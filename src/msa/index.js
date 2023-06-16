import React from 'react';
import {decide_location} from '../shared/index.js' // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js';

export class MSA extends React.Component{
    constructor(props){
        super(props);
        let href = window.location.href;
        let main_url = "http://bioinf.cs.ucl.ac.uk";
        let app_path = "/psipred_beta";
        let ann = null;
        let aln = null;
        console.log(href);
        if(window.location.href.includes("ann=") && window.location.href.includes("aln=")){
          let parts = window.location.href.split('?')[1];
          console.log(parts);
          let file_names = parts.split('&')
          aln = file_names[0].slice(4);
          ann = file_names[1].slice(4);
        }
        console.log("PAGE LOAD location : "+window.location.hostname);
        console.log("ALN:" +aln);
        console.log("ANN:" +ann);
        let uris = decide_location(href, window.location.hostname, main_url, app_path)
        uris['ann'] = ann;
        uris['aln'] = aln;
        this.align = React.createRef();
        this.state = uris;

        this.aa_colours = {
          A: '#d3f87f',
          V: '#b2f87f',
          I: '#97f87f',
          L: '#86f87f',
          M: '#7ff87f',
          F: '#7ff897',
          Y: '#7ff8d3',
          W: '#7fd3f8',
          H: '#7f97f8',
          R: '#7f7ff8',
          K: '#977ff8',
          N: '#d37ff8',
          Q: '#f87fd3',
          E: '#f87f97',
          D: '#f87f7f',
          S: '#f8867f',
          T: '#f8977f',
          G: '#f7b27f',
          P: '#f7d37f',
          C: '#f8f87f',
          "-": '#ffffff',
        }
        this.ss_colours = {
          C: "#ffffff",
          H: "#f87fd3",
          S: "#f8f87f",
        }
      }


      getAlignData(aln_file, ann_file){
        let aln_data = request_data(aln_file, this.state.files_url+"/submissions/");
        let ann_data = request_data(ann_file, this.state.files_url+"/submissions/");
        aln_data = aln_data.split("\n");
        aln_data = [{seq_name: aln_data[0].slice(1), seq: aln_data[1].split('')},
                    {seq_name: aln_data[2].slice(1), seq: aln_data[3].split('')}];
        this.setState({
          aln_data: aln_data,
          ann_data: ann_data,
        });
      }

      componentDidMount() {
        this.getAlignData(this.state.aln, this.state.ann);
      }

      transformAnnotations = (q_name, h_name, seq_length) => {
        let annotation_tracks = {};
        annotation_tracks[q_name] = [];
        annotation_tracks[h_name] = [];
        for(let i = 0; i < seq_length; i++){
          annotation_tracks[q_name][i] = "C";
          annotation_tracks[h_name][i] = "C";
        }
        let lines = this.state.ann_data.split("\n");
        console.log(this.state.ann_data);
        lines.forEach((line) => {
          let entries = line.split(/\s+/);
          if(entries.length === 6){
            let range_min = parseInt(entries[3])-1;
            let range_max = parseInt(entries[4])-1;
            annotation_tracks[entries[1]].forEach((value, i) => {
              if(i >= range_min && i <= range_max){
                annotation_tracks[entries[1]][i] = entries[0];
              }
          });
          } 
          });
        return(annotation_tracks);
      }
  
      renderAlignment = () => {
        let annotations = this.transformAnnotations(this.state.aln_data[1]['seq_name'], this.state.aln_data[0]['seq_name'], this.state.aln_data[1]['seq'].length);
        let table_data = "<h2>Alignment:</h2>";
        table_data += "<h2>Query&nbsp;vs&nbsp;"+this.state.aln_data[0]['seq_name']+"</h2>";
        table_data += "<tbody class='residue'>";
        
        table_data += "<tr><td>"+this.state.aln_data[1]['seq_name']+" </td>";
        table_data += "<td>:&nbsp</td>";
        this.state.aln_data[1]['seq'].forEach((char) =>{
          table_data += "<td bgcolor=\""+this.aa_colours[char.toUpperCase()]+"\">"+char.toUpperCase()+"</td>";
        });
        table_data += "</tr>";

        table_data += "<tr><td>Seconday&nbsp;Structure</td>";
        table_data += "<td>:&nbsp</td>";
        this.state.aln_data[1]['seq'].forEach((char, i) =>{
          table_data += "<td bgcolor=\""+this.ss_colours[annotations[this.state.aln_data[1]['seq_name']][i]]+"\">&nbsp;</td>";
        });
        table_data += "</tr>";

        table_data += "<tr><td>"+this.state.aln_data[0]['seq_name']+" </td>";
        table_data += "<td>:&nbsp</td>";
        this.state.aln_data[0]['seq'].forEach((char) =>{
          table_data += "<td bgcolor=\""+this.aa_colours[char.toUpperCase()]+"\">"+char.toUpperCase()+"</td>";
        });
        table_data += "</tr>";
                
        table_data += "<tr><td>Seconday&nbsp;Structure</td>";
        table_data += "<td>:&nbsp</td>";
        this.state.aln_data[1]['seq'].forEach((char, i) =>{
          table_data += "<td bgcolor=\""+this.ss_colours[annotations[this.state.aln_data[0]['seq_name']][i]]+"\">&nbsp;</td>";
        });
        table_data += "</tr>";

        table_data += "</tbody><br/><br/><h4>Residue&nbsp;colours&nbsp;as&nbsp;per&nbsp;<a href=\"https://academic.oup.com/peds/article/10/7/743/1593029\">Taylor&nbsp;(1997)</h4></a>"
        table_data += "<h4>Annotations</h4>"
        table_data += "<table><tbody class='residue'><tr><td>Helix:&nbsp</td><td bgcolor=\""+this.ss_colours["H"]+"\">&nbsp;</td></tr><tr><td>Strand:&nbsp</td><td bgcolor=\""+this.ss_colours["S"]+"\">&nbsp;</td></tr></tbody></table>"
        return(table_data);
      }

      render(){
        return(
              <div style={{overflow: 'auto', height: '100%'}}>
              { (this.state.aln_data) ?
                 <table dangerouslySetInnerHTML={{ __html: this.renderAlignment() }}></table>
                :
                null
              }
              </div>
        )
    }
}
