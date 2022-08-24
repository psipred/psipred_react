import React from 'react';
import {configurePost} from './requests_helper.js'; // eslint-disable-line no-unused-vars
import {draw_empty_annotation_panel} from './results_helper.js';

class ResultsMain extends React.Component{
  constructor(props){
    super(props);
    //here's where we'll handle all the results files
    let residues = this.props.seq.split('');
    let annotations = [];
    residues.forEach(function(res){
      annotations.push({'res': res});
    });
    this.state ={
      uuid: null,
      result_uri: '',
      error_message: '',
      waiting: true,
      psipred_waiting_message: '<h2>Please wait for your PSIPRED job to process</h2>',
      psipred_wating_icon: 'HELLO',
      annotations: annotations,
    };
    this.sequencePlot = React.createRef();
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
     console.log(this.state);
  }
  componentDidMount(){
    console.log(this.props);
    console.log('Sending URI request');
    console.log(this.props.submit_url);
    console.log('POST');
    fetch(this.props.submit_url, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'POST',
      body: configurePost({...{...this.state, ...this.props}}),
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
           uuid: data.UUID,
           result_uri: this.props.main_url+this.props.app_path+"/&uuid="+data.UUID,
         });
         if (window.history.replaceState) {
           window.history.replaceState({}, data.UUID, this.props.main_url+this.props.app_path+"/&uuid="+data.UUID);
         }
       }
       //DO SOME THINGS
     }).catch(error => {
       console.log("Sending Job to "+this.props.submit_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
       alert("Sending Job to "+this.props.submit_url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
      return null;
     }).finally(() => {
       //START POLLING
     });

   draw_empty_annotation_panel(this.state, this.sequencePlot.current)
    //here is a good place to send the results and set up the polling.
  }

  render() {
    //console.log(this.props);
    return(
      <div>
      <div className="info-box bg-default job_info">
        <span className="info-box-icon job_info">
            <i className="fa fa-line-chart job_info_icon"></i>
        </span>
        <div className="info-box-content">
          <div className="job_info_text job_info_text_left">
            <p className="name_text">Name : {this.props.name}</p>
          </div>
          <div className="job_info_text box-tools pull-right job_info_text_right">Copy Link: <input id="retrievalLink" value={this.state.result_uri} width="160" readOnly /><button className="copyButton" type="button" data-clipboard-action="copy" data-clipboard-target="#retrievalLink"><img src="../interface/static/images/clippy.svg" alt="Copy to clipboard" width="16" /></button></div>
        </div>
      </div>

      { this.props.formSelectedOption==='SeqForm' ?
      <div className="box box-primary">
        <div className="box-header with-border">
          <h5 className="box-title">Sequence Plot</h5>
          <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse"><i className="fa fa-minus"></i></button></div>
        </div>
        <div className="box-body">
          <div className="sequence_plot" id="sequence_plot" ref={this.sequencePlot} ></div><br />
        </div>
        { this.state.waiting &&
          <div className="overlay processing">
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        }
      </div>
      :
        <h2>STRUCT RESULTS</h2>
      }

      { this.props.analyses.includes("psipred_job") &&
        <div className="box box-primary collapsed-box" id="psipred_cartoon">
          <div className="box-header with-border">
            <h5 className="box-title">PSIPRED Cartoon</h5>
            <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
          </div>
          <div className="box-body">
            <div className="error">{this.state.error_message}</div>
            <div className="psipred_cartoon"></div>
            <div className="waiting" intro="slide" outro="slide">{this.state.psipred_waiting_message}</div>
            <div className="waiting_icon" intro="slide" outro="slide">{this.state.psipred_waiting_icon}</div>
            { this.state.waiting &&
              <div className="overlay processing">
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            }
          </div>
        </div>
      }
      </div>
    );
    // name bar
    // IF seq job : show sequencve plot
    // IF show various results
  }
}

class ResultsSidebar extends React.Component{
  componentDidMount(){
    //here we ask for the times
  }

  handleSubmit(){
    // handle the side bar submission
  }

  render () {
    return(<div><h2>SIDE REGION</h2></div>);
    // DOWNLOAD
    //RESUBMISSION
  }
}

export {ResultsMain};
export {ResultsSidebar};
