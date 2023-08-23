import * as colours from '../shared/colour_names.js';

export function merizo_html(dat_string){
  //console.log(dat_string);
  let merizo_table = '<br /><h3>Domain Assignments</h3><table class="small-table table-striped table-bordered"  style="width: 60%" >';
  merizo_table += '<tr><th>Domain ID</th><th>Domain Region</th><th>Colour</th></tr>';
  let data = dat_string.split("\t");
  let domains = data[7].split(",");
  domains.forEach((domain, idx) => {
     merizo_table += '<tr><td>'+idx+'</td><td>'+domain+'</td><td style="background-color:'+colours.colourNames[idx+1]+';">&nbsp;</td></tr>';
  });
  merizo_table += '</table>';
  // <tr><td bgcolor="#ff0000" style="border-style:solid; border-width:1px; border-color:#000000">&nbsp;&nbsp;</td><td>&nbsp;Hotspot Residue</td></tr>';;
  return(merizo_table);
}

export function parse_merizo(string){
  let merizo_labels = [];
  let domain_count = 1;
  let data = string.split("\t");
  let domain_data = data[7];
  merizo_labels = new Array(Number(data[1]));
  merizo_labels.fill(0);
  let domains = domain_data.split(",");
  domains.forEach((domain) => {
    let segments = domain.split("_");
    segments.forEach((segment) =>{
      let range = segment.split("-").map(Number);
      merizo_labels.forEach((val, idx) => {
        //console.log(range[0], range[1], idx);
        if(idx >= range[0]-1 && idx <= range[1]-1){
          merizo_labels[idx] = domain_count;
        }
      });
    });
    domain_count++;
  });
  return([merizo_labels, domain_count]);
}

//https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx

export function parse_hspred(file)
{
  let hspred_table = '<br /><h3>Key</h3><table class="small-table table-striped table-bordered"><tr><td bgcolor="#ff0000" style="border-style:solid; border-width:1px; border-color:#000000">&nbsp;&nbsp;</td><td>&nbsp;Hotspot Residue</td></tr>';
  hspred_table += '<tr><td bgcolor="#ffffff" style="border-style:solid; border-width:1px; border-color:#000000">&nbsp;&nbsp;</td><td>&nbsp;Non-Hotspot Residue</td></tr>';
  hspred_table += '<tr><td bgcolor="#0000ff" style="border-style:solid; border-width:1px; border-color:#000000">&nbsp;&nbsp;</td><td>&nbsp;Non-interface residue</td></tr></table><br /><br />';
  hspred_table += '<h3>Residue Predictions</h3>';
  hspred_table += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min Score: <input id="min_hs_score" name="min_hs_score" type="text"></td></tr><tr><td class="alnright" >Max Score: <input id="max_hs_score" name="max_hs_score" type="text"></td></tr></tbody></table><br />';
  hspred_table += '<table id="hspred_table" class="table table-striped table-bordered"><thead><tr><th>Chain/Residue</th><th>Residue Identity</th><th>Score</th><th>Highlight Residue</th></thead><tbody>';
  let lines = file.split('\n');
  lines.forEach(function(line, i){
    let entries = line.split(/\s+/);
    if(entries.length === 3){
      hspred_table += '<tr><td>'+entries[0]+'</td><td>'+entries[1]+'</td><td>'+entries[2]+'</td><td><input type="checkbox" value="'+entries[0]+'" id="'+entries[0]+'" onClick="psipred.highlight_hs_residue(\''+entries[0]+'\')"=></td></td></tr>';
    }
  });
  hspred_table += '</tbody><tfoot></tfoot><table>';
  return(hspred_table)
}


