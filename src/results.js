import React from 'react';
import {configurePost} from './requests_helper.js'; // eslint-disable-line no-unused-vars
import {parse_times} from './requests_helper.js'; // eslint-disable-line no-unused-vars
import {draw_empty_annotation_panel} from './results_helper.js';

//We render the name bar with the copy link and then we render the seq plot for
//any SeqForm results.
//Then we have a set of ifs for any additional results panels at the bottom
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
      error_message: null,
      loading_message: 'Fetching Times',
      psipred_waiting_message: 'Please wait for your PSIPRED job to process',
      psipred_wating_icon: '',
      annotations: annotations,
    };
    this.sequencePlot = React.createRef();
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
     //console.log(this.state);
  }
  componentDidMount(){
    //console.log(this.props);
    console.log('Sending URI request: POST: '+this.props.submit_url );
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
         this.props.updateWaiting(true);
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
        { this.props.waiting &&
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
    // name bar
    // IF seq job : show sequencve plot
    // IF show various results
  }
}


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

class ResultsSidebarDownloads extends React.Component{
  constructor(props){
    super(props);
    this.state ={
    };
  }

  packageZip = () => {}
  packageJobDetails = () => {}
  //<button className="fake-link" onClick="@this.fire('get_zip'), false">Get Zip file</button><br /><br />
  //<button className="fake-link" onClick="@this.fire('get_job_details'), false">Get Job details</button><br /><br />

  render() {
    return(
      <div className="box box-warning" id="downloads_widget">
       <div className="box-header with-border">
           <h5 className="box-title">Downloads</h5>

           <div className="box-tools pull-right">
               <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip"
                       title="Collapse">
                   <i className="fa fa-minus"></i></button>
           </div>
       </div>
       <div className="box-body">
           <h5>ZIP FILE</h5>
           <button className="fake-link" onClick={this.packageZip} >Get Zip file</button><br /><br />
           <h5>JOB CONFIGURATION</h5>
           <button className="fake-link" onClick={this.packageJobDetails} >Get Job details</button><br /><br />
           { this.props.analyses.includes('psipred') & this.props.analyses.waiting &&
            <h4>INSERT LINKS HERE</h4>
           }
       </div>
       { this.props.waiting &&
       <div className="overlay processing">
             <i className="fa fa-refresh fa-spin"></i>
       </div>
      }
      </div>
    );
  }
}

