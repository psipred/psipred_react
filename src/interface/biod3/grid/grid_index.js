import * as d3 from 'd3';
import 'd3-transition';
//import 'd3.layout.grid';
import {event as currentEvent} from 'd3-selection'; //re-import this due to d3-transition clash
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';
import { innerArrayValues } from '../common/index';
import { returnRange } from '../common/index';
import { printDebug } from '../common/index';
const cb = require('../common/palette.js');
const FileSaver = require('/home/dbuchan/Code/biod3/node_modules/file-saver');
const custom = {
E: {fill: 'Gold', name: 'Strand'},
H: {fill: 'HotPink', name: 'Helix'},
C: {fill: 'LightGrey', name: 'Coil'},
D: {stroke: 'blue', name: 'Disordered'},
PB: {stroke: 'green', name: 'Disordered, protein binding'},
B: {fill: '#7ebfd3', name: 'Putative Domain Boundary'},
I: {fill: 'DarkGrey', name: 'Membrane Interaction'},
TM: {fill: 'DarkGrey', name: 'Transmembrane Helix'},
EC: {fill: 'Orange', name: 'Extracellular'},
RH: {fill: 'Green', name: 'Re-entrant Helix'},
CY: {fill: 'White', name: 'Cytoplasmic'},
S: {fill: 'Pink', name: 'Signal Peptide'},
MB: {fill: 'FireBrick', name: 'Metal Binding'},
};

const annotations = [
//{name: 'lesk', values: ['res']},
//{name: 'clustal', values: ['res']},
{name: 'custom', values: ["ss", "disopred", "dompred", "dmpmetal"], label: 'psipred'},
{name: 'custom', values: ["memsat"], label: 'memsat'},
{name: 'aatypes', values: ['res']},
];

//
// Takes an array of data objects. MUST contain res
// Take data in this format
// [
//   {res: 'A', }
//   {res: 'T', }
// ]
//
// cellseries: the labels for each cell (and there will be a many cells as rows)
// xdimension: the number of cells per row
//
export function biod3_annotationGrid(data, opts={})
{
  let psipred_opts = {id: "annotationGrid", chartType: 'annotationGrid', annotation_sets: annotations, download_buttons: true, grid_label: true, grid_colour_type: "custom", grid_colour_annotations: ["ss", "disopred", "dompred", 'dmpmetal', 'memsat'], custom_grid_palette: custom };
  psipred_opts = Object.assign(psipred_opts, opts);
  biod3_genericGrid(data, 'res', 50, "annotationGrid", psipred_opts);
}

export function biod3_heatmap(data, cellseries, xdimension, colour_values, opts={})
{
  let heatmap_opts = {chartType: 'grid', grid_label: false, grid_colour_type: "heatmap", grid_colour_annotations: [colour_values] };
  heatmap_opts = Object.assign(heatmap_opts, opts);
  biod3_genericGrid(data, cellseries, xdimension, "heatmapChart", heatmap_opts);
}

// We make use of:
// https://www.npmjs.com/package/d3.layout.grid
//
// Take data in this format
// [
//   {ss: 'A', }
//   {ss: 'T', }
// ]
//
// cellseries: the labels for each cell (and there will be a many cells as rows)
// xdimension: the number of cells per row
export function biod3_genericGrid(data, cellseries, xdimension, label="seqAnnotationChart", opts={})
{
  opts = Object.assign(opts, {});
  const chart = chartFactory(opts);

  const cell_number = data.length;
  const ydimension = Math.ceil(cell_number/xdimension);
  const scales = setScale(chart, [1,xdimension], [1, ydimension], ydimension*(chart.em_size+3), xdimension, ydimension, cell_number);
  if(opts.debug === true)
  {
    printDebug(chart);
  }
  drawAxis(chart, 'axes', scales.x, scales.y, scales.x_top, scales.y_right, ydimension*(chart.em_size+3));
  update(chart, data, scales, xdimension);
  if(chart.key_panel)
  {
    drawLegend(chart);
  }
  if(chart.download_buttons)
  {
    button_helper(chart, label, "png", 0);
    button_helper(chart, label, "svg", chart.em_size*5);
    save_handler(chart, label);
  }
  if(chart.annotation_sets)
  {
    add_annotation_toggle(chart, data, scales, xdimension);
  }
}