// parse the small metsite output table
export function parse_metsite(file)
{
  let metsite_table = '<br /><h3>Key</h3><table class="small-table table-striped table-bordered"><tr><td bgcolor="#ff0000" style="border-style:solid; border-width:1px; border-color:#000000"></td><td><h5>&nbsp;Metal Binding Contact&nbsp;</h5></td></tr>';
  metsite_table += '<tr><td bgcolor="#000000" style="border-style:solid; border-width:1px; border-color:#000000"></td><td><h5>&nbsp;Chain not predicted&nbsp;</h5></td></tr>';
  metsite_table += '<tr><td bgcolor="#0000ff" style="border-style:solid; border-width:1px; border-color:#000000"></td><td><h5>&nbsp;Predicted chain&nbsp;</h5></td></tr></table><br />';
  metsite_table += '<h3>Residue Predictions</h3>';
  metsite_table += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min Score: <input id="min_met_score" name="min_met_score" type="text"></td></tr><tr><td class="alnright" >Max Score: <input id="max_met_score" name="max_met_score" type="text"></td></tr></tbody></table><br />';
  metsite_table += '<table id="metsite_table" class="table small-table table-striped table-bordered"><thead><tr><th>Residue</th><th>Raw Neural Network Score</th><th>Highlight Residue</th><thead><tbody>';
  let hit_regex = /\d+\s.+?\s\w{3}\d+/g;
  let hit_matches = file.match(hit_regex);
  if(hit_matches)
  {
    hit_matches.forEach(function(line, i){
      let entries = line.split(/\s/);
      metsite_table += '<tr><td>'+entries[2]+'</td><td>'+entries[1]+'</td><td><input type="checkbox" value="'+entries[2]+'" id="'+entries[2]+'" onClick="psipred.highlight_metsite_residue(\''+entries[2]+'\')"=></td></tr>';
    });
  }
  metsite_table += '</tbody><tfoot></tfoot><table>';
  return(metsite_table);
}

export function parse_ffpreds(file){

  let lines = file.split('\n');
  let bp_data = [];
  let mf_data = [];
  let cc_data = [];
  let table_data = '';
  lines.forEach(function(line, i){
    if(line.startsWith('#')){return;}
    let entries = line.split('\t');
    if(entries.length < 4){return;}
    if(entries[3] === 'BP'){bp_data.push(entries);}
    if(entries[3] === 'CC'){cc_data.push(entries);}
    if(entries[3] === 'MF'){mf_data.push(entries);}
  });

  table_data += "<b>Biological Process Predictions</b><br />";
  table_data += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min Probability: <input id="min_bp_prob" name="min_bp_prob" type="text"></td></tr><tr><td class="alnright" >Max Probability: <input id="max_bp_prob" name="max_bp_prob" type="text"></td></tr></tbody></table><br />';
  table_data += "<table id='bp_table' class='table small-table table-bordered gen-table'><thead><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr></thead><tbody>";
  bp_data.forEach(function(entries, i){
    let class_colour = 'safe';
    if(entries[2]==='L'){class_colour = 'notsafe';}
    table_data += '<tr class="'+class_colour+'">';
    table_data += '<td>'+entries[1]+'</td>';
    table_data += '<td>'+entries[4]+'</td>';
    table_data += '<td>'+entries[0]+'</td>';
    table_data += '<td>'+entries[2]+'</td>';
    table_data += '</tr>';

  });
  table_data += '</tbody><tfoot></tfoot></table><br />';

  table_data += "<b>Molecular Function Predictions</b><br />";
  table_data += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min Probability: <input id="min_mf_prob" name="min_mf_prob" type="text"></td></tr><tr><td class="alnright" >Max Probability: <input id="max_mf_prob" name="max_mf_prob" type="text"></td></tr></tbody></table><br />';
  table_data += "<table id='mf_table' class='table small-table table-bordered gen-table'><thead><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr></thead><tbody>";
  mf_data.forEach(function(entries, i){
    let class_colour = 'safe';
    if(entries[2]==='L'){class_colour = 'notsafe';}
    table_data += '<tr class="'+class_colour+'">';
    table_data += '<td>'+entries[1]+'</td>';
    table_data += '<td>'+entries[4]+'</td>';
    table_data += '<td>'+entries[0]+'</td>';
    table_data += '<td>'+entries[2]+'</td>';
    table_data += '</tr>';

  });
  table_data += '</tbody><tfoot></tfoot></table><br />';

  table_data += "<b>Cellular Component Predictions</b><br />";
  table_data += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min Probability: <input id="min_cc_prob" name="min_cc_prob" type="text"></td></tr><tr><td class="alnright" >Max Probability: <input id="max_cc_prob" name="max_cc_prob" type="text"></td></tr></tbody></table><br />';
  table_data += "<table id='cc_table' class='table small-table table-bordered gen-table'><thead><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr></thead><tbody>";
  cc_data.forEach(function(entries, i){
    let class_colour = 'safe';
    if(entries[2]==='L'){class_colour = 'notsafe';}
    table_data += '<tr class="'+class_colour+'">';
    table_data += '<td>'+entries[1]+'</td>';
    table_data += '<td>'+entries[4]+'</td>';
    table_data += '<td>'+entries[0]+'</td>';
    table_data += '<td>'+entries[2]+'</td>';
    table_data += '</tr>';
  });
  table_data += '</tbody><tfoot></tfoot></table><br />';
  table_data += 'These prediction terms represent terms predicted where SVM training includes assigned GO terms across all evidence code types. SVM reliability is regarded as High (H) when MCC, sensitivity, specificity and precision are jointly above a given threshold. otherwise Reliability is indicated as Low (L). <br />';
  return(table_data);
}

