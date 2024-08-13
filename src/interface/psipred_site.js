//import ReactDOM from 'react-dom/client'
import React from 'react';
import {Sidebar} from './sidebar.js'; // eslint-disable-line no-unused-vars
import {MainForm} from './mainform.js'; // eslint-disable-line no-unused-vars
import {ResultsMain} from './results.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarTimes} from './results_sidebar_times.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarDownloads} from './results_sidebar_downloads.js'; // eslint-disable-line no-unused-vars
import {ResultsSidebarResubmission} from './results_sidebar_resubmission.js'; // eslint-disable-line no-unused-vars
import {validateFormData} from './checkform.js' // eslint-disable-line no-unused-vars
import {decide_location} from '../shared/index.js' // eslint-disable-line no-unused-vars

//import { saveAs } from 'file-saver';

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
    let input_data = '';
    let seq = '';
    let pdb_data = null;
    let name = "";
    let email = '';
      
    if(this.props.location === 'Dev'){
      // input_data = 'ASDASDASDASDASDASDASDASDASDASD';
      // seq = 'ASDASDASDASDASDASDASDASDASDASD';
      name = "test";
      email = 'a@b.com'
    }
    this.state = {
      displayType: 'input',
      displayTime: true,
      formSelectedOption: 'SeqForm',
      seq_job_names: ["psipred",  "disopred", "pgenthreader", "metapsicov", "mempack",
      "memsatsvm", "genthreader", "dompred", "pdomthreader", "ffpred", "dmp", 
      "dmpfold", 's4pred', 'dmpmetal' ],
      struct_job_names: ["metsite", "hspred", "memembed", "merizo", "merizosearch"],
      // analyses: ['psipred_job'],
      analyses: ['psipred_job'],
      jobs: [],
      input_data: input_data,
      seq: seq,
      name: name,
      email: email,
      pdbData: pdb_data,
      waiting: false,
      uuid: null,
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
      memembed_barrel: 'TRUE',
      memembed_terminal: 'in',
      merizo_iterate: 'FALSE',
      merizo_chain: 'A',
      merizosearch_db: 'ted_100',
      merizosearch_chain: "A",
      svgs: null,
      results_files: false,
      config_data: null,
      resubmit: false,
      results_map: ['png', 'gif', 'jpg', 'horiz', 'ss2', 'pbdat', 'comb', 'memsat_svm',
                    'presult', 'align', 'presults', 'dom_presults', 'parseds', 'featcfg',
                    'full_formatted', 'csv', 'ann', 'aln', 'con', 'pdb', 'merizo', 'idx',
                    'boundary', 'Metpred', 'MetPred', 'out', 'results', 'pdb2', 'pdf',
                    'dmpmetal', 'dom_pdb', 'tsv'],
      job_strings: { "psipred": { 'shortName': 'PSIPRED',
                                  'fullName': 'PSIPRED 4.0',
                                  'describedName': 'PSIPRED 4.0 (Predict Secondary Structure)',
                                  'varName': 'psipred',
                                  'jobName': 'psipred_job',
                                  'tooltip': 'Predict helices, beta sheets and coils from AA sequence', },
                      "disopred": { 'shortName': 'DISOPRED3',
                                  'fullName': 'DISOPRED3',
                                  'describedName': 'DISOPRED3 (Disored Prediction)',
                                  'varName': 'disopred',
                                  'jobName': 'disopred_job',
                                  'tooltip': 'Detect intrinsically disordered regions in proteins', },
                      "pgenthreader": { 'shortName': 'pGenTHREADER',
                                    'fullName': 'pGenTHREADER',
                                    'describedName': 'pGenTHREADER (Profile Based Fold Recognition)',
                                    'varName': 'pgenthreader',
                                    'jobName': 'pgenthreader_job',
                                    'tooltip': 'Protein fold recognition with protein templates of known structure', },
                      "memsatsvm": { 'shortName': 'MEMSAT-SVM',
                                    'fullName': 'MEMSAT-SVM',
                                    'describedName': 'MEMSAT-SVM (Membrane Helix Prediction)',
                                    'varName': 'memsatsvm',
                                    'jobName': 'memsatsvm_job',
                                    'tooltip': 'Calculate length, location and topology of transmembrane helices', },
                      "dmp": { 'shortName': 'DeepMetaPSICOV',
                                'fullName': 'DeepMetaPSICOV 1.0',
                                'describedName': 'DeepMetaPSICOV 1.0 (Structural Contact Prediction)',
                                'varName': 'dmp',
                                'jobName': 'dmp_job',
                                'tooltip': 'Predict inter-residue contacts using a convolutional neural network', },
                      "mempack": { 'shortName': 'MEMPACK',
                                'fullName': 'MEMPACK',
                                'describedName': 'MEMPACK (TM Topology and Helix Packing)',
                                'varName': 'mempack',
                                'jobName': 'mempack_job',
                                'tooltip': 'Predict membrane helix packing', },
                      "genthreader": { 'shortName': 'genTHREADER',
                                'fullName': 'genTHREADER',
                                'describedName': 'genTHREADER (Rapid Fold Recognition)',
                                'varName': 'genthreader',
                                'jobName': 'genthreader_job',
                                'tooltip': 'Fast fold recognition method using template structures', },    
                      "pdomthreader": { 'shortName': 'pDomTHREADER',
                                'fullName': 'pDomTHREADER',
                                'describedName': 'pDomTHREADER (Protein Domain Fold Recognition)',
                                'varName': 'pdomthreader',
                                'jobName': 'pdomthreader_job',
                                'tooltip': 'Fast protein domain fold recognition using template domain structures', },    
                      "dmpfold": { 'shortName': 'DMPFold',
                                'fullName': 'DMPFold 2.0',
                                'describedName': 'DMPFold 2.0 (Protein Structure Prediction)',
                                'varName': 'dmpfold',
                                'jobName': 'dmpfold_job',
                                'tooltip': 'Accurate structure prediction using residue-residue contacts', },    
                      "s4pred": { 'shortName': 'S4Pred',
                                'fullName': 'S4Pred',
                                'describedName': 'S4Pred (Single Sequence SS Prediction)',
                                'varName': 's4pred',
                                'jobName': 's4pred_job',
                                'tooltip': 'Predict Secondary Structure Prediction with a single sequence', },         
                      "dompred": { 'shortName': 'DomPred',
                                'fullName': 'DomPred',
                                'describedName': 'DomPred (Domain Boundary Prediction)',
                                'varName': 'dompred',
                                'jobName': 'dompred_job',
                                'tooltip': 'Predict protein structural domain boundaries', },    
                      "ffpred": { 'shortName': 'FFPred',
                                'fullName': 'FFPred 4',
                                'describedName': 'FFPred 4 (Eurkaryotic Function Prediction)',
                                'varName': 'ffpred',
                                'jobName': 'ffpred_job',
                                'tooltip': 'Predict protein function, using Gene Ontology annotations', },    
                      "metsite": { 'shortName': 'Metsite',
                                'fullName': 'Metsite',
                                'describedName': 'Metsite (Protein-Metal Ion Contact Prediction)',
                                'varName': 'metsite',
                                'jobName': 'metsite_job',
                                'tooltip': 'Detects metal-binding residues from protein structure', },    
                      "hspred": { 'shortName': 'HSPred',
                                'fullName': 'HSPred',
                                'describedName': 'HSPred (Protein-Protein Hotspot Residue Prediction)',
                                'varName': 'hspred',
                                'jobName': 'hspred_job',
                                'tooltip': 'Predicts protein-protein interaction hotspot residues', },    
                      "memembed": { 'shortName': 'MEMEMBED',
                                'fullName': 'MEMEMBED',
                                'describedName': 'MEMEMBED (Membrane Protein Orientation Prediction)',
                                'varName': 'memembed',
                                'jobName': 'memembed_job',
                                'tooltip': 'Orientate membrane proteins within the lipid bilayer', },    
                      "merizo": { 'shortName': 'Merizo',
                                'fullName': 'Merizo',
                                'describedName': 'Merizo (Protein domain segmentation)',
                                'varName': 'merizo',
                                'jobName': 'merizo_job',
                                'tooltip': 'Fast and accurate protein domain prediction', },
                      "merizosearch": { 'shortName': 'Merizo Search',
                                'fullName': 'Merizo Search',
                                'describedName': 'Merizo Search (Domain segmentation and identification)',
                                'varName': 'merizosearch',
                                'jobName': 'merizosearch_job',
                                'tooltip': 'Fast domain segmentation and idenftication', },
                      "dmpmetal": {'shortName': 'DMPmetal',
                                   'fullName': 'DMPmetal',
                                   'describedName': 'DMPmetal (Metal Binding Site Prediction)',
                                   'varName': 'dmpmetal',
                                   'jobName': 'dmpmetal_job',
                                   'tooltip': 'llm based prediction of metal binding sites', },              
      },
    };
  }

  handleReset = () => {
    this.setState({
      analyses: ['psipred_job', ],
      jobs: [],
      input_data: '',
      seq: '',
      name: '',
      email: '',
      waiting: false,
      uuid: null,
      bioserf_modeller_key: '',
      domserf_modeller_key: '',
      dompred_e_value_cutoff: '0.01',
      dompred_psiblast_iterations: '5',
      ffpred_selection: 'human',
      pdbData: null,
      metsite_metal_type: 'CA',
      metsite_chain_id: 'A',
      metsite_fpr: '1',
      hspred_protein_1: 'A',
      hspred_protein_2: 'B',
      memembed_algorithm: '0',
      memembed_barrel: 'TRUE',
      memembed_terminal: 'in',
      merizo_iterate: 'FALSE',
      merizo_chain: 'A',
      merizosearch_db: 'ted_100',
      merizosearch_iterate: "TRUE",
      merizosearch_chain: "A",
      annotation_svg: null,
      results_files: false,
      config_data: null,
      resubmit: false,
      });
  }

  updateResultsFiles = (resultsData) => {
    this.setState({
      results_files: resultsData});
  }

  updateSVGs = (svg) => {
    this.setState({
      svgs: svg});
  }

  handleResubmit = (analyses, seq, name, email, event) => {
    this.setState({
      analyses: analyses,
      jobs: [],
      input_data: '',
      seq: seq,
      name: name,
      email: email,
      waiting: false,
      uuid: null,
      formSelectedOption: 'SeqForm',
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
      memembed_barrel: 'TRUE',
      memembed_terminal: 'in',
      annotation_svg: null,
      results_files: false,
      config_data: null,
      resubmit: true,
    });
    this.handleSubmit(event);
  }

  updateSeq = (newValue) => {
    this.setState({
      seq: newValue});
  }

  setTestSeq = () => {
    let test_seq = 'MLELLPTAVEGVSQAQITGRPEWIWLALGTALMGLGTLYFLVKGMGVSDPDAKKFYAITTLVPAIAFTMYLSMLLGYGLTMVPFGGEQNPIYWARYADWLFTTPLLLLDLALLVDADQGTILALVGADGIMIGTGLVGALTKVYSYRFVWWAISTAAMLYILYVLFFGFTSKAESMRPEVASTFKVLRNVTVVLWSAYPVVWLIGSEGAGIVPLNIETLLFMVLDVSAKVGFGLILLRSRAIFGEAEAPEPSAGDGAAATSD';
    this.setState({
      seq: test_seq,
      input_data: test_seq});
  }

  setDMPMetSeq = () => {
    let test_seq = 'IDVLLGADDGSLAFVPSEFSISPGEKIVFKNNAGFPHNIVFDEDSIPSGVDASKISMSEEDLLNAKGETFEVALSNKGEYSFYCSPHQGAGMVGKVTVN';
    this.setState({
      seq: test_seq,
      input_data: test_seq});
  }


  updateResubmit = (change) => {
    this.setState({
      resubmit: change});
  }

  updateConfig = (configData) => {
    this.setState({
      config_data: configData});
  }

  updateWaiting = (newValue) => {
    this.setState({waiting: newValue});
  }
  updateUuid = (newValue) => {
    this.setState({uuid: newValue});
  }
  updateName = (newValue) => {
    this.setState({name: newValue});
  }
  
  updateForm = (newValue) => {
    this.setState({formSelectedOption: newValue});
  }
  updateAnalyses = (newValue) => {
    this.setState({analyses: newValue});
  }
  updateDisplayTime = (newValue) => {
    this.setState({displayTime: newValue});
  }

  componentDidUpdate() {
    // currently just doing some reporting while debugging
    //console.log(this.state);
  }
  handleInputChange = (event) =>  {
    this.handleReset();
    //console.log(this.state.formSelectedOption);
    //console.log(event.target.value);
    this.setState({
      formSelectedOption: event.target.value,
      analyses: [],
    });
    //console.log(this.state.formSelectedOption);

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
        var fasta_regex = /^>(\S+).*\n(.+)/;
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
    //console.log(jobs);
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
    
    this.state.seq = this.state.seq.replace(/\r/g, "");
    //console.log(this.state.seq);
    let checked = validateFormData(this.state, jobs, pdbData);
    this.state.seq = checked.seq;
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

  componentDidMount(){
    console.log("INCOMING UUID: "+this.props.incoming_uuid);
    if(this.props.incoming_uuid){
      this.setState({displayType: 'results'});
    }
  }

  render () {
    return(
      <div className="row">
      { this.state.displayType === "input" ?
        <div>
          {/* <div className="col-md-9"><MainForm {...{...this.state, ...this.props}} handleInputChange={this.handleInputChange} handleSubmit={this.handleSubmit} handleStructChange={this.handleStructChange} handleReset={this.handleReset} handleSeqChange={this.handleSeqChange} setTestSeq={this.setTestSeq} setDMPMetSeq={this.setDMPMetSeq} /></div>
          <div className="col-md-3"><Sidebar {...this.state} handleSidebarChange={this.handleSidebarChange} /></div> */}
        </div>
      :
        <div>
          <div className="col-md-9">
            <ResultsMain {...{...this.state, ...this.props}} updateWaiting={this.updateWaiting} updateResultsFiles={this.updateResultsFiles} updateSVGs={this.updateSVGs}  updateName={this.updateName} updateUuid={this.updateUuid} updateConfig={this.updateConfig} updateResubmit={this.updateResubmit} updateForm={this.updateForm} updateSeq={this.updateSeq} updateAnalyses={this.updateAnalyses} updateDisplayTime={this.updateDisplayTime} />
          </div>
          <div className="col-md-3">
            { this.state.displayTime === true &&
              <ResultsSidebarTimes {...{...this.state, ...this.props}} />
            }
            <ResultsSidebarDownloads {...{...this.state, ...this.props}} />
            { this.state.formSelectedOption === 'SeqForm' &&
            <ResultsSidebarResubmission {...{...this.state, ...this.props}} handleResubmit={this.handleResubmit} />
            }
          </div>
        </div>
      }
      </div>
    );
  }
}

