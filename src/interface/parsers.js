import * as colours from '../shared/colour_names.js';


// take and ss2 (file) and parse the details and write the new annotation grid
export function parse_dmpmetal_annotations(annotations, file)
{
    let lines = file.split('\n');
    lines.forEach((line) => {
      let entries = line.split("\t");
      let idx = parseInt(entries[2])-1;
      //console.log(idx);
      if(entries.length == 4){
        if(parseFloat(entries[3]) >= 0.1){
            annotations[idx].dmpmetal = 'MB';
        }
      }
    });
    // TO DO
    return(annotations);
}


export function parse_dmpmetal(file)
{
    let lines = file.split('\n');
    let result_count = 0;
    let metal_ions = {
      'CHEBI:48775': 'Cd2+',
      'CHEBI:29108': 'Ca2+',
      'CHEBI:48828': 'Co2+',
      'CHEBI:49415': 'Co3+',
      'CHEBI:23378': 'Cu cation',
      'CHEBI:49552': 'Cu+',
      'CHEBI:29036': 'Cu2+',
      'CHEBI:60240': 'divalent metal cation',
      'CHEBI:190135': 'di-μ-sulfido-diiron',
      'CHEBI:24875': 'iron cation',
      'CHEBI:29033': 'Fe2+',
      'CHEBI:29034': 'Fe3+',
      'CHEBI:30408': 'iron-sulfur cluster',
      'CHEBI:49713': 'Li+',
      'CHEBI:18420': 'Mg2+',
      'CHEBI:29035': 'Mn2+',
      'CHEBI:16793': 'Hg2+',
      'CHEBI:49786': 'Ni2+',
      'CHEBI:60400': 'nickel-iron-sulfur cluster',
      'CHEBI:47739': 'NiFe4S4 cluster',
      'CHEBI:29103': 'K+',
      'CHEBI:29101': 'Na+',
      'CHEBI:49883': 'tetra-μ3-sulfido-tetrairon',
      'CHEBI:21137': 'tri-μ-sulfido-μ3-sulfido-triiron',
      'CHEBI:29105': 'Zn2+',
      'CHEBI:177874': 'NiFe4S5 cluster',
      'CHEBI:21143': 'Fe8S7 iron-sulfur cluster',
      'CHEBI:60504': 'iron-sulfur-iron cofactor',
      'CHEBI:25213': 'metal cation',
    };
    let dmp_table = '<br /><p>Binding residues are reported where estimated p-value 0.1% or greater.</p><table class="small-table table-striped table-bordered" style="width: 100%">';
    dmp_table += '<tr><th style="width: 10%">Residue ID</th><th style="width: 30%">CHEBI ID</th><th style="width: 30%">Metal</th><th style="width: 30%">P-Value</th></tr>';
    lines.forEach((line) => {
      let entries = line.split("\t");
      if(entries.length == 4){
        if(parseFloat(entries[3]) >= 0.1){
            result_count++;
            dmp_table += '<tr><td style="width: 10%">'+entries[2]+'</td>';
            dmp_table += '<td style="width: 30%"><a href="https://www.ebi.ac.uk/chebi/searchId.do?chebiId='+entries[1]+'">'+entries[1]+'</a></td>';
            dmp_table += '<td style="width: 30%">'+metal_ions[entries[1]]+'</td>';
            dmp_table += '<td style="width: 30%">'+entries[3]+'</td></tr>';
      
          }
      }
    });
    dmp_table += '</table><p>There may be lower probability predictions in the Residue Results file.</p>';
    if(result_count === 0){
      dmp_table = "<h4>No binding site residues with p-value >= 0.1 predicted for this sequence. There may be lower probability predictions in the Residue Results file.</h4>"
    }
    return(dmp_table);
}

