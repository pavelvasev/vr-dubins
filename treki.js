import parse_csv from "../vr-cinema/src/csv.js";
import * as utils from "./vr-cinema/src/utils.js";

export default function cinema_treki( parent,name ) {

  var obj = parent.vz.create_obj( {}, {parent:parent, name:name} );
  var gr  = parent.vz.vis.addPoints( obj, "points" );
  gr.color=[1,1,1];
  gr.radius = 1.25;

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    //obj.addCombo( "N","all",["all"].concat( getdiffvalues(dat.N) ),move );
    obj.addText( "N","",move );
    obj.addLabel( "N-values",getdiffvalues(dat.N).toString() );
    move();
  });

  function move() {
      var selection_hash = {};
      var vals = obj.getParam("N");
      vals.toString().split(/[\s,;]+/).forEach(function(v) { selection_hash[v]=1; } );
      var dat = obj.getParam("@dat");
      var fil = function(arr) {
        return simplefilterbynums( dat.N, arr, selection_hash );
      }
      gr.positions = utils.combine( [fil(dat.X), fil(dat.Y), fil(dat.Fi) ] );
  }

  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}


function simplefilterbynums( num_array, data_array, selection_hash )
{
  if (selection_hash.all) return data_array;
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
