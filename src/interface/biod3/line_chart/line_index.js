import * as d3 from 'd3';
import 'd3-transition';
import {event as currentEvent} from 'd3-selection'; //re-import this due to d3-transition clash
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';
import { keysrt } from '../common/index';
const FileSaver = require('/home/dbuchan/Code/biod3/node_modules/file-saver');
//const FileSaver = require('/Users/dbuchan/Code/biod3/node_modules/file-saver');

//takes the contents of an ss or ss2 file formatted as
//convenience function that expects an SS files data and calls genericxyLineChart
//with the relevant args pre-configured.
// [
//  {pos: 1, res: 'P', ss: 'E', coil: 0.997, helix: 0.000, strand: 0.002},
//  {pos: 2, res: 'K', ss: 'E', coil: 0.887, helix: 0.005, strand: 0.003},
//  ...
// ]
export function biod3_psipredxyLineChart(data)
{
  biod3_genericxyLineChart(data, 'pos', ['coil','helix', 'strand'],
                           ['DimGrey', 'HotPink', 'Gold'], 'psipred_nn_chart', {
                           assignment_ribbon: true, assignment_label: 'ss',
                           download_buttons: true, y_axis_label: "NN Output",
                           x_axis_label: 'Residue Position',
                           ribbon_label: 'Annotation',});
}

// data is a csv parsed in to an array such that each entry is an object with
// the fields such as:
// [
//  {pos: 1, res: 'P', ss: 'E', coil: 0.997, helix: 0.000, strand: 0.002},
//  {pos: 2, res: 'K', ss: 'E', coil: 0.887, helix: 0.005, strand: 0.003},
//  ...
// ]
// xseries is a string which names an entry in the data that will be used as
// the x values (i.e. 'pos'), and must be numeric data
// yseries is an array containing the names of the columns with y values to
// be plotted (i.e. ['coil, 'helix', 'strand'])
// lineColours : an array of valid css colours  ['DimGrey', 'HotPink', 'Gold']
// opts: an object to override the chartFactory defaults
export function biod3_genericxyLineChart(data, xseries, yseries, lineColours, label='xyLineChart', opts={})
{
  opts = Object.assign(opts, {chartType: 'line'});
  const chart = chartFactory(opts);
  //set up X scale and values
  const xVals = data.reduce(function (arr, val) { return arr.concat(Number(val[xseries])); }, []);
  const xFunc = function (d) {return scales.x(d[xseries]);};
  //build array of all possible y values
  let yVals = [];
  yseries.forEach( function (value) {
    yVals = yVals.concat(data.reduce(function (arr, val) { return arr.concat(Number(val[value])); }, []));
  });

  // build the scales and axis
  const scales = setScale(chart, xVals, yVals, chart.height - chart.margin.bottom * 2);
  drawAxis(chart, 'axes', scales.x, scales.y);

  const yFuncs = {};
  yseries.forEach (function (value) {
    yFuncs[value] = function (d) {return scales.y(d[value]);};
  });
  drawxyChart(chart, data, xFunc, yFuncs, scales, xseries);
  if(chart.key_panel)
  {
    drawLegend(chart, yseries, lineColours);
  }
  if(chart.download_buttons)
  {
    button_helper(chart, label, "png", 0);
    button_helper(chart, label, "svg", chart.em_size*5);
    save_handler(chart, label);
  }
  if(chart.assignment_ribbon)
  {
    draw_assignment_ribbon(data, chart, xVals, scales);
  }
  if(chart.x_cutoff)
  {
    add_cutoff_line(chart, scales, chart.x_cutoff, "x");
  }
  if(chart.y_cutoff)
  {
    add_cutoff_line(chart, scales, chart.y_cutoff, "y");
  }
}

function draw_assignment_ribbon(data, chart, xVals, scales)
{
  //basically here we build a whole new line chart where the
  //lines are discontinuous based on the annotation string
  //which is a string label column in the source data. ''
  //and we ommit the axes!
  // we draw x many of these given the labels
  // https://bl.ocks.org/mbostock/3035090
  //console.log("assignment label:"+chart.assignment_label);

  const sets = data.reduce(function (subsets, val) {
                  const key_str = val[chart.assignment_label];
                  let this_arr = subsets[key_str] || [];
                  subsets[key_str] = this_arr.concat({x: Number(val.pos),  y: 1});
                  return subsets;
                }, []);
  //fill in null vals
  const label_keys = Object.keys(sets);
  label_keys.forEach(function (val) {
    let xVal_copy = xVals.slice(0);
    sets[val].forEach(function ( entry_obj ){
      xVal_copy = xVal_copy.filter(function(e) { return e !== entry_obj.x; });
    });
    xVal_copy.forEach(function (xVal) {
      let this_arr = sets[val] || [];
      sets[val] = this_arr.concat({x: Number(xVal),  y: null});
    });
    sets[val] = keysrt(sets[val], 'x');
  });
  const ribbon_scales = setScale(chart, xVals, [1], chart.margin.top/4);
  //drawAxis(chart, 'ribbon', ribbon_scales.x, ribbon_scales.y);
  Object.keys(sets).forEach(function (key) {
    // plot these as discontinuous lines
    // scale func
    let Gen = d3.line()
        .defined(function(d) { return d.y; })
        .x(function (d) {return scales.x(d.x);} )
        .y(function (d) {return ribbon_scales.y(d.y); })
        .curve(d3.curveLinear);
    let Line = chart.ribbon.selectAll("."+key+"line")
      .data([sets[key]]);
    Line.enter().append("path").classed(key, true)
        .merge(Line)
        .attr("d", Gen)
        .attr("fill", "none");
  });

  if(chart.ribbon_label)
  {
     chart.ribbon.append("text")
      .attr("transform",
            "translate("+chart.margin.left/2+", 10)")
      .style("text-anchor", "middle")
      .text(chart.ribbon_label);
  }
}

