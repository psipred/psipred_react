import React from 'react';
import {PsipredSite} from './psipred_site.js' // eslint-disable-line no-unused-vars

export class Interface extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            here: '#'
        };
    }
    render () {
        return(
            <div className="wrapper">  { /* <!-- WRAPS ALL PAGE CONTENT --> */ }
              <header className="main-header">
              { /* <!-- Logo -->*/ }
                  <a href="/" className="logo">
                       { /* <!-- mini logo for sidebar mini 50x50 pixels --> */ }
                      <span className="logo-mini">
                    <img src="http://bioinf.cs.ucl.ac.uk/psipred/static/images/psipred_logomark.svg" alt="PSIPRED logomark"/>
              </span>
              { /* <!-- logo for regular state and mobile devices --> */ }
                      <span className="logo-lg">
                    <img src="http://bioinf.cs.ucl.ac.uk/psipred/static/images/psipred_logo.svg" alt="PSIPRED"/>
              </span>
                  </a>
                  { /* <!-- Header Navbar: style can be found in header.less --> */ }
              
              <nav className="navbar navbar-static-top" role="navigation">
                  { /* <!-- Sidebar toggle button-->*/ }
                  <a href={this.state.here} className="sidebar-toggle" data-toggle="push-menu" role="button" style={{ 'paddingTop': '18px'}}>
                      <span className="sr-only">Toggle navigation</span>
                  </a>
                  <div className="container-fluid">
                        <div className="navbar-header" style={{ 'paddingTop': '5px'}}>
                          <h4 className="psipred_title" ><b>UCL Department of Computer Science: Bioinformatics Group</b></h4>
                        </div>
                        <div className="collapse navbar-collapse" id="navbar-collapse">
                          <div className="nav navbar-nav navbar-right">
                            <a href="https://www.ucl.ac.uk/" alt="UCL"><img alt="UCL Logo" height="50px" src="http://cms.cs.ucl.ac.uk/typo3/fileadmin/bioinf/templates/images/ucl-logo.svg" /></a>
                          </div>
                        </div>
                  </div>
              </nav>
              
              </header>
              { /* <!-- Left side column. contains the sidebar --> */ }
        <aside className="main-sidebar">
        { /*  <!-- sidebar: style can be found in sidebar.less --> */ }
          <section className="sidebar">
            { /* <!-- Sidebar user panel -->
            <!-- sidebar menu: : style can be found in sidebar.less --> */ }
              <ul className="sidebar-menu">
                <li className="header">MAIN NAVIGATION</li>
                <section className="sidebar">
                { /* <!-- Sidebar Menu -->*/ }
                  <ul className="sidebar-menu tree" data-widget="tree">
            { /* <!-- Optionally, you can add icons to the links --> */ }
                  <ul className="sidebar-menu">
                    <li className="treeview">
        
                  <ul className="treeview-menu" style={{ 'display': 'block' }}>
                    <li>
                        <a href="http://bioinfadmin.cs.ucl.ac.uk/index.html">
                            <i className="fa fa-info"></i><span><b>Introduction</b></span>
                        </a>
                    </li>
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Contact.html">
                              <i className="fa fa-keyboard-o"></i> <span>Contact</span>
                          </a>
                      </li>
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Software_Downloads.html">
                              <i className="fa fa-download"></i> <span>Downloads &amp; Branding</span>
                          </a>
                      </li>
                      <li>
                          <a href="https://twitter.com/psipred">
                              <i className="fa fa-twitter"></i> <span>Twitter/News</span>
                          </a>
                      </li>
                    </ul>
                        <a href={this.state.here}><i className="fa fa-th"></i> <span>PSIPRED Team Links</span>
                            <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                    <ul className="treeview-menu" style={{ 'display': 'block' }}>
        
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_People.html">
                              <i className="fa fa-users"></i> <span>People</span>
                          </a>
                      </li>
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_ProCovar.html">
                              <i className="fa fa-archive"></i> <span>ProCovar</span>
                          </a>
                      </li>
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Publications.html">
                              <i className="fa fa-book"></i> <span>Publications</span>
                          </a>
                      </li>
        
        
                      <li>
                          <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Vacancies.html">
                              <i className="fa fa-envelope-square"></i> <span>Vacancies</span>
                          </a>
                      </li>
        
                      </ul>
                     </li>
                 </ul>
        
                 <ul className="sidebar-menu">
                   <li className="treeview">
                       <a href={this.state.here}><i className="fa fa-th"></i> <span>PSIPRED Workbench Links</span>
                           <span className="pull-right-container">
                               <i className="fa fa-angle-left pull-right"></i>
                           </span>
                       </a>
                   <ul className="treeview-menu" style={{ 'display': 'block' }}>
                   <li>
                       <a href="http://bioinf.cs.ucl.ac.uk/psipred/">
                           <i className="fa fa-dashboard"></i> <span>PSIPRED Workbench</span>
                       </a>
                   </li>
                   <li>
                       <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_methods_overview.html">
                           <i className="fa fa-list-ul"></i> <span>Workbench Overview</span>
                       </a>
                   </li>
                   <li>
                       <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_PSIPRED_citation.html">
                           <i className="fa fa-file-text-o"></i> <span>Workbench Citation</span>
                       </a>
                   </li>
                   <li>
                       <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Server_Tutorial.html">
                           <i className="fa fa-question-circle-o"></i> <span>Help & Tutorials</span>
                       </a>
                   </li>
                   <li>
                       <a href="http://bioinfadmin.cs.ucl.ac.uk/UCL-CS_Bioinformatics_Web_Services.html">
                           <i className="fa fa-server"></i> <span>REST API</span>
                       </a>
                   </li>
        
                   <li>
                       <a href="https://github.com/psipred">
                           <i className="fa fa-github"></i> <span>PSIPRED Github</span>
                       </a>
                   </li>
        
                   </ul>
                    </li>
                   </ul>
                 </ul>
                 { /* .sidebar-menu */ }
        
        
              </section>
              </ul>
            </section>
            { /* .sidebar */ }
          </aside>

           
          <div className="content-wrapper">
            <PsipredSite />
          </div>
 

          <footer className="main-footer">
          <div className="pull-right hidden-xs">
          <strong>Copyright &copy; 2022.<br /></strong>
          </div>
          &nbsp;
        </footer>
            </div>
        )};
}
