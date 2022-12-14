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
    console.log('Sending Times URI request: GET: '+this.props.times_url);
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
       console.log("Sending Job to "+this.props.times_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Sending Job to "+this.props.times_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
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
              { "psipred" in this.state &&
                <div><span className="info-box-number">Average PSIPRED runtime is: {this.state.psipred}</span><br /></div>
              }
            </div>
      </div>
    );
  }
}

export {ResultsSidebarTimes};
