import $ from 'jquery';
import DataTable from 'datatables.net-dt';

export function decide_location(href, hostname, main_url, app_path){
    let uris = {
        endpoints_url: 'http://127.0.0.1:8000/analytics_automated/endpoints/',
        submit_url: 'http://127.0.0.1:8000/analytics_automated/submission/',
        times_url: 'http://127.0.0.1:8000/analytics_automated/jobtimes/',
        joblist_url: 'http://127.0.0.1:8000/analytics_automated/job/',
        gears_svg: "../static/images/gears.svg",
        app_path:  '/interface',
        files_url:  'http://127.0.0.1:8000',
        location: "Dev",
        main_url: 'http://127.0.0.1:3000',
    };

    if(href === "http://bioinf.cs.ucl.ac.uk/psipred/" || (href.includes('psipred') && !  href.includes('psipred_beta')) )
    {
      uris['app_path'] = '/psipred';
      uris['joblist_url'] = main_url+uris['app_path']+'/api/job/';
      uris['endpoints_url'] = main_url+uris['app_path']+'/api/endpoints/';
      uris['submit_url'] = main_url+uris['app_path']+'/api/submission/';
      uris['times_url'] = main_url+uris['app_path']+'/api/jobtimes/';
      uris['files_url'] = main_url+uris['app_path']+"/api";
      uris['gears_svg'] = "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg";
      uris['location ']= "Production";
    }
    else if(hostname === "bioinfstage1.cs.ucl.ac.uk" || href  === "http://bioinf.cs.ucl.ac.uk/psipred_beta/" || href.includes('psipred_beta'))
    { //update for staging paths
      uris['joblist_url'] = main_url+app_path+'/api/job/';
      uris['endpoints_url'] = main_url+app_path+'/api/endpoints/';
      uris['submit_url'] = main_url+app_path+'/api/submission/';
      uris['times_url'] = main_url+app_path+'/api/jobtimes/';
      uris['files_url'] = main_url+app_path+"/api";
      uris['location'] = 'Staging';
      //gears_svg = "../static/images/gears.svg";
    } else if (hostname === "127.0.0.1" || hostname === "localhost"){
      console.log("dev server using default URIs");
    } else {
      alert('UNSETTING ENDPOINTS WARNING, WARNING! WEBSITE NON FUNCTIONAL');
      uris['joblist_url'] = '';
      uris['endpoints_url'] = '';
      uris['submit_url'] = '';
      uris['times_url'] = '';
    }
    return(uris);
}

export function request_data(uri, file_url, mime){
  // convert this to synchronous
  console.log("REQUESTING ASCII DATA: "+file_url+uri)
  let results_data = null;
  let req = new XMLHttpRequest();
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
     results_data = req.response;
    }
  }
  req.open("GET", file_url+uri, false);
  if(mime){req.setRequestHeader('Accept', mime);}
  req.send();
  req.onerror = function() {
    alert("Request failed");
  };
  return(results_data);
}

export function request_binary_data(uri, file_url){
  // convert this to synchronous
  console.log("REQUESTING BINARY DATA: "+file_url+uri)
  let results_data = null;
  let req = new XMLHttpRequest();
  //req.responseType = "arraybuffer";
  req.onreadystatechange = function (){
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      const byteArray = new Uint8Array(req.response);
      results_data = byteArray;
    }
  }
  req.open("GET", file_url+uri, false);
  //req.responseType = "arraybuffer";
  req.send();
  req.onerror = function() {
    alert("Request failed");
  };
  return(results_data);
}

export function config_table(table_id, page_length, min_id, max_id, table_name, sort_column_number, extra_order){
  let table = $(table_id).DataTable({
    'searching'   : true,
    'pageLength': page_length,
  });
  if(extra_order)
  {
    let table = $(table_id).DataTable({
      'searching'   : true,
      'pageLength': page_length,
      'order': [extra_order,]
    });
  }
  var minEl = $(min_id);
  var maxEl = $(max_id);
  // Custom range filtering function
  //https://stackoverflow.com/questions/55242822/prevent-datatables-custom-filter-from-affecting-all-tables-on-a-page
  //note: we have to push one of these functions on to the array for every table we want to have
  // a custom filter for.
  $.fn.dataTable.ext.search.push(function (settings, data) {
    //console.log(settings.nTable.id);
    if ( settings.nTable.id !== table_name ) {
      return true;
    }
    var min = parseFloat(minEl.val(), 10);
    var max = parseFloat(maxEl.val(), 10);
    var score = parseFloat(data[sort_column_number]) || 0; // use data for the column
    if (
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && score <= max) ||
        (min <= score && isNaN(max)) ||
        (min <= score && score <= max)
    ) {
        return true;
    }
    return false;
  });
     
  // Changes to the inputs will trigger a redraw to update the table
  minEl.on('input', function () {
      table.draw();
  });
  maxEl.on('input', function () {
    table.draw();
  });
}
