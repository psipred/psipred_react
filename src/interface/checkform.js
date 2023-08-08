
function test_modeller_key(input)
{
  if(input === 'M'+'O'+'D'+'E'+'L'+'I'+'R'+'A'+'N'+'J'+'E') // eslint-disable-line no-useless-concat
  {
    return(true);
  }
  return(false);
}

function ValidateEmail(input) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.match(validRegex)) {
    return true;
  }
  return false;
}

function ValidateFloatString(input){
  var validRegex = /^[0-9]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.match(validRegex)) {
    return true;
  }
  return false;
}

function ValidateIntegerString(input){
  var validRegex = /^[0-9]+$/;

  if (input.match(validRegex)) {
    return true;
  }
  return false;
}

function ValidateChainID(input){
  var validRegex = /^[A-Z]$/;

  if (input.match(validRegex)) {
    return true;
  }
  return false;
}

function test_seq(seq, jobs, pdbData)
{
  /* length checks */
  if(seq.length === 0)
  {
    return("You must provide a protein sequence or MSA for sequence analysis submission");
  }
  if(seq.length < 30)
  {
    return("Your sequence is too short for analysis. Minimum size is 30 residues");
  }
  if(seq.length > 1500)
  {
    return("Your sequence is too long to process. Maximum size is 1500 residues");
  }
  if(seq.length > 500 && jobs.includes('dmpfold'))
  {
    return("DMPfold jobs have a maximum sequence length of 500 residues.");
  }
  if(seq.length > 500 && jobs.includes('dmp'))
  {
    return("DeepMetaPSICOV jobs have a maximum sequence length of 500 residues.");
  }
  /* nucleotide checks */
  let nucleotide_count = (seq.match(/A|T|C|G|U|N|a|t|c|g|u|n/g)||[]).length;
  if((nucleotide_count/seq.length) > 0.95)
  {
    return("Your sequence appears to be nucleotide sequence. This service requires protein sequence as input");
  }
  if(/[^ACDEFGHIKLMNPQRSTVWYX-]+/i.test(seq))
  {
    return("Your sequence contains invalid characters");
  }
  return(null);
}


