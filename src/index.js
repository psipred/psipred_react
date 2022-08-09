import ReactDOM from 'react-dom/client'
import React from 'react';


class FormInteractivity extends React.Component{
  render(){
    return(
      <div className="box-body">
        <div className="form-group">
          <div className="col-md-12 form-header form_header_blue">
            <div className="row form-header-row"><h5 className="float-header">Select input data type</h5>
            </div>
          </div>

          <div className="col-md-12">
            <div className="row form-header-row">
              <div className="funkyradio">
                <div className="funkyradio-primary"><input type="radio" id="radio1" name="radio" value="on" /> <label for="radio1"><b>Sequence Data&nbsp;&nbsp;</b></label></div>&nbsp;&nbsp;&nbsp;
                <div className="funkyradio-danger"><input type="radio" id="radio2" name="radio" value="on" /> <label for="radio2"><b>PDB Structure Data&nbsp;&nbsp;</b></label></div>
              </div><br />
            </div>
          </div>


        </div>
        <div className="form-group"></div>
        <div className="form-group"></div>
      </div>
      );
  }
}

class MainForm extends React.Component{
  render () {
    return(
      <div id="main_form" className="box box-primary">
        <div className="box-header with-border">
          <p>The PSIPRED Workbench provides a range of protein structure prediction methods. The site can be used interactively via a web browser or programmatically via our REST API. For high-throughput analyses, downloads of all the algorithms are available.</p>
          <p><b>Amino acid</b> sequences enable: secondary structure prediction, including regions of disorder and transmembrane helix packing; contact analysis; fold recognition; structure modelling; and prediction of domains and function. In addition <b>PDB Structure files</b> allow prediction of protein-metal ion contacts, protein-protein hotspot residues, and membrane protein orientation.</p>
          <hr id="hr_form"></hr>
        </div>
        <div className="box-header with-border"><h5 className="box-title">Data Input</h5></div>
          <FormInteractivity />
      </div>
    );
  }
}

class Sidebar extends React.Component{
  render () {
    return(
      <div id="main_form" className="box box-primary">
        <div className="box-header with-border">Required Options</div>
        <div className="box-body"></div>
      </div>
    );
  }
}

class DisplayArea extends React.Component{
  render () {
    return(
      <div className="row">
        // IF Form or Results HERE
        <div className="col-md-9"><MainForm /></div>
        <div className="col-md-3"><Sidebar /></div>
      </div>
    );
  }
}

class PsipredSite extends React.Component{
  render(){
    return(
      <section className="content">
        <div id="psipred_site">
        <DisplayArea />
          <div className="row">
            <div className="col-md-9"></div><div className="col-md-3"></div>
          </div>
        <div className="helixy">
          <img src="http://bioinf.cs.ucl.ac.uk/psipred_new/static/images/helixy_png_blank.png" />
        </div>
        </div>
      </section>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PsipredSite />);
