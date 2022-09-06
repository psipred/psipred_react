import { annotationGrid } from './biod3/main.js';

export function draw_empty_annotation_panel(state, targetDiv){
  // console.log(Math.ceil(residues.length/50));
  let panel_height = ((Math.ceil(state.annotations.length/50)+2)*20)+(8*20);
  if(panel_height < 300){panel_height = 300;}
  //console.log("INITIAL HEIGHT: "+panel_height);
  annotationGrid(state.annotations, {parent: targetDiv, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: panel_height, container_height: panel_height});
}

export async function process_files(uri, file_url){
  console.log("Fetching Results File: "+file_url+uri)
  let response = await fetch(file_url+uri);
  if(response.ok){
    const text = await response.text();
    return(text);
  }
  else{
    throw new Error("Unable to retrieve: "+file_url+uri);
  }
}