class ResultsSidebarResubmission extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      analyses: ['psipred_job'],
      seqStart: 1,
      seqStop: this.props.seq.length,
      bioDomModellerKey: '',
    };
    this.timer = null;
  }

  handleResubmit = () => {
    //if seqStart or seqStop are blank set to limits
    //Here we do the things for the resubmission
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
    console.log(this.state);
  }

  triggerStartChange = (value) => {
    console.log(value);
    if(value.length===0){
      this.setState({
        seqStart: 1,
      });
    }
    if(value > this.state.seqStop){
      this.setState({
        seqStart: this.state.seqStop,
      });
    }
  }
  triggerStopChange = (value) => {
    console.log(value);
    if(value.length===0 || value > this.props.seq.length){
      this.setState({
        seqStop: this.props.seq.length,
      });
    }
    else if(value < this.state.seqStart){
      this.setState({
        seqStop: this.state.seqStart,
      });
    }
  }

  handleChange = (event) => {
    if(event.target.name === 'bioserf_domserf_modeller_key')
    {
      this.setState({
         bioDomModellerKey: event.target.value,
         bioserf_modeller_key: event.target.value,
         domserf_modeller_key: event.target.value,
      });
    }
    if(event.target.name === 'start_coord')
    {
      clearTimeout(this.timer);
      let value = ' ';
      value = parseInt(event.target.value);
      if((value && value > 0) || !value)
      {
        if(! value){value = '';}
        this.setState({
          seqStart: value,
        });
        this.timer = setTimeout(this.triggerStartChange.bind(null, value), 1000);
      }
    }

    if(event.target.name === 'stop_coord')
    {
      clearTimeout(this.timer);
      let value = '';
      value = parseInt(event.target.value);
      if((value && value > 0) || !value)
      {
        if(! value){value = '';}
        this.setState({
          seqStop: value,
        });
        this.timer = setTimeout(this.triggerStopChange.bind(null, value), 1000);
      }
    }

  }

  dmpfoldAlert = (event) => {
    if(event.target.checked){
      alert("DMPFold analyses can take up to 6 hours. We advise you submit DMPfold jobs seperately to other predictions\n\nNote that DMP gives less accurate results for sequences larger than 500 residues, you should divide your sequence into shorter domains before submission");
    }
  }
  bioserfAlert = (event) => {
    if(event.target.checked){
      alert("Bioserf analyses can take longer than 6 hours. If you wish to run multiple analyses consdier running Bioserf as a seperate job submission");
    }
  }
  domserfAlert = (event) => {
    if(event.target.checked){
      alert("Domserf analyses can take longer than 6 hours. If you wish to run multiple analyses consdier running Bioserf as a seperate job submission");
    }
  }


  render(){
    return(
<div className="box box-success collapsed-box" id="resubmission_widget">
    <div className="box-header with-border">
        <h5 className="box-title">Segment Resubmission</h5>

        <div className="box-tools pull-right">
            <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip"
                    title="Collapse">
                <i className="fa fa-plus"></i></button>
        </div>
    </div>
    <div className="box-body">
      <br />
      <form method="Post" className="form" intro="slide" outro="slide"  onSubmit={this.handleResubmit}>
      <br />
      <h5 data-toggle="tool-tip" title="Select subsequence regions from your current result">Select subsequence region</h5>
      Start Coordinate <input type="text" id="start_coord" name="start_coord" className="sequence_coord" value={this.state.seqStart} onChange={this.handleChange} /> - Stop Coordinate <input id="stop_coord" type="text" name="stop_coord" className="sequence_coord" value={this.state.seqStop} onChange={this.handleChange} />

      <div className="form-group">
        <br />
        <h5>Choose prediction methods (hover for short description)</h5>
        <table className="full-width-table">
        <tbody>

          <tr>
          <td data-toggle="tool-tip" title="Predict helices, beta sheets and coils from AA sequence">
            <input type="checkbox" id="id_psipred_job" name="psipred_job" value="psipred_job" onChange={this.handleChange} checked={this.state.analyses.includes('psipred_job')}/>
            <label htmlFor="id_psipred_job">&nbsp;PSIPRED</label>
          </td>
          <td data-toggle="tool-tip" title="Detect intrinsically disordered regions in proteins">
            <input type="checkbox" id="id_disopred_job" name="disopred_job" value="disopred_job" onChange={this.handleChange} checked={this.state.analyses.includes('disopred_job')} />
            <label htmlFor="id_disopred_job">&nbsp;DISOPRED</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Calculate length, location and topology of transmembrane helices">
            <input type="checkbox" id="id_memsatsvm_job" name="memsatsvm_job" value="memsatsvm_job" onChange={this.handleChange} checked={this.state.analyses.includes('memsatsvm_job')} />
            <label htmlFor="id_memsat_job">&nbsp;MEMSAT-SVM</label>
          </td>
          <td data-toggle="tool-tip" title="Protein fold recognition with protein templates of known structure.">
            <input type="checkbox" id="id_pgenthreader_job" name="pgenthreader_job" value="pgenthreader_job" onChange={this.handleChange} checked={this.state.analyses.includes('pgenthreader_job')} />
            <label htmlFor="id_pgenthreader_job">&nbsp;pGenTHREADER</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Predict interresidue contacts using a convolutional neural network">
            <input type="checkbox" id="id_dmp_job" name="dmp_job" value="dmp_job" onChange={this.handleChange} checked={this.state.analyses.includes('dmp_job')} />
            <label htmlFor="id_dmp_job">&nbsp;DeepMetaPSICOV</label>
          </td>
          <td data-toggle="tool-tip" title="Predict packing membrane helices">
            <input type="checkbox" id="id_mempack_job" name="mempack_job" value="mempack_job" onChange={this.handleChange} checked={this.state.analyses.includes('mempack_job')} />
            <label htmlFor="id_mempack_job">&nbsp;MEMPACK</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Fast fold recognition method using template structures">
            <input type="checkbox" id="id_genthreader_job" name="genthreader_job" value="genthreader_job" onChange={this.handleChange} checked={this.state.analyses.includes('genthreader_job')} />
            <label htmlFor="id_genthreader_job">&nbsp;GenTHREADER</label>
          </td>
          <td data-toggle="tool-tip" title="Fast protein domain fold recognition using domain templates">
            <input type="checkbox" id="id_pdomthreader_job" name="pdomthreader_job" value="pdomthreader_job" onChange={this.handleChange} checked={this.state.analyses.includes('pdomthreader_job')} />
            <label htmlFor="id_pdomthreader_job">&nbsp;pDomThreader</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Fully automated homology modelling">
            <input type="checkbox" onClick={this.bioserfAlert} id="id_bioserf_job" name="bioserf_job" value="bioserf_job" onChange={this.handleChange} checked={this.state.analyses.includes('bioserf_job')} />
            <label htmlFor="id_bioserf_job">&nbsp;Bioserf</label>
          </td>
          <td data-toggle="tool-tip" title="Fully automated structural domain homology modelling">
            <input type="checkbox" onClick={this.domserfAlert} id="id_domserf_job" name="domserf_job" value="domserf_job" onChange={this.handleChange} checked={this.state.analyses.includes('domserf_job')} />
            <label htmlFor="id_domserf_job">&nbsp;Domserf</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Accurate structure prediction using residue-residue contacts.">
            <input type="checkbox" onClick={this.dmpfoldAlert} id="id_dmpfold_job" name="dmpfold_job" value="dmpfold_job" onChange={this.handleChange} checked={this.state.analyses.includes('dmpfold_job')} />
            <label htmlFor="id_dmpfold_job">&nbsp;DMPfold</label>
          </td>
          <td data-toggle="tool-tip" title="Predict protein structural domain boundaries.">
            <input type="checkbox" id="id_dompred_job" name="dompred_job" value="dompred_job" onChange={this.handleChange} checked={this.state.analyses.includes('dompred_job')} />
            <label htmlFor="id_dompred_job">&nbsp;DomPred</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title="Predict protein function, using Gene Ontology annotations">
            <input type="checkbox" id="id_ffpred_job" name="ffpred_job" value="ffpred_job" onChange={this.handleChange} checked={this.state.analyses.includes('ffpred_job')} />
            <label htmlFor="id_ffpred_job">FFPred</label>
          </td>
          <td>
          </td>
          </tr>
        </tbody>
        </table>

        <h5 data-toggle="tool-tip" title="Provide a MODELLER key if you've selected Domserf or Bioserf">Bioserf/Domserf MODELLER KEY</h5>
        <input type="text" id="bioserf_domserf_modeller_key" name="bioserf_domserf_modeller_key" value={this.state.bioDomModellerKey} onChange={this.handleChange} />

      </div>

      <div className="text-right">
      <input value="Resubmit" type="submit" className="btn btn-primary" />
      </div>
      <br />
      </form>
    </div>
    { !this.props.waiting &&
    <div className="overlay processing">
            <i className="fa fa-refresh fa-spin"></i>
    </div>
    }
</div>
  );}
}

export {ResultsMain};
export {ResultsSidebarTimes};
export {ResultsSidebarDownloads};
export {ResultsSidebarResubmission};
