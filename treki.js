import parse_csv from "../vr-cinema/src/csv.js";
import * as utils from "./vr-cinema/src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-treki","Cinema: treki", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );

  var gr  = vz.vis.addPoints( obj, "points" );
  gr.setParam("shape",2);  
  
  // P1 requirement
  if ((opts.name || "").indexOf("current") >= 0) {
    gr.setParam("color",[1,1,0]);
    gr.setParam("radius",5.5);
  }
  else
  {
    gr.setParam("color",[1,0,0]);
    gr.setParam("radius",2.4);
  }

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    // obj.addCombo( "N","all",["all"].concat( getdiffvalues(dat.N) ),move );
    // obj.addText( "N","",move );
    obj.setParam( "N-values",getdiffvalues(dat.N).toString() );
    move();
  });

  function move() {

      var selection_hash = {};
      var vals = obj.getParam("N") || "";
      vals.toString().split(/[\s,;]+/).forEach(function(v) { selection_hash[v]=1; } );
      // if (Object.keys(selection_hash).length == 0) selection_hash["all"] = 1;

      var dat = obj.getParam("@dat");
      if (!dat) return;
      
      var fil = function(arr) {
        return simplefilterbynums( dat.N, arr, selection_hash );
      }
      gr.positions = utils.combine( [fil(dat.X), fil(dat.Y), fil(dat.Fi) ] );
  }
  
  obj.addText( "N","",move );
  obj.addLabel( "N-values","" );

  addSendNFeature( obj );

  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}


function simplefilterbynums( num_array, data_array, selection_hash )
{
  if (selection_hash.all || selection_hash[""]) return data_array;
  var acc = [];
  for (var i=0; i<data_array.length; i++) {
    if (selection_hash[ num_array[i] ])
        acc.push( data_array[i] );
  }
  return acc;
}

function getdiffvalues(arr) {
  var a = {};
  for (var i=0; i<arr.length; i++)
    a[ arr[i] ] = 1;
  //return ["---"].concat( Object.keys( a ).sort() );
  return Object.keys( a ).sort( function (a, b) {  return a - b;  } ); // сортировка чисел, просто .sort() им мало
}


//////////////// feature


// it looks like this feature is compound of two features
// 1) activate feature 2 by checkbox,
// 2) send parameter to neighbours
function addSendNFeature( obj ) {
  obj.addCheckbox( "share-N",true );
  
  obj.trackParam( "N", function() {
    if (!obj.getParam( "share-N" )) return;
    
    obj.ns.parent.ns.getChildNames().forEach( function(name) {
      if (name.indexOf("treki") >= 0) {
        var o2 = obj.ns.parent.ns.getChildByName( name );
        if (o2 != obj) {
          o2.setParam( "N", obj.getParam("N") );
        }
      }
    });
  });
}