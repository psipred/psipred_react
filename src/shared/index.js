import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { annotationGrid } from '../interface/biod3/main.js';
//import * as $3Dmol from '3dmol/build/3Dmol.js';
import * as colours from './colour_names.js';
import { parse_merizo } from '../interface/parsers.js';


var moment = require('moment');

export function display_structure(mol_container, pdb_data, cartoon, memembed, merizo_dat, merizo_ctl, merizo_search_button_names, merizo_search_domain_button_names)
{
  //mol_container - handle for the DOM element for the structure
  //pdb_data - PDB data in text format
  //cartoon - bool for cartoon colouring
  //memembed - bool for memember colouring
  //merizo_dat - merizo data in text format or False
  //merizo_ctl - bool to toggle merizo colouring side bar

  let merizo_labels = [];
  let cartoon_color = function(atom) {
    if(atom.ss === 'h'){atom.color = '#e353e3'; return '#e353e3';}
    if(atom.ss === 's'){atom.color = '#e5dd55'; return '#e5dd55';}
    atom.color = 'grey';
    return('grey');
  };
  let merizo_color = function(atom){
    let domain_number = merizo_labels[atom.resi];
    //console.log(merizo_labels);
    if(colours.colourNames[domain_number]){
      atom.color = colours.colourNames[domain_number]; return(colours.colourNames[domain_number]);
    }
    atom.color = 'White';
    return('White');  
  };
  
  let hotspot_color = function(atom){
    if(atom.b === 1.0){atom.color = 'red'; return 'red';}
    if(atom.b === 0.5){atom.color = 'black'; return 'black';}
    if(atom.b === 50){atom.color = 'white'; return 'white';}
    if(atom.b === 100){atom.color = 'red'; return 'red';}
    atom.color = 'blue';
    return("blue");
  };
  let bFactor_color = function(atom) {
    let minBFactor = 0;
    let maxBFactor = 100;
    let normalizedBFactor = (atom.b - minBFactor) / (maxBFactor - minBFactor);
    let hue = (1 - normalizedBFactor) * 240;
    let rgbColor = hslToRgb(hue / 360, 1, 0.5);
  
    let color = `rgb(${rgbColor.join(',')})`;
    atom.color = color;
    return color;
  };
  
  function hslToRgb(h, s, l) {
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l;
    } else {
      let hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  let bFactorBins_color = function(atom) {
    if (atom.b > 90) {
      atom.color = "rgb(0, 81, 214)";
      return "rgb(0, 81, 214)";
    } else if (atom.b > 70) {
      atom.color = "rgb(101, 203, 243)";
      return "rgb(101, 203, 243)";
    } else if (atom.b > 50) {
      atom.color = "rgb(255, 219, 19)";
      return "rgb(255, 219, 19)";
    } else {
      atom.color = "rgb(255, 125, 69)";
      return "rgb(255, 125, 69)";
    }
  };
  
  // Function to color atoms by occupancy values

  let element = mol_container;
  let config = { backgroundColor: '#ffffff' };
  let viewer = Window.$3Dmol.createViewer( element, config );
  viewer.addModel( pdb_data, "pdb" );                       /* load data */
  //console.log(viewer);
  
  if(merizo_search_button_names){
    //console.log(merizo_search_button_names);
    document.getElementById("colorByDomains").addEventListener("click", function() {
      viewer.setStyle({}, { cartoon: { colorfunc: merizo_color } });
      viewer.render();
    });

    for (const [key, value] of Object.entries(merizo_search_button_names)){
      // eslint-disable-next-line no-loop-func
      //console.log(merizo_labels);
      // eslint-disable-next-line no-loop-func
      document.getElementById(value).addEventListener("click", function() {
        let lab_copy = JSON.parse(JSON.stringify(merizo_labels));
        for (const [key2, value2] of Object.entries(merizo_labels)){
          if(Number(key) !== Number(value2)){
            merizo_labels[key2] = 0;
          }
        }
        viewer.setStyle({}, { cartoon: { colorfunc: merizo_color } });
        viewer.render();
        merizo_labels =JSON.parse(JSON.stringify(lab_copy));
      });
    }
  }

  if(merizo_search_domain_button_names){
    //console.log(merizo_search_button_names);
    document.getElementById("colorByDomains").addEventListener("click", function() {
      viewer.setStyle({}, { cartoon: { colorfunc: merizo_color } });
      viewer.render();
    });

    for (const [key, value] of Object.entries(merizo_search_domain_button_names)){
      // eslint-disable-next-line no-loop-func
      //console.log(merizo_labels);
      // eslint-disable-next-line no-loop-func
      document.getElementById(value).addEventListener("click", function() {
        let lab_copy = JSON.parse(JSON.stringify(merizo_labels));
        for (const [key2, value2] of Object.entries(merizo_labels)){
          if(Number(key) !== Number(value2)){
            merizo_labels[key2] = 0;
          }
        }
        viewer.setStyle({}, { cartoon: { colorfunc: merizo_color } });
        viewer.render();
        merizo_labels =JSON.parse(JSON.stringify(lab_copy));
      });
    }
  }

  if(merizo_ctl){
      //Add event listeners to buttons
    document.getElementById("colorByBFactor").addEventListener("click", function() {
      viewer.setStyle({}, { cartoon: { colorfunc: bFactor_color } });
      viewer.render();
    });
  
    document.getElementById("colorByDomains").addEventListener("click", function() {
      viewer.setStyle({}, { cartoon: { colorfunc: merizo_color } });
      viewer.render();
    });
  
    document.getElementById("colorByplDDT").addEventListener("click", function() {
      viewer.setStyle({}, { cartoon: { colorfunc: bFactorBins_color } });
      viewer.render();
    });
  }
  else if(cartoon)
  {
    viewer.setStyle({}, {cartoon: {colorfunc: cartoon_color}});  /* style all atoms */
  }
  else {
    viewer.setStyle({}, {cartoon: {colorfunc: hotspot_color}});  /* style all atoms */
  }
  if(memembed){
    viewer.addSurface(Window.$3Dmol.SurfaceType.VDW, {'opacity':0.8, colorscheme: 'whiteCarbon'});
  }
  if(merizo_dat){
    let merizo_data = parse_merizo(merizo_dat);
    merizo_labels = merizo_data[0];
    viewer.setStyle({}, {cartoon: {colorfunc: merizo_color}});
  }
  viewer.zoomTo();                                      /* set camera */
  viewer.render();                                      /* render scene */
  viewer.zoom(1.7, 3000);
}

export function decide_location(href, hostname, main_url, app_path){
    console.log("DECIDING WHERE I AM");
    let uris = {
        endpoints_url: 'http://127.0.0.1:8000/analytics_automated/endpoints/',
        submit_url: 'http://127.0.0.1:8000/analytics_automated/submission/',
        times_url: 'http://127.0.0.1:8000/analytics_automated/jobtimes/',
        joblist_url: 'http://127.0.0.1:8000/analytics_automated/job/',
        gears_svg: "../static/images/gears.svg",
        app_path:  '/interface',
        files_url:  'http://127.0.0.1:8000',
        location: "Dev",
        main_url: 'http://127.0.0.1',
    };
    if(href.includes(':3000')){
      uris['main_url'] = 'http://127.0.0.1:3000';
    }

    if(hostname === "bioinfstaging1.cs.ucl.ac.uk")
    { //update for staging paths
      uris['main_url'] = "bioinfstaging3.cs.ucl.ac.uk";
      uris['joblist_url'] = main_url+app_path+'/api/job/';
      uris['endpoints_url'] = main_url+app_path+'/api/endpoints/';
      uris['submit_url'] = main_url+app_path+'/api/submission/';
      uris['times_url'] = main_url+app_path+'/api/jobtimes/';
      uris['files_url'] = main_url+app_path+"/api";
      uris['location'] = 'Staging';
      //gears_svg = "../static/images/gears.svg";
      console.log(uris);
      return(uris);
  
    }
    if(href  === "http://bioinf.cs.ucl.ac.uk/psipred_beta" || href.includes('psipred_beta'))
    { //update for staging paths
      uris['app_path'] = app_path;
      uris['main_url'] = "bioinf.cs.ucl.ac.uk";
      uris['joblist_url'] = main_url+app_path+'/api/job/';
      uris['endpoints_url'] = main_url+app_path+'/api/endpoints/';
      uris['submit_url'] = main_url+app_path+'/api/submission/';
      uris['times_url'] = main_url+app_path+'/api/jobtimes/';
      uris['files_url'] = main_url+app_path+"/api";
      uris['location'] = 'Staging';
      //gears_svg = "../static/images/gears.svg";
      console.log(uris);
      return(uris);
  
    }
    if(href  === "http://bioinf.cs.ucl.ac.uk/psipred_alt" || href.includes('psipred_alt'))
     { //update for staging paths
        uris['app_path'] = '/psipred_alt';
        uris['main_url'] = "bioinf.cs.ucl.ac.uk";
        uris['joblist_url'] = main_url+'/psipred_alt/api/job/';
        uris['endpoints_url'] = main_url+'/psipred_alt/api/endpoints/';
        uris['submit_url'] = main_url+'/psipred_alt/api/submission/';
        uris['times_url'] = main_url+'/psipred_alt/api/jobtimes/';
        uris['files_url'] = main_url+"/psipred_alt/api";
        uris['location'] = 'Staging';
        //gears_svg = "../static/images/gears.svg";
        console.log(uris);
        return(uris);
    
    } 
    if (hostname === "127.0.0.1" || hostname === "localhost"){
      console.log("dev server using default URIs");
      console.log(uris);
      return(uris);  
    }
    if(href === "http://bioinf.cs.ucl.ac.uk/psipred/" || href.includes('psipred')  )
    {
        uris['main_url'] = "http://bioinf.cs.ucl.ac.uk/";
        uris['app_path'] = '/psipred';
        uris['joblist_url'] = main_url+uris['app_path']+'/api/job/';
        uris['endpoints_url'] = main_url+uris['app_path']+'/api/endpoints/';
        uris['submit_url'] = main_url+uris['app_path']+'/api/submission/';
        uris['times_url'] = main_url+uris['app_path']+'/api/jobtimes/';
        uris['files_url'] = main_url+uris['app_path']+"/api";
        uris['gears_svg'] = "http://bioinf.cs.ucl.ac.uk/psipred/static/images/gears.svg";
        uris['location']= "Production";
        console.log("IN PROD");
    } else {
      alert('UNSETTING ENDPOINTS WARNING, WARNING! WEBSITE NON FUNCTIONAL');
      uris['joblist_url'] = '';
      uris['endpoints_url'] = '';
      uris['submit_url'] = '';
      uris['times_url'] = '';
    }
      console.log(uris);
    return(uris);
}

export function request_data(uri, file_url, mime){
  // convert this to synchronous
  let results_data = null;
  let req = new XMLHttpRequest();
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
     results_data = req.response;
    }
  }
  req.open("GET", file_url+uri, false);
  //req.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
  if(mime){req.setRequestHeader('Accept', mime);
    req.overrideMimeType(mime);
  }

  req.send();
  req.onerror = function() {
    alert("Request failed");
  };
  return(results_data);
}

