import {select as d3Select } from 'd3-selection';
import * as d3 from 'd3';
require('/home/dbuchan/Code/biod3/node_modules/blueimp-canvas-to-blob');
//require('/Users/dbuchan/Code/biod3/node_modules/blueimp-canvas-to-blob');
const FileSaver = require('/home/dbuchan/Code/biod3/node_modules/file-saver');
//const FileSaver = require('/Users/dbuchan/Code/biod3/node_modules/file-saver');

const protoChart = {
  chartType: false, // can be one of 'line', 'grid'
  em_size: false,
  width: window.innerWidth,
  height: window.innerHeight,
  container_width: window.innerWidth,
  container_height: window.innerHeight,
  parent: 'body',
  key_panel: true,
  y_axis_label: false,
  x_axis_label: false,
  ribbon_label: false,
  y_cutoff: false,
  x_cutoff: false,
  x_cutoff_text: "Cutoff",
  y_cutoff_text: "Cutoff",
  assignment_ribbon: false,
  assignment_label: '',
  download_buttons: false,
  grid_label: false,
  grid_colour_type: false,
  grid_colour_annotations: false,
  x_grid_labels: false,
  y_grid_labels: false,
  y_labels: false,
  x_labels: false,
  custom_grid_palette: false,
  grid_key: false,
  annotation_sets: false,
  margin_scaler: 5,
  margin: {
    left: false,
    right:  false,
    top:  false,
    bottom:  false,
  },
};

export function biod3_clearSelection(parent)
{
    d3.select(parent).select("svg").remove();
}

//
// Builds a panel to put a chart in given the prototype Object
// Call With
// const chart = chartFactory()
// Override with
// const chart = chartFactory({margin: {top: 20, bottom: 20, right: 20, left: 20}})
//
export function chartFactory(opts, proto = protoChart) {

  const chart = Object.assign({}, proto, opts);
  // chart.tooltip = d3.select("body").append("div")
  //     .attr("class", "tooltip")
  //     .style("opacity", 0)
  //     .style("position", "absolute");
  chart.em_size = getEmPixels();
  chart.margin.left = chart.em_size*chart.margin_scaler;
  chart.margin.right = chart.em_size*chart.margin_scaler;
  chart.margin.top = chart.em_size*chart.margin_scaler;
  chart.margin.bottom = chart.em_size*chart.margin_scaler;

  //console.log(chart.id);
  d3.select(chart.parent).select("svg").remove();
  chart.svg = d3Select(chart.parent)
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width)
    .attr('height', chart.height);

  chart.svg
    .style("text-rendering", "optimizeLegibility")
    .style("shape-rendering", "default")
    .style("font-family", "sans-serif");

  if(chart.download_buttons)
  {
    chart.key_panel = true;
  }
  if(chart.key_panel)
  {
    if(chart.chartType === 'line')
    {
      chart.container_width = chart.container_width*0.9;
    }
    else {
        chart.container_height = chart.container_height - (chart.container_height * 0.2);
    }
  }
  if(chart.container_width < (chart.margin.left+chart.margin.right))
  {
    chart.container_width = chart.margin.left+chart.margin.right+chart.em_size;
  }
  if(chart.assignment_ribbon)
  {
    chart.container_height = chart.container_height - (chart.container_height * 0.1);
  }


  let top_translate = chart.margin.top;
  let axis_y_translate = 0;
  if(chart.annotation_sets)
  {
    top_translate = chart.em_size*5;
    axis_y_translate = chart.em_size*3;
  }
  let key_x_translate = 0;
  let key_y_translate = chart.container_height-chart.margin.bottom;
  if(chart.chartType === 'line');
  {
    key_x_translate = chart.width - chart.margin.right - (chart.em_size * 4);
    key_y_translate = chart.margin.top;
  }
  if(chart.chartType === 'annotationGrid')
  {
    key_x_translate = 0;
    key_y_translate = chart.container_height;
  }
  let buttons_x_translate = chart.container_width-(chart.em_size*10);
  let buttons_y_translate = chart.container_height-chart.margin.bottom;
  if(chart.chartType === 'line');
  {
    buttons_x_translate = chart.width - (10*chart.em_size);
    buttons_y_translate = chart.height-(10*chart.em_size);
  }
  if(chart.chartType === 'annotationGrid')
  {
    buttons_x_translate = chart.width-chart.margin.right-(chart.em_size*10);
    buttons_y_translate = chart.container_height;
  }
  chart.container = chart.svg.append('g')
    .attr('id', 'container')
    .attr('width', chart.container_width - chart.margin.left - chart.margin.right)
    .attr('height', chart.height - chart.margin.top - chart.margin.bottom )
    .attr('transform', 'translate('+[chart.margin.left, top_translate]+')');

  chart.axes = chart.svg.append('g')
    .attr('id', 'axes')
    .attr("width", chart.container_width - chart.margin.left - chart.margin.right)
    .attr("height", chart.height)
    .attr('transform', 'translate('+[0, axis_y_translate]+')');

  chart.key = chart.svg.append('g')
    .attr('id', 'key')
    .attr("width", (chart.width * 0.2) - chart.margin.left - chart.margin.right)
    .attr("height", chart.height)
    .attr('transform', 'translate('+[key_x_translate, key_y_translate]+')');

  chart.buttons = chart.svg.append('g')
    .attr('id', 'buttons')
    .attr("width", (chart.width * 0.2) - chart.margin.left - chart.margin.right)
    .attr("height", chart.height)
    .attr('transform', 'translate('+[buttons_x_translate, buttons_y_translate]+')');

  chart.ribbon = chart.svg.append('g')
    .attr('id', 'ribbon')
    .attr("width", chart.container_width - chart.margin.left - chart.margin.right)
    .attr("height", chart.margin.top)
    .attr('transform', 'translate('+[chart.margin.left, 0]+')');

  chart.annotationToggle = chart.svg.append('g')
    .attr('id', 'toggle')
    .attr("width", chart.container_width - chart.margin.left - chart.margin.right)
    .attr("height", chart.margin.top)
    .attr('transform', 'translate('+[chart.margin.left/2, top_translate/3]+')');

  return chart;
}

