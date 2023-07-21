import React from 'react';
import {configurePost} from './requests_helper.js'; // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js'; // eslint-disable-line no-unused-vars
import {ResultsSequence} from './results_sequence.js'; // eslint-disable-line no-unused-vars

//We render the name bar with the copy link and then we render the seq plot for
//any SeqForm results.
//Then we have a set of ifs for any additional results panels at the bottom
class ResultsMain extends React.Component{
  constructor(props){
    super(props);
    //here's where we'll handle all the results files
    this.state ={
      result_uri: '',
      error_message: null,
      loading_message: 'Fetching Times',
      psipred_waiting_message: 'Please wait for your PSIPRED job to process',
      psipred_wating_icon: '',
      disopred_waiting_message: 'Please wait for your DISOPRED job to process',
      disopred_wating_icon: '',
      memsatsvm_waiting_message: 'Please wait for your MEMSAT-SVM job to process',
      memsatsvm_wating_icon: '',
      pgenthreader_waiting_message: 'Please wait for your pGenTHREADER job to process',
      pgenthreader_wating_icon: '',
      dmp_waiting_message: 'Please wait for your DeepMetaPSICOV job to process',
      dmp_wating_icon: '',
      mempack_waiting_message: 'Please wait for your Mempack job to process',
      mempack_wating_icon: '',
      genthreader_waiting_message: 'Please wait for your GenTHREADER job to process',
      genthreader_wating_icon: '',
      pdomthreader_waiting_message: 'Please wait for your pDomTHREADER job to process',
      pdomthreader_wating_icon: '',
      
    };
  }

  checkSubset = (parentArray, subsetArray) => {
    let set = new Set(parentArray);
    return subsetArray.every(x => set.has(x));
  }
  
  getJob = (config_data) => {
    //console.log(config_data.props);
    console.log('Getting Job Data URI request: GET: '+config_data.props.submit_url+config_data.props.incoming_uuid );
    fetch(config_data.props.submit_url+config_data.props.incoming_uuid, {
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
       if(data.UUID !== null)
       {
         console.log("RECIEVED JOB DATA FOR UUID: "+data.UUID);
         let submission_jobs = [];
         //We've got the data now we check all the jobs run are either seq or stsruct jobs and we update the
         // parent props.analyses accordingly
         data.submissions.forEach((submission) =>{
            submission_jobs.push(submission.job_name);
         });
         let submission_data = data.submissions[0];
         let job_type = "SeqForm"

         //console.log("ARRAY TEST:"+found)
        if(this.checkSubset(config_data.props.seq_job_names, submission_jobs))
         {
           let seq = request_data(submission_data.input_file, config_data.props.files_url);
           config_data.props.updateAnalyses(submission_jobs.map(item => `${item}_job`));
           config_data.props.updateSeq(seq);
           config_data.props.updateForm(job_type);
         }
         else if (this.checkSubset(config_data.props.struct_job_names, submission_jobs)){
           //GET PDB DATA
          job_type = "StructForm";
          config_data.props.updateForm(job_type);
         }
         else
         {
          //THROW SOME ERROR AS THE USERS SOMEHOW HAS A JOB THAT CONTAINS BOTH SEQ AND STRUCT JOBS
         }
         this.setState({
            result_uri: config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID,
         });
         config_data.props.updateUuid(data.UUID);
         config_data.props.updateWaiting(true);
       }
       //DO SOME THINGS
     }).catch(error => {
       console.log("Getting Job data "+config_data.props.submit_url+config_data.props.incoming_uuid+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Getting Job data to "+config_data.props.submit_url+config_data.props.incoming_uuid+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       return null;
     });
  }

  postJob = (config_data) => {
    // console.log(config_data.props);
    console.log('Posting Job URI request: POST: '+config_data.props.submit_url );
    let sending_data = configurePost({...{...config_data.state, ...config_data.props}});
    fetch(config_data.props.submit_url, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'POST',
      body: sending_data,
    }).then(response => {
       if(response.ok){
         return response.json().then(json => {return(json);});
       }
       throw response;
     }).then(data => {
       if(data.UUID !== null)
       {
         console.log("RECIEVED UUID: "+data.UUID);
         this.setState({
           result_uri: config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID,
         });
         this.props.updateUuid(data.UUID);
         if(window.history.replaceState) {
          //DEV EXPECTS THIS URL TO BE 127.0.0.1, if you're on LOCALHOST this asssignment will fail
          window.history.replaceState({}, data.UUID, config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID);
         }
         config_data.props.updateWaiting(true);
       }
       //DO SOME THINGS
     }).catch(error => {
       console.log("Posting Job to "+config_data.props.submit_url+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Posting Job to "+config_data.props.submit_url+" Failed. "+error.message+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       return null;
     });
  }

  componentDidUpdate() {
    if (this.props.resubmit === true) {
       console.log('RESUBMITTING SEQUENCE');
       this.props.updateResubmit(false);
       this.postJob(this);
     }
  }

  componentDidMount(){
    if(this.props.incoming_uuid){
       console.log("GETTING DETAILS JOB: "+this.props.incoming_uuid);
       this.getJob(this);
    }
    else{
      this.postJob(this);
    }
  }

  render() {
    //console.log(this.props);
    return(
      <div>
      { (this.props.uuid && this.props.formSelectedOption==='SeqForm') ?
        <ResultsSequence {...{...this.state, ...this.props}} updateWaiting={this.props.updateWaiting} updateResultsFiles={this.props.updateResultsFiles} updateConfig={this.props.updateConfig} />
        :
        <h2>STRUCT RESULTS</h2>
      }


      </div>
    );
    // name bar
    // IF seq job : show sequencve plot
    // IF show various results
  }
}

export {ResultsMain};
