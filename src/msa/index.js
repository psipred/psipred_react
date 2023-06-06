import React from 'react';
import {decide_location} from '../shared/index.js' // eslint-disable-line no-unused-vars
import {request_data} from '../shared/index.js';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-msa";
 

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
        this.sequences = [
          {
            name: "seq1",
            sequence: "MAMYDDEFDasdasdasdaasdasdasdasdasdasdasdsdasdaTKASDLTFSPWVEVE",
          },
          {
            name: "seq2",
            sequence: "MAMYDDEFDasdasdasdaasdasdasdasdasdasdasdsdasdaTKASDLTFSPWVEVE",
          },
        ];
      }


      getAlignData(aln_file, ann_file){
        let aln_data = request_data(aln_file, this.state.files_url+"/submissions/");
        let ann_data = request_data(ann_file, this.state.files_url+"/submissions/");
        this.setState({
          aln_data: aln_data,
          ann_data: ann_data,
        });
      }

      componentDidMount() {
        this.getAlignData(this.state.aln, this.state.ann);
      }
  
      render(){
        return(
            <div>
                <nightingale-msa
                  sequence={this.sequences}
                  ref={this.align}
                  id="msa-2"
                  height="200"
                  display-start="50"
                  display-end="130"
                  color-scheme="clustal2"
                  label-width="100"
                  highlight="3:20"
                  highlight-color="red"
                ></nightingale-msa>
            </div>
        )
    }
}