//
//
// HELPER FUNCTIONS FOR 2nd ORDER BEHAVIOURS (download buttons mostly)
//
//


/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function (document, documentElement) {
    // Enable strict mode
    "use strict";

    // Form the style on the fly to result in smaller minified file
    var important = "!important;";
    var style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

    window.getEmPixels = function (element) {

        var extraBody;

        if (!element) {
            // Emulate the documentElement to get rem value (documentElement does not work in IE6-7)
            element = extraBody = document.createElement("body");
            extraBody.style.cssText = "font-size:1em" + important;
            documentElement.insertBefore(extraBody, document.body);
        }

        // Create and style a test element
        var testElement = document.createElement("i");
        testElement.style.cssText = style;
        element.appendChild(testElement);

        // Get the client width of the test element
        var value = testElement.clientWidth;

        if (extraBody) {
            // Remove the extra body element
            documentElement.removeChild(extraBody);
        }
        else {
            // Remove the test element
            element.removeChild(testElement);
        }

        // Return the em value in pixels
        return value;
    };
}(document, document.documentElement));

export function printDebug(chart)
{
  console.log("parent: "+chart.parent);
  console.log("emsize: "+chart.em_size);
  console.log("width: "+chart.width);
  console.log("height: "+chart.height);
  console.log("container_width: "+chart.container_width);
  console.log("container_height: "+chart.container_height);
  console.log('margin scaler: '+chart.margin_scaler);
  console.log('margin.left: '+chart.margin.left);
  console.log('margin.right: '+chart.margin.right);
  console.log('margin.top: '+chart.margin.top);
  console.log('margin.bottom: '+chart.margin.bottom);

}

// Functions for converting an SVG canvas element to PNG as pre-configured
// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
//
export function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (let c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (let i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];

			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}


		return extractedCSSText;

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css");
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}


export function svgString2Image( svgString, width, height, format, callback ) {
	format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});


	};
	image.src = imgsrc;
}

