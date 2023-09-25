import React from 'react';
import { saveAs } from 'file-saver';
//import { link } from 'd3';
import {request_data} from '../shared/index.js';

const JSZip = require('jszip');
const JSZipUtils = require('jszip-utils');

class ResultsSidebarDownloads extends React.Component{
  constructor(props){
    super(props);
    this.state ={
    };
  }


  getConf = () => {
    let header = "job,step_number,type,name,version,parameters\n";
    let conf = '';
    this.props.analyses.forEach((job)=> {
      job = job.replace(/_job/, '')
      console.log("Getting config for "+job);
      let config_data = JSON.parse(request_data(job, this.props.joblist_url, 'application/json'));
      config_data.steps.forEach((step) => {
        if(step.task.configuration.length !== 0){
          step.task.configuration.forEach((info) => {
            conf += job+","+step.ordering+","+info.type+","+info.name+","+info.version+","+info.parameters+"\n";
          });
        }
      });
    });
    return(header+conf);
  }

  returnJobConfig = () => {
    let file_data = this.getConf();
    saveAs(new Blob(file_data.split()), this.props.uuid+".csv");
  }

  getSVGArea = (id) => {
    var element = document.getElementById(id);
    let svg = null;
    if(element){
      svg = element.innerHTML;
      svg = svg.replace(/<g id="toggle".+?<\/g>/, '');
      svg = svg.replace(/<g id="buttons".+?<\/g>/, '');
    }
    return(svg);
  }

  returnZip = async () => {
    let zip = new JSZip();
    Object.keys(this.props.results_files).forEach((job) => {
      Object.keys(this.props.results_files[job]).forEach((file) => {
        //console.log(file);
        if(file.includes(".png") ||file.includes(".jpg") || file.includes(".jpeg") ||file.includes(".gif"))
        {
          let url = this.props.files_url+"/submissions/"+file;
          var imgdata = null;
          try{
            imgdata = JSZipUtils.getBinaryContent(url);
          }
          catch (err){
            console.log("Could not get image data for zip: "+file);
          }
          zip.file(file, imgdata, {binary: true});
        }
        else {
          zip.file(file, this.props.results_files[job][file])
        }
      });
    });
    zip.file("job_configuration.csv", this.getConf());
    var svg = this.getSVGArea('sequence_plot');
    if(svg){
      zip.file('seq_annotation.svg', svg)
    }
    svg = this.getSVGArea('psipred_horiz');
    if(svg){
      zip.file('psipred_cartoon.svg', svg)
    }
    svg = this.getSVGArea('disorder_svg');
    if(svg){
      zip.file('disorder_precision.svg', svg)
    }
    let local_blob =  await zip.generateAsync({type:"blob"});
    saveAs(local_blob, this.props.uuid+".zip");
  }
  
  packageJobDetails = () => {}

  getFile = (event) => {
    Object.keys(this.props.results_files).forEach((job) => {
      Object.keys(this.props.results_files[job]).forEach((file) => {
        console.log(file);
        if(file.includes(event.target.value)){
          saveAs(new Blob(this.props.results_files[job][file].split()), file);
        }
      });
    });

  }

  createDownloadLinks = (count, file_info, title) => { 
    let html_data = [];

    html_data.push(<h5 key={count} >{title}</h5>);
    count++;
    file_info.forEach((file) => {
      html_data.push(<button className="fake-link" key={count} onClick={this.getFile} value={file[0]} >{file[1]}</button>);
      count++;
      html_data.push(<br key={count} />);
      count++;
    });
    return([html_data, count]);
  }