function set_aanorm(){
  let hAA_norm = {};
  hAA_norm.A = { val: 0.071783248006309,
                 sde: 0.027367661524275};
  hAA_norm.V = { val: 0.059624595369901,
                 sde: 0.020377791528745};
  hAA_norm.Y = { val: 0.026075068240437,
                 sde: 0.014822471531379};
  hAA_norm.W = { val: 0.014166002612771,
                 sde: 0.010471835801996};
  hAA_norm.T = { val: 0.052593582972714,
                 sde: 0.020094793964597};
  hAA_norm.S = { val: 0.082123241332099,
                 sde: 0.028687566081512};
  hAA_norm.P = { val: 0.065557531322241,
                 sde: 0.034239398496736};
  hAA_norm.F = { val: 0.037103994969002,
                 sde: 0.018543423139186};
  hAA_norm.M = { val: 0.022562818183955,
                 sde: 0.011321039662481};
  hAA_norm.K = { val: 0.054833979269185,
                 sde: 0.029264083667157};
  hAA_norm.L = { val: 0.10010591575906,
                 sde: 0.030276808519009};
  hAA_norm.I = { val: 0.042034526040467,
                 sde: 0.020826849262495};
  hAA_norm.H = { val: 0.027141403537598,
                 sde: 0.01550566378985};
  hAA_norm.G = { val: 0.069179820104536,
                 sde: 0.030087562057328};
  hAA_norm.Q = { val: 0.065920561931801,
                 sde: 0.030103091008366};
  hAA_norm.E = { val: 0.04647846225838,
                 sde: 0.019946269461736};
  hAA_norm.C = { val: 0.024908551872056,
                 sde: 0.020822909589504};
  hAA_norm.D = { val: 0.044337904726041,
                 sde: 0.018436677256726};
  hAA_norm.N = { val: 0.033507020987033,
                 sde: 0.016536022288204};
  hAA_norm.R = { val: 0.05974046903119,
                 sde: 0.025165994773384};
  return(hAA_norm);
}

function set_fnorm(){
  let hF_norm = {};
  hF_norm.hydrophobicity = {val: -0.34876828080152,
                            sde: 0.75559152769799};
  hF_norm['percent positive residues'] = {val: 11.457717466948,
                                          sde: 3.567133341139};
  hF_norm['aliphatic index'] = {val: 79.911549319099,
                                sde: 16.787617978827};
  hF_norm['isoelectric point'] = {val: 7.6102046383603,
                                  sde: 1.9716111020088};
  hF_norm['molecular weight'] = {val: 48668.412839961,
                                 sde: 37838.324895969};
  hF_norm.charge = {val: 5.0991763057604,
                    sde: 16.83863659025};
  hF_norm['percent negative residues'] = {val: 11.026190128176,
                                          sde: 4.0206631680926};
  hF_norm['molar extinction coefficient'] = {val: 46475.293923926,
                                             sde: 39299.399848823};
  return(hF_norm);
}

function get_aa_color(val){
    let ab_val = Math.abs(val);
    if(ab_val >= 2.96 ){
        if(val > 0){return "signif1p";}
        return "signif1n";
    }
    else if(ab_val >= 2.24){
        if(val > 0){return "signif2p";}
        return "signif2n";
    }
    else if(ab_val >= 1.96 ){
        if(val > 0){return "signif5p";}
        return "signif5n";
    }
    else if(ab_val >= 1.645 ) {
        if(val > 0){return "signif10p";}
        return "signif10n";
    }
    return "plain";
}