const validateFormData = (state, jobs, pdbData) => {
  let compare = (a1, a2) => a1.filter(v => a2.includes(v)).length;
  let checked = { send: false, // flag to control if the form data looks valid and should be POSTed
                  message: null, //Any error message if send is false
                  result_page: "seq", // if send is true seq whether we're rendering the seq or structu results page
                  jobs: null, // we return an array of the jobs that need to be run removing anything redundant from jobs
                  pdbData: ''
                };
  let seq_job_list = state.seq_job_names;
  let struct_job_list =  state.struct_job_names;
  if((compare(jobs, seq_job_list) > 0) && (compare(jobs, struct_job_list) > 0)) {
    checked.message = "You can not submit both sequence and structure analysis jobs";
    return(checked);
  }
  if((compare(jobs, seq_job_list) === 0) && (compare(jobs, struct_job_list) === 0)) {
    checked.message = "You must select at least one analysis job";
    return(checked);
  }
  if(jobs.includes('bioserf')){
    let bios_modeller_test = test_modeller_key(state.bioserf_modeller_key);
    if(! bios_modeller_test)
    {
      checked.message = "You have not provided a valid MODELLER key for BioSerf. Contact the Sali lab for a MODELLER licence.";
      return(checked);
    }
  }
  if(jobs.includes('domserf')){
    let modeller_test = test_modeller_key(state.domserf_modeller_key);
    if(! modeller_test)
    {
      checked.message = "You have not provided a valid MODELLER key for DomSerf. Contact the Sali lab for a MODELLER licence.";
      return(checked);
    }
  }

  if(! /^[\x00-\x7F]+$/.test(state.name)) // eslint-disable-line no-control-regex
  {
    checked.message = "Please restrict job names to alphanumeric characters and simple punctuation";
    return(checked);
  }

  if(state.email.length === 0)
  {
    var r = window.confirm("No email address was provided.\n\nAnalyses can be long running and we recommend users leave an\nemail address to receive completion alerts. Leaving an email address\nalso allows us to contact you if there are any problems with you analyses\n\nPress OK to submit without an email address.");
    if(r === true)
    {
      state.email = 'dummy@dummy.com';
    }
    else {
      return(checked);
    }
  }
  if(! ValidateEmail(state.email)){
    checked.message = "You must provide a valid email address";
    return(checked);
  }

  if(state.name.length === 0)
  {
    checked.message = "You must provide a short identifying name for your submission";
    return(checked);
  }

  if(compare(jobs, struct_job_list) > 0) {
    checked.result_page = 'struct';
  }

  if(checked.result_page === 'seq') {
    //Here we validate the various sequence analysis inputs  let seq_count = seq.split(">").length - 1;
    if(jobs.length === 13)
    {
      checked.message = "You can't select all sequence analyses";
      return(checked);
    }

    let seq_count = state.seq.split(">").length - 1;
    let lines = state.seq.split("\n");
    if(seq_count <= 1) // dealing with single seq
    {
      let whole_seq = '';
      lines.forEach(function(line){
        if(! line.startsWith('>')){ whole_seq += line; }
      });
      if(whole_seq.length < 1){
        checked.message= "No sequence provided";
        return(checked);
      }
      checked.message = test_seq(state.seq, jobs);
    }
    else {
      let seq_count = 0;
      let residue_count = 0;
      let seqs = {};
      lines.forEach(function(line){
        if(line.startsWith(">")){
          seq_count += 1;
          seqs[seq_count] = '';
        }
        else
        {
          seqs[seq_count] += line;
          residue_count += line.length;
        }
      });
      //console.log(seqs);
      let msa_residue_total = seqs["1"].length*seq_count;

      if(residue_count !== msa_residue_total){
          checked.message = "MSA Sequences must be of same length";
          return(checked);
      }
      for(let key in seqs)
      {
        checked.message += test_seq(seqs[key]);
        if(checked.message > 0){
          return(checked);
        }
      }
    }
    if(! ValidateFloatString(state.dompred_e_value_cutoff)) {
      checked.message = "E Value cutoff for Dompred must be a number";
    }
    if(! ValidateIntegerString(state.dompred_psiblast_iterations)) {
      checked.message = "PSI-BLAST iterations for Dompred must be an integer";
    }
    if(checked.message){
      return(checked);
    }
  }
  else { // Here we validate structure things
    if(jobs.length === 4)
    {
      checked.message = "You can't select all structure analyses";
      return(checked);
    }

    if(! ValidateChainID(state.metsite_chain_id)) {
      checked.message = "Metsite chain ID must be a single letter";
      return(checked);
    }
    if(! ValidateChainID(state.hspred_protein_1)) {
      checked.message = "HSPred Protein 1 must be a single letter";
      return(checked);
    }
    if(! ValidateChainID(state.hspred_protein_2)) {
      checked.message = "HSPred Protein 2 must be a single letter";
      return(checked);
    }
    if(pdbData) {
      if(! /ATOM\s+\d+/i.test(pdbData)){
          checked.message = "Your file does not look like a plain text ascii pdb file. This service does not accept .gz or xml format pdb files";
          return(checked);
      }
    }
  }
  //console.log(jobs);
  //remove redundant jobs
  if(jobs.includes('pgenthreader') || 
     jobs.includes('dompred') || jobs.includes('pdomthreader') ||
     jobs.includes('bioserf') || jobs.includes('domserf') ||
     jobs.includes('metapsicov')) {
       let idx = jobs.indexOf('psipred');
       if(idx > -1){
         jobs.splice(idx, 1);
       }
  }
  if(jobs.includes('bioserf'))
  {
    let idx = jobs.indexOf('pgenthreader');
    if(idx > -1){
      jobs.splice(idx, 1);
    }
  }
  if(jobs.includes('domserf'))
  {
    let idx = jobs.indexOf('pdomthreader');
    if(idx > -1){
      jobs.splice(idx, 1);
    }
  }
  //console.log(jobs);

  checked.send = true;
  checked.message = 'all tests passed';
  checked.pdbData = pdbData;
  checked.jobs = jobs;
  return(checked);
};


export { validateFormData };
