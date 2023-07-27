import React from 'react';
import {parse_times} from './requests_helper.js'; // eslint-disable-line no-unused-vars

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
     }).catch(error => {
       console.log("Getting Times data "+this.props.times_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Getting Times data "+this.props.times_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
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
              { this.props.analyses.includes('psipred_job') &&
                <div><span className="info-box-number">PSIPRED runtime: {this.state.psipred}</span><br /></div>
              }
              { this.props.analyses.includes('disopred_job') &&
              <div><span className="info-box-number">DISOPRED runtime: {this.state.disopred}</span><br /></div>
              }
              { this.props.analyses.includes('memsatsvm_job') &&
              <div><span className="info-box-number">MEMSAT-SVM runtime: {this.state.memsatsvm}</span><br /></div>
              }
              { this.props.analyses.includes('pgenthreader_job') &&
              <div><span className="info-box-number">pGenTHREADER runtime: {this.state.pgenthreader}</span><br /></div>
              }
              { this.props.analyses.includes('dmp_job') &&
              <div><span className="info-box-number">DeepMetaPSICOV runtime: {this.state.dmp}</span><br /></div>
              }
               { this.props.analyses.includes('mempack_job') &&
              <div><span className="info-box-number">MEMPACK runtime: {this.state.mempack}</span><br /></div>
              }
              { this.props.analyses.includes('genthreader_job') &&
              <div><span className="info-box-number">GenTHREADER runtime: {this.state.genthreader}</span><br /></div>
              }
              { this.props.analyses.includes('pdomthreader_job') &&
              <div><span className="info-box-number">pDomTHREADER runtime: {this.state.pdomthreader}</span><br /></div>
              }
              { this.props.analyses.includes('s4pred_job') &&
              <div><span className="info-box-number">S4Pred runtime: {this.state.s4pred}</span><br /></div>
              }
              
            </div>
      </div>
    );
  }
}

export {ResultsSidebarTimes};