export function request_binary_data(uri, file_url){
  // convert this to synchronous
  console.log("REQUESTING BINARY DATA: "+file_url+uri)
  let results_data = null;
  let req = new XMLHttpRequest();
  //req.responseType = "arraybuffer";
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      const byteArray = new Uint8Array(req.response);
      results_data = byteArray;
    }
  }
  req.open("GET", file_url+uri, false);
  //req.responseType = "arraybuffer";
  req.send();
  req.onerror = function() {
    alert("Request failed");
  };
  return(results_data);
}

export function config_table(table_id, page_length, min_id, max_id, table_name, sort_column_number, extra_order){
  let table = null;
  if(extra_order)
  {
    table = $(table_id).DataTable({
      'searching'   : true,
      'pageLength': page_length,
      'order': [extra_order,]
    });
  }
  else{
    table = $(table_id).DataTable({
      'searching' : true,
      'pageLength': page_length,
    });
  }
  var minEl = $(min_id);
  var maxEl = $(max_id);
  // Custom range filtering function
  //https://stackoverflow.com/questions/55242822/prevent-datatables-custom-filter-from-affecting-all-tables-on-a-page
  //note: we have to push one of these functions on to the array for every table we want to have
  // a custom filter for.
  $.fn.dataTable.ext.search.push(function (settings, data) {
    //console.log(settings.nTable.id);
    if ( settings.nTable.id !== table_name ) {
      return true;
    }
    var min = parseFloat(minEl.val(), 10);
    var max = parseFloat(maxEl.val(), 10);
    var score = parseFloat(data[sort_column_number]) || 0; // use data for the column
    if (
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && score <= max) ||
        (min <= score && isNaN(max)) ||
        (min <= score && score <= max)
    ) {
        return true;
    }
    return false;
  });
     
  // Changes to the inputs will trigger a redraw to update the table
  minEl.on('input', function () {
      table.draw();
  });
  maxEl.on('input', function () {
    table.draw();
  });
}

