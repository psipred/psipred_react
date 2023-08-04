//import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
const getIndexFile = () => {
  var location = window.location.pathname;
  if(location.startsWith("/interface")){
    return 'index-interface'
  }
  if(location.startsWith("/msa")){
    return 'index-msa'
  }
  if(location.startsWith("/model")){
    return 'index-model'
  }
}

import(`./index/${getIndexFile()}`).then(( this_class ) => {
  //ReactDOM.render(render, document.getElementById('root'))
  root.render(this_class.render());
})

