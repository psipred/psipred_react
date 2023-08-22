import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
//const getIndexFile = () => {
var location = window.location.pathname;
console.log(location);
if(location.startsWith("/interface")){
    import('./index/index-interface').then(( this_class ) => {
      root.render(this_class.render());
    })
}
else if(location.startsWith("/msa")) {
  import('./index/index-msa').then(( this_class ) => {
    root.render(this_class.render());
  })
}
else if(location.startsWith("/model")) {
  import('./index/index-model').then(( this_class ) => {
    root.render(this_class.render());
  })
}
else
{
  console.log("NO VALID ROUTE")
}

  // if(location.startsWith("/msa")){
  //   return 'index-msa'
  // }
  // if(location.startsWith("/model")){
  //   return 'index-model'
  // }
  // import('./index/index-interface').then(( this_class ) => {
  //   console.log("Hi");
  //   //ReactDOM.render(render, document.getElementById('root'))
  //   root.render(this_class.render());
  // })
  //return 'index-interface';
//}

// import('./index/'+getIndexFile()).then(( this_class ) => {
//   console.log("Hi");
//   //ReactDOM.render(render, document.getElementById('root'))
//   root.render(this_class.render());
// })