function add_annotation_toggle(chart, data, scales, xdimension)
{
    const updateAnnotations = function(d){chart.grid_colour_type=d.name;
                              chart.grid_colour_annotations=d.values;
                              chart.container.selectAll(".rect").remove();
                              chart.container.selectAll(".text").remove();
                              update(chart, data, scales, xdimension);
                              chart.key.selectAll(".rect").remove();
                              chart.key.selectAll("text").remove();
                              drawLegend(chart);};
    let key = chart.annotationToggle.selectAll(".rect")
               .data(chart.annotation_sets);
    const button = function(d){return(d.name+"button");};
    const labelText = function(d){if(d.label){return d.label;}else{return d.name;}};

    key.enter().append("rect")
   .attr('x', chart.em_size*4)
   .attr('id', function(d){return labelText(d)+"button";} )
   .attr('width', function(d){let label_str = '';if(d.label){label_str="Show "+d.label;}else{label_str="Show "+d.name;}return (label_str.length*chart.em_size)/1.8;})
   .attr('height', chart.em_size*1.5)
   .attr("transform", function(d, i){return "translate("+[i*chart.em_size*10, 0]+")";})
   .attr('class', function(d){return labelText(d)+"button";} )
   .on('mouseover', function(d){
      d3.select('#'+labelText(d)+'button')
        .attr('fill', '')
        .classed('active', true);
      d3.select('#'+labelText(d)+'Text')
        .attr('fill', '')
        .classed('active', true);})
    .on('mouseout', function(d){
      d3.select('#'+labelText(d)+'button')
        .classed('active', false);
      d3.select('#'+labelText(d)+'Text')
        .classed('active', false);})
    .on('click', updateAnnotations);
  let text = chart.annotationToggle.selectAll(".text")
               .data(chart.annotation_sets);
  text.enter().append("text")
    .attr('id', function(d){return labelText(d)+"Text";})
    .attr('class', 'buttonText')
    .attr("x", 10+(chart.em_size*4))
    .attr("y", chart.em_size*0.8)
    .attr("dy", ".35em")
    .attr("transform", function(d, i){return "translate("+[i*chart.em_size*10, 0]+")";})
    .text(function(d){return "Show "+labelText(d);})
    .on('mouseover', function(d){
        d3.select('#'+labelText(d)+'button')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#'+labelText(d)+'Text')
          .attr('fill', '')
          .classed('active', true);})
    .on('mouseout', function(d){
        d3.select('#'+labelText(d)+'button')
          .classed('active', false);
        d3.select('#'+labelText(d)+'Text')
          .classed('active', false);})
    .on('click', updateAnnotations);
}

