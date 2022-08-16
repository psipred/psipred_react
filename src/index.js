import ReactDOM from 'react-dom/client'
import React from 'react';
import {Sidebar} from './sidebar.js'; // eslint-disable-line no-unused-vars
import {MainForm} from './mainform.js'; // eslint-disable-line no-unused-vars

class DisplayArea extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      displayType: 'input',
      formSelectedOption: 'SeqForm',
      analyses: ['psipred_job'],
      input_data: '',
      seq: '',
      name: '',
      email: '',
      file: null,
      bioserf_modeller_key: '',
      domserf_modeller_key: '',
      dompred_e_value_cutoff: 0.01,
      dompred_psiblast_iterations: 5,
      ffpred_selection: 'human',
      metsite_metal_type: 'CA',
      metsite_chain_id: 'A',
      metsite_fpr: 1,
      hspred_protein_1: 'A',
      hspred_protein_2: 'B',
      memembed_algorithm: 0,
      memembed_barrel: 'true',
      memembed_terminal: 'in',
    };
  }

  handleReset = () => {
    this.setState({
      analyses: ['psipred_job'],
      input_data: '',
      seq: '',
      name: '',
      email: '',
      bioserf_modeller_key: '',
      domserf_modeller_key: '',
      dompred_e_value_cutoff: 0.01,
      dompred_psiblast_iterations: 5,
      ffpred_selection: 'human',
      metsite_metal_type: 'CA',
      metsite_chain_id: 'A',
      metsite_fpr: 1,
      hspred_protein_1: 'A',
      hspred_protein_2: 'B',
      memembed_algorithm: 0,
      memembed_barrel: 'true',
      memembed_terminal: 'in',
      });
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
     console.log(this.state);
  }
  handleInputChange = (event) =>  {
    this.setState({
      formSelectedOption: event.target.value,
    });
    if(event.target.value === 'SeqForm'){
      this.handleResetSeq();
    }
    else {
      this.handleResetStruct();
    }
  }
  handleStructChange = (event) =>  {
    var value = event.target.value;
    if(event.target.name === 'job_name') {
      this.setState({
        name: value
      });
    } else if(event.target.name === 'email') {
      this.setState({
        email: value
      });
    } else {
      const change = this.state.analyses;
      const index = this.state.analyses.indexOf(event.target.value);
      if(index > -1)
      {
        change.splice(index, 1);
      } else {
        change.push(event.target.value);
      }
      this.setState({
        analyses: change
      });
      if(this.state.analyses.length === 13){
        alert("You have selected every analysis. This job may take in excess of 12 hours. Please consider submitting seperate jobs ");
      }
    }
  }

  handleSeqChange = (event) =>  {
    var value = event.target.value;
    if(event.target.name === 'input_data'){
      //Handle FASTA HERE!
      this.setState({
        input_data: value
      });
      var header_count = (value.match(/>/g) || []).length;
      // Here we handle fasta input and grab the name/header for the jobname if possible
      if(header_count === 1) {
        var fasta_regex = /^>(.+)\n(.+)/;
        var match = fasta_regex.exec(value);
        if(match){
          this.setState({
            name: match[1],
            seq: match[2]
          });
        }
        else{
          this.setState({
            seq: value
          });
        }
      }
      else {
        this.setState({
          seq: value
        });
      }
    } else if(event.target.name === 'job_name') {
      this.setState({
        name: value
      });
    } else if(event.target.name === 'email') {
      this.setState({
        email: value
      });
    } else {
      const change = this.state.analyses;
      const index = this.state.analyses.indexOf(event.target.value);
      if(index > -1)
      {
        change.splice(index, 1);
      } else {
        change.push(event.target.value);
      }
      this.setState({
        analyses: change
      });
      if(this.state.analyses.length === 13){
        alert("You have selected every analysis. This job may take in excess of 12 hours. Please consider submitting seperate jobs ");
      }
    }
  }

  handleSidebarChange = (event) => {
    var newstate = {};
    // we can set the state by target.name as all our html elements share the
    // same name as the state variables
    newstate[event.target.name] = event.target.value;
    this.setState(newstate);
  }

  render () {
    return(
      <div className="row">
      { this.state.displayType === "input" ?
        <div>
          <div className="col-md-9"><MainForm  {...this.state} handleInputChange={this.handleInputChange} handleStructChange={this.handleStructChange} handleReset={this.handleReset} handleSeqChange={this.handleSeqChange} /></div>
          <div className="col-md-3"><Sidebar {...this.state} handleSidebarChange={this.handleSidebarChange} /></div>
        </div>
      :
        <div>
          <h2>RESULTS</h2>
          {// results panel
          // extra panels
          // results sidebar
          // resubmission widget
          }
        </div>
      }
      </div>
    );
  }
}

class PsipredSite extends React.Component{
  render(){
    return(
      <section className="content">
        <div id="psipred_site">
        <DisplayArea />
          <div className="row">
            <div className="col-md-9"></div><div className="col-md-3"></div>
          </div>
        <div className="helixy">
          <img alt="It's Helixy y'all!" src="http://bioinf.cs.ucl.ac.uk/psipred_new/static/images/helixy_png_blank.png" />
        </div>
        </div>
      </section>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PsipredSite />);
