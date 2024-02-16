import React from 'react';
import {request_data} from '../shared/index.js'; 
import {config_table} from '../shared/index.js'; 
import {parse_config} from '../shared/index.js';
import {display_structure} from '../shared/index.js';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {parse_metsite} from './parsers.js';
import {parse_hspred} from './parsers.js';
import {merizo_html} from './parsers.js';
// import {extractBFactors} from './parsers.js';

class ResultsStructure extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    this.metsite_pdb = React.createRef();
    this.metsite_table = React.createRef();
    this.hspred_initial_pdb = React.createRef();
    this.hspred_second_pdb = React.createRef();
    this.hspred_table = React.createRef();
    this.memembed_pdb = React.createRef();
    this.merizo_pdb = React.createRef();
    this.merizo_boundaries = React.createRef();
    this.merizo_pdb_sidebar = React.createRef();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
    console.log(this.state);

    for(let key in this.state.metsite_results){
      if(key.includes(".MetPred")){
        display_structure(this.metsite_pdb.current, this.state.metsite_results[key], false, false);
      }
      if(key.includes(".Metpred")){
        let file_data = this.state.metsite_results[key];
        //console.log(file_data);
        let html_data = parse_metsite(file_data);
        var dt = document.createElement('template');
        dt.innerHTML = html_data;
        this.metsite_table.current.appendChild(dt.content);
      }
    }
    if(this.state.metsite_results){
      config_table('#metsite_table', 10, '#min_met_score', '#max_met_score', 'metsite_table', 1, null);
    }

    for(let key in this.state.hspred_results){
      if(key.includes("_initial.pdb")){
        display_structure(this.hspred_initial_pdb.current, this.state.hspred_results[key], false, false);    
      }
      if(key.includes("_second.pdb")){
        display_structure(this.hspred_second_pdb.current, this.state.hspred_results[key], false, false);
      }
      if(key.includes(".out")){
        let file_data = this.state.hspred_results[key];
        //console.log(file_data);
        let html_data = parse_hspred(file_data);
        let hs = document.createElement('template');
        hs.innerHTML = html_data;
        this.hspred_table.current.appendChild(hs.content);
      }
    }
    if(this.state.hspred_results){
      config_table('#hspred_table', 50, '#min_hs_score', '#max_hs_score', 'hspred_table', 2, [2, 'desc']);
    }

    for(let key in this.state.memembed_results){
      if(key.includes(".pdb")){
        display_structure(this.memembed_pdb.current, this.state.memembed_results[key], false, true);    
      }
    }
    for(let key in this.state.merizo_results){
      let uid = key.slice(0,-15)

      if(key.includes(".pdb2")){
        let merizo_idx = this.state.merizo_results[uid+'_merizo_v2.idx'];
        // let bFactors = extractBFactors(this.state.merizo_results[key])

        var merizo_panel = document.getElementById("merizo_sidebar_bg");
        merizo_panel.style.display = "inline-block";
        merizo_panel.style.verticalAlign = "top";
        merizo_panel.style.width = "150px";
        merizo_panel.style.height = "400px";
        merizo_panel.style.position = "relative";
        merizo_panel.style.left = "0px";
        merizo_panel.style.backgroundColor = "#e8e8e8";


        var pdb_options = document.createElement('template');
        pdb_options.innerHTML = '<h4><b>Display Options</b></h4> <h5>Colouration</h5>  <button id="colorByDomains">Domains</button></ br></ br><button id="colorByBFactor">B-factor as temp</button></ br></ br><button id="colorByplDDT">B-factor as plDDT</button> '

        this.merizo_pdb_sidebar.current.appendChild(pdb_options.content);

        display_structure(this.merizo_pdb.current, this.state.merizo_results[key], false, false, merizo_idx);
      }
      if(key.includes(".merizo")){
        let file_data = this.state.merizo_results[key];
        let html_data = merizo_html(file_data);

        var mr = document.createElement('template');
        mr.innerHTML = html_data;
        this.merizo_boundaries.current.appendChild(mr.content);
      }
    }
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

              // we assign the results files 
              this.setState({metsite_results: parsed_data.metsite,
                    hspred_results: parsed_data.hspred,
                    memembed_results: parsed_data.memembed,
                    merizo_results: parsed_data.merizo
              });
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
        //console.log("THIS ERROR?"+error);
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
    //here is a good place to send the results and set up the polling.
    this.timer = setInterval(() => this.getResults(), 20000);
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
            <div className="job_info_text box-tools pull-right job_info_text_right">Copy Link: <input id="retrievalLink" value={this.props.result_uri} width="160" readOnly /><CopyToClipboard text={this.props.result_uri}><button className="copyButton" type="button" data-clipboard-action="copy" data-clipboard-target="#retrievalLink"
><img src={process.env.PUBLIC_URL+"/static/images/clippy.svg"} alt="Copy to clipboard" width="16" /></button></CopyToClipboard></div>
          </div>
        </div>
        }

        { this.props.analyses.includes("metsite_job") &&
          <div className="box box-primary" id="metsite_preds">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.metsite.shortName} Predictions</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.metsite_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.metsite_waiting_icon} /></div>
              }
              <div className="metsite_structure pdb_panel_class" id="metsite_structure" ref={this.metsite_pdb}></div>
              <div className="metsite_table_holder" id="metsite_table_holder" ref={this.metsite_table} ></div>
              
            </div>
          </div>
         }
        { this.props.analyses.includes("hspred_job") &&
          <div className="box box-primary" id="hspred_preds">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.hspred.shortName} Predictions</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
                            
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.hspred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.hspred_waiting_icon} /></div>
              }
              <div>
              <div className="hspred_structure pdb_panel_class" id="hs_pred_initial" ref={this.hspred_initial_pdb}></div>
              <div className="hspred_structure pdb_panel_class" id="hs_pred_second" ref={this.hspred_second_pdb}></div>
              </div>
              <div className="hspred_table_holder" id="hspred_table_holder" ref={this.hspred_table} ></div>
              
            </div>
          </div>
         }
        { this.props.analyses.includes("memembed_job") &&
          <div className="box box-primary" id="memembed_preds">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.memembed.shortName} Prediction</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.memembed_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.memembed_waiting_icon} /></div>
              }
              <div className="memembed_pdb pdb_panel_class" id="memembed" ref={this.memembed_pdb}></div>
        
            </div>
          </div>
         }
         {this.props.analyses.includes("merizo_job") && (
          <div className="box box-primary" id="merizo_preds">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.merizo.shortName} Prediction</h5>
              <div className="box-tools pull-right">
                <button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse">
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="box-body">
              {this.state.error_message && <div className="error">{this.state.error_message}</div>}
              {this.props.waiting && (
                <div className="waiting" intro="slide" outro="slide">
                  <br />
                  <h4>{this.props.merizo_waiting_message}</h4>
                </div>
              )}
              {this.props.waiting && (
                <div className="waiting_icon" intro="slide" outro="slide">
                  <img alt="waiting icon" src={this.props.merizo_waiting_icon} />
                </div>
              )}
              <div className="pdb_panel_class_merizo_options" id="merizo_sidebar_bg" ref={this.merizo_pdb_sidebar}></div>
              <div className="merizo_pdb pdb_panel_class_merizo" id="merizo_pdb_panel" ref={this.merizo_pdb}></div>
              <div className="merizo_boundaries" id="merizo_boundary_table" ref={this.merizo_boundaries}></div>
            </div>
          </div>
        )}
         
         
      </div>
    );
  }
}
export {ResultsStructure};