// adpated from
// http://bl.ocks.org/wboykinm/e6e222d71e9b59e8b3053e0c4fe83daf
export function writeSVGDownloadLink(label){
    try {
        let isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported. Can't save file from the browser you are using");
    }
    console.log(label);
    let html = d3.select("#"+label)
        .attr("title", label)
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;
    // console.log(label);
    console.log(html);
    html = html.substring(html.indexOf("<svg")); // if there is any cruft before the leading <svg> we get rid of it
    html = html.replace(/<g id="toggle".+?<\/g>/, '');
    html = html.replace(/<g id="buttons".+?<\/g>/, '');
    let blob = new Blob([html], {type: "image/svg+xml"});
    FileSaver.saveAs(blob, label+".svg");
}

// assuming your chart has a chart.buttons this will add a pair of
// buttons to the page.
// type: string with the label name (svg or png), also used for css
// xoffset: how far to the right the SVG button should be
export function button_helper(chart, label, type, xoffset, layer="buttons", x_addition=0, y_addition=0)
{
  let x_pos = xoffset+x_addition;
  let y_pos = 0+y_addition;
  chart[layer].append("rect")
   .attr('x', x_pos)
   .attr('y', y_pos)
   .attr('id', label+type+'Button')
   .attr('width', chart.em_size*4.5)
   .attr('height', chart.em_size*2)
   .attr('class', type+'button')
   .on('mouseover', function(){
      d3.select('#'+label+type+'Button')
        .attr('fill', '')
        .classed('active', true);
      d3.select('#'+label+type+'Text')
        .attr('fill', '')
        .classed('active', true);})
    .on('mouseout', function(){
      d3.select('#'+label+type+'Button')
        .classed('active', false);
      d3.select('#'+label+type+'Text')
        .classed('active', false);
   });

  chart[layer].append("text")
    .attr('id', label+type+'Text')
    .attr('class', 'buttonText')
    .attr("x", chart.em_size/2+x_pos)
    .attr("y", chart.em_size+y_pos)
    .attr("dy", ".35em")
    .text("Get "+type.toUpperCase())
    .on('mouseover', function(){
        d3.select('#'+label+type+'Button')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#'+label+type+'Text')
          .attr('fill', '')
          .classed('active', true);})
    .on('mouseout', function(){
        d3.select('#'+label+type+'Button')
          .classed('active', false);
        d3.select('#'+label+type+'Text')
          .classed('active', false);
    });
 }

// takes a chart and a string for the file name and handles the user interaction
// to return a file
// Some parts of this function adapted from
// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
export function save_handler(chart, label)
{
    save_helper(chart, 'Button', label);
    save_helper(chart, 'Text', label);
}
function save_helper(chart, type, label)
{
  console.log(label);
  d3.select('#'+label+'png'+type).on('click', function(){
    var svgString = getSVGString(chart.svg.node());
    // remove toggle and buttons
    // <g id="toggle"></g>
    // <g id="buttons"></g>
    console.log(svgString);
    svgString = svgString.replace(/<g id="toggle".+?<\/g>/, '');
    svgString = svgString.replace(/<g id="buttons".+?<\/g>/, '');
    svgString2Image( svgString, 2*chart.width, 2*chart.height, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
      FileSaver.saveAs( dataBlob, label+".png" ); // FileSaver.js function
    }
  });
  d3.select('#'+label+'svg'+type)
    .on("click", function() { writeSVGDownloadLink(label); } );
}

// sort and array of objects by an inner key
export function keysrt(arr, key, reverse) {
    var sortOrder = 1;
    if(reverse){
        sortOrder = -1;
    }
    return arr.sort(function(a, b) {
        var x = a[key],
            y = b[key];

        return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// return the min and max values of a 2D array's inner key
export function innerMinMax(data, key) {
  let min = data[0][key];
  let max = data[0][key];
  Object.keys(data).forEach(function (idx){
    if(data[idx][key] > max){max = data[idx][key];}
    if(data[idx][key] < min){min = data[idx][key];}
  });
  return [min, max];
}

// return all the values for an object inner key as an array
export function innerArrayValues(data, key) {
  let vals = [];
  Object.keys(data).forEach(function (idx){
    vals.push(data[idx][key]);
  });
  return vals;
}


//given 2 values return and array with all interpolated vals
export function returnRange(n, m)
{
  let tmp = [];
  for(var i = n; i <= m; i++)
  {
    tmp.push(i);
  }
  return(tmp);
}