//parse the ffpred featcfg features file
export function parse_featcfg(file)
{
  let lines = file.split('\n');
  let SF_data = {};
  let AA_data = {};
  let hF_norm =set_fnorm();
  let hAA_norm=set_aanorm();
  lines.forEach(function(line, i){
    if(line.startsWith("AA")){
      let columns = line.split('\t');
      AA_data[columns[1]] = columns[2];
    }
    if(line.startsWith("SF"))
    {
      let columns = line.split('\t');
      SF_data[columns[1]] = columns[2];
    }
  });

  // build html tables for the feature data
  //let class_colour = '';
  let feat_table = '<table align="center" class="small-table table-striped table-bordered ffpred-table"><tr><th>Feature Name</th><th>Value</th><th>Bias</th></tr>';

  Object.keys(SF_data).sort().forEach(function(feature_name){
    let class_colour = '';
    if(feature_name in hF_norm){
      class_colour = get_aa_color( (parseFloat(SF_data[feature_name])-hF_norm[feature_name].val) / hF_norm[feature_name].sde);
    }
    feat_table += '<tr><td>'+feature_name+'</td><td>'+parseFloat(SF_data[feature_name]).toFixed(2)+'</td><td class="'+class_colour+'">&nbsp;&nbsp;&nbsp;</td></tr>';
  });
  feat_table += '</table>';

  //build html table for the AA data
  let aa_table = '<b>Amino Acid Composition (percentages)</b><br />';

  aa_table += '<table width="50%" class="small-table table-striped table-bordered ffpred-table" align="center" ><tr>';
  Object.keys(AA_data).sort().forEach(function(residue){
    aa_table += '<th width="5%">'+residue+'</th>';
  });
  aa_table += '</tr><tr>';
  Object.keys(AA_data).sort().forEach(function(residue){
    let class_colour = '';
    class_colour = get_aa_color((parseFloat(AA_data[residue])-hAA_norm[residue].val) / hAA_norm[residue].sde);
    aa_table += '<td width="5% class="'+class_colour+'">'+(parseFloat(AA_data[residue])*100).toFixed(2)+'</td>';
  });
  aa_table += '</tr></table><br />';
  aa_table += '<b>Significance Key</b><br /><br />';
  aa_table += '<table width="50%" class="small-table table-striped table-bordered ffpred-table" align="center">';
  aa_table += '<thead><tr>';
  aa_table += '<th width="9%" align="left"><b>low</b></th>';
  aa_table += '<th colspan="9">&nbsp;</th>';
  aa_table += '<th width="9%" align="right"><b>high</b></th>';
  aa_table += '</tr></thead>';
  aa_table += '<tbody><tr>';
  aa_table += '<td>&nbsp;</td>';
  aa_table += '<td class="signif1n">p &lt; 0.01</td>';
  aa_table += '<td class="signif2n">p &lt; 0.02</td>';
  aa_table += '<td class="signif5n">p &lt; 0.05</td>';
  aa_table += '<td class="signif10n">p &lt; 0.1</td>';
  aa_table += '<td>p &gt;= 0.1</td>';
  aa_table += '<td class="signif10p">p &lt; 0.1</td>';
  aa_table += '<td class="signif5p">p &lt; 0.05</td>';
  aa_table += '<td class="signif2p">p &lt; 0.02</td>';
  aa_table += '<td class="signif1p">p &lt; 0.01</td>';
  aa_table += '<td>&nbsp</td>';
  aa_table += '</tr></tbody>';
  aa_table += '<tfoot><tr>';
  aa_table += '<td colspan="11">Significance p value is calculated using the Z score of the percent amino acid composition</td>';
  aa_table += '</tr><tfoot>';
  aa_table += '</table>';
  return([feat_table, aa_table]);
}


// for a given memsat data files extract coordinate ranges given some regex
export function get_memsat_ranges(regex, data)
{
    let match = regex.exec(data);
    if(match[1].includes(','))
    {
      let regions = match[1].split(',');
      regions.forEach(function(region, i){
        regions[i] = region.split('-');
        regions[i][0] = parseInt(regions[i][0]);
        regions[i][1] = parseInt(regions[i][1]);
      });
      return(regions);
    }
    else if(match[1].includes('-'))
    {
        // console.log(match[1]);
        let seg = match[1].split('-');
        let regions = [[], ];
        regions[0][0] = parseInt(seg[0]);
        regions[0][1] = parseInt(seg[1]);
        return(regions);
    }
    return(match[1]);
}

// take and ss2 (file) and parse the details and write the new annotation grid
export function parse_ss2(annotations, file)
{
    let lines = file.split('\n');
    lines.shift();
    lines = lines.filter(Boolean);
    if(annotations.length === lines.length)
    {
      lines.forEach(function(line, i){
        let entries = line.split(/\s+/);
        annotations[i].ss = entries[3];
      });
    }
    else
    {
      alert("SS2 annotation length does not match query sequence");
    }
    return(annotations);
}

