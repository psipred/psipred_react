import React from 'react';
import { saveAs } from 'file-saver';
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

  returnZip = async () => {
    let zip = new JSZip();
    for(let key in this.props.results_files){
      zip.file(key, this.props.results_files[key])
    }
    let local_blob =  await zip.generateAsync({type:"blob"});
    saveAs(local_blob, this.props.uuid+".zip");
  }
  packageJobDetails = () => {}
  getFile = (event) => {
    for(let data in this.props.results_files){
      if(data.includes(event.target.value)){
        saveAs(new Blob(this.props.results_files[data].split()), data);
      }
    }
  }

  //<button className="fake-link" onClick="@this.fire('get_zip'), false">Get Zip file</button><br /><br />
  //<button className="fake-link" onClick="@this.fire('get_job_details'), false">Get Job details</button><br /><br />

  renderPsipredResults = () => {
    let psipred_downloads = [];
    let count = 0;
    for(let name in this.props.results_files){
      count++;
      if(name.includes(".horiz")){
        psipred_downloads.push(<button className="fake-link" key={count} onClick={this.getFile} value="horiz">Horiz Format Output</button>);
      }
      if(name.includes(".ss2")){
        psipred_downloads.push(<button className="fake-link" key={count} onClick={this.getFile} value="ss2">SS2 Format Output</button>);
      }
      count++;
      psipred_downloads.push(<br key={count} />);
    }
    return(<div><h5>PSIPRED DOWNLOADS</h5>{psipred_downloads}</div>);
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
           { (this.props.analyses.includes('psipred_job') && this.props.results_files) ?
               this.renderPsipredResults()
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
