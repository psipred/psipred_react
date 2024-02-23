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
const cb = require('../common/palette.js');
const FileSaver = require('/home/dbuchan/Code/biod3/node_modules/file-saver');

export function biod3_psipred(data, label="psipredChart", opts={})
{
  const xdimension = 50;
  //console.log(data);
  const data_array = parseHFormat(data);
  const sets = Math.ceil(data_array.length/50);
  opts = Object.assign(opts, {key_panel: false, download_buttons: true, id: label});
  const chart = chartFactory(opts);
  chart.height = (7*chart.em_size)*(sets+1);
  chart.container_height = chart.height;
  chart.width = chart.em_size*xdimension;
  chart.container_width = chart.em_size*xdimension;
  chart.chartType = 'psipred';
  //here we'll have a loop where we take slices of the array and
  //create a new axis and new
  let key_position = 0;
  for(let i=0; i<sets; i+=1)
  {
    let x_start = 1 + i*xdimension;
    let x_stop = xdimension + i*xdimension;
    let y_location =  0 + i*(10*chart.em_size);
    let x_location = (7*chart.em_size) + i*(10*chart.em_size);

    let scales = setScale(chart, x_start, x_stop, (7*chart.em_size));
    drawAxis(chart, 'axes', scales.x, scales.y, x_location, y_location);
    let slice = data_array.slice(x_start-1,x_stop);
    key_position = drawDiagram(chart, slice, x_location, y_location, x_start);
  }
  drawKey(chart, data_array, key_position+2*chart.em_size, label);
}

function drawKey(chart, data_array, key_position, label)
{
  let key = chart.container;
  key_position+=chart.em_size;
  if(chart.download_buttons)
  {
    //button_helper(chart, label, "png", 0, "buttons", chart.container_width*0.8, key_position);
    //button_helper(chart, label, "svg", chart.em_size*5, "buttons", chart.container_width*0.8, key_position);
    button_helper(chart, label, "png", 0, "buttons", 0, 3);
    button_helper(chart, label, "svg", chart.em_size*5, "buttons", 0, 3);

    save_handler(chart, label);
  }
  key.append("text")
    .attr("transform", function(d, i){return "translate("+[0, key_position]+")";})
    .text( "Legend:")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill", "black");
  key_position+=chart.em_size;
  addSSElement(chart, key, key_position, "Strand", "Gold");
  addTextElement(chart, key, key_position, "Conf:", "-");
  addConfElements(chart, key, key_position);
  key.append("text")
    .attr("transform", function(d, i){return "translate("+[chart.em_size*17.5, key_position+chart.em_size*0.8]+")";})
    .text( "+ Confidence of prediction")
    .attr("font-family", "sans-serif")
    .attr("fill", "black");
  key_position+=chart.em_size;
  addSSElement(chart, key, key_position, "Helix", "HotPink");
  addTextElement(chart, key, key_position, "Cart:", "3-state assignment cartoon");
  key_position+=chart.em_size;
  addSSElement(chart, key, key_position, "Coil", "DimGrey");
  addTextElement(chart, key, key_position, "Pred:", "3-state prediction");
  key_position+=chart.em_size;
  addTextElement(chart, key, key_position, "AA:", "Target Sequence");
}

function addConfElements(chart, key, key_position)
{
  let bar_size = 9;
  let x_offset_adjust = 0;
  for(let j =0; j<9; j+=1 )
  {
    key.append("rect")
    .attr("class", "rect")
    .attr("width", chart.em_size/2)
    .attr("height", chart.em_size*(j/10))
    .attr("transform", function(d, i){
            let y_offset = chart.em_size-(chart.em_size*(j/10));
            return "translate("+[chart.em_size*13+(chart.em_size*x_offset_adjust), key_position+y_offset]+")";} )
    .attr("stroke",  "black")
    .attr("fill", cb.colorbrewer.PuBu[9][j]);
    bar_size-=1;
    x_offset_adjust+=0.5;
  }
}

function addTextElement(chart, key, key_position, title, desc)
{
  key.append("text")
    .attr("transform", function(d, i){return "translate("+[chart.em_size*10, key_position+chart.em_size*0.8]+")";})
    .text( title)
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("font-weight", "bold");
  key.append("text")
    .attr("transform", function(d, i){return "translate("+[chart.em_size*13, key_position+chart.em_size*0.8]+")";})
    .text( desc)
    .attr("font-family", "sans-serif")
    .attr("fill", "black");
}

function addSSElement(chart, key, key_position, label, colour)
{
  key.append("rect")
    .attr("class", "rect")
    .attr("width", chart.em_size)
    .attr("height", function(d){if(label === "Coil"){return chart.em_size/4;}else{return chart.em_size;}})
    .attr("transform", function(d, i){let y_offset = 0;
                          if(label === 'Coil'){y_offset+=chart.em_size/2;}return "translate("+[0, key_position+y_offset]+")";})
    .attr("stroke", "White")
    .attr("fill", colour);
  key.append("text")
    .attr("transform", function(d, i){return "translate("+[chart.em_size*1.5, key_position+chart.em_size*0.8]+")";})
    .text( label)
    .attr("font-family", "sans-serif")
    .attr("fill", "black");
}

