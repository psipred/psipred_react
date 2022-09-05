import React from 'react';

class ResultsSidebarDownloads extends React.Component{
  constructor(props){
    super(props);
    this.state ={
    };
  }

  packageZip = () => {}
  packageJobDetails = () => {}
  //<button className="fake-link" onClick="@this.fire('get_zip'), false">Get Zip file</button><br /><br />
  //<button className="fake-link" onClick="@this.fire('get_job_details'), false">Get Job details</button><br /><br />

  render() {
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
           <button className="fake-link" onClick={this.packageZip} >Get Zip file</button><br /><br />
           <h5>JOB CONFIGURATION</h5>
           <button className="fake-link" onClick={this.packageJobDetails} >Get Job details</button><br /><br />
           { this.props.analyses.includes('psipred') & this.props.analyses.waiting &&
            <h4>INSERT LINKS HERE</h4>
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
