import ReactDOM from 'react-dom/client'
import React from 'react';
import {Sidebar} from './sidebar.js'; // eslint-disable-line no-unused-vars
import {MainForm} from './mainform.js'; // eslint-disable-line no-unused-vars
import {ResultsMain} from './results.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarTimes} from './results_sidebar_times.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarDownloads} from './results_sidebar_downloads.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarResubmission} from './results_sidebar_resubmission.js'; // eslint-disable-line no-unused-vars
import {validateFormData} from './checkform.js' // eslint-disable-line no-unused-vars

async function readPDBFile(file) {
    let result_text = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsText(file);
    });
    return result_text;
}


class DisplayArea extends React.Component{
  constructor(props){
    super(props);
    let input_data = "";
    let seq = "";
    let name = "";
    let email = '';

    if(this.props.location === 'Dev'){
      input_data = "ASDASDASDASDASDASDASDASDASDASDASDASDASDASD";
      seq = "ASDASDASDASDASDASDASDASDASDASDASDASDASDASD";
      name = "test";
      email = 'a@b.com'
    }
    this.state = {
      displayType: 'input',
      formSelectedOption: 'SeqForm',
      analyses: ['psipred_job'],
      jobs: [],
      input_data: input_data,
      seq: seq,
      name: name,
      email: email,
      pdbData: '',
      waiting: false,
      bioserf_modeller_key: '',
      domserf_modeller_key: '',
      dompred_e_value_cutoff: '0.01',
      dompred_psiblast_iterations: '5',
      ffpred_selection: 'human',
      metsite_metal_type: 'CA',
      metsite_chain_id: 'A',
      metsite_fpr: '1',
      hspred_protein_1: 'A',
      hspred_protein_2: 'B',
      memembed_algorithm: '0',
      memembed_barrel: 'true',
      memembed_terminal: 'in',
      psipred_results: null,
      results_map: ['png', 'gif', 'jpg', 'horiz', 'ss2', 'pbdat', 'comb', 'memsatdata',
                    'presult', 'gen_presult', 'dom_presult', 'parseds', 'ffpredfeatures',
                    'ffpredpredictions', 'metsite', 'hspred'],
    };
  }

  handleReset = () => {
    this.setState({
      analyses: ['psipred_job'],
      jobs: [],
      input_data: '',
      seq: '',
      name: '',
      email: '',
      waiting: false,
      bioserf_modeller_key: '',
      domserf_modeller_key: '',
      dompred_e_value_cutoff: '0.01',
      dompred_psiblast_iterations: '5',
      ffpred_selection: 'human',
      pdbData: '',
      metsite_metal_type: 'CA',
      metsite_chain_id: 'A',
      metsite_fpr: '1',
      hspred_protein_1: 'A',
      hspred_protein_2: 'B',
      memembed_algorithm: '0',
      memembed_barrel: 'true',
      memembed_terminal: 'in',
      psipred_results: null
      });
  }

  updateResultsFiles = (jobType, resultsData) => {
    if(jobType === 'psipred_job')
    {
      this.setState({psipred_results: resultsData});
    }
  }

  updateWaiting = (newValue) => {
    this.setState({waiting: newValue});
  }
  componentDidUpdate() {
    // currently just doing some reporting while debugging
     console.log(this.state);
  }
  handleInputChange = (event) =>  {
    this.setState({
      formSelectedOption: event.target.value,
    });
    this.handleReset();
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
    }
    if(this.state.analyses.length === 4){
      alert("You have selected every analysis method. We don't allow submissions which select all analyses. Please consider more carefully which predictions you require.");
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
            seq: match[2].toUpperCase(),
          });
        }
        else{
          this.setState({
            seq: value.toUpperCase()
          });
        }
      }
      else {
        this.setState({
          seq: value.toUpperCase()
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
      if(this.state.analyses.length === 12){
        alert("You have selected nearly every analysis. This job may take in excess of 12 hours. Please consider submitting seperate jobs ");
      }
    }
    if(this.state.analyses.length === 13){
      alert("You have selected every analysis method. We don't allow submissions which select all analyses. Please consider more carefully which predictions you require.");
    }
  }

  handleSidebarChange = (event) => {
    var newstate = {};
    // we can set the state by target.name as all our html elements share the
    // same name as the state variables
    newstate[event.target.name] = event.target.value;
    this.setState(newstate);
  }

  //BEFORE RENDER CHECK LOCAL HOST AND SET ENDPOINTS
  //              CHECK URL FOR UUID IF FOUND RENDER RESULTS

  handleSubmit = async (event) => {
    event.preventDefault();
    // Uppercase the seq data
    let jobs = this.state.analyses;
    jobs = jobs.map(elem => elem.replace("_job", ""));

    let pdbFile = null;
    let pdbData = null;
    try{
     pdbFile = document.getElementById("pdbFile").files[0];
     if(pdbFile){
       pdbData = await readPDBFile(pdbFile);
     }
    }
      catch(err) {
        pdbData = "";
        if(err.message.includes("FileReader.readAsText is not an object")){
          alert("File selected not valid");
        }
    }
    let checked = validateFormData(this.state, jobs, pdbData);
    if(checked.send){
      //SENDING THINGS NOW!!!, set up callback to update state.
      this.setState({
        jobs: checked.jobs,
        pdbData: checked.pdbData,
        displayType: 'results'
      });
    }
    else{
      alert(checked.message);
    }
    //1. Check and sanitise form data
    //2. set displaytType and re-render
  }

  render () {
    return(
      <div className="row">
      { this.state.displayType === "input" ?
        <div>
          <div className="col-md-9"><MainForm  {...this.state} handleInputChange={this.handleInputChange} handleSubmit={this.handleSubmit} handleStructChange={this.handleStructChange} handleReset={this.handleReset} handleSeqChange={this.handleSeqChange} /></div>
          <div className="col-md-3"><Sidebar {...this.state} handleSidebarChange={this.handleSidebarChange} /></div>
        </div>
      :
        <div>
          <div className="col-md-9">
            <ResultsMain {...{...this.state, ...this.props}} updateWaiting={this.updateWaiting} updateResultsFiles={this.updateResultsFiles}/>
          </div>
          <div className="col-md-3">
            <ResultsSidebarTimes {...{...this.state, ...this.props}} />
            <ResultsSidebarDownloads {...{...this.state, ...this.props}} />
            <ResultsSidebarResubmission {...{...this.state, ...this.props}} />
          </div>
          {
          // 1. draw results 2 Main areas
           //        DIAGRAM AND TABLES
           //2. Draw Time/waiting panelresults panel
           //3. send async request for times
           //3. extra panels
           //       results sidebar
           //     resubmission widget
           //4. send async request form data
          }
        </div>
      }
      </div>
    );
  }
}