function drawLegend(chart)
{
  let palette;
  if(chart.grid_colour_type === 'lesk')
  {
    palette = cb.lesk_annotations;
  }
  if(chart.grid_colour_type === 'aatypes')
  {
    palette = cb.aatypes_annotations;
  }
  if(chart.grid_colour_type === 'clustal')
  {
    palette = cb.clustal_annotations;
  }
  if(chart.grid_colour_type === 'taylor')
  {
    palette = cb.taylor_annotations;
  }
  if(chart.custom_grid_palette && chart.grid_colour_type === 'custom')
  {
    palette = chart.custom_grid_palette;
  }
    let label_counter = 0;
    let y_pos = 0;
    let key = chart.key.selectAll(".rect")
      .data(Object.keys(palette));
    key.enter().append("rect")
      .attr("class", "rect")
      .attr("width", chart.em_size)
      .attr("height", chart.em_size)
      .attr("transform", function(d, i){
            if(label_counter == 4)
            {
              label_counter = 0;
              y_pos += 1;
            }
            let out_array = [(label_counter*11*chart.em_size)+chart.margin.left, y_pos*chart.em_size*1.4];
            label_counter+=1;
            return "translate("+out_array+")";})
      .attr("stroke", function(d){const colour="white"; if(palette[d].stroke){return palette[d].stroke;} return colour;})
      .attr("fill", function(d){const colour="white"; if(palette[d].fill){return palette[d].fill;} return colour;});
    label_counter = 0;
    y_pos = 0;
    let text = chart.key.selectAll(".text")
        .data(Object.keys(palette));
    text.enter().append("text")
      .attr("transform", function(d, i){
            if(label_counter == 4)
            {
              label_counter = 0;
              y_pos += 1;
            }
            let out_array = [(label_counter*11*chart.em_size)+chart.margin.left+(chart.em_size*1.2), (y_pos*chart.em_size*1.4)+chart.em_size/1.5];
            label_counter+=1;
          return "translate("+out_array+")";})
      .text( function (d) { return palette[d].name; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "black");
}

function update(chart, data, scales, xdimension) {
  let y_pos = 0;
  let cell_count = 0;

  let heatmapColour = d3.scaleLinear()
  .domain(d3.range(0, 1, 1.0 / (cb.colorbrewer.RdYlGn[11].length - 1)))
  .range(cb.colorbrewer.RdYlGn[11]);
  let c = d3.scaleLinear().domain(d3.extent(innerArrayValues(data, chart.grid_colour_annotations))).range([0,1]);

  let rollOverText = function(d, i) { let annotation_str = "Pos: "+(i+1)+"\n";
                          if(chart.grid_colour_type && chart.grid_colour_annotations)
                          {
                            if(chart.grid_colour_type === "heatmap")
                            {
                              annotation_str += d[chart.grid_colour_annotations[0]];
                            }
                            if(chart.grid_colour_type === "lesk" || chart.grid_colour_type === "aatypes" ||
                               chart.grid_colour_type === "clustal" || chart.grid_colour_type === "taylor" ||
                               chart.grid_colour_type === "secondary_structure" || chart.grid_colour_type === "transmembrane")
                            {
                              annotation_str+=d[chart.grid_colour_annotations];
                            }
                            if( chart.grid_colour_type === "custom")
                            {
                              chart.grid_colour_annotations.forEach(function(value, i) {
                                if(chart.custom_grid_palette[d[value]]){
                                  annotation_str += value+": "+d[value]+"\n";
                                }
                              });
                            }
                            return(annotation_str);
                          }};
  let colourIn = function(d, type) {
                                let colour = "white";
                                if(chart.grid_colour_type && chart.grid_colour_annotations)
                                {
                                  if(chart.grid_colour_type === "heatmap")
                                  {
                                      return heatmapColour(c(d[chart.grid_colour_annotations[0]]));
                                  }
                                  if(chart.grid_colour_type === "lesk" || chart.grid_colour_type === "aatypes" ||
                                     chart.grid_colour_type === "clustal" || chart.grid_colour_type === "taylor" ||
                                     chart.grid_colour_type === "secondary_structure" || chart.grid_colour_type === "transmembrane")
                                  {
                                      if(cb[chart.grid_colour_type].hasOwnProperty(d[chart.grid_colour_annotations[0]]) )
                                      {
                                        if(cb[chart.grid_colour_type][d[chart.grid_colour_annotations[0]]].hasOwnProperty(type))
                                        {
                                           colour = cb[chart.grid_colour_type][d[chart.grid_colour_annotations[0]]][type];
                                        }
                                      }
                                  }
                                  if( chart.grid_colour_type === "custom")
                                  {
                                    chart.grid_colour_annotations.forEach(function(value, i) {
                                      if(chart.custom_grid_palette[d[value]])
                                      {
                                        if(chart.custom_grid_palette[d[value]].hasOwnProperty(type))
                                        {
                                          colour = chart.custom_grid_palette[d[value]][type];
                                        }
                                      }
                                    });
                                  }
                                }
                                return(colour); };

  let rect = chart.container.selectAll(".rect")
    .data(data);
  rect.enter().append("rect")
    .attr("class", "rect")
    .attr("width", chart.em_size*1.1)
    .attr("height", chart.em_size*1.1)
    .attr("transform", function(d) { if(cell_count == xdimension)
                                     {
                                        cell_count = 0;
                                        y_pos+=chart.em_size*1.2;
                                     }
                                     cell_count+=1;
        return "translate(" +[scales.x(cell_count), y_pos]+ ")"; })
    .attr("fill", function(d) { return(colourIn(d, "fill"));})
    .attr("stroke", function(d) { return(colourIn(d, "stroke")); })
    .append("svg:title").text(rollOverText);
  // here we should test what kind of grid colour we have.
    // heatmap
    // ss
    // custoom
  rect.exit().transition()
    .remove();
  if(chart.grid_label)
  {
      y_pos = chart.em_size*0.8;
      cell_count = 0;
      var text = chart.container.selectAll(".text")
        .data(data);
      text.enter().append("text")
        .attr("transform", function(d) {
                                         if(cell_count == xdimension)
                                         {
                                            cell_count = 0;
                                            y_pos+=chart.em_size*1.2;
                                         }
                                         cell_count+=1;
            return "translate(" +[scales.x(cell_count)+5, y_pos]+ ")"; })
        .text( function (d) { return d.res; })
        .attr("font-family", "sans-serif")
        .attr("font-size", chart.em_size*0.66)
        .attr("font-weight", "bold")
        .attr("fill", "black")
    .append("svg:title").text(rollOverText);
      text.exit().transition()
        .remove();
  }
}

function drawAxis(chart, layer, x, y, xT, yR, y_height)
{
  const xAxis = d3.axisBottom().scale(x).tickValues(x.domain().filter(function(d,i){ return !((i+1)%10);}));
  const xTAxis = d3.axisTop().scale(xT).tickValues(x.domain().filter(function(d,i){ return !((i+1)%10);}));
  const yAxis = d3.axisLeft().scale(y);
  const yRAxis = d3.axisRight().scale(yR);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(yAxis)
  .select(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[(chart.container_width-chart.margin.right), chart.margin.top]+')')
  .call(yRAxis)
  .selectAll(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, y_height+chart.margin.top]+')')
  .call(xAxis)
  .selectAll(".domain").remove();

  let tx = chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(xTAxis);
  if(chart.x_labels)
  {
    tx.selectAll("text")
    .attr("y", 0)
    .attr("x", chart.em_size/2)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-60)")
    .style("text-anchor", "start");
  }
  tx.selectAll(".domain").remove();
  chart[layer].selectAll("line").remove();
}

