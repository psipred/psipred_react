import React from 'react';
import {parse_times} from '../shared/index.js'; // eslint-disable-line no-unused-vars

class ResultsSidebarTimes extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      loading_message: 'Fetching Times',
    };
  }

    componentDidUpdate() {
      // currently just doing some reporting while debugging
      //console.log(this.state);
    }
  componentDidMount(){
    console.log('Getting Times URI request: GET: '+this.props.times_url);
    fetch(this.props.times_url, {
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
         console.log("RECIEVED TIMES");
         var times = parse_times(data);
         this.setState(times);
       }
       //DO SOME THINGS
     }).catch(async error => {
       let obj = await error.json().then(json => {return(json);});
       console.log("Getting Times data "+this.props.times_url+" Failed. "+obj.error+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Getting Times data "+this.props.times_url+" Failed. "+obj.error+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
      return null;
     })
  }

  render () {
    return(
      <div className="info-box">
            <span className="info-box-icon bg-blue"><i className="fa fa-clock-o"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Average Processing Time</span><br />
              { this.state.loading_message &&
                <div><span className="info-box-number">{this.state.loading_message}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.psipred.jobName) &&
                <div><span className="info-box-number">{this.props.job_strings.psipred.shortName} runtime: {this.state.psipred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.disopred.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.disopred.shortName} runtime: {this.state.disopred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.memsatsvm.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.memsatsvm.shortName} runtime: {this.state.memsatsvm}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.pgenthreader.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.pgenthreader.shortName} runtime: {this.state.pgenthreader}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.dmp.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.dmp.shortName} runtime: {this.state.dmp}</span><br /></div>
              }
               { this.props.analyses.includes(this.props.job_strings.mempack.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.mempack.shortName} runtime: {this.state.mempack}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.genthreader.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.genthreader.shortName} runtime: {this.state.genthreader}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.pdomthreader.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.pdomthreader.shortName} runtime: {this.state.pdomthreader}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.s4pred.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.s4pred.shortName} runtime: {this.state.s4pred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.dompred.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.dompred.shortName} runtime: {this.state.dompred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.ffpred.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.ffpred.shortName} runtime: {this.state.ffpred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.metsite.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.metsite.shortName} runtime: {this.state.mesite}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.hspred.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.hspred.shortName} runtime: {this.state.hspred}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.memembed.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.memembed.shortName} runtime: {this.state.memembed}</span><br /></div>
              }
              { this.props.analyses.includes(this.props.job_strings.merizo.jobName) &&
              <div><span className="info-box-number">{this.props.job_strings.merizo.shortName} runtime: {this.state.merizo}</span><br /></div>
              }
              
            </div>
      </div>
    );
  }
}

export {ResultsSidebarTimes};