function add_cutoff_line(chart, scales, value, axis)
{
  let alt_axis = "x";
  let idx = 1;
  let label = chart.y_cutoff_text;
  let x_adjust = 5;
  if(axis === "x")
  {
    alt_axis = "y";
    idx = 0;
    label = chart.x_cutoff_text;
    x_adjust = -3;
  }
  // console.log(axis);
  // console.log(alt_axis);
  const cutoff = chart.container.append("line")
                      .classed("cutoff_line", true)
                      .attr(alt_axis+"1", 0)
                      .attr(axis+"1", scales[axis](value))
                      .attr(alt_axis+"2", scales[alt_axis].range()[idx])
                      .attr(axis+"2", scales[axis](value));
  const cutoff_label = chart.container.append("text")
                            .attr('class', 'cutoffText')
                            .attr(alt_axis, 5)
                            .attr(axis, (scales[axis](value) - x_adjust))
                            .attr("dy", ".1em")
                            .text(label+": "+value.toString());
}

function drawLegend(chart, yseries, lineColours)
{
  //build scale
  var ordinal = d3.scaleOrdinal()
    .domain(yseries)
    .range(lineColours);

  var legendOrdinal = legend.legendColor()
     .shape("path", d3.symbol().type(d3.symbolSquare).size(chart.em_size*10)())
     .shapePadding(10)
     //.cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

  chart.key.append("g")
   .attr('class', 'legendOrdinal')
   .call(legendOrdinal);

}

function drawxyChart(chart, data, xFunc, yFuncs, scales, xseries)
{

  Object.keys(yFuncs).forEach(function (key) {
    let obj = yFuncs[key];
    let Gen = d3.line()
      .x(xFunc)
      .y(obj)
      .curve(d3.curveMonotoneX);
    let Line = chart.container.selectAll("."+key+"line")
      .data([data]);
    Line.enter().append("path").classed(key, true)
      .merge(Line)
      .attr("d", Gen)
      .attr("fill", "none");

//function (d) {return scales.x(d[xseries]);};
  chart.container.selectAll(".dot")
     .data(data)
   .enter().append("circle").classed(key, true)
     .attr("r", 1.5)
     .attr("cx", xFunc)
     .attr("cy", obj)
     .attr("fill", "black")
     .append("svg:title").text(function(d, i){return xseries+": "+d[xseries]+"\nval: "+d[key]+"\ntype: "+d[chart.assignment_label]; });
  });
}

function setScale(chart, xVals, yVals, yExtent)
{
//const xVals = data.reduce(function (arr, val) { return arr.concat(val.pos); }, []);

  const x = d3.scaleLinear().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(d3.extent(xVals));
  const y = d3.scaleLinear().range([yExtent, 0])
    .domain(d3.extent(yVals));
  return {x, y};
}

function drawAxis(chart, layer, x, y)
{
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  chart[layer].append('g')
    .attr('class', 'axis y')
    .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
    .call(yAxis);
  if(chart.y_axis_label)
  {
     chart.container.append("text")
      // .attr("transform", "translate(" + (chart.width/2) + " ," +
      //                      (chart.height + chart.margin.top + 20) + ")")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (chart.margin.left/2))
      .attr("x",0 - (chart.container_height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(chart.y_axis_label);
  }

  console.log(chart.container_height-100);
  chart[layer].append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate('+[chart.margin.left, chart.height-chart.margin.bottom]+')')
    .call(xAxis);
  if(chart.x_axis_label)
  {
     chart.container.append("text")
      .attr("transform",
            "translate(" + (chart.container_width/2) + " ," +
                           (chart.height-chart.margin.bottom-chart.em_size*3)+ ")")
      .style("text-anchor", "middle")
      .text(chart.x_axis_label);
  }

}