class PsipredSite extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      endpoints_url: null,
      submit_url: null,
      times_url: null,
      joblist_url: null,
      files_url: null,
      gears_svg: "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg",
      main_url: "http://bioinf.cs.ucl.ac.uk",
      app_path: "/psipred_beta",
      location: "Dev",
      gear_string: '<object width="140" height="140" type="image/svg+xml" data=""></object>',
    };
  }

  componentDidMount() {
    console.log(window.location.hostname);
    console.log(window.location.href);

    //defaults for dev server
    var joblist_url = 'http://127.0.0.1:8000/analytics_automated/job/';
    var endpoints_url = 'http://127.0.0.1:8000/analytics_automated/endpoints/';
    var submit_url = 'http://127.0.0.1:8000/analytics_automated/submission/';
    var times_url = 'http://127.0.0.1:8000/analytics_automated/jobtimes/';
    var app_path = '/interface';
    var main_url = 'http://127.0.0.1:3000';
    var gears_svg = "../static/images/gears.svg";
    var files_url = 'http://127.0.0.1:8000';
    var location = "Dev";

    //updates for production paths
    if(window.location.href === "http://bioinf.cs.ucl.ac.uk/psipred/" || (window.location.href.includes('psipred') && !  window.location.href.includes('psipred_beta')) )
    {
      app_path = '/psipred';
      joblist_url = this.state.main_url+app_path+'/api/job/';
      endpoints_url = this.state.main_url+app_path+'/api/endpoints/';
      submit_url = this.state.main_url+app_path+'/api/submission/';
      times_url = this.state.main_url+app_path+'/api/jobtimes/';
      files_url = this.state.main_url+app_path+"/api";
      gears_svg = "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg";
      location = "Production";
    }
    else if(window.location.hostname === "bioinfstage1.cs.ucl.ac.uk" || window.location.href  === "http://bioinf.cs.ucl.ac.uk/psipred_beta/" || window.location.href.includes('psipred_beta'))
    { //update for staging paths
      joblist_url = this.state.main_url+this.state.app_path+'/api/job/';
      endpoints_url = this.state.main_url+this.state.app_path+'/api/endpoints/';
      submit_url = this.state.main_url+this.state.app_path+'/api/submission/';
      times_url = this.state.main_url+this.state.app_path+'/api/jobtimes/';
      files_url = this.state.main_url+this.state.app_path+"/api";
      location = 'Staging';
      //gears_svg = "../static/images/gears.svg";
    } else if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"){
      console.log("dev server using default URIs");
    } else {
      alert('UNSETTING ENDPOINTS WARNING, WARNING! WEBSITE NON FUNCTIONAL');
      joblist_url = '';
      endpoints_url = '';
      submit_url = '';
      times_url = '';
    }
    this.setState({
      endpoints_url: endpoints_url,
      submit_url: submit_url,
      times_url: times_url,
      joblist_url: joblist_url,
      gears_svg: gears_svg,
      app_path: app_path,
      files_url: files_url,
      location: location,
      main_url: main_url,
    });
  }

  render(){
    return(
      <section className="content">
        <div id="psipred_site">
          { this.state.location === "Dev" &&
              <div><h3 className="form_error">WARNING: This is Dev</h3></div>
          }
          { this.state.location === "Staging" &&
              <div><h3 className="form_error">WARNING: This is Staging</h3></div>
          }
          <DisplayArea {...this.state}/>
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
