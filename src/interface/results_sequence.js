import React from 'react';
import {draw_empty_annotation_panel} from './results_helper.js';
import {request_data} from '../shared/index.js';
// import {request_binary_data} from './results_helper.js';
import {parse_config} from './results_helper.js';
import { parse_ss2 } from './parsers.js';
import { parse_pbdat } from './parsers.js';
import { parse_comb } from './parsers.js';
import { parse_memsatdata } from './parsers.js';
import { parse_presults } from './parsers.js';
import { psipred } from './biod3/main.js';
import { genericxyLineChart } from './biod3/main.js';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';

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
      disopred_results: null,
      memsatsvm_results: null,
      pgenthreader_results: null,
      annotation_panel_height: panel_height,
    };
    this.sequencePlot = React.createRef();
    this.horizPlot = React.createRef();
    this.disopredPlot = React.createRef();
    this.memsatSVMSchematic = React.createRef();
    this.memsatSVMCartoon = React.createRef();
    this.pgenthreaderTable = React.createRef();
    this.dmp_plot = React.createRef();
    this.genthreaderTable = React.createRef();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
    //console.log(this.state);
    for(let key in this.state.psipred_results){
      if(key.includes(".horiz")){
        let file_data = this.state.psipred_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
        //var svg = document.getElementById('psipredChart').outerHTML; //I'm sure we should use the horizPlot ref
        //this.props.updateResultsFiles('disopred', {'psipredCartoon.svg': svg});
        //NEED TO UPDATE this.props.results_files?
      }
    }
    for(let key in this.state.disopred_results){
      if(key.includes(".comb")){
        let file_data = this.state.disopred_results[key];
        let precision = parse_comb(file_data);
        genericxyLineChart(precision, 'pos', ['precision'], ['Black',], 'DisoNNChart', {parent: this.disopredPlot.current, chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
        //var svg = document.getElementById('disorder_svg').innerHTML;
      }
    }
    for(let key in this.state.memsatsvm_results){
      if(key.includes("_schematic.png")){
        let img_url = this.state.memsatsvm_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Memsat Schematic diagram";
        this.memsatSVMSchematic.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.memsatSVMSchematic.current.appendChild(newElement);
      }
      if(key.includes("_cartoon_memsat_svm.png")){
        let img_url = this.state.memsatsvm_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Memsat Cartoon diagram";
        this.memsatSVMSchematic.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.memsatSVMSchematic.current.appendChild(newElement);
      } 
    }
    let ann_set = {};
    let ann_gen_set = {};
    //let ann_dom_set = {};

    for(let key in this.state.pgenthreader_results){
      if(key.includes(".ann")){
        let path = key.substring(0, key.lastIndexOf("."));
        let id = path.substring(path.lastIndexOf(".")+1, path.length);
        ann_set[id] = {};
        ann_set[id]['ann'] = path+".ann";
        ann_set[id]['aln'] = path+".aln";
      }
    }
    for(let key in this.state.pgenthreader_results){
      if(key.includes(".horiz")){
        let file_data = this.state.pgenthreader_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
      }
      if(key.includes(".presults")){
        let file_data = this.state.pgenthreader_results[key];
        let html_data = parse_presults(file_data, ann_set, "pgen");
        var t = document.createElement('template');
        t.innerHTML = html_data;
        this.pgenthreaderTable.current.appendChild(t.content);
      }
    }
    if(this.state.pgenthreader_results){
      let mgen_table = $('#pgen_table').DataTable({
        'searching'   : true,
        'pageLength': 50,
      });

      var minEl = $('#min_pgen_pval');
      var maxEl = $('#max_pgen_pval');
      // Custom range filtering function
      //https://stackoverflow.com/questions/55242822/prevent-datatables-custom-filter-from-affecting-all-tables-on-a-page
      //note: we have to push one of these functions on to the array for every table we want to have
      // a custom filter for.
      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
          //console.log(settings.nTable.id);
          if ( settings.nTable.id !== 'pgen_table' ) {
            return true;
          }
          var min = parseFloat(minEl.val(), 10);
          var max = parseFloat(maxEl.val(), 10);
          var pval = parseFloat(data[2]) || 0; // use data for the age column
          if (
              (isNaN(min) && isNaN(max)) ||
              (isNaN(min) && pval <= max) ||
              (min <= pval && isNaN(max)) ||
              (min <= pval && pval <= max)
          ) {
              return true;
          }
   
          return false;
      });
   
      // Changes to the inputs will trigger a redraw to update the table
      minEl.on('input', function () {
          mgen_table.draw();
      });
      maxEl.on('input', function () {
          mgen_table.draw();
      });

    }

    for(let key in this.state.genthreader_results){
      if(key.includes(".ann")){
        let path = key.substring(0, key.lastIndexOf("."));
        let id = path.substring(path.lastIndexOf(".")+1, path.length);
        ann_gen_set[id] = {};
        ann_gen_set[id]['ann'] = path+".ann";
        ann_gen_set[id]['aln'] = path+".aln";
      }
    }
    for(let key in this.state.genthreader_results){
      if(key.includes(".presults")){
        let file_data = this.state.genthreader_results[key];
        console.log(file_data);
        let html_data = parse_presults(file_data, ann_gen_set, "gen");
        var gt = document.createElement('template');
        gt.innerHTML = html_data;
        this.genthreaderTable.current.appendChild(gt.content);
      }
    }

    if(this.state.genthreader_results){
      let gen_table = $('#gen_table').DataTable({
        'searching'   : true,
        'pageLength': 50,
      });

      var gen_minEl = $('#min_gen_pval');
      var gen_maxEl = $('#max_gen_pval');
      // Custom range filtering function
      //https://stackoverflow.com/questions/55242822/prevent-datatables-custom-filter-from-affecting-all-tables-on-a-page
      //note: we have to push one of these functions on to the array for every table we want to have
      // a custom filter for.
      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
          //console.log(settings.nTable.id);
          if ( settings.nTable.id !== 'gen_table' ) {
            return true;
          }
          var min = parseFloat(gen_minEl.val(), 10);
          var max = parseFloat(gen_maxEl.val(), 10);
          var pval = parseFloat(data[2]) || 0; // use data for the age column
          if (
              (isNaN(min) && isNaN(max)) ||
              (isNaN(min) && pval <= max) ||
              (min <= pval && isNaN(max)) ||
              (min <= pval && pval <= max)
          ) {
              return true;
          }
   
          return false;
      });
   
      // Changes to the inputs will trigger a redraw to update the table
      gen_minEl.on('input', function () {
          gen_table.draw();
      });
      gen_maxEl.on('input', function () {
          gen_table.draw();
      });

    }


    for(let key in this.state.dmp_results){
      if(key.includes(".horiz")){
        let file_data = this.state.dmp_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
      }
      if(key.includes("png")){
        let img_url = this.state.dmp_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "DMP Contact Map";
        this.dmp_plot.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.dmp_plot.current.appendChild(newElement);
      } 
    }
    
    console.log("UPDATING ANNOTATION GRID");
    annotationGrid(this.state.annotations, {parent: this.sequencePlot.current, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: this.state.annotation_panel_height, container_height: this.state.annotation_panel_height});
    //this.props.updateResultsFiles(results_data);
  }

  getResultsFiles = (data, props) => {
    let results_files = {};
    data.forEach(function(entry){
      let glob = entry.data_path.split(/[.]/).pop();
      if(glob.includes("png") || glob.includes("gif") || glob.includes("jpg") || glob.includes("ann") || glob.includes("aln"))
      {
          // we just store the image URI for later use (i.e. zip file creation)
          let image_url = props.files_url+entry.data_path;
          //console.log(image_url)
          let file_name = entry.data_path.split('/')[2];
          results_files[file_name] = image_url;
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
                if(key.includes('.memsat_svm')){
                  console.log("Found MEMSAT_SVM and parsing");
                  local_annotations = parse_memsatdata(local_annotations, results_data[key]);
                } 
                
              }
              // we assign the results files 
              this.setState({psipred_results: parsed_data.psipred,
                disopred_results: parsed_data.disopred,
                memsatsvm_results: parsed_data.memsatsvm,
                pgenthreader_results: parsed_data.pgenthreader,
                dmp_results: parsed_data.dmp,
                genthreader_results: parsed_data.genthreader,
                annotations: local_annotations});
            });
            this.props.updateResultsFiles(res);
            this.props.updateDisplayTime(false);
            this.props.updateWaiting(false);
            this.props.updateConfig(config_csv);
          }
          else if(data.state === "Error"){
            throw new Error(data.submissions.at(-1).last_message);
          }
          else{
            throw new Error("Job Failed");
          }

        }
      }).catch(error => {
        console.log("Fetching results: "+result_uri+" Failed. \n"+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        alert("Fetching results: "+result_uri+" Failed. \n"+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        this.props.updateWaiting(false);
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

  renderIcon(panel_id, title, plot_class, plot_id, plot_data_ref, waiting_message, waiting_icon){
    return(
      <div className="box box-primary collapsed-box" id={panel_id}>
      <div className="box-header with-border">
        <h5 className="box-title">{title}</h5>
        <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
      </div>
      <div className="box-body">
        { this.state.error_message &&
          <div className="error">{this.state.error_message}</div>
        }
        <div className={plot_class} id={plot_id} ref={plot_data_ref} ></div>
        { this.props.waiting &&
          <div className="waiting" intro="slide" outro="slide"><br /><h4>{waiting_message}</h4></div>
        }
        { this.props.waiting &&
          <div className="waiting_icon" intro="slide" outro="slide">{waiting_icon}</div>
        }
        { this.props.waiting &&
          <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
        }
      </div>
    </div>
    )
  }


  render() {
    // currently the memsat panel is not calling the funcition. Possible argument for the memsat panel to be 2 panels
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

        { (this.props.analyses.includes("psipred_job") || this.props.analyses.includes("pgenthreader_job") || this.props.analyses.includes("dmp_job")) &&
          <div>
            { this.renderIcon("psipred_cartoon", "PSIPRED Cartoon", "psipred_cartoon", 'psipred_horiz', this.horizPlot, this.state.psipred_waiting_message, this.state.psipred_waiting_icon) }
          </div> 
         }
         { this.props.analyses.includes("disopred_job") &&
          <div>
            { this.renderIcon("disorder_plot", "DISOPRED Plot", "disorder_plot", 'pdisorder_svg', this.disopredPlot, this.state.disopred_waiting_message, this.state.disopred_waiting_icon) }
          </div>
         }
        { this.props.analyses.includes("memsatsvm_job") &&
          <div className="box box-primary collapsed-box" id="memsatsvm_schematics">
            <div className="box-header with-border">
              <h5 className="box-title">MEMSAT-SVM Schematics</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              <div className="memsatsvm_schematic" id="memsatsvm_schematic" ref={this.memsatSVMSchematic}></div>
              <div className="memsatsvm_cartoon" id="memsatsvm_cartoon" ref={this.memsatSVMCartoon} ></div>
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.state.memsatsvm_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide">{this.state.memsatsvm_waiting_icon}</div>
              }
              { this.props.waiting &&
                <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
              }
            </div>
          </div>
         }
         { this.props.analyses.includes("pgenthreader_job") &&
          <div>
            { this.renderIcon("pgen_table_box", "pGenTHREADER Structural Results", "pgen_table_div", 'pgenthreader_table', this.pgenthreaderTable, this.state.pgenthreader_waiting_message, this.state.pgenthreader_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("dmp_job") &&
          <div>
            { this.renderIcon("dmp_contact_map", "DMP Contact Plot", "dmp_plot_div", 'dmp_plot', this.dmp_plot, this.state.dmp_waiting_message, this.state.dmp_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("genthreader_job") &&
          <div>
            { this.renderIcon("gen_table_box", "GenTHREADER Structural Results", "gen_table_div", 'genthreader_plot', this.genthreaderTable, this.state.genthreader_waiting_message, this.state.genthreader_waiting_icon) }
          </div>
         }
      </div>
    );
  }
}
export {ResultsSequence};