// //take the disopred pbdat file, parse it and add the annotations to the annotation grid
export function parse_pbdat(annotations, file)
{
    let lines = file.split('\n');
    lines.shift(); lines.shift(); lines.shift(); lines.shift(); lines.shift();
    lines = lines.filter(Boolean);
    if(annotations.length === lines.length)
    {
      lines.forEach(function(line, i){
        let entries = line.split(/\s+/);
        if(entries[3] === '-'){annotations[i].disopred = 'D';}
        if(entries[3] === '^'){annotations[i].disopred = 'PB';}
      });
    }
    else
    {
      alert("PBDAT annotation length does not match query sequence");
    }
    return(annotations);
}
//
// //parse the disopred comb file and add it to the annotation grid
export function parse_comb(file)
{
  let precision = [];
  let lines = file.split('\n');
  lines.shift(); lines.shift(); lines.shift();
  lines = lines.filter(Boolean);
  lines.forEach(function(line, i){
    let entries = line.split(/\s+/);
    precision[i] = {};
    precision[i].pos = entries[1];
    precision[i].precision = entries[4];
  });
  return(precision);
}
//
//parse the memsat output
export function parse_memsatdata(annotations, file)
{
  //console.log(file);
  let topo_regions = get_memsat_ranges(/Topology:\s+(.+?)\n/, file);
  let signal_regions = get_memsat_ranges(/Signal\speptide:\s+(.+)\n/, file);
  let reentrant_regions = get_memsat_ranges(/Re-entrant\shelices:\s+(.+?)\n/, file);
  let terminal = get_memsat_ranges(/N-terminal:\s+(.+?)\n/, file);
  //console.log(signal_regions);
  // console.log(reentrant_regions);
  let coil_type = 'CY';
  if(terminal === 'out')
  {
    coil_type = 'EC';
  }
  let tmp_anno = new Array(annotations.length);
  if(topo_regions !== 'Not detected.')
  {
    let prev_end = 0;
    topo_regions.forEach(function(region){
      tmp_anno = tmp_anno.fill('TM', region[0], region[1]+1);
      if(prev_end > 0){prev_end -= 1;}
      tmp_anno = tmp_anno.fill(coil_type, prev_end, region[0]);
      if(coil_type === 'EC'){ coil_type = 'CY';}else{coil_type = 'EC';}
      prev_end = region[1]+2;
    });
    tmp_anno = tmp_anno.fill(coil_type, prev_end-1, annotations.length);

  }
  //signal_regions = [[70,83], [102,117]];
  if(signal_regions !== 'Not detected.'){
    signal_regions.forEach(function(region){
      tmp_anno = tmp_anno.fill('S', region[0], region[1]+1);
    });
  }
  //reentrant_regions = [[40,50], [200,218]];
  if(reentrant_regions !== 'Not detected.'){
    reentrant_regions.forEach(function(region){
      tmp_anno = tmp_anno.fill('RH', region[0], region[1]+1);
    });
  }
  tmp_anno.forEach(function(anno, i){
    annotations[i].memsat = anno;
  });
  return(annotations);
}
//type is one of gen, pgen and dgen
export function parse_presults(file, ann_list, type)
{
  let uri_stub = 'http://127.0.0.1:3000';
  if(process.env.PUBLIC_URL.length > 0){
    uri_stub = process.env.PUBLIC_URL;
  }
  let lines = file.split('\n');
  let pseudo_table = null;
  if(Object.keys(ann_list).length > 0){
  pseudo_table =  '<div class="text-right modeller-key" style="visibility: visible;">Modeller Licence Key: <input class="text" value=""><br><br></div>';
  pseudo_table += '<table class="filter_table" cellspacing="5" cellpadding="5" border="0"><tbody><tr><td class="alnright"><h4>Filter Table Rows</h4></td></tr><tr><td class="alnright">Min P-Value: <input id="min_'+type+'_pval" name="min_'+type+'_score" type="text"></td></tr><tr><td class="alnright" >Max P-Value: <input id="max_'+type+'_pval" name="max_'+type+'_pval" type="text"></td></tr></tbody></table><br />';
  pseudo_table += '<table id="'+type+'_table" class="small-table table-striped table-bordered gen-table"><thead>\n';
  pseudo_table += '<tr><th>Conf.</th>';
  pseudo_table += '<th>Net Score</th>';
  pseudo_table += '<th>p-value</th>';
  pseudo_table += '<th>PairE</th>';
  pseudo_table += '<th>SolvE</th>';
  pseudo_table += '<th>Aln Score</th>';
  pseudo_table += '<th>Aln Length</th>';
  pseudo_table += '<th>Target Len</th>';
  pseudo_table += '<th>Query Len</th>';
  if(type === 'dgen'){
    pseudo_table += '<th>Region Start</th>';
    pseudo_table += '<th>Region End</th>';
    pseudo_table += '<th>CATH</th>';
    pseudo_table += '<th>SCOP</th>';
  }else {
    pseudo_table += '<th>Fold</th>';
    pseudo_table += '<th>SCOP</th>';
    pseudo_table += '<th>CATH</th>';
  }
  pseudo_table += '<th>PDBSUM</th>';
  pseudo_table += '<th>Alignment</th>';
  pseudo_table += '<th>MODEL</th>';

  // if MODELLER THINGY
  pseudo_table += '</tr></thead><tbody">\n';
  lines.forEach(function(line, i){
    //console.log(line);
    if(line.length === 0){return;}
    let entries = line.split(/\s+/);
    let table_hit = entries[9];
    if(type === 'dgen'){ table_hit = entries[11];}
    if(table_hit+"_"+i in ann_list)
    {
    pseudo_table += "<tr>";
    pseudo_table += "<td class='"+entries[0].toLowerCase()+"'>"+entries[0]+"</td>";
    pseudo_table += "<td>"+entries[1]+"</td>";
    pseudo_table += "<td>"+entries[2]+"</td>";
    pseudo_table += "<td>"+entries[3]+"</td>";
    pseudo_table += "<td>"+entries[4]+"</td>";
    pseudo_table += "<td>"+entries[5]+"</td>";
    pseudo_table += "<td>"+entries[6]+"</td>";
    pseudo_table += "<td>"+entries[7]+"</td>";
    pseudo_table += "<td>"+entries[8]+"</td>";
    let pdb = entries[9].substring(0, entries[9].length-2);
    if(type === 'dgen'){ pdb = entries[11].substring(0, entries[11].length-3);}
    if(type === 'dgen'){
      pseudo_table += "<td>"+entries[9]+"</td>";
      pseudo_table += "<td>"+entries[10]+"</td>";
      pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/version/latest/domain/"+table_hit+"'>"+table_hit+"</a></td>";
      pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
      pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode="+pdb+"'>Open</a></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/msa/?aln="+(ann_list[table_hit+"_"+i].aln)+"&ann="+(ann_list[table_hit+"_"+i].ann)+"\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=1000 height=400 top=30\")' value='View' /></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/model/?aln="+(ann_list[table_hit+"_"+i].aln)+"&type=cath\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=500 height=600 top=30\")' value='View' /></td>";
    }
    else{
      pseudo_table += "<td><a target='_blank' href='https://www.rcsb.org/pdb/explore/explore.do?structureId="+pdb+"'>"+table_hit+"</a></td>";
      pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
      pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/pdb/"+pdb+"'>SEARCH</a></td>";
      pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode="+pdb+"'>Open</a></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/msa/?aln="+(ann_list[table_hit+"_"+i].aln)+"&ann="+(ann_list[table_hit+"_"+i].ann)+"\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=1000 height=400 top=30\")' value='View' /></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/model/?aln="+(ann_list[table_hit+"_"+i].aln)+"&type=pdb\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=500 height=600 top=30\")' value='View' /></td>";
      
      //pseudo_table += "<td><input class='button' type='button' onClick='psipred.buildModel(\""+(ann_list[table_hit+"_"+i].aln)+"\", \"pdb_modeller\");' value='Model' /></td>";
    }
    pseudo_table += "</tr>\n";
    }
  });
  pseudo_table += "</tbody><tfoot></tfoot></table>\n";
  }
  else {
    pseudo_table = "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>";
  }
  return(pseudo_table);
}

export function parse_parseds(annotations, file)
{
  let prediction_regex = /Domain\sBoundary\slocations\spredicted\sDPS:\s(.+)/;
  let prediction_match =  prediction_regex.exec(file);
  if(prediction_match)
  {
    let values = [];
    if(prediction_match[1].indexOf(","))
    {
      values = prediction_match[1].split(',');
      values.forEach(function(value, i){
        values[i] = parseInt(value);
      });
    }
    else
    {
      values[0] = parseInt(prediction_match[1]);
    }
    //console.log(values);
    values.forEach(function(value){
      annotations[value].dompred = 'B';
    });
  }
  return(annotations);
}
