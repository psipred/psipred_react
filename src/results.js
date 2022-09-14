import React from 'react';
import {configurePost} from './requests_helper.js'; // eslint-disable-line no-unused-vars
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
    };
  }

  postJob = (config_data) => {
    console.log(config_data.props);
    console.log('Sending JOB URI request: POST: '+config_data.props.submit_url );
    fetch(this.props.submit_url, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'POST',
      body: configurePost({...{...config_data.state, ...config_data.props}}),
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
         if (window.history.replaceState) {
           window.history.replaceState({}, data.UUID, config_data.props.main_url+config_data.props.app_path+"/&uuid="+data.UUID);
         }
         this.props.updateWaiting(true);
       }
       //DO SOME THINGS
     }).catch(error => {
       console.log("Sending Job to "+config_data.props.submit_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Sending Job to "+config_data.props.submit_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
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
    this.postJob(this);
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
