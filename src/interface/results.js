import React from 'react';
import {configurePost} from '../shared/index.js'; // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js'; // eslint-disable-line no-unused-vars
import {ResultsSequence} from './results_sequence.js'; // eslint-disable-line no-unused-vars
import {ResultsStructure} from './results_structure.js'; // eslint-disable-line no-unused-vars


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
      psipred_waiting_message: 'Please wait for your '+this.props.job_strings.psipred.shortName+' job to process',
      psipred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      disopred_waiting_message: 'Please wait for your '+this.props.job_strings.disopred.shortName+' job to process',
      disopred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      memsatsvm_waiting_message: 'Please wait for your '+this.props.job_strings.memsatsvm.shortName+' job to process',
      memsatsvm_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      pgenthreader_waiting_message: 'Please wait for your '+this.props.job_strings.pgenthreader.shortName+' job to process',
      pgenthreader_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      dmp_waiting_message: 'Please wait for your '+this.props.job_strings.dmp.shortName+' job to process',
      dmp_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      mempack_waiting_message: 'Please wait for your '+this.props.job_strings.mempack.shortName+' job to process',
      mempack_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      genthreader_waiting_message: 'Please wait for your '+this.props.job_strings.genthreader.shortName+' job to process',
      genthreader_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      pdomthreader_waiting_message: 'Please wait for your '+this.props.job_strings.pdomthreader.shortName+' job to process',
      pdomthreader_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      dmpfold_waiting_message: 'Please wait for your '+this.props.job_strings.dmpfold.shortName+' job to process',
      dmpfold_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      s4pred_waiting_message: 'Please wait for your '+this.props.job_strings.s4pred.shortName+' job to process',
      s4pred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      dompred_waiting_message: 'Please wait for your '+this.props.job_strings.dompred.shortName+' job to process',
      dompred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      ffpred_waiting_message: 'Please wait for your '+this.props.job_strings.ffpred.shortName+' job to process',
      ffpred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      metsite_waiting_message: 'Please wait for your '+this.props.job_strings.metsite.shortName+' job to process',
      metsite_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      hspred_waiting_message: 'Please wait for your '+this.props.job_strings.hspred.shortName+' job to process',
      hspred_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      memembed_waiting_message: 'Please wait for your '+this.props.job_strings.memembed.shortName+' job to process',
      memembed_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      merizo_waiting_message: 'Please wait for your '+this.props.job_strings.merizo.shortName+' job to process',
      merizo_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      dmpmetal_waiting_message: 'Please wait for your '+this.props.job_strings.dmpmetal.shortName+' job to process',
      dmpmetal_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
      merizosearch_waiting_message: 'Please wait for your '+this.props.job_strings.merizosearch.shortName+' job to process',
      merizosearch_waiting_icon: process.env.PUBLIC_URL+'/static/images/gears.svg',
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
           //console.log(submission_jobs);
           if(submission_jobs.includes("pdomthreader") || submission_jobs.includes("pgenthreader") )
           {
            submission_jobs.push('psipred');
           }
           let seq = request_data(submission_data.input_file, config_data.props.files_url);
           seq = seq.replace(/\r?\n|\r/g, "");
           config_data.props.updateAnalyses(submission_jobs.map(item => `${item}_job`));
           config_data.props.updateSeq(seq);
           config_data.props.updateForm(job_type);
         }
         else if (this.checkSubset(config_data.props.struct_job_names, submission_jobs)){
           //GET PDB DATA
          job_type = "StructForm";
          config_data.props.updateAnalyses(submission_jobs.map(item => `${item}_job`));
          config_data.props.updateForm(job_type);
         }
         else
         {
          //THROW SOME ERROR AS THE USERS SOMEHOW HAS A JOB THAT CONTAINS BOTH SEQ AND STRUCT JOBS
         }
         this.setState({
            result_uri: config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID,
         });
         config_data.props.updateName(data.submissions[0].submission_name);
         config_data.props.updateUuid(data.UUID);
         config_data.props.updateWaiting(true);
       }
       //DO SOME THINGS
     }).catch(async error => {
       let obj = await error.json().then(json => {return(json);});
       let message = '';
       if(obj.error){
        message = obj.error;
       }
       if(obj.error.input_data){
        message = obj.error.input_data
       }
       console.log("Getting Job data "+config_data.props.submit_url+config_data.props.incoming_uuid+" Failed. "+message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
       alert("Getting Job data to "+config_data.props.submit_url+config_data.props.incoming_uuid+" Failed. "+message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
       return null;
     });
  }

  postJob = (config_data) => {
    // console.log(config_data.props);
    console.log('Posting Job URI request: POST: '+config_data.props.submit_url );
    let sending_data = configurePost({...{...config_data.state, ...config_data.props}});
    for (const pair of sending_data.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    fetch(config_data.props.submit_url, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'POST',
      body: sending_data,
    }).then(async response => {
       if(response.ok){
         //console.log("response ok");
         return response.json().then(json => {return(json);});
       }
       throw response;
     }).then(data => {
       //console.log("response processing");
       if(data.UUID !== null)
       {
         console.log("RECIEVED UUID: "+data.UUID);
         this.setState({
           result_uri: config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID,
         });
         this.props.updateUuid(data.UUID);
         if(window.history.replaceState) {
          //DEV EXPECTS THIS URL TO BE 127.0.0.1, if you're on LOCALHOST this asssignment will fail

          //window.history.replaceState({}, data.UUID, config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID);
          console.log("Add new history to browser window: "+config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID);
          try {
            window.history.replaceState({}, data.UUID, config_data.props.app_path+"/&uuid="+data.UUID);
          }
          catch{
            throw new Error("Failed to push new browser history: "+config_data.props.main_url+config_data.props.app_path);
          }
        }
         config_data.props.updateWaiting(true);
       }
       //DO SOME THINGS
     }).catch(async error => {
        let message = {};
        try {
          let obj = await error.json().then(json => {return(json);});
          //console.log(obj);
          if(obj.error){
            message.message = obj.error;
          }
          else if(obj.error.input_data){
            message.message = obj.error.input_data
          }
          else {
            message.message = obj;
          }
        }
        catch{
          message.message=error
        }
        console.log(message.message);
        console.log("Posting Job to "+config_data.props.submit_url+" Failed. "+message.message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
        console.log(message.message);
        alert("Posting Job to "+config_data.props.submit_url+" Failed. "+message.message+". The Backend processing service was unable to process your submission. Please contact psipred-help@cs.ucl.ac.uk providing the following information; submission data, submission email address, analyses you had selected and the job name.");
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
        <ResultsStructure {...{...this.state, ...this.props}} updateWaiting={this.props.updateWaiting} updateResultsFiles={this.props.updateResultsFiles} updateConfig={this.props.updateConfig} />
      }


      </div>
    );
  }
}

export {ResultsMain};
