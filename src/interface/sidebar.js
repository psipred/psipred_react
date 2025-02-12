import React from 'react';

class Sidebar extends React.Component{
  render () {
    return(
      <div className="box box-primary" id="main_form">
        <div className="box-header with-border">
          <h5 className="box-title">Additional Settings</h5>
        </div>
        <div className="box-body">
          <div className="col-md-12">

          { this.props.analyses.includes(this.props.job_strings.dompred.jobName) &&
            <DompredOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.ffpred.jobName) &&
            <FfpredOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.metsite.jobName) &&
            <MetsiteOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.hspred.jobName) &&
            <HspredOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.memembed.jobName) &&
            <MemembedOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.merizo.jobName) &&
            <MerizoOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.merizosearch.jobName) &&
            <MerizoSearchOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          { this.props.analyses.includes(this.props.job_strings.gsrcl.jobName) &&
            <GsRCLOptions {...this.props} handleSidebarChange={this.props.handleSidebarChange} />
          }
          
          </div>
        </div>
      </div>
    );
  }
}

class MetsiteOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.metsite.fullName}</h4>
          <strong>Select Metal:</strong><br />
            <select id="metsite_metal_type" size="6" name="metsite_metal_type" value={this.props.metsite_metal_type} onChange={this.props.handleSidebarChange} >
              <option value="CA" >Calcium</option>
              <option value="ZN">Zinc</option>
              <option value="MG">Magnesium</option>
              <option value="FE">Iron</option>
              <option value="CU">Copper</option>
              <option value="MN">Manganese</option>
            </select><br /><br />
          <strong>Chain ID:</strong>
            <input type="text" id="metsite_chain_id" name="metsite_chain_id" value={this.props.metsite_chain_id} onChange={this.props.handleSidebarChange} /><br /><br />
          <strong>False Positive Rate:</strong><br />
            <select id="metsite_fpr" size="1" name="metsite_fpr" value={this.props.metsite_fpr} onChange={this.props.handleSidebarChange} >
              <option value="0">1%</option>
              <option value="1">5%</option>
              <option value="2">10%</option>
              <option value="3">20%</option>
            </select>
        </div>
    );
  }
}
class HspredOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.hspred.fullName}</h4>
        <strong>Protein 1:</strong><input type="text" id="hspred_protein_1" name="hspred_protein_1" value={this.props.hspred_protein_1} onChange={this.props.handleSidebarChange} /><br /><br />
        <strong>Protein 2:</strong> <input type="text" id="hspred_protein_2" name="hspred_protein_2" value={this.props.hspred_protein_2} onChange={this.props.handleSidebarChange} />
      </div>
    );
  }
}
class MemembedOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.memembed.fullName}</h4>
        <strong>Search Type:</strong>
          <select id="memembed_algorithm" size="1" name="memembed_algorithm" value={this.props.memembed_algorithm} onChange={this.props.handleSidebarChange} >
            <option value="0">Genetic Algorithm</option>
            <option value="1">Grid Search</option>
            <option value="2">Direct</option>
            <option value="3">GA x 5</option>
          </select><br /><br />
        <strong>Target is Beta Barrel:</strong><br />
          <input type="radio" id="memembed_barrel_yes" name="memembed_barrel" value="TRUE" checked={this.props.memembed_barrel === "TRUE"} onChange={this.props.handleSidebarChange} /> <label htmlFor="memembed_barrel_yes">Yes</label><br />
          <input type="radio" id="memembed_barrel_no" name="memembed_barrel" value="FALSE" checked={this.props.memembed_barrel === "FALSE"} onChange={this.props.handleSidebarChange} /> <label htmlFor="memembed_barrel_no">No</label><br /><br />
        <strong>N-Terminal Location:</strong><br />
          <input type="radio" id="memembed_terminal_in" name="memembed_terminal" value="in" checked={this.props.memembed_terminal === "in"} onChange={this.props.handleSidebarChange} /> <label htmlFor="memembed_terminal_in">Cytoplasmic</label><br />
          <input type="radio" id="memembed_terminal_out" name="memembed_terminal" value="out" checked={this.props.memembed_terminal === "out"} onChange={this.props.handleSidebarChange} /> <label htmlFor="memembed_terminal_out">Extra Cellular</label><br /><br />
      </div>
    );
  }
}

class DompredOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.dompred.fullName}</h4>
        <strong>PSI-BLAST e-value cutoff:</strong><input type="text" id="dompred_e_value_cutoff" name="dompred_e_value_cutoff" value={this.props.dompred_e_value_cutoff} onChange={this.props.handleSidebarChange} /><br /><br />
        <strong>PSI-BLAST Iterations:</strong> <input type="text" id="dompred_psiblast_iterations" name="dompred_psiblast_iterations" value={this.props.dompred_psiblast_iterations} onChange={this.props.handleSidebarChange} />
      </div>
    );
  }
}
class FfpredOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.ffpred.fullName}</h4>
        <input type="radio" id="ffpred_human" name="ffpred_selection" value="human" checked={this.props.ffpred_selection === 'human'} onChange={this.props.handleSidebarChange} /> <label htmlFor="ffpred_human">Human Prediction</label><br />
        <input type="radio" id="ffpred_fly" name="ffpred_selection" value="fly" checked={this.props.ffpred_selection === 'fly'} onChange={this.props.handleSidebarChange} /> <label htmlFor="ffpred_fly">Fly Prediction</label>
      </div>
    );
  }
}
class MerizoOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.merizo.fullName}</h4>
        <strong>Chain:</strong><input type="text" id="merizo_chain" name="merizo_chain" value={this.props.merizo_chain} onChange={this.props.handleSidebarChange} /><br /><br />
        <strong>Segmentation Mode:</strong><br />
          <input type="radio" id="merizo_mode_default" name="merizo_iterate" value="FALSE" checked={this.props.merizo_iterate === 'FALSE'} onChange={this.props.handleSidebarChange} /> <label htmlFor="merizo_mode">Default (short chain)</label><br />
          <input type="radio" id="merizo_mode_iterative" name="merizo_iterate" value="TRUE" checked={this.props.merizo_iterate === 'TRUE'} onChange={this.props.handleSidebarChange} /> <label htmlFor="merizo_mode">Iterative (long chain)</label><br />
      </div>
    );
  }
}

class MerizoSearchOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.merizosearch.fullName}</h4>
        <strong>Chain:</strong><input type="text" id="merizosearch_chain" name="merizosearch_chain" value={this.props.merizosearch_chain} onChange={this.props.handleSidebarChange} /><br /><br />
        <strong>Search Database:</strong><br />
          <input type="radio" id="merizosearch_db_ted" name="merizosearch_db" value="ted" checked={this.props.merizosearch_db === 'ted'} onChange={this.props.handleSidebarChange} /> <label htmlFor="merizosearch_db">&nbsp;TED (slow)</label><br />
          <input type="radio" id="merizosearch_db_cath" name="merizosearch_db" value="cath" checked={this.props.merizosearch_db === 'cath'} onChange={this.props.handleSidebarChange} /><label htmlFor="merizosearch_db">&nbsp;CATH 4.3 (fast)</label><br />
        </div>
    );
  }
}


class GsRCLOptions extends React.Component {
  render () {
    return(
      <div className="row form-header-row">
        <h4>{this.props.job_strings.gsrcl.fullName}</h4>
        <strong>Tissue Dataset:</strong>
          <select id="gsrcl_tissue" size="1" name="gsrcl_tissue" value={this.props.gsrcl_tissue} onChange={this.props.handleSidebarChange} >
            <option value="Quake_Smart-seq2_Limb_Muscle">Mouse Limb Muscle</option>
          </select>
      </div>
    );
  }
}

export {Sidebar};
