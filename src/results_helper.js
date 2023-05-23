import { annotationGrid } from './biod3/main.js';

export function draw_empty_annotation_panel(state, targetDiv){
  // console.log(Math.ceil(residues.length/50));
  //console.log("INITIAL HEIGHT: "+panel_height);
  annotationGrid(state.annotations, {parent: targetDiv, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: state.annotation_panel_height, container_height: state.annotation_panel_height});
}

export function request_data(uri, file_url, mime){
  // convert this to synchronous
  console.log("REQUESTING ASCII DATA: "+file_url+uri)
  let results_data = null;
  let req = new XMLHttpRequest();
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
     results_data = req.response;
    }
  }
  req.open("GET", file_url+uri, false);
  if(mime){req.setRequestHeader('Accept', mime);}
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
