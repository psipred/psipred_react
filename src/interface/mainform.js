import React from 'react';

class SeqForm extends React.Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(event);
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
                  <td data-toggle="tool-tip" title={this.props.job_strings.psipred.tooltip}><input type="checkbox" id="id_psipred_job" name={this.props.job_strings.psipred.jobName} value={this.props.job_strings.psipred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.psipred.jobName)} />&nbsp;<label htmlFor="id_psipred_job" >{this.props.job_strings.psipred.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.disopred.tooltip}><input type="checkbox" id="id_disopred_job" name={this.props.job_strings.disopred.jobName} value={this.props.job_strings.disopred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.disopred.jobName)} />&nbsp;<label htmlFor="id_disopred_job">{this.props.job_strings.disopred.describedName}</label></td>
                </tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.memsatsvm.tooltip}><input type="checkbox" id="id_memsatsvm_job" name={this.props.job_strings.memsatsvm.jobName} value={this.props.job_strings.memsatsvm.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.memsatsvm.jobName)} />&nbsp;<label htmlFor="id_memsatsvm_job">{this.props.job_strings.memsatsvm.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.pgenthreader.tooltip}><input type="checkbox" id="id_pgenthreader_job" name={this.props.job_strings.pgenthreader.jobName} value={this.props.job_strings.pgenthreader.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.pgenthreader.jobName)} />&nbsp;<label htmlFor="id_pgenthreader_job">{this.props.job_strings.pgenthreader.describedName}</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Structure Modelling</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.dmpfold.tooltip}><input type="checkbox" id="id_dmpfold_job" name={this.props.job_strings.dmpfold.jobName} value={this.props.job_strings.dmpfold.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.dmpfold.jobName)} />&nbsp;<label htmlFor="id_dmpfold_job">{this.props.job_strings.dmpfold.describedName}</label></td>
                  <td></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Single Sequence Prediction</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.s4pred.tooltip}><input type="checkbox" id="id_s4pred_job" name={this.props.job_strings.s4pred.jobName} value={this.props.job_strings.s4pred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.s4pred.jobName)} />&nbsp;<label htmlFor="id_s4pred_job">{this.props.job_strings.s4pred.describedName}</label></td>
                  <td></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td colSpan="2"><h4>Contact Analysis</h4></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.dmp.tooltip}><input type="checkbox" id="id_dmp_job" name={this.props.job_strings.dmp.jobName} value={this.props.job_strings.dmp.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.dmp.jobName)} />&nbsp;<label htmlFor="id_dmp_job">{this.props.job_strings.dmp.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.mempack.tooltip}><input type="checkbox" id="id_mempack_job" name={this.props.job_strings.mempack.jobName} value={this.props.job_strings.mempack.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.mempack.jobName)} />&nbsp;<label htmlFor="id_mempack_job">{this.props.job_strings.mempack.describedName}</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Fold Recognition</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.genthreader.tooltip}><input type="checkbox" id="id_genthreader_job" name={this.props.job_strings.genthreader.jobName} value={this.props.job_strings.genthreader.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.genthreader.jobName)} />&nbsp;<label htmlFor="id_genthreader_job">{this.props.job_strings.genthreader.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.pdomthreader.tooltip}><input type="checkbox" id="id_pdomthreader_job" name={this.props.job_strings.pdomthreader.jobName} value={this.props.job_strings.pdomthreader.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.pdomthreader.jobName)} />&nbsp;<label htmlFor="id_pdomthreader_job">{this.props.job_strings.pdomthreader.describedName}</label></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Domain Prediction</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.dompred.tooltip}><input type="checkbox" id="id_dompred_job" name={this.props.job_strings.dompred.jobName} value={this.props.job_strings.dompred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.dompred.jobName)} />&nbsp;<label htmlFor="id_dompred_job">{this.props.job_strings.dompred.describedName}</label></td>
                  <td></td>
                </tr>
                <tr><td className="input_table" colSpan="2"><hr /></td></tr>
                <tr><td><h4>Function Prediction</h4></td><td></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.ffpred.tooltip}><input type="checkbox" id="id_ffpred_job" name={this.props.job_strings.ffpred.jobName} value={this.props.job_strings.ffpred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.ffpred.jobName)} />&nbsp;<label htmlFor="id_ffpred_job">{this.props.job_strings.ffpred.describedName}</label> </td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.dmpmetal.tooltip}><input type="checkbox" id="id_dmpmetal_job" name={this.props.job_strings.dmpmetal.jobName} value={this.props.job_strings.dmpmetal.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.dmpmetal.jobName)} />&nbsp;<label htmlFor="id_dmpmetal_job">{this.props.job_strings.dmpmetal.describedName}</label> </td>
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
            <a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br /> If you wish to test these services follow this link to retrieve <a className="form-link" href="http://www.uniprot.org/uniprot/B0R5N9.fasta">a test fasta sequence</a> or <button onClick={this.props.setTestSeq} type="button" class="fake-link">click here to load a test seq</button>.<br />For DMPmetal, <button onClick={this.props.setDMPMetSeq} type="button" class="fake-link">click here to set a test sequence</button>.
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
            { this.props.suspension_message !== null ?
              <div><h3 className="form_error">{this.props.suspension_message}</h3></div>
            :
              <div className="form-group">
                <input className="btn btn-danger" type="reset" value="Reset" onClick={this.props.handleReset} /> <input className="btn btn-primary" name="submit" type="submit" value="submit" />
              </div>
            }
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
                <tr><td colSpan="2"><h4>Popular Analyses</h4></td></tr>
                <tr>
                  <td colspan="2" data-toggle="tool-tip" title={this.props.job_strings.merizosearch.tooltip}><input type="checkbox" id="id_merizosearch_job" name={this.props.job_strings.merizosearch.jobName} value={this.props.job_strings.merizosearch.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.merizosearch.jobName)} />&nbsp;<label htmlFor="id_merizosearch_job">{this.props.job_strings.merizosearch.describedName}</label></td>
                </tr>
                <tr><td colSpan="2"><h4>Structure Analyses</h4></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.metsite.tooltip}><input type="checkbox" id="id_metsite_job" name={this.props.job_strings.metsite.jobName} value={this.props.job_strings.metsite.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.metsite.jobName)} />&nbsp;<label htmlFor="id_metsite_job">{this.props.job_strings.metsite.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.hspred.tooltip}><input type="checkbox" id="id_hspred_job" name={this.props.job_strings.hspred.jobName} value={this.props.job_strings.hspred.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.hspred.jobName)} />&nbsp;<label htmlFor="id_hspred_job">{this.props.job_strings.hspred.describedName}</label></td>
                </tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.memembed.tooltip}><input type="checkbox" id="id_memembed_job" name={this.props.job_strings.memembed.jobName} value={this.props.job_strings.memembed.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.memembed.jobName)} />&nbsp;<label htmlFor="id_memembed_job">{this.props.job_strings.memembed.describedName}</label></td>
                  <td data-toggle="tool-tip" title={this.props.job_strings.merizo.tooltip}><input type="checkbox" id="id_merizo_job" name={this.props.job_strings.merizo.jobName} value={this.props.job_strings.merizo.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.merizo.jobName)} />&nbsp;<label htmlFor="id_merizo_job">{this.props.job_strings.merizo.describedName}</label></td>
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
            If you wish to try Metsite or HSPred follow this link to retrieve <a className="form-link" href="http://www.rcsb.org/pdb/download/downloadFile.do?fileFormat=pdb&amp;compression=NO&amp;structureId=1IAR">a test pdb file.</a><br /><br />
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
            { this.props.suspension_message !== null ?
              <div><h3 className="form_error">{this.props.suspension_message}</h3></div>
            :
              <div className="form-group"><input className="btn btn-danger" type="reset" value="Reset" onClick={this.props.handleReset}/> <input className="btn btn-primary" type="submit" value="Submit" /></div>    
            }
          </form>
        </div>
      </div>
    </div>
  );
  }
}
//  <td data-toggle="tool-tip" title="Generate TDB file from structure for use with genTHREADER, pGenTHREADER and pDomTHREADER"><input type="checkbox" id="id_gentdb_job" name="gentdb_job" value="gentdb_job" onChange={this.handleChange} checked={this.props.analyses.includes('gentdb_job')} />&nbsp;<label htmlFor="id_gentdb_job">Generate TDB (Custom Generated Threading File)</label></td>
                

