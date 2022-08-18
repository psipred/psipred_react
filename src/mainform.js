import React from 'react';

class SeqForm extends React.Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(event);
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

  render () {
    return(
      <div className="form-group">
        <div className="col-md-12">
          <div className="row form-header-row"><br />
          <form className="form" id="main_form" method="Post" intro="slide" outro="slide" name="main_form" onSubmit={this.handleSubmit} >
            <input type="hidden" name="csrfmiddlewaretoken" value="6TwolraqeOHCMgVbxvCgNJ3EQsHdqo9Rbp5GNIZkxWUFhlYjWMfLikgu0x7SxLDa" />
            <div className="form-group">
              <table className="full-width-table">
                <tbody>
                <tr><td colSpan="2"><h4>Popular Analyses</h4></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Predict helices, beta sheets and coils from AA sequence"><input type="checkbox" id="id_psipred_job" name="psipred_job" value="psipred_job" onChange={this.handleChange} checked={this.props.analyses.includes('psipred_job')} />&nbsp;<label htmlFor="id_psipred_job" >PSIPRED 4.0 (Predict Secondary Structure)</label></td>
                  <td data-toggle="tool-tip" title="Detect intrinsically disordered regions in proteins"><input type="checkbox" id="id_disopred_job" name="disopred_job" value="disopred_job" onChange={this.handleChange} checked={this.props.analyses.includes('disopred_job')} />&nbsp;<label htmlFor="id_disopred_job">DISOPRED3 (Disopred Prediction)</label></td>
                </tr>
                <tr>
                  <td data-toggle="tool-tip" title="Calculate length, location and topology of transmembrane helices"><input type="checkbox" id="id_memsatsvm_job" name="memsatsvm_job" value="memsatsvm_job" onChange={this.handleChange} checked={this.props.analyses.includes('memsatsvm_job')} />&nbsp;<label htmlFor="id_memsatsvm_job">MEMSAT-SVM (Membrane Helix Prediction)</label></td>
                  <td data-toggle="tool-tip" title="Protein fold recognition with protein templates of known structure."><input type="checkbox" id="id_pgenthreader_job" name="pgenthreader_job" value="pgenthreader_job" onChange={this.handleChange} checked={this.props.analyses.includes('pgenthreader_job')} />&nbsp;<label htmlFor="id_pgenthreader_job">pGenTHREADER (Profile Based Fold Recognition)</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td colSpan="2"><h4>Contact Analysis</h4></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Predict interresidue contacts using a convolutional neural network"><input type="checkbox" id="id_dmp_job" name="dmp_job" value="dmp_job" onChange={this.handleChange} checked={this.props.analyses.includes('dmp_job')} />&nbsp;<label htmlFor="id_dmp_job">DeepMetaPSICOV 1.0 (Structural Contact Prediction)</label></td>
                  <td data-toggle="tool-tip" title="Predict packing membrane helices"><input type="checkbox" id="id_mempack_job" name="mempack_job" value="mempack_job" onChange={this.handleChange} checked={this.props.analyses.includes('mempack_job')} />&nbsp;<label htmlFor="id_mempack_job">MEMPACK (TM Topology and Helix Packing)</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Fold Recognition</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Fast fold recognition method using template structures"><input type="checkbox" id="id_genthreader_job" name="genthreader_job" value="genthreader_job" onChange={this.handleChange} checked={this.props.analyses.includes('genthreader_job')} />&nbsp;<label htmlFor="id_genthreader_job">GenTHREADER (Rapid Fold Recognition)</label></td>
                  <td data-toggle="tool-tip" title="Fast protein domain fold recognition using domain templates"><input type="checkbox" id="id_pdomthreader_job" name="pdomthreader_job" value="pdomthreader_job" onChange={this.handleChange} checked={this.props.analyses.includes('pdomthreader_job')} />&nbsp;<label htmlFor="id_pdomthreader_job">pDomTHREADER (Protein Domain Fold Recognition)</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Structure Modelling</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Fully automated homology modelling"><input type="checkbox" onClick={this.bioserfAlert} id="id_bioserf_job" name="bioserf_job" value="bioserf_job" onChange={this.handleChange} checked={this.props.analyses.includes('bioserf_job')} />&nbsp;<label htmlFor="id_bioserf_job">Bioserf 2.0 (Automated Homology Modelling)</label></td>
                  <td data-toggle="tool-tip" title="Fully automated structural domain homology modelling"><input type="checkbox" onClick={this.domserfAlert} id="id_domserf_job" name="domserf_job" value="domserf_job" onChange={this.handleChange} checked={this.props.analyses.includes('domserf_job')} />&nbsp;<label htmlFor="id_domserf_job">Domserf 2.1 (Automated Domain Homology Modelling)</label></td>
                </tr>
                <tr>
                  <td data-toggle="tool-tip" title="Accurate structure prediction using residue-residue contacts."><input type="checkbox" onClick={this.dmpfoldAlert} id="id_dmpfold_job" name="dmpfold_job" value="dmpfold_job" onChange={this.handleChange} checked={this.props.analyses.includes('dmpfold_job')} />&nbsp;<label htmlFor="id_dmpfold_job">DMPfold 1.0 Fast Mode (Protein Structure Prediction)</label></td>
                  <td></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Domain Prediction</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Predict protein structural domain boundaries."><input type="checkbox" id="id_dompred_job" name="dompred_job" value="dompred_job" onChange={this.handleChange} checked={this.props.analyses.includes('dompred_job')} />&nbsp;<label htmlFor="id_dompred_job">DomPred (Protein Domain Prediction)</label></td>
                  <td></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Function Prediction</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title="Predict protein function, using Gene Ontology annotations"><input type="checkbox" id="id_ffpred_job" name="ffpred_job" value="ffpred_job" onChange={this.handleChange} checked={this.props.analyses.includes('ffpred_job')} />&nbsp;<label htmlFor="id_ffpred_job">FFPred 3 (Eurkaryotic Function Prediction)</label> </td>
                  <td></td>
                </tr>
                <tr><td colSpan="2"><a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br /></td></tr>
                </tbody>
              </table>
            </div>

            <div className="col-sm-12 form-header-blue">
              <div className="row form-header-row">
                <h5 className="float-header">Submission details</h5>
              </div>
            </div>
            <br /><br /><p className="form_error"></p>
            <div className="form-group">
              <div className="form-group">
                <label className="control-label" htmlFor="id_input_data">Protein Sequence</label><textarea className="form-control" cols="40" rows="3" placeholder="Protein Sequence" title="" required="" id="id_input_data" name="input_data" value={this.props.input_data} onChange={this.handleChange}></textarea>
              </div>
            </div>
            <a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br /> If you wish to test these services follow this link to retrieve <a className="form-link" href="http://www.uniprot.org/uniprot/B0R5N9.fasta">a test fasta sequence</a>.
            <br /><br />
            <div className="form-group">
              <div className="form-group">
                <label className="control-label" htmlFor="id_job_name">Job name</label><input className="form-control" type="text" placeholder="Job name" title="" required="" id="id_job_name" name="job_name" value={this.props.name} onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <div className="form-group">
                <label className="control-label" htmlFor="id_email">Email (optional)</label><input className="form-control" type="email" placeholder="Email (optional)" title="" id="id_email" name="email" value={this.props.email} onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <input className="btn btn-danger" type="reset" value="Reset" onClick={this.props.handleReset} /> <input className="btn btn-primary" name="submit" type="submit" value="submit" />
            </div>
          </form>
          </div>
        </div>
      </div>);
  }
}