  //<button className="fake-link" onClick="@this.fire('get_zip'), false">Get Zip file</button><br /><br />
  //<button className="fake-link" onClick="@this.fire('get_job_details'), false">Get Job details</button><br /><br />
  renderDownloads = () => {
    let downloads_text = [];
    let count = 0;
    
    this.props.struct_job_names.forEach((name) =>{
      let link_data = [];
      if(this.props.analyses.includes(name+'_job')){
        if(name === this.props.job_strings.metsite.varName){
          link_data = this.createDownloadLinks(count, [['.MetPred', 'Metsite PDB'], ['.Metpred', 'Mesite Predictions']], this.props.job_strings.metsite.shortName+' DOWNLOADS');
          downloads_text.push(link_data[0]);
        }
        if(name === this.props.job_strings.hspred.varName){
          link_data = this.createDownloadLinks(count, [['initial.pdb', 'HSPred First PDB File'], ['second.pdb', 'HSPred Second PDB File'], ['.out', 'HSPRed Predictions']], this.props.job_strings.hspred.shortName+' DOWNLOADS');
          downloads_text.push(link_data[0]);
        }
        if(name === this.props.job_strings.memembed.varName){
          link_data = this.createDownloadLinks(count, [['.pdb', 'PDB Embedding'], ], this.props.job_strings.memembed.shortName+' DOWNLOADS');
          downloads_text.push(link_data[0]);
        }
        if(name === this.props.job_strings.merizo.varName){
          link_data = this.createDownloadLinks(count, [['.pdb2', this.props.job_strings.merizo.shortName+' PDB'], ['.merizo', this.props.job_strings.merizo.shortName+' Boundaries']], this.props.job_strings.merizo.shortName+' DOWNLOADS');
          downloads_text.push(link_data[0]);
        }
        
        count = link_data[1];
      }
    });

    this.props.seq_job_names.forEach((name) =>{
      // console.log(name);
      // console.log(this.props.analyses);
      let link_data = [];
        if(this.props.analyses.includes(name+'_job')){
          if(name === this.props.job_strings.psipred.varName || name === this.props.job_strings.dmp.varName){
            link_data = this.createDownloadLinks(count, [['.horiz','Horiz Format Output'],['.ss2','SS2 Format Output']], this.props.job_strings.psipred.shortName+' DOWNLOADS');
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.pgenthreader.varName){
            link_data = this.createDownloadLinks(count, [['.presults', this.props.job_strings.pgenthreader.shortName+' Hits'], ], this.props.job_strings.pgenthreader.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.disopred.varName){
            link_data = this.createDownloadLinks(count, [['.comb', 'COMB Format Output'],['.pbdat', 'PBDAT Format Output']], this.props.job_strings.disopred.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.memsatsvm.varName){
            link_data = this.createDownloadLinks(count, [['.memsat_svm', this.props.job_strings.memsatsvm.shortName+' text format'], ], this.props.job_strings.memsatsvm.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.dmp.varName){
            link_data = this.createDownloadLinks(count, [['.con', this.props.job_strings.dmp.shortName+' Contact List'], ], this.props.job_strings.dmp.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.genthreader.varName){
            link_data = this.createDownloadLinks(count, [['.presults', this.props.job_strings.genthreader.shortName+' Hits'], ], this.props.job_strings.genthreader.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.pdomthreader.varName){
            link_data = this.createDownloadLinks(count, [['.presults', this.props.job_strings.pdomthreader.shortName+' Hits'], ], this.props.job_strings.pdomthreader.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.dmpfold.varName){
            link_data = this.createDownloadLinks(count, [['.pdb', 'PDB Model'], ], this.props.job_strings.dmpfold.shortName+' DOWNLOADS')
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.s4pred.varName){
            link_data = this.createDownloadLinks(count, [['.horiz','Horiz Format Output'],['.ss2','SS2 Format Output']], this.props.job_strings.s4pred.shortName+' DOWNLOADS');
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.dompred.varName){
            link_data = this.createDownloadLinks(count, [['.boundary',this.props.job_strings.dompred.shortName+' Boundaries']], this.props.job_strings.dompred.shortName+' DOWNLOADS');
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.ffpred.varName){
            link_data = this.createDownloadLinks(count, [['.featcfg', this.props.job_strings.ffpred.shortName+' Predicted Features'], ['.full_formatted', this.props.job_strings.ffpred.shortName+' Predictions']], this.props.job_strings.ffpred.shortName+' DOWNLOADS');
            downloads_text.push(link_data[0]);
          }
          if(name === this.props.job_strings.mempack.varName){
            link_data = this.createDownloadLinks(count, [['_LIPID_EXPOSURE.results', this.props.job_strings.mempack.shortName+' Lipid Exposure Results'], ['_CONTACT_DEF1.results', this.props.job_strings.mempack.shortName+' Contacts']], this.props.job_strings.mempack.shortName+' DOWNLOADS');
            downloads_text.push(link_data[0]);
          }

          count = link_data[1];
        }
        // downloads_text.push(link_data[0]);
        // count = link_data[1];
      });
    return(<div>{downloads_text}</div>);
  }

  render() {
    //console.log(this.props.analyses);
    return(
      <div className="box box-warning" id="downloads_widget">
       <div className="box-header with-border">
           <h5 className="box-title">Downloads</h5>

           <div className="box-tools pull-right">
               <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip"
                       title="Collapse">
                   <i className="fa fa-minus"></i></button>
           </div>
       </div>
       <div className="box-body">
           <h5>RESULTS ZIP FILE</h5>
           <button className="fake-link" onClick={this.returnZip} >Get Zip File</button><br /><br />
           <h5>JOB CONFIGURATION</h5>
           <button className="fake-link" onClick={this.returnJobConfig} >Get Job Details</button><br /><br />
           { (this.props.results_files) ?
                this.renderDownloads()
              :
               null
           }
       </div>
       { this.props.waiting &&
       <div className="overlay processing">
             <i className="fa fa-refresh fa-spin"></i>
       </div>
      }
      </div>
    );
  }
}

export {ResultsSidebarDownloads};
