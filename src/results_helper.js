import * as biod3 from './biod3.js';

export function draw_empty_annotation_panel(state){
  // console.log(Math.ceil(residues.length/50));
  let panel_height = ((Math.ceil(state.annotations.length/50)+2)*20)+(8*20);
  if(panel_height < 300){panel_height = 300;}
  //console.log("INITIAL HEIGHT: "+panel_height);
  console.log(biod3.annotationGrid);
  biod3.annotationGrid(state.annotations, {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: panel_height, container_height: panel_height});
}