class TransForm extends React.Component {
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
                <tr><td colSpan="2"><h4>RNASeq Analyses</h4></td></tr>
                <tr>
                  <td data-toggle="tool-tip" title={this.props.job_strings.gsrcl.tooltip}><input type="checkbox" id="id_gsrcl_job" name={this.props.job_strings.gsrcl.jobName} value={this.props.job_strings.gsrcl.jobName} onChange={this.handleChange} checked={this.props.analyses.includes(this.props.job_strings.gsrcl.jobName)} />&nbsp;<label htmlFor="id_gsrcl_job">{this.props.job_strings.gsrcl.describedName}</label></td>
                  <td></td>
                </tr>
                <tr><td colSpan="2"><a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br /></td>
                </tr>
              </tbody>
              </table>
            </div>
            <div className="col-sm-12 form-header-green">
              <div className="row form-header-row">
                <h5 className="float-header">Submission details</h5>
              </div>
            </div>
            
            <p className="form_error"></p> <br /><br /><br />
            Input data must be submitted in CSV format. Please consult our <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">docutmentation</a> on the required layout for your data.<br /><br />
            <input type="file" id="transFile" name="transFile" defaultValue='' /><br /><br />
            <a className="form-link" href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">Help...</a><br />
            If you wish to try this method follow this link to retrieve <a className="form-link" href="">a test csv file.</a><br /><br />
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
            { this.props.suspension_message !== null ?
              <div><h3 className="form_error">{this.props.suspension_message}</h3></div>
            :
              <div className="form-group"><input className="btn btn-danger" type="reset" value="Reset" onClick={this.props.handleReset}/> <input className="btn btn-primary" type="submit" value="Submit" /></div>    
            }
            
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
          : this.props.formSelectedOption === "StructForm" ?
            <div className="col-md-12 form-header-red">
              <div className="row form-header-row"><h5 className="float-header">Select input data type</h5></div>
            </div>
          : 
          <div className="col-md-12 form-header-green">
              <div className="row form-header-row"><h5 className="float-header">Select input data type</h5></div>
            </div>
          }
          <div className="col-md-12">
            <div className="row form-header-row">
              <div className="funkyradio">
                <div className="funkyradio-primary"><input type="radio" id="radio1" name="radio" value="SeqForm" checked={this.props.formSelectedOption === "SeqForm"} onChange={this.props.handleInputChange} /> <label htmlFor="radio1"><b>Sequence Data&nbsp;&nbsp;</b></label></div>&nbsp;&nbsp;&nbsp;
                <div className="funkyradio-danger"><input type="radio" id="radio2" name="radio" value="StructForm" checked={this.props.formSelectedOption === "StructForm"} onChange={this.props.handleInputChange} /> <label htmlFor="radio2"><b>PDB Structure Data&nbsp;&nbsp;</b></label></div>&nbsp;&nbsp;&nbsp;
                {/* <div className="funkyradio-success"><input type="radio" id="radio3" name="radio" value="TransForm" checked={this.props.formSelectedOption === "TransForm"} onChange={this.props.handleInputChange} /> <label htmlFor="radio3"><b>RNASeq Data&nbsp;&nbsp;</b></label></div> */}
    
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
          : this.props.formSelectedOption === "StructForm" ?
          <div className="col-md-12 form-header-red">
            <div className="row form-header-row">
              <h5 className="float-header">Choose prediction methods (hover for short description)</h5>
            </div>
          </div>
          : 
          <div className="col-md-12 form-header-green">
          <div className="row form-header-row">
            <h5 className="float-header">Choose prediction methods (hover for short description)</h5>
          </div>
        </div>
        }
        </div>
        { this.props.formSelectedOption === "SeqForm" ?
            <SeqForm {...this.props} handleChange={this.props.handleSeqChange} handleReset={this.props.handleReset} handleSubmit={this.props.handleSubmit} setTestSeq={this.props.setTestSeq} />
          : this.props.formSelectedOption === "StructForm" ?
            <StructForm  {...this.props} handleChange={this.props.handleStructChange} handleReset={this.props.handleReset} handleSubmit={this.props.handleSubmit} />
          :
            <TransForm  {...this.props} handleChange={this.props.handleStructChange} handleReset={this.props.handleReset} handleSubmit={this.props.handleSubmit} />
            }

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
          <p>Video tutorials for our most popular and latest methods can be found at the <a href="https://www.youtube.com/@psipreducl">PSIPRED YouTube Channel</a> </p>
          <p>For Help or Errors please email psipred-help@cs.ucl.ac.uk</p>
          <hr id="hr_form"></hr>
        </div>
        <div className="box-header with-border"><h5 className="box-title">Data Input</h5></div>
          <FormInteractivity {...this.props} handleSubmit={this.props.handleSubmit} handleInputChange={this.props.handleInputChange} handleStructChange={this.props.handleStructChange} handleReset={this.props.handleReset} handleSeqChange={this.props.handleSeqChange} setTestSeq={this.props.setTestSeq} />
      </div>
    );
  }
}

export {MainForm};
