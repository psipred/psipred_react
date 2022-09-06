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

  handleResubmit = () => {
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
    { this.props.waiting &&
    <div className="overlay processing">
            <i className="fa fa-refresh fa-spin"></i>
    </div>
    }
</div>
  );}
}

export {ResultsSidebarResubmission};
