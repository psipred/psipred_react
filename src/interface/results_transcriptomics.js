import React from 'react';
import {request_data} from '../shared/index.js'; 
import {parse_config} from '../shared/index.js';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {parse_gsrcl_legend} from './parsers.js';
import {parse_gsrcl_probabilities} from './parsers.js';

// import {extractBFactors} from './parsers.js';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';

class ResultsTranscriptomics extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    
    this.gsrcl_png = React.createRef();
    this.gsrcl_legend = React.createRef();
    this.gsrcl_table = React.createRef();
    this.update_count = 0;
    this.gsrcl_csv_found = false;
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
    //console.log(this.state);
    this.update_count = this.update_count + 1;
    for(let key in this.state.gsrcl_results){
      if(key.includes(".png")){
        let img_url = this.state.gsrcl_results[key];
        let newElement = document.createElement('img');
        newElement.src = img_url;
        newElement.alt = "GsRCL t-SNE plot";
        newElement.style.width = "800px";
        this.gsrcl_png.current.appendChild(newElement);
      }
    }
    
    for(let key in this.state.gsrcl_results){
      if(key.includes(".csv")){
        this.gsrcl_csv_found = true;
        let file_data = this.state.gsrcl_results[key];
        if(file_data.length > 0){
          let html_data = parse_gsrcl_probabilities(file_data);
          var dt = document.createElement('template');
          dt.innerHTML = html_data;
          this.gsrcl_table.current.appendChild(dt.content);
        //   let table = $('#gsrcl_probabilities_table').DataTable({
        //     searching : true,
        //     paging: true,
        //     ordering: true,
        //     lengthChange: 50,
        //     pageLength: 50,
        //     order: [[7, 'asc']],
        //     layout: {
        //       bottomEnd: {
        //           paging: {
        //               firstLast: true,
        //               buttons: 5
        //           }
        //       }
        //   }
        //  });
        }
      }
    }
    
    for(let key in this.state.gsrcl_results){
      if(key.includes(".txt")){
        let file_data = this.state.gsrcl_results[key];
        console.log(file_data);
        if(this.gsrcl_csv_found == false){
          var dt = document.createElement('template');
          dt.innerHTML = "<h2>Your input file is not formatted correctly</h2><p>"+file_data.slice(11)+"</p>";
          this.gsrcl_table.current.appendChild(dt.content);
        }
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
            let file_content = request_data(entry.data_path, props.files_url, 'text/plain;charset=UTF-8');
            let file_name = entry.data_path.split('/')[2];
            results_files[file_name] = file_content;
        
          }
          catch (err){
            console.log("Getting and processing data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk  providing the following information; submission data, submission email address, analyses you had selected and the job name." + err.message);
            alert("Getting and processing data file: "+entry.data_path+" Failed. The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
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
              this.setState({gsrcl_results: parsed_data.gsrcl,
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
        //console.log(message.message);
        console.log("Fetching results: "+result_uri+" Failed. \n"+message.message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
        alert("Fetching results: "+result_uri+" Failed. \n"+message.message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
        this.setState({error_message: message.message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name."});
        this.props.updateWaiting(false);
        return null;
      });
    };
  }

  componentDidMount(){
    //here is a good place to send the results and set up the polling.
    this.timer = setInterval(() => this.getResults(), 20000);
    //this.timer = setInterval(() => this.getResults(), 500);
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

        { this.props.analyses.includes("gsrcl_job") &&
          <div className="box box-primary" id="gsrcl_svg_image">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.gsrcl.shortName} Cluster Plot</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.gsrcl_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.gsrcl_waiting_icon} /></div>
              }
              <div className="gsrcl_png" id="gsrcl_png" ref={this.gsrcl_png}></div>
              </div>
          </div>
         }
        
        { this.props.analyses.includes("gsrcl_job") &&
          <div className="box box-primary" id="gsrcl_probabilities">
            <div className="box-header with-border">
              <h5 className="box-title">{this.props.job_strings.gsrcl.shortName} Probabilities</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.props.gsrcl_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide"><img alt="waiting icon" src={this.props.gsrcl_waiting_icon} /></div>
              }
              <div className="gsrcl_table" id="gsrcl_table" ref={this.gsrcl_table}></div>
            </div>
          </div>
         }
        
         
      </div>
    );
  }
}
export {ResultsTranscriptomics};