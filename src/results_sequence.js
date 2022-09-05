import React from 'react';
import {draw_empty_annotation_panel} from './results_helper.js';
import {process_files} from './results_helper.js';


class ResultsSequence extends React.Component{
  constructor(props){
    super(props);
    let residues = this.props.seq.split('');
    let annotations = [];
    residues.forEach(function(res){
      annotations.push({'res': res});
    });
    this.state ={
      annotations: annotations,
    };
    this.sequencePlot = React.createRef();
    this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if(this.props.waiting === false){
      clearInterval(this.timer);
      this.time = null;
    }
  }

  getResultsFiles = (data, props) => {
    data.forEach(function(entry){
      process_files(entry.data_path, props.uuid);
    });
  }

  getResults = () => {
    let result_uri = this.props.submit_url+this.props.uuid;
    if(this.props.waiting) {
      console.log("RESULTS: "+result_uri);
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
        console.log(data);
        if(data.state !== "Running"){
          this.getResultsFiles(data.submissions[0].results, this.props);
          this.props.updateWaiting(false);
        }
      }).catch(error => {
        console.log("Fetching results: "+result_uri+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        alert("Fetching results: "+result_uri+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");
        return null;
      });
    }
  }

  componentDidMount(){
    draw_empty_annotation_panel(this.state, this.sequencePlot.current)
    //here is a good place to send the results and set up the polling.
      this.timer = setInterval(()=> this.getResults(), 500);
  }

  render() {
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
            <div className="job_info_text box-tools pull-right job_info_text_right">Copy Link: <input id="retrievalLink" value={this.props.result_uri} width="160" readOnly /><button className="copyButton" type="button" data-clipboard-action="copy" data-clipboard-target="#retrievalLink"><img src="../interface/static/images/clippy.svg" alt="Copy to clipboard" width="16" /></button></div>
          </div>
        </div>
        }

        { this.props.uuid &&
        <div className="box box-primary">
          <div className="box-header with-border">
            <h5 className="box-title">Sequence Plot</h5>
            <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse"><i className="fa fa-minus"></i></button></div>
          </div>
          <div className="box-body">
            <div className="sequence_plot" id="sequence_plot" ref={this.sequencePlot} ></div><br />
          </div>
          { this.props.waiting &&
            <div className="overlay processing">
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          }
        </div>
        }

        { this.props.analyses.includes("psipred_job") &&
          <div className="box box-primary collapsed-box" id="psipred_cartoon">
            <div className="box-header with-border">
              <h5 className="box-title">PSIPRED Cartoon</h5>
              <div className="box-tools pull-right"><button className="btn btn-box-tool" type="button" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fa fa-plus"></i></button></div>
            </div>
            <div className="box-body">
              { this.state.error_message &&
                <div className="error">{this.state.error_message}</div>
              }
              <div className="psipred_cartoon"></div>
              { this.props.waiting &&
                <div className="waiting" intro="slide" outro="slide"><br /><h4>{this.state.psipred_waiting_message}</h4></div>
              }
              { this.props.waiting &&
                <div className="waiting_icon" intro="slide" outro="slide">{this.state.psipred_waiting_icon}</div>
              }
              { this.props.waiting &&
                <div className="overlay processing"><i className="fa fa-refresh fa-spin"></i></div>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}
export {ResultsSequence};
