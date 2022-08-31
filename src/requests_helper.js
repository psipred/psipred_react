//given a job name prep all the form elements and send an http request to the
//backend
var moment = require('moment');

export function configurePost(formState)
{
  //console.log(formState);
  console.log("Sending form data");
  var file = null;
  try
  {
    file = new Blob([formState.seq]);
  } catch (e)
  {
    alert(e);
  }
  let fd = new FormData();
  console.log("JOB NAME: "+formState.name);

  fd.append("input_data", file, 'input.txt');
  fd.append("job",formState.jobs.join(","));
  fd.append("submission_name", formState.name);
  fd.append("email", formState.email);
  if(formState.jobs.includes('dompred')){
  fd.append("psiblast_dompred_evalue", formState.dompred_e_value_cutoff);
  fd.append("psiblast_dompred_iterations", formState.dompred_psiblast_iterations);}
  if(formState.jobs.includes('metsite')){
  fd.append("metsite_checkchains_chain", formState.metsite_chain_id);
  fd.append("extract_fasta_chain", formState.metsite_chain_id);
  fd.append("seedSiteFind_metal", formState.metsite_metal_type);
  fd.append("seedSiteFind_chain", formState.metsite_chain_id);
  fd.append("metpred_wrapper_chain", formState.metsite_chain_id);
  fd.append("metpred_wrapper_metal", formState.metsite_metal_type);
  fd.append("metpred_wrapper_fpr", formState.metsite_fpr);}
  if(formState.jobs.includes('hspred')){
  fd.append("hspred_checkchains_chains", formState.hspred_protein_1+formState.hspred_protein_2);
  fd.append("hs_pred_first_chain", formState.hspred_protein_1);
  fd.append("hs_pred_second_chain", formState.hspred_protein_2);
  fd.append("split_pdb_files_first_chain", formState.hspred_protein_1);
  fd.append("split_pdb_files_second_chain", formState.hspred_protein_2);}
  if(formState.jobs.includes('memembed')){
  fd.append("memembed_algorithm", formState.memembed_algorithm);
  fd.append("memembed_barrel", formState.memembed_barrel);
  fd.append("memembed_termini", formState.memembed_terminal);}
  if(formState.jobs.includes('ffpred')){
  fd.append("ffpred_selection", formState.ffpred_selection);
  }
  return(fd);
  //let response_data = send_request(formState.submit_url, "POST", fd);
  //if(response_data !== null)
  //{
  //   let times = send_request(times_url,'GET',{});
  //   let jobs = job_name.split(",");
  //   jobs.forEach(function(name){
  //     if(name in times)
  //     {
  //       ractive.set('loading_message', null);
  //       var duration = moment.duration(times[name]*1000);
  //       ractive.set(name+'_time', job_names[name]+": "+duration.humanize());
  //     }
  //     else
  //     {
  //       ractive.set('loading_message', null);
  //       ractive.set(name+'_time', "No time for "+job_names[name]+" job.");
  //     }
  //   });
  //   //alert(JSON.stringify(times));
  //   for(var k in response_data)
  //   {
  //     if(k == "UUID")
  //     {
  //       ractive.set('batch_uuid', response_data[k]);
  //       if(['metiste', 'hspred', 'gentdb', 'memembed'].includes(job_name))
  //       {
  //         ractive.fire('poll_trigger', false);
  //       }
  //       else
  //       {
  //         ractive.fire('poll_trigger', true);
  //       }
  //     }
  //   }
  //   let csv = '';
  //   jobs.forEach(function(name){
  //     let config = send_request(joblist_url+name,'GET',{});
  //     csv = ractive.get('config_text');
  //     csv += parse_config(config);
  //     ractive.set('config_text', csv);
  //   });
  //   zip.folder("submissions/").file(ractive.get('batch_uuid')+".csv", csv);
  // }
  // else
  // {
  //   return null;
  // }
  // return true;
}

export function parse_times(data){
  //moment.duration(times[name]*1000);
  let times = {'loading_message': null};
  for(const [key, value] of Object.entries(data)){
    times[key] = moment.duration(value*1000).humanize();
  }
  return(times);
}