function drawDiagram(chart, data_array, x_location, y_location, x_start)
{
  let y_pos = 0;
  let cell_count = 0;
  let heatmapColour = d3.scaleLinear()
  .domain(d3.range(0, 1, 1.0 / (cb.colorbrewer.PuBu[9].length - 1)))
  .range(cb.colorbrewer.PuBu[9]);
  let c = d3.scaleLinear().domain(d3.extent(innerArrayValues(data_array, "conf"))).range([0,1]);
  let confRect = chart.container.selectAll("g")
    .data(data_array);
  confRect.enter().append("rect")
    .attr("class", "rect")
    .attr("width", chart.em_size)
    .attr("height", function(d){ return chart.em_size*((d.conf+1)/10);})
    .attr("transform", function(d, i) {
                          let y_offset = chart.em_size-(chart.em_size*((d.conf+1)/10));
                          return "translate(" +[i*chart.em_size, y_location+y_offset]+ ")"; })
    .attr("fill", function(d) {return heatmapColour(c(d.conf));})
    .attr("stroke", "black")
    .append("svg:title").text(function (d){return d.conf;});
  y_location += chart.em_size*2;
  let cartoonRect = chart.container.selectAll("g")
      .data(data_array);
  cartoonRect.enter().append("rect")
    .attr("class", "rect")
    .attr("width", chart.em_size)
    .attr("height", function(d) {if(d.pred === 'C'){return chart.em_size/4;}else{return chart.em_size;}})
    .attr("transform", function(d, i) {
                          let y_offset = 0;
                          if(d.pred === 'C'){y_offset+=chart.em_size/3;}
                          return "translate(" +[i*chart.em_size, y_location+y_offset]+ ")"; })
    .attr("fill", function(d) {if(d.pred === 'C'){return 'DimGrey';}
                               if(d.pred === 'E'){return 'Gold';}
                               if(d.pred === 'H'){return 'HotPink';}
    })
    .attr("stroke", function(d) {if(d.pred === 'C'){return 'DimGrey';}
                               if(d.pred === 'E'){return 'Gold';}
                               if(d.pred === 'H'){return 'HotPink';}
    })
    .append("svg:title").text(function (d){return d.pred;});

  y_location += chart.em_size*2;
  let predText = chart.container.selectAll("g")
      .data(data_array);
  predText.enter().append("text")
    .attr("transform", function(d, i) {
                          return "translate(" +[i*chart.em_size, y_location+(chart.em_size/2)]+ ")"; })
    .text( function (d) { return d.pred; })
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .append("svg:title").text(function (d, i){return i+x_start;});

  y_location += chart.em_size*2;
  let aaText = chart.container.selectAll("g")
      .data(data_array);
  aaText.enter().append("text")
    .attr("transform", function(d, i) {
                          return "translate(" +[i*chart.em_size, y_location+(chart.em_size/3)]+ ")"; })
    .text( function (d) { return d.aa; })
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .append("svg:title").text(function (d, i){return i+x_start;});
  return y_location;
}

function setScale(chart, xstart, xstop, ysize)
{
  let x = d3.scaleBand().range([0, chart.container_width])
    .domain(returnRange(xstart, xstop));

  let y = d3.scaleBand().range([0, ysize])
    .domain(['Conf', 'Cart', 'Pred', 'AA']);
  return {x, y};
}

function drawAxis(chart, layer, x, y, xlocation, ylocation)
{
  const xAxis = d3.axisBottom().scale(x).tickValues(x.domain().filter(function(d,i){ return !((i+1)%10);}));
  const yAxis = d3.axisLeft().scale(y);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, ylocation+chart.margin.top]+')')
  .call(yAxis)
  .select(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, xlocation+chart.margin.top]+')')
  .call(xAxis)
  .selectAll(".domain").remove();
  chart[layer].selectAll("line").remove();
}


function parseHFormat(data)
{
  let parsed = [];
  const lines = data.split("\n");
  let conf = '';
  let pred = '';
  let aa = '';
  lines.forEach(function(line, i){
    conf += stripLine(line, "Conf: ");
    pred += stripLine(line, "Pred: ");
    aa += stripLine(line, "  AA: ");
  });
  aa.split("").forEach(function(char, i){
    parsed.push({aa: aa[i], pred: pred[i], conf: Number(conf[i])});
  });
  return(parsed);
}
function stripLine(line, leader)
{
  if(line.startsWith(leader))
  {
    let re = new RegExp("^"+leader);
    return(line.replace(re, ""));
  }
  else {
    return '';
  }
}
