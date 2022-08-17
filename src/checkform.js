
function test_modeller_key(input)
{
  if(input === 'M'+'O'+'D'+'E'+'L'+'I'+'R'+'A'+'N'+'J'+'E') // eslint-disable-line no-useless-concat
  {
    return(true);
  }
  return(false);
}

const validateFormData = (state, jobs) => {
  let compare = (a1, a2) => a1.filter(v => a2.includes(v)).length;
  let checked = { send: false, // flag to control if the form data looks valid and should be POSTed
                  message: null, //Any error message if send is false
                  result_page: "seq" // if send is true seq whether we're rendering the seq or structu results page
                };
  let seq_job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack",
                      "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf",
                      "domserf", "ffpred", "dmp", "dmpfold" ];
  let struct_job_list = ["metsite", "hspred", "memembed", "gentdb"];
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

  if(state.name.length === 0)
  {
    checked.message = "You must provide a short identifying name for your submission";
    return(checked)
  }


  if(compare(jobs, struct_job_list) > 0) {
    checked.result_page = 'struct';
  }
  if(checked.result_page === 'seq') {
    if(state.seq.length === 0)
    {
      checked.message = "You must provide a protein sequence or MSA for sequence analysis submission";
      return(checked)
    }
  }
  else {

  }

  checked.send = true;
  checked.message = 'all tests passed';
  return(checked);
};


export { validateFormData };
