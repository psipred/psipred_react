import React from 'react';
import { saveAs } from 'file-saver';
import { link } from 'd3';
const JSZip = require('jszip');

class ResultsSidebarDownloads extends React.Component{
  constructor(props){
    super(props);
    this.state ={
    };
  }

  returnJobConfig = () => {
    let header = "job,step_number,type,name,version,parameters\n";
    let file_data = header+this.props.config_data;
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
        zip.file(file, this.props.results_files[job][file])
      });
    });
    var svg = this.getSVGArea('sequence_plot');
    if(svg){
      zip.file('seq_annotation.svg', svg)
    }
    var svg = this.getSVGArea('psipred_horiz');
    if(svg){
      zip.file('psipred_cartoon.svg', svg)
    }
    var svg = this.getSVGArea('disorder_svg');
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
        if(file.includes(event.target.value)){
          saveAs(new Blob(this.props.results_files[job][file].split()), file);
        }
      });
    });

  }

  createDownloadLinks = (count, name, file_info, title) => { 
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
  renderDownloads = (job, file_data, title_string) => {
    let downloads_text = [];
    let count = 0;
    this.props.seq_job_names.forEach((name) =>{
      // console.log(name);
      // console.log(this.props.analyses);
      let link_data = [];
        if(this.props.analyses.includes(name+'_job')){
          if(name === 'psipred'){
            link_data = this.createDownloadLinks(count, name, [['.horiz','Horiz Format Output'],['.ss2','SS2 Format Output']], 'PSIPRED DOWNLOADS');
          }
          
          if(name === 'disopred'){
            link_data = this.createDownloadLinks(count, name, [['.comb', 'COMB Format Output'],['.pbdat', 'PBDAT Format Output']], 'DISOPRED DOWNLOADS')
          }
          downloads_text.push(link_data[0]);
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
           <h5>ZIP FILE</h5>
           <button className="fake-link" onClick={this.returnZip} >Get Zip file</button><br /><br />
           <h5>JOB CONFIGURATION</h5>
           <button className="fake-link" onClick={this.returnJobConfig} >Get Job details</button><br /><br />
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
