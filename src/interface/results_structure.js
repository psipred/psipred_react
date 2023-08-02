import React from 'react';
import {request_data} from '../shared/index.js';
// import {request_binary_data} from './results_helper.js';
import {parse_config} from './results_helper.js';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import * as $3Dmol from '3dmol/build/3Dmol.js';

class ResultsStructure extends React.Component{
  constructor(props){
    super(props);
    //this.sequencePlot = React.createRef();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
    //console.log(this.state);

    // for(let key in this.state.memsatsvm_results){
    //   if(key.includes("_schematic.png")){
    //     let img_url = this.state.memsatsvm_results[key];
    //     let newElement = document.createElement('img');
    //     newElement.src = img_url;
    //     newElement.alt = "Memsat Schematic diagram";
    //     this.memsatSVMSchematic.current.appendChild(newElement);
    //     newElement = document.createElement('br');
    //     this.memsatSVMSchematic.current.appendChild(newElement);
    //   }
    // }
    
    // if(this.state.genthreader_results){
    //   let gen_table = $('#gen_table').DataTable({
    //     'searching'   : true,
    //     'pageLength': 50,
    //   });

    //   var gen_minEl = $('#min_gen_pval');
    //   var gen_maxEl = $('#max_gen_pval');
    //   // Custom range filtering function
    //   //https://stackoverflow.com/questions/55242822/prevent-datatables-custom-filter-from-affecting-all-tables-on-a-page
    //   //note: we have to push one of these functions on to the array for every table we want to have
    //   // a custom filter for.
    //   $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    //       //console.log(settings.nTable.id);
    //       if ( settings.nTable.id !== 'gen_table' ) {
    //         return true;
    //       }
    //       var min = parseFloat(gen_minEl.val(), 10);
    //       var max = parseFloat(gen_maxEl.val(), 10);
    //       var pval = parseFloat(data[2]) || 0; // use data for the age column
    //       if (
    //           (isNaN(min) && isNaN(max)) ||
    //           (isNaN(min) && pval <= max) ||
    //           (min <= pval && isNaN(max)) ||
    //           (min <= pval && pval <= max)
    //       ) {
    //           return true;
    //       }
   
    //       return false;
    //   });
   
    //   // Changes to the inputs will trigger a redraw to update the table
    //   gen_minEl.on('input', function () {
    //       gen_table.draw();
    //   });
    //   gen_maxEl.on('input', function () {
    //       gen_table.draw();
    //   });

    // }
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
              this.setState({});
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
      }).catch(async error => {
        //console.log("THIS ERROR?"+error);
        let obj = {}; 
        try{
          obj = await error.json().then(json => {return(json);});
        }
        catch{
          obj["error"] = error;
        }
        console.log("Fetching results: "+result_uri+" Failed. \n"+obj.error+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        alert("Fetching results: "+result_uri+" Failed. \n"+obj.error+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        this.props.updateWaiting(false);
        return null;
      });
    };
  }

  componentDidMount(){
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

        { (this.props.analyses.includes("psipred_job") || this.props.analyses.includes("pgenthreader_job") || this.props.analyses.includes("dmp_job") || this.props.analyses.includes("dompred_job") || this.props.analyses.includes("ffpred_job")) &&
          <div>
            { this.renderPanel("psipred_cartoon", "PSIPRED Cartoon", "psipred_cartoon", 'psipred_horiz', this.horizPlot, this.state.psipred_waiting_message, this.state.psipred_waiting_icon) }
          </div> 
         }
         
      </div>
    );
  }
}
export {ResultsStructure};