export function merizo_html(dat_string){
  let lines = dat_string.split("\n");
  lines.shift();
  dat_string = lines[0];
  let merizo_table = '<br /><h3>Domain Assignments</h3><table class="small-table table-striped table-bordered"  style="width: 30%" >';
  merizo_table += '<tr><th>Domain ID</th><th>Domain Region</th><th>Colour</th></tr>';
  let data = dat_string.split("\t");
  if(! data[7]){
    let merizo_table = '<br /><h3>NO DOMAIN BOUNDARIES FOUND FOR THIS PDB FILE</h3>';
    return(merizo_table); 
  }
  let domains = data[7].split(",");
  domains.forEach((domain, idx) => {
     merizo_table += '<tr><td>'+(idx+1)+'</td><td>'+domain+'</td><td style="background-color:'+colours.colourNames[idx+1]+';">&nbsp;</td></tr>';
  });
  merizo_table += '</table>';

  //B-factor colours
  merizo_table += '<div style="width: 100%;"><div style="display: inline-block; width: 100%;">';
  merizo_table += '<h3>B-factor Temperature Key</h3><table class="small-table table-striped table-bordered" style="width: 30%;">';
  merizo_table += '<tr><th>Range</th><th>Colour</th></tr>';
  merizo_table += '<tr><td>Min</td><td style="background-color:#000080">&nbsp;</td></tr>';
  merizo_table += '<tr><td>Mid</td><td style="background-color:#008000">&nbsp;</td></tr>';
  merizo_table += '<tr><td>Max</td><td style="background-color:#800000">&nbsp;</td></tr>';
  merizo_table += '</table>';
  merizo_table += '</div>';
  
  //plDDT bins
  merizo_table += '<div style="display: inline-block; width: 100%;">';
  merizo_table += '<h3>B-factor plDDT Key</h3><table class="small-table table-striped table-bordered" style="width: 30%;">';
  merizo_table += '<tr><th NOWRAP>Confidence Bin</th><th>plDDT</th><th>Colour</th></tr>';
  merizo_table += '<tr><td>Very High</td><td>\>90</td><td style="background-color:rgb(0, 81, 214)">&nbsp;</td></tr>';
  merizo_table += '<tr><td>High</td><td>70-90</td><td style="background-color:rgb(101, 203, 243)">&nbsp;</td></tr>';
  merizo_table += '<tr><td>Low</td><td>50-70</td><td style="background-color:rgb(255, 219, 19)">&nbsp;</td></tr>';
  merizo_table += '<tr><td>Very Low</td><td>\<50</td><td style="background-color:rgb(255, 125, 69)">&nbsp;</td></tr>';
  merizo_table += '</table>';
  merizo_table += '</div></div>';

  return(merizo_table);
}


export function parse_merizo(string){
  let merizo_labels = {};
  let resi = string.split(",");
  for (var i = 0; i < resi.length; i++) {
    let ele = resi[i].split(":")
    let r = parseInt(ele[0], 10)
    let idx = parseInt(ele[1], 10)
    merizo_labels[r] = idx;
  }
  var domain_labels = Object.values(merizo_labels);
  var domain_count = Math.max(...domain_labels)
  return([merizo_labels, domain_count]);
}

