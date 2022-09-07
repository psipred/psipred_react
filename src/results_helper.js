import { annotationGrid } from './biod3/main.js';

export function draw_empty_annotation_panel(state, targetDiv){
  // console.log(Math.ceil(residues.length/50));
  let panel_height = ((Math.ceil(state.annotations.length/50)+2)*20)+(8*20);
  if(panel_height < 300){panel_height = 300;}
  //console.log("INITIAL HEIGHT: "+panel_height);
  annotationGrid(state.annotations, {parent: targetDiv, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: panel_height, container_height: panel_height});
}

export function request_data(uri, file_url){
  // convert this to synchronous
  console.log("REQUESTING: "+file_url+uri)
  let results_data = null;
  let req = new XMLHttpRequest();
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
     results_data = req.response;
    }
  }
  req.open("GET", file_url+uri, false);
  req.send();
  req.onerror = function() {
    alert("Request failed");
  };
  return(results_data);
}