class StructForm extends React.Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(event);
  }

  render () {
    return (
    <div className="form-group">
      <div className="col-md-12">
        <div className="row form-header-row"><br />
          <form className="form" id="main_form" method="Post" intro="slide" outro="slide" name="main_form" onSubmit={this.handleSubmit} >
            <input type="hidden" name="csrfmiddlewaretoken" value="6TwolraqeOHCMgVbxvCgNJ3EQsHdqo9Rbp5GNIZkxWUFhlYjWMfLikgu0x7SxLDa" />
            <div className="form-group">
              <table className="full-width-table">
              <tbody>
                <tr>
                  <td data-toggle="tool-tip" title="Detects metal-binding residues from protein structure"><input type="checkbox" id="id_metsite_job" name="metsite_job" value="metsite_job" onChange={this.handleChange} checked={this.props.analyses.includes('metsite_job')} />&nbsp;<label htmlFor="id_metsite_job">Metsite (Protein-metal Ion Contact Prediction)</label></td>
                  <td data-toggle="tool-tip" title="Predicts protein-protein interaction hotspot residues"><input type="checkbox" id="id_hspred_job" name="hspred_job" value="hspred_job" onChange={this.handleChange} checked={this.props.analyses.includes('hspred_job')} />&nbsp;<label htmlFor="id_hspred_job">HSPred (Protein-Protein Hotspot Residue Prediction)</label></td>
                </tr>
                <tr>
                  <td data-toggle="tool-tip" title="Orientate membrane proteins within the lipid bilayer"><input type="checkbox" id="id_memembed_job" name="memembed_job" value="memembed_job" onChange={this.handleChange} checked={this.props.analyses.includes('memembed_job')} />&nbsp;<label htmlFor="id_memembed_job">MEMEMBED (Membrane Protein Orientation Prediction)</label></td>
                  <td data-toggle="tool-tip" title="Generate TDB file from structure for use with genTHREADER, pGenTHREADER and pDomTHREADER"><input type="checkbox" id="id_gentdb_job" name="gentdb_job" value="gentdb_job" onChange={this.handleChange} checked={this.props.analyses.includes('gentdb_job')} />&nbsp;<label htmlFor="id_gentdb_job">Generate TDB (Custom Generated Threading File)</label></td>
                </tr>
                <tr><td colSpan="2"><a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br /></td>
                </tr>
              </tbody>
              </table>
            </div>
            <div className="col-sm-12 form-header-red">
              <div className="row form-header-row">
                <h5 className="float-header">Submission details</h5>
              </div>
            </div>
            <p className="form_error"></p> <br /><br /><br /> Select PDB file<br /> <input type="file" id="pdbFile" name="pdbFile" defaultValue='' /><br /><br />
            <a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br />
            If you wish to Metsite or HSPred follow this link to retrieve <a className="form-link" href="http://www.rcsb.org/pdb/download/downloadFile.do?fileFormat=pdb&amp;compression=NO&amp;structureId=1IAR">a test pdb file.</a><br /><br />
            <div className="form-group">
              <div className="form-group">
                <label className="control-label" htmlFor="id_job_name">Job name</label><input className="form-control" type="text" placeholder="Job name" title="" required="" id="id_job_name" name="job_name" value={this.props.name} onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <div className="form-group">
                <label className="control-label" htmlFor="id_email">Email (optional)</label><input className="form-control" type="email" placeholder="Email (optional)" title="" id="id_email" name="email" value={this.props.email} onChange={this.handleChange}  />
              </div>
            </div>
            <div className="form-group"><input className="btn btn-danger" type="reset" value="Reset" onClick={this.props.handleReset}/> <input className="btn btn-primary" type="submit" value="Submit" /></div>
          </form>
        </div>
      </div>
    </div>
  );
  }
}