export class PsipredSite extends React.Component{
  constructor(props){
    super(props);
    let href = window.location.href;
    let uuid = null;
    if(window.location.href.includes("&uuid=")){
      href = window.location.href.split('&uuid=')[0];
      uuid = window.location.href.split('&uuid=')[1];
      //request the results once here and 
    }
    console.log("PAGE LOAD location : "+window.location.hostname);
    console.log("PAGE LOAD href: "+href);
    console.log("PAGE LOAD uuid: "+uuid);
    this.state = {
      suspension_message: null,
      server_message: null,
      //suspension_message: "The server will be offline until the 15th of Feb 2024",
      server_message: "Our new hardware and service upgrade is complete. There may be some minor bugs. If you encounter one of these please email psipred-help@cs.ucl.ac.uk",
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
      incoming_uuid: uuid,
      href: href,
    };
    let new_state = decide_location(this.state.href, window.location.hostname, this.state.main_url, this.state.app_path);
    this.state = {...this.state, ...new_state};
  }

  // componentDidMount() {
  //   let new_state = decide_location(this.state.href, window.location.hostname, this.state.main_url, this.state.app_path);
  //   console.log(new_state);
  //   this.setState(decide_location(this.state.href, window.location.hostname, this.state.main_url, this.state.app_path));
  //   //defaults for dev server
  // }

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
          { this.state.server_message !== null &&
            <div><h3 className="form_error">{this.state.server_message}</h3></div>
          }
          { this.state.suspension_message !== null &&
            <div><h3 className="form_error">{this.state.suspension_message}</h3></div>
          }
          <DisplayArea {...this.state}/>
          <div className="row">
            <div className="col-md-9"></div><div className="col-md-3"></div>
          </div>
        <div className="helixy">
          <img alt="It's Helixy y'all!" src="http://bioinf.cs.ucl.ac.uk/psipred/static/images/helixy_png_blank.png" />
        </div>
        </div>
      </section>
    );
  }
}