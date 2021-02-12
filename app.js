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
  
  // subscribe to obj data loaded -> autoscale

  return obj;
}
