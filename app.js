import * as treki from "./treki.js";

export function setup( vz ) {
  treki.setup( vz );

  vz.addItemType( "dubins-cinema-viewer","Dubins cinema viewer", function( opts ) {
    return create( vz, opts );
  } );
  
  var p1 = vzPlayer.loadPackageByCode( "vis-comps" );
  var p2 = vzPlayer.loadPackage( vz.getDir(import.meta.url)+"./vr-cinema/src/cinema-viewzavr.js" );

  return Promise.allSettled( [p1,p2] );
}

export function create( vz, opts ) {
  var obj = vz.createObjByType( Object.assign( {},opts,{type: "cinema-view-cinema",name:"dubins-cinema-viewer"} ) );
  
  var autoscale = vz.createObjByType( {type: "auto_scale",parent:obj} );

  //obj.addViewType( "treki",treki_func );
  //obj.setParam("file","https://viewlang.ru/dubins/data/123/data.csv");
  //obj.setParam("file",vz.getDir(import.meta.url)+"./data.csv");
  obj.setParam("file","https://viewlang.ru/dubins/data/data.csv");
  
  // P9 requirement. Somewhere here we see that we need feature-based layers.
  feature_autoScaleOnGrowOnce( obj, autoscale );
  
  // subscribe to obj data loaded -> autoscale

  return obj;
}

// feature
function feature_autoScaleOnGrowOnce( obj, autoscale ) {
  var autoscaled=false;
  obj.findRoot().trackParam("cliprange", function(v) {
    v = v.detail; // todo мы это переделаем на просто значение параметра.
    if (v > 500 && !autoscaled) {
      console.log("AUTO-SCALING ONE TIME");
      autoscale.signalTracked("Auto-scale");
      autoscaled=true;
    }
  });
}