//given a job name prep all the form elements and send an http request to the
//backend

export function configurePost(formState)
{
  console.log(formState);
  console.log("Sending form data");
  var file = null;
  try
  {
    file = new Blob([formState.seq]);
  } catch (e)
  {
    alert(e);
  }
  if(formState.pdbData) {
    try
    {
      file = new Blob([formState.pdbData]);
    } catch (e)
    {
      alert(e);
    }
  }
  if(formState.transData) {
    try
    {
      file = new Blob([formState.transData]);
    } catch (e)
    {
      alert(e);
    }
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
  if(formState.jobs.includes('merizo')){
    fd.append("merizo_iterate", formState.merizo_iterate);
    fd.append("merizo_chain", formState.merizo_chain);
  }
  if(formState.jobs.includes('merizosearch')){
    fd.append("merizosearch_db", formState.merizosearch_db);
    fd.append("merizosearch_chain", formState.merizosearch_chain);
  }
  if(formState.jobs.includes('gsrcl')){
    fd.append("verify_csv_tissue", formState.gsrcl_tissue);
    fd.append("gsrcl_predict_tissue", formState.gsrcl_tissue);
    fd.append("gsrcl_predict_log", formState.gsrcl_log);
    fd.append("verify_csv_log", formState.gsrcl_log);
  }
  return(fd);
}

export function parse_times(data){
  //moment.duration(times[name]*1000);
  let times = {'loading_message': null};
  for(const [key, value] of Object.entries(data)){
    times[key] = moment.duration(value*1000).humanize();
  }
  return(times);
}

export function draw_empty_annotation_panel(state, targetDiv){
  // console.log(Math.ceil(residues.length/50));
  //console.log("INITIAL HEIGHT: "+panel_height);
  annotationGrid(state.annotations, {parent: targetDiv, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: state.annotation_panel_height, container_height: state.annotation_panel_height});
}

export function parse_config(json){
  let job_summary = '';
  let step_count = 0;
  json.steps.forEach(function(step){
    if(step.task.configuration.length > 0) {
      step.task.configuration.forEach(function(conf){
        job_summary += json.name+",";
        job_summary += step_count+",";
        job_summary += conf.type+",";
        job_summary += conf.name+",";
        job_summary += conf.version+",";
        job_summary += '"'+conf.parameters+'"\n';
      });
      step_count+=1;
    }
  });
  return(job_summary);
}

export function showChainTooltip(evt, text) {
  let tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = text;
  tooltip.style.display = "block";
  tooltip.style.left = evt.pageX + 10 + 'px';
  tooltip.style.top = evt.pageY + 10 + 'px';
}

export function hideChainTooltip() {
  var tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}