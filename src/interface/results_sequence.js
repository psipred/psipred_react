import React from 'react';
import {draw_empty_annotation_panel} from '../shared/index.js';
import {request_data} from '../shared/index.js';
import {config_table} from '../shared/index.js'; 
import {display_structure} from '../shared/index.js';
import {CopyToClipboard} from 'react-copy-to-clipboard';
// import {request_binary_data} from './results_helper.js';
import {parse_config} from '../shared/index.js';
import { parse_ss2 } from './parsers.js';
import { parse_pbdat } from './parsers.js';
import { parse_comb } from './parsers.js';
import { parse_memsatdata } from './parsers.js';
import { parse_presults } from './parsers.js';
import { parse_parseds } from './parsers.js';
import { parse_featcfg } from './parsers.js';
import { parse_ffpreds} from './parsers.js';
import { psipred } from './biod3/main.js';
import { genericxyLineChart } from './biod3/main.js';
//import DataTable from 'datatables.net-dt';
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
    this.pdomthreaderTable = React.createRef();
    this.dmpfold_pdb = React.createRef();
    this.s4pred_horiz = React.createRef();
    this.dompred_chart = React.createRef();
    this.dompred_results = React.createRef();
    this.ffpred_memsat = React.createRef();
    this.ffpred_tables = React.createRef();
    this.ffpred_sch = React.createRef();
    this.aa_comp = React.createRef();
    this.global_features = React.createRef();
    this.mempack_plot = React.createRef();
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
    for(let key in this.state.dompred_results){
      if(key.includes(".horiz")){
        let file_data = this.state.dompred_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
      }
    }
    for(let key in this.state.ffpred_results){
      if(key.includes(".horiz")){
        let file_data = this.state.ffpred_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.horizPlot.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
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
    let ann_dom_set = {};

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
      config_table('#pgen_table', 50, '#min_pgen_pval', '#max_pgen_pval', 'pgen_table', 2, null);
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
        //console.log(file_data);
        let html_data = parse_presults(file_data, ann_gen_set, "gen");
        var gt = document.createElement('template');
        gt.innerHTML = html_data;
        this.genthreaderTable.current.appendChild(gt.content);
      }
    }

    if(this.state.genthreader_results){
      config_table('#gen_table', 50, '#min_gen_pval', '#max_gen_pval', 'gen_table', 2, null);
    }

    for(let key in this.state.pdomthreader_results){
      if(key.includes(".ann")){
        let path = key.substring(0, key.lastIndexOf("."));
        let id = path.substring(path.lastIndexOf(".")+1, path.length);
        ann_dom_set[id] = {};
        ann_dom_set[id]['ann'] = path+".ann";
        ann_dom_set[id]['aln'] = path+".aln";
      }
    }
    for(let key in this.state.pdomthreader_results){
      if(key.includes(".presults")){
        let file_data = this.state.pdomthreader_results[key];
        //console.log(file_data);
        let html_data = parse_presults(file_data, ann_dom_set, "pgen");
        var dt = document.createElement('template');
        dt.innerHTML = html_data;
        this.pdomthreaderTable.current.appendChild(dt.content);
      }
    }

    if(this.state.pdomthreader_results){
      config_table('#pdom_table', 50, '#min_pdom_pval', '#max_pdom_pval', 'pdom_table', 2, null);
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
    for(let key in this.state.dmpfold_results){
      if(key.includes(".pdb")){
        display_structure(this.dmpfold_pdb.current, this.state.dmpfold_results[key], true, false);
      }
    }

    for(let key in this.state.s4pred_results){
      if(key.includes(".horiz")){
        let file_data = this.state.s4pred_results[key];
        let count = (file_data.match(/Conf/g) || []).length;
        let panel_height = ((6*30)*(count+1))+120;
        psipred(file_data, 'psipredChart', {parent: this.s4pred_horiz.current, margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
      }
    }

    for(let key in this.state.dompred_results){
      
      if(key.includes(".png")){
        let img_url = this.state.dompred_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Dompred Chart";
        this.dompred_chart.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.dompred_chart.current.appendChild(newElement);
      }
      if(key.includes(".boundary")){
        let boundary_data = this.state.dompred_results[key];
        let prediction_regex = /Domain\sBoundary\slocations\spredicted\sDPS:\s(.+)/;
        let prediction_match =  prediction_regex.exec(boundary_data);
        let h4Element = document.createElement('h4');
        h4Element.innerText += boundary_data;
        if(prediction_match)
        {
          h4Element.innerText += boundary_data;
        }
        else{
          h4Element.innerText += "No ParseDS Domain boundaries predicted";
        }
        this.dompred_results.current.appendChild(h4Element);
      }
    }

    for(let key in this.state.ffpred_results){
      if(key.includes("_cartoon_memsat_svm.png")){
        let img_url = this.state.ffpred_results[key];
        let divElement = document.createElement('div');
        divElement.className = "center"

        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Memsat Cartoon diagram";
        divElement.append(newElement);
        this.ffpred_memsat.current.appendChild(divElement);
        newElement = document.createElement('br');
        this.ffpred_memsat.current.appendChild(newElement);
      }
      if(key.includes("_sch.png")){
        let img_url = this.state.ffpred_results[key];
        let divElement = document.createElement('div');
        divElement.className = "center"

        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "FFPred Feature Schematic";
        divElement.append(newElement);
        this.ffpred_sch.current.appendChild(divElement);
        newElement = document.createElement('br');
        this.ffpred_sch.current.appendChild(newElement);
      }
      if(key.includes(".featcfg")){
        let file_data = this.state.ffpred_results[key];
        let html_data = parse_featcfg(file_data);
        let feat_table = html_data[0];
        let aa_table = html_data[1];
        
        t = document.createElement('template');
        t.innerHTML = feat_table;
        this.global_features.current.appendChild(t.content);
        t = document.createElement('template');
        t.innerHTML = aa_table;
        this.aa_comp.current.appendChild(t.content);
      }
      if(key.includes(".full_formatted")){
        let file_data = this.state.ffpred_results[key];
        let html_data = parse_ffpreds(file_data);
        t = document.createElement('template');
        t.innerHTML = html_data;
        this.ffpred_tables.current.appendChild(t.content);
      }
    }
    if(this.state.ffpred_results){
      config_table('#bp_table', 50, '#min_bp_prob', '#max_bp_prob', 'bp_table', 2, [3, 'asc']);
      config_table('#mf_table', 50, '#min_mf_prob', '#max_mf_prob', 'mf_table', 2, [3, 'asc']);
      config_table('#cc_table', 50, '#min_cc_prob', '#max_cc_prob', 'cc_table', 2, [3, 'asc']);
    }
    for(let key in this.state.mempack_results){
      if(key.includes("_Kamada-Kawai_1.png")){
        let img_url = this.state.mempack_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Mempack Diagram";
        newElement.setAttribute('width', "60%");
        this.mempack_plot.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.mempack_plot.current.appendChild(newElement);
      }
      if(key.includes("_schematic.png")){
        let img_url = this.state.mempack_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Memsat Schematic diagram";
        this.memsatSVMSchematic.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.memsatSVMSchematic.current.appendChild(newElement);
      }
      if(key.includes("_cartoon_memsat_svm.png")){
        let img_url = this.state.mempack_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "Memsat Cartoon diagram";
        this.memsatSVMSchematic.current.appendChild(newElement);
        newElement = document.createElement('br');
        this.memsatSVMSchematic.current.appendChild(newElement);
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
                if(key.includes('.boundary')){
                  console.log("Found Dompred and parsing");
                  local_annotations = parse_parseds(local_annotations, results_data[key]);
                } 
                
              }
              // we assign the results files 
              this.setState({psipred_results: parsed_data.psipred,
                disopred_results: parsed_data.disopred,
                memsatsvm_results: parsed_data.memsatsvm,
                pgenthreader_results: parsed_data.pgenthreader,
                dmp_results: parsed_data.dmp,
                genthreader_results: parsed_data.genthreader,
                pdomthreader_results: parsed_data.pdomthreader,
                dmpfold_results: parsed_data.dmpfold,
                s4pred_results: parsed_data.s4pred,
                dompred_results: parsed_data.dompred,
                ffpred_results: parsed_data.ffpred,
                mempack_results: parsed_data.mempack,
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
          else if(data.state === "Submitted"){
            console.log("Awaiting Worker")
          }
          else{
            throw new Error("Job Failed");
          }

        }
      }).catch(async error => {
        let message = '';
        try {
          let obj = await error.json().then(json => {return(json);});
          if(obj.error){
            message.message = obj.error;
          }
          if(obj.error.input_data){
            message.message = obj.error.input_data
          }
        }
        catch{
          message=error
        }
        console.log(message.message);
        console.log("Fetching results: "+result_uri+" Failed. \n"+message.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        //alert("Fetching results: "+result_uri+" Failed. \n"+message.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        this.setState({error_message: message.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk"});
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

  renderPanel(panel_id, title, plot_class, plot_id, plot_data_ref, waiting_message, waiting_icon){
  //ID to identify the panel
  //A nice human readable name of the panel
  //A class name for the results area
  //And ID name for the results
  //A react ref to manipulate to insert the diagram/results/etc
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
        { this.props.waiting &&
          <div className="waiting" intro="slide" outro="slide"><br /><h4>{waiting_message}</h4></div>
        }
        { this.props.waiting &&
          <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={waiting_icon} /></div>
        }
        <div className={plot_class} id={plot_id} ref={plot_data_ref} ></div>

      </div>
    </div>
    )
  }
  // { this.props.waiting &&
  //   <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
  // }

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
            <div className="job_info_text box-tools pull-right job_info_text_right">Copy Link: <input id="retrievalLink" value={this.props.result_uri} width="160" readOnly /><CopyToClipboard text={this.props.result_uri}><button className="copyButton" type="button" data-clipboard-action="copy" data-clipboard-target="#retrievalLink"
><img src={process.env.PUBLIC_URL+"/static/images/clippy.svg"} alt="Copy to clipboard" width="16" /></button></CopyToClipboard></div>
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

        { (this.props.analyses.includes("psipred_job") || this.props.analyses.includes("pgenthreader_job") || this.props.analyses.includes("dmp_job") || this.props.analyses.includes("dompred_job") || this.props.analyses.includes("ffpred_job") ) &&
          <div>
            { this.renderPanel("psipred_cartoon", this.props.job_strings.psipred.shortName+" Cartoon", "psipred_cartoon", 'psipred_horiz', this.horizPlot, this.state.psipred_waiting_message, this.state.psipred_waiting_icon) }
          </div> 
         }
         { this.props.analyses.includes("disopred_job") &&
          <div>
            { this.renderPanel("disorder_plot", this.props.job_strings.disopred.shortName+" Plot", "disorder_plot", 'pdisorder_svg', this.disopredPlot, this.state.disopred_waiting_message, this.state.disopred_waiting_icon) }
          </div>
         }
        { (this.props.analyses.includes("memsatsvm_job") || this.props.analyses.includes("mempack_job")) &&
          <div className="box box-primary collapsed-box" id="memsatsvm_schematics">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.memsatsvm.shortName} Schematics</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.memsatsvm_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.memsatsvm_waiting_icon} /></div>
              }
              <div className="memsatsvm_schematic" id="memsatsvm_schematic" ref={this.memsatSVMSchematic}></div>
              <div className="memsatsvm_cartoon" id="memsatsvm_cartoon" ref={this.memsatSVMCartoon} ></div>
            </div>
          </div>
         }
         { this.props.analyses.includes("pgenthreader_job") &&
          <div>
            { this.renderPanel("pgen_table_box", this.props.job_strings.pgenthreader.shortName+" Structural Results", "pgen_table_div", 'pgenthreader_table', this.pgenthreaderTable, this.props.pgenthreader_waiting_message, this.props.pgenthreader_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("dmp_job") &&
          <div>
            { this.renderPanel("dmp_contact_map", this.props.job_strings.dmp.shortName+" Contact Plot", "dmp_plot_div", 'dmp_plot', this.dmp_plot, this.props.dmp_waiting_message, this.props.dmp_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("genthreader_job") &&
          <div>
            { this.renderPanel("gen_table_box", this.props.job_strings.genthreader.shortName+" Structural Results", "gen_table_div", 'genthreader_table', this.genthreaderTable, this.props.genthreader_waiting_message, this.props.genthreader_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("pdomthreader_job") &&
          <div>
            { this.renderPanel("pdom_table_box", this.props.job_strings.pdomthreader.shortName+" Structural Results", "pdom_table_div", 'pdomthreader_table', this.pdomthreaderTable, this.props.pdomthreader_waiting_message, this.props.pdomthreader_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("dmpfold_job") &&
          <div>
            { this.renderPanel("dmpfold_pdb", this.props.job_strings.dmpfold.shortName+" prediction", "pdb_panel_class", 'dmp_pdb_id', this.dmpfold_pdb , this.props.dmpfold_waiting_message, this.props.dmpfold_waiting_icon) }
          </div>
         }
         { this.props.analyses.includes("s4pred_job") &&
          <div>
            { this.renderPanel("s4pred_cartoon", this.props.job_strings.s4pred.shortName+" Cartoon", "s4pred_cartoon", 's4pred_horiz', this.s4pred_horiz , this.props.s4pred_waiting_message, this.props.dmpfold_waiting_icon) }
          </div>
         }
        { this.props.analyses.includes("dompred_job") &&
          <div className="box box-primary collapsed-box" id="dompred_results">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.dompred.shortName} Results</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.dompred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.dompred_waiting_icon} /></div>
              }
              <div className="dompred_chart" id="dompred_chart" ref={this.dompred_chart}></div>
              <div className="dompred_results" id="dompread_results" ref={this.dompred_results} ></div>

            </div>
          </div>
         }
         { this.props.analyses.includes("ffpred_job") &&
          <div className="box box-primary collapsed-box" id="ffpred_schematics">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.ffpred.shortName} Predictions</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.ffpred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.ffpred_waiting_icon} /></div>
              }
              <p>These prediction terms represent terms predicted where SVM training includes assigned GO terms across all evidence code types. SVM reliability is regarded as High (H) when MCC, sensitivity, specificity and precision are jointly above a given threshold, Otherwise Reliability is indicated as Low (L). </p>
              <div className="ffpred_bp_table" id="ffpred_bp_table" ref={this.ffpred_tables} ></div>
              <h4>Sequence Feature Map</h4>
              <p>Position dependent feature predictions are mapped onto the sequence schematic shown below. The line height of the Phosphorylation and Glycosylation features reflects the confidence of the residue prediction.</p>
              <div className="ffpred_sch" id="ffpred_sch" ref={this.ffpred_sch} ></div>
              <h4>Predicted Transmembrane Topology</h4>
              <div className="ffpred_memsat" id="ffpred_memsat" ref={this.ffpred_memsat} ></div>
              <h4>Amino Acid Composition</h4>
              <div className="ffpred_memsat" id="ffpred_memsat" ref={this.aa_comp} ></div>
              <h4>Global Features</h4>
              <p>Global features are calculated directly from sequence. Localisation values are predicted by the Psort algorithm and reflect the relative likelihood of the protein occupying different cellular localisations. The bias column is highlighted according to the significance of the feature value calculated from Z score of the feature.</p>
              <div className="ffpred_memsat" id="ffpred_memsat" ref={this.global_features} ></div>
            </div>
          </div>
         }
        { this.props.analyses.includes("mempack_job") &&
        <div>
        { this.renderPanel("mempack_pane", this.props.job_strings.mempack.shortName+" Cartoon", "mempack_plot", 'mempack_plot', this.mempack_plot , this.props.mempack_waiting_message, this.props.mempack_waiting_icon) }
        </div>
         }
         
      </div>
    );
  }
}
export {ResultsSequence};
