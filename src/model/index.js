import React from 'react';
import {decide_location} from '../shared/index.js' // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js'; 
import {display_structure} from '../shared/index.js';

export class Model extends React.Component{
    constructor (props){
        super(props);
        let href = window.location.href;
        let main_url = "http://bioinf.cs.ucl.ac.uk";
        let app_path = "/psipred_beta";
        let aln = null;
        let analysis_type = null;
        console.log(href);
        if(window.location.href.includes("aln=")){
          let aln_ref = window.location.href.split('?')[1];
          let input_data = aln_ref.slice(4).split('&type=');
          aln = input_data[0];
          analysis_type = input_data[1];
        }
        console.log("PAGE LOAD location : "+window.location.hostname);
        console.log("ALN:" +aln);
        let uris = decide_location(href, window.location.hostname, main_url, app_path)
        uris['aln'] = aln;
        this.timer = null;
        this.state = uris;
        this.state.uuid = null; 
        this.state.model_uri = null;
        this.state.waiting = true;
        this.state.aln = request_data("/submissions/"+aln, this.state.files_url, 'text/plain');
        this.state.form_data = this.configurePost(this.state.aln, analysis_type);
        this.state.uuid = this.postModelJob(this.state.form_data);
        this.state.pdb_data = null;
        console.log("MODELLING JOB UUID: "+this.state.uuid);

        this.model = React.createRef();

    }

    postModelJob = (form_data) => {
        console.log("SENDING MODELLING JOB TO: "+this.state.submit_url)
        let results_data = null;
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange = function (){
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
             results_data = JSON.parse(xhr.response);
            }
        }
        xhr.open('POST',this.state.submit_url, false);
        xhr.setRequestHeader("Accept","application/json");
        xhr.send(form_data);
        xhr.onerror = function() {
            alert("Request failed");
        };
        return(results_data.UUID);
    }

    configurePost = (aln_data, analysis_type) =>
    {
      //console.log(formState);
      var file = null;
      try
      {
        file = new Blob([aln_data]);
      } catch (e)
      {
        alert(e);
      }
      let fd = new FormData();
    
      fd.append("input_data", file, 'input.txt');
      if(analysis_type === "cath"){

          console.log("JOB NAME: cath_modeller ");
          fd.append("job", "cath_modeller");
      }
      else{
        console.log("JOB NAME: pdb_modeller ");
        fd.append("job", "pdb_modeller");
      }
      fd.append("submission_name", "genthreader_model");
      fd.append("email", "dummy@dummy.com");
      
      return(fd);
    }

    getResultsFiles = (data, state) => {
        let results_files = {};
        let model_uri = null;
        data.forEach(function(entry){
          let glob = entry.data_path.split(/[.]/).pop();
          if(glob.includes("pdb"))
          {
              let file_content = request_data(entry.data_path, state.files_url);
              let file_name = entry.data_path.split('/')[2];
              results_files[file_name] = file_content;
              model_uri = state.files_url+entry.data_path;
          }
        });
        return([results_files, model_uri]);
      }
    

  getResults = () => {
    let result_uri = this.state.submit_url+this.state.uuid;
    let results_data = null;
    // we should loop over this.props.analyses and for every JOB_job we should get all the results data
    if(this.state.waiting) {
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
            data.submissions.forEach((submission) => {
              // get an array of all the results files for our job
              results_data = this.getResultsFiles(submission.results, this.state);
              //for each job type we push all the results files to this object
            });
            this.setState({waiting: false,
                pdb_data: results_data[0],
                model_uri: results_data[1],});
            clearInterval(this.timer);
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


  componentDidUpdate(prevProps) {
    // console.log(this.state.pdb_data);
    // console.log(this.state.pdb_data[Object.keys(this.state.pdb_data)[0]]);
    var data = this.state.pdb_data[Object.keys(this.state.pdb_data)[0]];
    display_structure(this.model.current, data, true, false);
  }

    componentDidMount(){
        console.log("Awaiting structure");
        this.timer = setInterval(() => this.getResults(), 500);
      }
    

    render(){
        return(
            <>{ this.state.pdb_data ?
                <div>
                    <div className="row">
                    <div className="col-sm-7 col-sm-offset-5">
                      <h2><a href={this.state.model_uri}>DOWNLOAD MODEL</a></h2>
                      <div id="container-01" ref={this.model} className="mol-container" style={{width: "600px",height: "600px", position: "relative"}}></div>
                    </div>
                    </div>
                </div>
              :
              <h1>&nbsp;3D MODEL Requested (may take up to 30mins)...</h1>
           }</>
        )}
}