class FormInteractivity extends React.Component{
  render(props) {
    return(
      <div className="box-body">
        <div className="form-group">

          { this.props.formSelectedOption === "SeqForm" ?
            <div className="col-md-12 form-header-blue">
              <div className="row form-header-row"><h5 className="float-header">Select input data type</h5></div>
            </div>
          :
            <div className="col-md-12 form-header-red">
              <div className="row form-header-row"><h5 className="float-header">Select input data type</h5></div>
            </div>
          }
          <div className="col-md-12">
            <div className="row form-header-row">
              <div className="funkyradio">
                <div className="funkyradio-primary"><input type="radio" id="radio1" name="radio" value="SeqForm" checked={this.props.formSelectedOption === "SeqForm"} onChange={this.props.handleInputChange} /> <label htmlFor="radio1"><b>Sequence Data&nbsp;&nbsp;</b></label></div>&nbsp;&nbsp;&nbsp;
                <div className="funkyradio-danger"><input type="radio" id="radio2" name="radio" value="StructForm" checked={this.props.formSelectedOption === "StructForm"} onChange={this.props.handleInputChange} /> <label htmlFor="radio2"><b>PDB Structure Data&nbsp;&nbsp;</b></label></div>
              </div><br />
            </div>
          </div>

        </div>
        <div className="form-group">
        { this.props.formSelectedOption === "SeqForm" ?
          <div className="col-md-12 form-header-blue">
            <div className="row form-header-row">
              <h5 className="float-header">Choose prediction methods (hover for short description)</h5>
            </div>
          </div>
          :
          <div className="col-md-12 form-header-red">
            <div className="row form-header-row">
              <h5 className="float-header">Choose prediction methods (hover for short description)</h5>
            </div>
          </div>
        }
        </div>
        { this.props.formSelectedOption === "SeqForm" ? <SeqForm {...this.props} handleChange={this.props.handleSeqChange} handleReset={this.props.handleReset} handleSubmit={this.props.handleSubmit} /> : <StructForm  {...this.props} handleChange={this.props.handleStructChange} handleReset={this.props.handleReset} handleSubmit={this.props.handleSubmit} />}

      </div>
      );
  }
}

class MainForm extends React.Component{
  render () {
    return(
      <div id="main_form" className="box box-primary">
        <div className="box-header with-border">
          <p>The PSIPRED Workbench provides a range of protein structure prediction methods. The site can be used interactively via a web browser or programmatically via our REST API. For high-throughput analyses, downloads of all the algorithms are available.</p>
          <p><b>Amino acid</b> sequences enable: secondary structure prediction, including regions of disorder and transmembrane helix packing; contact analysis; fold recognition; structure modelling; and prediction of domains and function. In addition <b>PDB Structure files</b> allow prediction of protein-metal ion contacts, protein-protein hotspot residues, and membrane protein orientation.</p>
          <hr id="hr_form"></hr>
        </div>
        <div className="box-header with-border"><h5 className="box-title">Data Input</h5></div>
          <FormInteractivity {...this.props} handleSubmit={this.props.handleSubmit} handleInputChange={this.props.handleInputChange} handleStructChange={this.props.handleStructChange} handleReset={this.props.handleReset} handleSeqChange={this.props.handleSeqChange} />
      </div>
    );
  }
}

export {MainForm};
