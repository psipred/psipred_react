import React from 'react';
import {decide_location} from '../shared/index.js' // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js';
import * as $3Dmol from '3dmol/build/3Dmol.js';

export class Model extends React.Component{
    constructor (props){
        super(props);
        let href = window.location.href;
        let main_url = "http://bioinf.cs.ucl.ac.uk";
        let app_path = "/psipred_beta";
        let aln = null;
        console.log(href);
        if(window.location.href.includes("aln=")){
          let aln_ref = window.location.href.split('?')[1];
          aln = aln_ref.slice(4);
        }
        console.log("PAGE LOAD location : "+window.location.hostname);
        console.log("ALN:" +aln);
        let uris = decide_location(href, window.location.hostname, main_url, app_path)
        uris['aln'] = aln;
        this.timer = null;

        this.state = uris;
        this.state.uuid = null; 
        this.state.waiting = true;
        this.state.aln = request_data("/submissions/"+aln, this.state.files_url, 'text/plain');
        this.state.form_data = this.configurePost(this.state.aln);
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

    configurePost = (aln_data) =>
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
      console.log("JOB NAME: pdb_modeller ");
    
      fd.append("input_data", file, 'input.txt');
      fd.append("job", "pdb_modeller");
      fd.append("submission_name", "genthreader_model");
      fd.append("email", "dummy@dummy.com");
      
      return(fd);
    }

    getResultsFiles = (data, state) => {
        let results_files = {};
        data.forEach(function(entry){
          let glob = entry.data_path.split(/[.]/).pop();
          if(glob.includes("pdb"))
          {
              let file_content = request_data(entry.data_path, state.files_url);
              let file_name = entry.data_path.split('/')[2];
              results_files[file_name] = file_content;
          }
        });
        return(results_files);
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
            let parsed_data = {};
            data.submissions.forEach((submission) => {
              // get an array of all the results files for our job
              results_data = this.getResultsFiles(submission.results, this.state);
              //for each job type we push all the results files to this object
              parsed_data[submission.job_name] = results_data;
              //console.log(parsed_data);
            });
            this.setState({waiting: false,
                pdb_data: parsed_data.pdb_modeller,});
            clearInterval(this.timer);
          }
          else if(data.state === "Error"){
            throw new Error(data.submissions.at(-1).last_message);
          }
          else{
            throw new Error("Job Failed");
          }

        }
      }).catch(error => {
        console.log("Fetching 3D MODEL: "+result_uri+" Failed. \n"+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        alert("Fetching 3D MODEL: "+result_uri+" Failed. \n"+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        this.setState({waiting: false});
        clearInterval(this.timer);
        return null;
      });
    };
  }


  componentDidUpdate(prevProps) {
    console.log(this.state.pdb_data[Object.keys(this.state.pdb_data)[0]]);
    var data = this.state.pdb_data[Object.keys(this.state.pdb_data)[0]];
    var cartoon_color = function(atom) {
      if(atom.ss === 'h'){return '#e353e3';}
      if(atom.ss === 's'){return '#e5dd55';}
      return('grey');
    };
    //https://www.npmjs.com/package/3dmol
    let element = this.model.current;
    let config = { backgroundColor: '#ffffff' };
    let viewer = $3Dmol.createViewer( element, config );
    viewer.addModel( data, "pdb" );                       /* load data */
    viewer.setStyle({}, {cartoon: {colorfunc: cartoon_color}});  /* style all atoms */
    viewer.zoomTo();                                      /* set camera */
    viewer.render();                                      /* render scene */
    viewer.zoom(1.7, 3000);     
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
                        <div id="container-01" ref={this.model} className="mol-container" style={{width: "600px",height: "600px", position: "relative"}}></div>
                    </div>
                    </div>
                </div>
              :
              <h1>&nbsp;3D MODEL Requested (may take up to 30mins)...</h1>
           }</>
        )}
}