export function extractBFactors(pdbContent) {
  let lines = pdbContent.split('\n');
  let bFactors = [];

  for (const line of lines) {
    if (line.startsWith('ATOM')) {
      const bFactor = parseFloat(line.substr(60, 6));
      bFactors.push(bFactor);
    }
  }
  return bFactors;
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
        regions[i][0] = parseInt(regions[i][0]-1);
        regions[i][1] = parseInt(regions[i][1]-1);
      });
      return(regions);
    }
    else if(match[1].includes('-'))
    {
        // console.log(match[1]);
        let seg = match[1].split('-');
        let regions = [[], ];
        regions[0][0] = parseInt(seg[0]-1);
        regions[0][1] = parseInt(seg[1]-1);
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
  //console.log(annotations);
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
  console.log("PARSING ANN LIST");
  console.log(ann_list);
  console.log(JSON.stringify(ann_list));
  console.log("SHOWN ANN LIST");
  if(Object.keys(ann_list).length > 0){
  console.log("WE MADE IT TO THIS LIST");
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
      // pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
      pseudo_table += "<td><a target='_blank' href='https://www.ebi.ac.uk/pdbe/scop/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
      
      pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode="+pdb+"'>Open</a></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/msa/?aln="+(ann_list[table_hit+"_"+i].aln)+"&ann="+(ann_list[table_hit+"_"+i].ann)+"\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=1000 height=400 top=30\")' value='View' /></td>";
      pseudo_table += "<td><input class='button' type='button' onClick='window.open(\""+uri_stub+"/model/?aln="+(ann_list[table_hit+"_"+i].aln)+"&type=cath\", \"Popup\", \"scrolling=yes, scrollbars=yes status width=500 height=600 top=30\")' value='View' /></td>";
    }
    else{
      pseudo_table += "<td><a target='_blank' href='https://www.rcsb.org/pdb/explore/explore.do?structureId="+pdb+"'>"+table_hit+"</a></td>";
      //pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
      pseudo_table += "<td><a target='_blank' href='https://www.ebi.ac.uk/pdbe/scop/search?t=txt;q="+pdb+"'>SEARCH</a></td>";
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

function build_merizo_html_table(lines, cath_table, add_buttons, tblid){

  let button_names = {};
  let htmltab = '<table width="100%" class="small-table table-striped table-bordered ffpred-table" id="'+tblid+'" align="center"><thead><tr>';
  if(add_buttons){
    htmltab += "<th>Show</th>";
    htmltab += "<th>Chopping</th>";
    htmltab += "<th>plddt</th>";
  }
  if(cath_table){
    htmltab += "<th>Hit:CATH</th>";
    htmltab += "<th>CATH H-Family</th>"
    htmltab += "<th>Hit:PDB</th>";
  }
  else{
    htmltab += "<th>Hit:TED</th>";
    htmltab += "<th>Get all Atom PDB</th>";
    htmltab += "<th>CATH H-Family</th>"
  }
  htmltab += "<th>Cosine Sim</th>";
  if(add_buttons){
    htmltab += "<th>Query Length</th>";
  }
  htmltab += "<th>Hit Length</th>";
  htmltab += "<th>Align Length</th>";
  htmltab += "<th>Seq ID</th>";
  //htmltab += "<th>Q TM</th>";
  //htmltab += "<th>T TM</th>";
  htmltab += "<th>Max TM</th>";
  htmltab += "<th>RMSD</th>";
  if(! cath_table){
    htmltab += "<th>Species</th>";
  }
  htmltab += "</tr></thead><tbody>";
  let result_cnt = 0;
  lines.forEach(function(line){
    if(line.length > 0){
      result_cnt+=1;
      htmltab += "<tr>";
      let entries = line.split(/\t+/);
      let hit_name = entries.shift();
      if(add_buttons){
        let dom_number = parseInt(hit_name.slice(-2), 10);
        htmltab += '<td><button class="btn btn-secondary btn-block merizo_tbl_buttons" id="show_msearch_'+dom_number+'">Show</button></td>';
        button_names[dom_number] ="show_msearch_"+dom_number;
      }
      let meta_data = [];
      if(entries.length === 15){
        meta_data = entries.pop();
        //if(! cath_table){
          meta_data = meta_data.replace(/'/g, '"');
          meta_data = JSON.parse(meta_data);
        //}
      }
      entries.forEach(function(entry, i){
        // console.log(i);
        if(i === 1 || i === 3 || i === 10 || i === 11)  {
          //skips unused table values
        }
        else if(i === 4){
          if(cath_table){
          htmltab += '<td><a href="https://www.cathdb.info/version/latest/domain/'+entry+'">'+entry+'</a></td>';
          if(meta_data.cath.includes('NA') ){
            htmltab += '<td>Unassigned</td>';
          }
          else{
            htmltab += '<td><a href="https://www.cathdb.info/version/latest/superfamily/'+meta_data.cath+'">'+meta_data.cath+'</a></td>';
          }
          htmltab += '<td><a href="https://www.rcsb.org/structure/'+entry.substring(0,4)+'">'+entry.substring(0,4)+'</a></td>';
          }
          else{
            // massage entry
            let dom = entry;
            dom = dom.replace('AF-','');
            dom = dom.replace('-F1-model_v4','');
            let uniprot = dom.slice(0, -2); 
            uniprot = uniprot.replace('_TED', '');
            htmltab += '<td><a href="https://ted.cathdb.info/uniprot/'+uniprot+'">'+dom+'</a></td>';
            htmltab += '<td><a href="https://ted.cathdb.info/api/v1/files/'+entry+'.pdb">DOWNLOAD PDB</a></td>';
            if(meta_data.cath){
              if(meta_data.cath.includes('NA') ){
                htmltab += '<td>Unassigned</td>';
              }
              else{
                htmltab += '<td><a href="https://www.cathdb.info/version/latest/superfamily/'+meta_data.cath+'">'+meta_data.cath+'</a></td>';
              }
            }
            else{
              htmltab += '<td>Unkown</td>';
            }
          }
        }
        else{
          // console.log(entry, i);
          if((! add_buttons && (i === 0 ||  i === 6 || i === 2 ))){

          }
          else{
            htmltab += "<td>"+entry+"</td>";
          }
        }
      });
      if(! cath_table){
        if(meta_data.cath){
          htmltab += '<td><a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id='+meta_data.taxid+'">'+meta_data.taxsci+'</a></td>';
      }
      else{
        htmltab += '<td>Unkown</td>';
      }
      }
      htmltab += "</tr>";
  }
  });
  htmltab += "</tbody></table>";
  if(result_cnt === 0){
    return {html: "<h2>Merizo Search identified no significant domain hits for this structure after segmentation</h2>", data: {}};
  }
  return {html: htmltab, data: button_names};
}

export function parse_merizosearch_search_results(file, type)
{ 
  // split the results in to top TM hit for each domain and by domain
  let cath_table = true;
  cath_table = true;
  let top_tm_results = {};
  let per_domain_results = {}
  let lines = file.split("\n");
  lines.shift();
  lines.forEach(function(line, i){
    if(line.length === 0){return;}
    let entries = line.split(/\t+/);
    if(entries[5].includes("_TED")){
      cath_table = false;
    }
    let domain_number = parseInt(entries[0].slice(-2), 10);
    
    if(!(domain_number in top_tm_results)){
      top_tm_results[domain_number] = {'tm': 0, 'data': []};
      per_domain_results[domain_number] = {'data': []};
    }

    if(parseFloat(entries[12]) > top_tm_results[domain_number]['tm'])
    {
      top_tm_results[domain_number]['tm'] = parseFloat(entries[12]);
      top_tm_results[domain_number]['data'] = [line];
    }
    per_domain_results[domain_number]['data'].push(line);
  });
  //build Top TM table
  let top_lines = [];
  for(const [key, value] of Object.entries(top_tm_results)){
    lines = top_tm_results[key]['data'];
    top_lines.push(lines[0]);
  }
  let top_data = build_merizo_html_table(top_lines, cath_table, true, "toptmtable");
  top_data['html'] = '<button align="right" class="btn btn-secondary btn-block merizo_buttons" id="colorByDomains">Re-colour All Segments&nbsp</button><h3>Domains with highest TM Score</h3>' + top_data['html'];
  
  //build Each domain table
  let domain_html = '';
  let domain_buttons = {};
  let table_ids = []
  for(const [key, value] of Object.entries(per_domain_results)){
    let data_slice = value['data'].slice(0,10);
    let dom_data = build_merizo_html_table(data_slice, cath_table, false, key+"tmtable");
    let entries = value['data'][0].split("\t");
    domain_html += '<h3>Domain '+key+': '+entries[1]+', Length '+entries[7]+'</h3>';
    domain_html += '<button align="right" class="btn btn-secondary btn-block merizo_buttons" id="show_domain_'+key+'">Show Domain '+key+'&nbsp</button>' + dom_data['html'];
    domain_buttons[key] ='show_domain_'+key;
    table_ids.push(key+"tmtable");
  }
  return {html: top_data['html'], data: top_data['data'], althtml: domain_html, domdata: domain_buttons, tableids: table_ids};
}

function draw_chain(meta){
  let meta_data = JSON.parse(meta);
  let svg = '<svg version="1.1" baseProfile="full" width="500" height="30" xmlns="http://www.w3.org/2000/svg" aria-label="chain summary figure role="img">';
  svg += '<rect width="492" height="6" x="4" y="12" fill="#aaaaaa"><title>Unmatched region</title></rect>';
  let dom_count = 0;
  let max_length = 0;
  // Shouldn't have to loop over all the domains to find the hit length 
  // as they should all be the same. But just in case...
  meta_data.forEach((hit) => {
    let clen = parseInt(hit.clen);
    if(clen > max_length){
      max_length = clen;
    }
  });

  meta_data.forEach((hit, idx) => {
    let colour = colours.colourNames[idx+1];
    let coords = hit.rr.split("_");
    
    coords.forEach((coord) => {
      let pair = coord.split("-");
      pair[0] = parseInt(pair[0]);
      pair[1] = parseInt(pair[1]);
      let start_loc = (pair[0]/max_length)*492;
      let stop_loc = (pair[1]/max_length)*492;
      let width = stop_loc - start_loc;
      if(hit.cath === "NA"){
        svg += '<rect width="'+width+'" height="22" x="'+(start_loc+4)+'" y="4" fill="'+colour+'"><title>'+"Unassigned CATH : "+coord+'</title></rect>';
      }
      else {
        svg += '<a href="https://www.cathdb.info/version/latest/superfamily/'+hit.cath+'"><rect width="'+width+'" height="22" x="'+(start_loc+4)+'" y="4" fill="'+colour+'"><title>'+hit.cath+" : "+coord+'</title></rect></a>';
      }
    });
  });

  svg += "</svg>";
  return svg;
}

function build_chain_html(lines, title){
  let cath_table = true;
  lines.forEach((line) => {
    if(line[6].includes('"ted":')){
      cath_table = false;
    }
  });
  let chain_html = "<div><h3>"+title+'</h3><table width="100%" class="small-table table-striped table-bordered ffpred-table" align="center"><thead>';
  if(cath_table){
    chain_html += '<th>Link to CATH Entry</th><th>Link to PDB Entry</th><th>Total Domains in hit chain</th><th style="width: 500px">MDA Diagram</th></thead><tbody>';
  }
  else {
    chain_html += '<th>Link to TED Entry</th><th>Link to AFDB Entry</th><th>Total Domains in hit chain</th><th style="width: 500px">MDA Diagram</th></thead><tbody>';
  }
  lines.forEach((line) => {
    if(cath_table){
      var pdb= line[2].slice(0, -1);
      chain_html += '<tr><td><a href="https://cathdb.info/search?q='+line[2]+'">'+line[2]+"</a></td>";
      chain_html += '<td><a href="https://www.rcsb.org/structure/'+pdb+'">'+pdb+"</a></td>"; 
    }
    else{
      var pos1 = line[2].indexOf("-");    
      var pos2 = line[2].indexOf("-", pos1+1);
      let uniprot = line[2].slice(pos1+1, pos2);
      chain_html += '<tr><td><a href="https://ted.cathdb.info/uniprot/'+uniprot+'">'+uniprot+"</a></td>";
      chain_html += '<td><a href="https://www.alphafold.ebi.ac.uk/entry/'+uniprot+'">'+line[2]+"</a></td>";
    }
    chain_html += "<td >"+line[3]+"</td>";
    chain_html += '<td>'+draw_chain(line[6])+'</td></tr>';
    
  });
  
  chain_html += "</tbody></table></div>";
  return chain_html;
}

export function parse_merizosearch_search_multi_domains(file)
{ 
  // yes, this could be done on a single keyed object but I kinda like separating it out in to 4
  // objects just for the sake of logically organising it
  let unordered = []; // 0
  let discontig = []; // 1
  let contig = []; // 2
  let exact= []; // 3
  let lines = file.split('\n');
  lines.forEach((line) => {
      let entries = line.split('\t');
      //console.log(entries);
      entries[4] = parseInt(entries[4]);
      if(entries[4] === 0){unordered.push(entries);}
      if(entries[4] === 1){discontig.push(entries);}
      if(entries[4] === 2){contig.push(entries);}
      if(entries[4] === 3){exact.push(entries);}
    });
    let unorderedhtml = "";
    let discontightml = "";
    let contightml = "";
    let exacthtml = "";
    // we need to know if we're looking at TED or CATH results here. Should really get that from global
    // state
    // unorderedhtml = build_chain_html(unordered, "Unordered chain matches");
    if(unordered.length > 0){
      unorderedhtml = build_chain_html(unordered.slice(0, 10), "Unordered chain matches");
      console.log(unordered);
    }
    else{
      unorderedhtml = "<h3>There are no unordered chain matches for this query</h3>";
    }
    if(discontig.length > 0){
      discontightml = build_chain_html(discontig.slice(0, 10), "Discontiguous chain matches");
    }
    else{
      discontightml = "<h3>There are no discontiguous chain matches for this query</h3>";
    }
    if(contig.length > 0){
      contightml = build_chain_html(contig.slice(0, 10), "Contiguous chain matches");
    }
    else{
      contightml = "<h3>There are no contiguous chain matches for this query</h3>";
    }
    if(exact.length > 0){
      exacthtml = build_chain_html(exact.slice(0, 10), "Exact chain matches");
    }
    else{
      exacthtml = "<h3>There are exact chain matches for this query</h3>";
    }
    let table_ids = [];

  // foreach category build a diagram string and results table
  return {unorderedhtml: unorderedhtml, discontightml: discontightml, contightml: contightml, exacthtml: exacthtml, tableids: table_ids};
  //return {html: top_data['html'], data: top_data['data'], althtml: domain_html, domdata: domain_buttons, tableids: table_ids};
}

export function parse_gsrcl_legend(file)
{
  //console.log(file);
  let html_data = '<table width="30%" class="small-table table-striped table-bordered gsrcl-legend" id="gsrcl_legend" align="left"><thead>';
  html_data += '<tr><th>Colour</th><th></th><th>Cell Type</th></tr>';
  html_data += '</thead><tbody>';
  let lines = file.split('\n');
  lines.forEach((line) => {
    let entries = line.split('\t');
    if(entries[0].length > 0){
      html_data += '<tr>';
      html_data += '<td style="background: '+entries[1]+'">&nbsp;</td>';
      html_data += '<td>&nbsp;</td>';
      html_data += '<td>'+entries[0]+'</td>';
      html_data += '</tr>';
    }
  });
  html_data += '</tbody></table>';

  return(html_data);
}


export function parse_gsrcl_probabilities(file)
{
  //console.log(file);
  let html_data = '<table width="100%" class="small-table table-striped table-bordered gsrcl-probabilities" id="gsrcl_probabilities_table" align="left"><thead>';
  let lines = file.split('\n');
  let header = lines.shift();
  let fields = header.split(',');
  fields.shift();
  html_data += '<tr><th>Profile ID</th>';
  fields.forEach((field) => {
    html_data += '<th>'+field+'</th>';
  });
  html_data += '</tr></thead><tbody>';
  lines.forEach((line, i) => {
    if(i > 10){return false;} 
    html_data += '<tr>';
    let entries = line.split(',');
    entries.forEach((entry, j) => {
      if(j === 0){
        html_data += '<td>'+entry+'</td>';
      }
      else if (j === entries.length-1)
      {
        html_data += '<td>'+entry+'</td>';
      }
      else {
        html_data += '<td>'+entry.substring(0,3)+'</td>';
      }
    });
    html_data += '</tr>';
  });
  html_data += '</tbody></table>';

  return(html_data);
}