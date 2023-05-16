import React from 'react';
import {draw_empty_annotation_panel} from './results_helper.js';
import {request_data} from './results_helper.js';
import {request_binary_data} from './results_helper.js';
import {parse_config} from './results_helper.js';
import { parse_ss2 } from './parsers.js';
import { parse_pbdat } from './parsers.js';
import { parse_comb } from './parsers.js';
import { psipred } from './biod3/main.js';
import { genericxyLineChart } from './biod3/main.js';

import { annotationGrid } from './biod3/main.js';

class ResultsSequence extends React.Component{
  constructor(props){
    super(props);
    let residues = this.props.seq.split('');
    let annotations = [];
    residues.forEach(function(res){
      annotations.push({'res': res});
    });
    let panel_height = ((Math.ceil(annotations.length/50)+2)*20)+(8*20);
    if(panel_height < 300){panel_height = 300;}
    this.state ={
      annotations: annotations,
      psipred_results: null,
      disopred_pbdata_data: null,
      disopred_comb_data: null,
      annotation_panel_height: panel_height,
    };
    this.sequencePlot = React.createRef();
    this.horizPlot = React.createRef();
    this.disopredPlot = React.createRef();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
    let results_data = {}
    for(let key in this.state.psipred_results){
      if(key.includes(".horiz")){
        let file_data = this.state.psipred_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
        var svg = document.getElementById('psipredChart').outerHTML; //I'm sure we should use the horizPlot ref
        svg = svg.replace(/<g id="toggle".+?<\/g>/, '');
        svg = svg.replace(/<g id="buttons".+?<\/g>/, '');
        results_data['psipred'] = {'psipred_horiz.svg': svg}
        //this.props.updateResultsFiles('disopred', {'psipredCartoon.svg': svg});
        //NEED TO UPDATE this.props.results_files?
      }
    }
    for(let key in this.state.disopred_results){
      if(key.includes(".comb")){
        let file_data = this.state.disopred_results[key];
        let precision = parse_comb(file_data);
        genericxyLineChart(precision, 'pos', ['precision'], ['Black',], 'DisoNNChart', {parent: this.disopredPlot.current, chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
        var svg = document.getElementById('disorder_svg').innerHTML;
        svg = svg.replace(/<g id="toggle".+?<\/g>/, '');
        svg = svg.replace(/<g id="buttons".+?<\/g>/, '');
        results_data['disopred'] = {'disoNNChart.svg': svg}
        //this.props.updateSVGs(results_data);
      }
    }
    console.log("UPDATING ANNOTATION GRID");
    annotationGrid(this.state.annotations, {parent: this.sequencePlot.current, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: this.state.annotation_panel_height, container_height: this.state.annotation_panel_height});
    //this.props.updateResultsFiles(results_data);
  }

  getResultsFiles = (data, props) => {
    let results_files = {};
    data.forEach(function(entry){
      let glob = entry.data_path.split('.')[1];
      if(glob.includes(".png") || glob.includes(".gif") || glob.includes(".jpg"))
      {
          // THIS MIGHT NOT WORK, WE'LL SEE
          let file_content = request_binary_data(entry.data_path, props.files_url);
          let file_name = entry.data_path.split('/')[2];
          results_files[file_name] = file_content;
          //There ought to be a way of casting the file string back to binary but for now
          //we're just using JSzip utils to get the data AGAIN in binary format instead
          // try {
          //   JSZipUtils.getBinaryContent(url, function (err, data) {
          //     if(err) {
          //       throw err; // or handle the error
          //     }
          //     zip.folder(path_bits[1]).file(path_bits[2], data, {binary: true});
          //   });
          // }
          // catch(err) {
          //   console.log("Getting and processing binary data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk " + err.message);
          //   alert("Getting and processing binary data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
          //   return null;
          // }
      }
      else {
        if(props.results_map.includes(glob))
        {
          try {
            let file_content = request_data(entry.data_path, props.files_url);
            let file_name = entry.data_path.split('/')[2];
            results_files[file_name] = file_content;
          }
          catch (err){
            console.log("Getting and processing data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk " + err.message);
            alert("Getting and processing data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
            return null;
          }
        }
      }
    });
    return(results_files);
  }

  getResults = () => {
    let result_uri = this.props.submit_url+this.props.uuid;
    let joblist_uri = this.props.joblist_url;
    let results_data = null;
    let config_csv = '';
    // we should loop over this.props.analyses and for every JOB_job we should get all the results data
    if(this.props.waiting) {
      console.log("POLLING RESULTS: "+result_uri);
      fetch(result_uri, {
        headers: {
          'Accept': 'application/json',
        },
        method: 'GET',
      }).then(response => {
        if(response.ok){
          return response.json().then(json => {return(json);});
        }
        throw response;
      }).then(data => {
        if(data.state !== "Running"){
          if(data.state === "Complete"){
            // Here we loop over data.submissions
            let parsed_data = {};
            let local_data = [];
            let local_annotations = this.state.annotations;
            let res = {};
            data.submissions.forEach((submission) => {
              // get an array of all the results files for our job
              results_data = this.getResultsFiles(submission.results, this.props);
              //for each job type we push all the results files to this object
              parsed_data[submission.job_name] = results_data;
              //we update the top DisplayArea class with everything the sidebar needs:
              res[submission.job_name] = results_data;
              // get the job configuration
              let config = request_data(submission.job_name, joblist_uri, 'application/json');
              config_csv += parse_config(JSON.parse(config));
              
              //here we handle updating the annotation object for the annotation panel to be rendered in
              //component did update
              for(let key in results_data){
                if(key.includes(".ss2")){
                  console.log("Found SS2 and parsing");
                  local_annotations = parse_ss2(local_annotations, results_data[key]);
                }
                if(key.includes('.pbdat')){
                  console.log("Found PDBAT and parsing");
                  local_annotations = parse_pbdat(local_annotations, results_data[key]);
                } 
              }
              // we assign the results files 
              this.setState({psipred_results: parsed_data.psipred,
                disopred_results: parsed_data.disopred,
                annotations: local_annotations});
            });
            this.props.updateResultsFiles(res);
            this.props.updateDisplayTime(false);
            this.props.updateWaiting(false);
            this.props.updateConfig(config_csv);
          }
          else{
            throw new Error("Job Failed");
          }
        }
      }).catch(error => {
        console.log("Fetching results: "+result_uri+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        alert("Fetching results: "+result_uri+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        return null;
      });
    };
  }

  componentDidMount(){
    console.log("DRAWING EMPTY ANNOTATION PANEL");
    draw_empty_annotation_panel(this.state, this.sequencePlot.current)
    //here is a good place to send the results and set up the polling.
    this.timer = setInterval(() => this.getResults(), 500);
  }

  render() {
    return(
      <div>
        { this.props.uuid &&
        <div className="info-box bg-default job_info">
          <span className="info-box-icon job_info">
              <i className="fa fa-line-chart job_info_icon"></i>
          </span>
          <div className="info-box-content">
            <div className="job_info_text job_info_text_left">
              <p className="name_text">Name : {this.props.name}</p>
            </div>
            <div className="job_info_text box-tools pull-right job_info_text_right">Copy Link: <input id="retrievalLink" value={this.props.result_uri} width="160" readOnly /><button className="copyButton" type="button" data-clipboard-action="copy" data-clipboard-target="#retrievalLink" onClick={()=>navigator.clipboard.writeText(this.props.result_uri)}
><img src="../interface/static/images/clippy.svg" alt="Copy to clipboard" width="16" /></button></div>
          </div>
        </div>
        }

        { this.props.uuid &&
        <div className="box box-primary">
          <div className="box-header with-border">
            <h5 className="box-title">Sequence Plot</h5>
            <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse"><i className="fa fa-minus"></i></button></div>
          </div>
          <div className="box-body">
            <div className="sequence_plot" id="sequence_plot" ref={this.sequencePlot} ></div><br />
          </div>
          { this.props.waiting &&
            <div className="overlay processing">
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          }
        </div>
        }

        { this.props.analyses.includes("psipred_job") &&
          <div className="box box-primary collapsed-box" id="psipred_cartoon">
            <div className="box-header with-border">
              <h5 className="box-title">PSIPRED Cartoon</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              <div className="psipred_cartoon" id='psipred_horiz' ref={this.horizPlot} ></div>
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.state.psipred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide">{this.state.psipred_waiting_icon}</div>
              }
              { this.props.waiting &&
                <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
              }
            </div>
          </div>
         }
         { this.props.analyses.includes("disopred_job") &&
          <div className="box box-primary collapsed-box" id="disorder_plot">
            <div className="box-header with-border">
              <h5 className="box-title">DISOPRED Plot</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              <div className="disorder_plot" id="disorder_svg" ref={this.disopredPlot} ></div>
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.state.disopred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide">{this.state.disopred_waiting_icon}</div>
              }
              { this.props.waiting &&
                <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
              }
            </div>
          </div>
         }
      </div>
    );
  }
}
export {ResultsSequence};
