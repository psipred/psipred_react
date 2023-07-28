import { annotationGrid } from './biod3/main.js';

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
