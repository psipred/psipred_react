import '../index.css';
import { biod3_psipredxyLineChart } from './line_chart/line_index.js';
import { biod3_genericxyLineChart } from './line_chart/line_index.js';
import { biod3_genericGrid } from './grid/grid_index.js';
import { biod3_heatmap } from './grid/grid_index.js';
import { biod3_annotationGrid } from './grid/grid_index.js';
import { biod3_psipred } from './psipred_chart/psipred_index.js';
import { biod3_clearSelection } from './common/index.js';

// d3.queue()
//   .defer(d3.csv, '../test_data/ginormous_sequence.ss')
//   .await(drawChart);

// d3.queue()
//   .defer(d3.text, '../test_data/example.horiz')
//   .await(drawChart);

const custom = { // eslint-disable-line no-unused-vars
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
};

const annotations = [ // eslint-disable-line no-unused-vars
{name: 'lesk', values: ['res']},
{name: 'clustal', values: ['res']},
{name: 'aatypes', values: ['res']},
{name: 'custom', values: ["ss", "disopred", "dompred"], label: 'psipred'},
{name: 'custom', values: ["memsat"], label: 'memsat'},
];

function drawChart(error, exampleSS){ // eslint-disable-line no-unused-vars
  //biod3_psipredxyLineChart(exampleSS);
  //biod3_genericxyLineChart(exampleSS, 'pos', ['coil','helix'], ['DimGrey', 'HotPink', 'Gold'], 'yoChart', {chartType: 'line', x_cutoff: 20, y_cutoff: 0.3});
  //console.log(exampleSS);
  //biod3_genericGrid(exampleSS, 'ss', 50, "psipredChart", {chartType: 'grid', annotation_sets: annotations, download_buttons: true, grid_label: true, grid_colour_type: "custom", grid_colour_annotations: ["ss", "disopred", "dompred"], custom_grid_palette: custom });
  //biod3_heatmap(exampleSS, 'ss', 70, 'coil', {x_labels: ['a', 'b',]} );
  // biod3_psipred(exampleSS, 'psipredChart', {parent: 'div.results_container'});
  //biod3_annotationGrid(exampleSS);
}

//Export the functions for use as a module
export const psipred = biod3_psipred;
export const psipredxyLineChart = biod3_psipredxyLineChart;
export const genericxyLineChart = biod3_genericxyLineChart;
export const genericGrid = biod3_genericGrid ;
export const heatmap = biod3_heatmap;
export const annotationGrid = biod3_annotationGrid;
export const clearSelection = biod3_clearSelection;

export const __hotReload = true;