function setScale(chart, xVals, yVals, yExtent, xdimension, ydimension, cell_number){
  const x = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));

  let y_range = returnRange(yVals[0], yVals[1]);
  y_range.forEach(function(value, i) { if(value == 1) {y_range[i] = 1;}
                                       else {y_range[i] = ((value-1)*xdimension)+1; }
  });
  const y = d3.scaleBand().range([0, yExtent])
    .domain(y_range);

  let x_top = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));
  if(chart.x_labels)
  {
    let xlabels = [];
    if(chart.x_labels.length < xdimension)
    {
      let label_count = -1;
      for(let i = 0; i <= xdimension; i+=1)
      {
        if(i % chart.x_labels.length === 0){label_count+=1;}
        xlabels.push(chart.x_labels[i % chart.x_labels.length]+"_"+label_count);
      }
    }
    else
    {
      xlabels = chart.x_labels;
    }
    x_top = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(xlabels.slice(0, xdimension));
  }

  let y_range_right = returnRange(yVals[0], yVals[1]);
  y_range_right.forEach(function(value, i) { y_range_right[i]=value*xdimension;
                                             if(i === y_range_right.length-1)
                                             { y_range_right[i]=cell_number;}
  });
  let y_right = d3.scaleBand().range([0, yExtent])
    .domain(y_range_right);
  if(chart.y_labels)
  {
    let ylabels = [];
    if(chart.y_labels.length < ydimension)
    {
      let label_count = -1;
      for(let i = 0; i <= ydimension; i+=1)
      {
        if(i % chart.y_labels.length === 0){label_count+=1;}
        ylabels.push(chart.y_labels[i % chart.y_labels.length]+"_"+label_count);
      }
    }
    else
    {
      ylabels = chart.y_labels;
    }
    y_right = d3.scaleBand().range([0, yExtent])
    .domain(ylabels.slice(0, ydimension));
  }
  return {x, y, x_top, y_right};
}
