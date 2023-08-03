import React from 'react';

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

  handleResubmit = (event) => {
    event.preventDefault();
    let subseq = this.props.seq.slice(this.state.seqStart-1, this.state.seqStop);
    console.log('PREPPING RESUBMIT');
    let name = this.props.name;
    let email = this.props.email;
    this.props.handleResubmit(this.state.analyses, subseq, name, email, event);
    //if seqStart or seqStop are blank set to limits
    //Here we do the things for the resubmission
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
    //console.log(this.state);
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
          <td data-toggle="tool-tip" title={this.props.job_strings.psipred.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.psipred.jobName} value={this.props.job_strings.psipred.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.psipred.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.psipred.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.disopred.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.disopred.jobName} value={this.props.job_strings.disopred.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.disopred.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.disopred.shortName}</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title={this.props.job_strings.memsatsvm.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.memsatsvm.jobName} value={this.props.job_strings.memsatsvm.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.memsatsvm.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.memsatsvm.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.pgenthreader.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.pgenthreader.jobName} value={this.props.job_strings.pgenthreader.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.pgenthreader.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.pgenthreader.shortName}</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title={this.props.job_strings.dmp.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.dmp.jobName} value={this.props.job_strings.dmp.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.dmp.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.dmp.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.mempack.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.mempack.jobName} value={this.props.job_strings.mempack.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.mempack.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.mempack.shortName}</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title={this.props.job_strings.genthreader.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.genthreader.jobName} value={this.props.job_strings.genthreader.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.genthreader.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.genthreader.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.pdomthreader.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.pdomthreader.jobName} value={this.props.job_strings.pdomthreader.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.pdomthreader.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.pdomthreader.shortName}</label>
          </td>
          </tr>
          
          <tr>
          <td data-toggle="tool-tip" title={this.props.job_strings.dmpfold.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.dmpfold.jobName} value={this.props.job_strings.dmpfold.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.dmpfold.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.dmpfold.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.dompred.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.dompred.jobName} value={this.props.job_strings.dompred.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.dompred.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.dompred.shortName}</label>
          </td>
          </tr>

          <tr>
          <td data-toggle="tool-tip" title={this.props.job_strings.s4pred.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.s4pred.jobName} value={this.props.job_strings.s4pred.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.s4pred.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.s4pred.shortName}</label>
          </td>
          <td data-toggle="tool-tip" title={this.props.job_strings.ffpred.tooltip}>
            <input type="checkbox" id="id_psipred_job" name={this.props.job_strings.ffpred.jobName} value={this.props.job_strings.ffpred.jobName} onChange={this.handleChange} checked={this.state.analyses.includes(this.props.job_strings.ffpred.jobName)}/>
            <label htmlFor="id_psipred_job">&nbsp;{this.props.job_strings.ffpred.shortName}</label>
          </td>
          </tr>
        </tbody>
        </table>
      </div>

      <div className="text-right">
      <input value="Resubmit" type="submit" className="btn btn-primary" />
      </div>
      <br />
      </form>
    </div>
    { this.props.waiting &&
    <div className="overlay processing">
            <i className="fa fa-refresh fa-spin"></i>
    </div>
    }
</div>
  );}
}

export {ResultsSidebarResubmission};

//<h5 data-toggle="tool-tip" title="Provide a MODELLER key if you've selected Domserf or Bioserf">Bioserf/Domserf MODELLER KEY</h5>
//<input type="text" id="bioserf_domserf_modeller_key" name="bioserf_domserf_modeller_key" value={this.state.bioDomModellerKey} onChange={this.handleChange} />
