import treki_func from "./treki.js";

export function setup( vz ) {
  vz.addItemType( "dubins-cinema-viewer","Dubins cinema viewer", function( opts ) {
    return create( vz, opts );
  } );
  
  vzPlayer.loadPackageByCode( "vis-comps" );

  return vzPlayer.loadPackage( vz.getDir(import.meta.url)+"./vr-cinema/src/cinema-viewzavr.js" );
}

// create function should return Viewzavr object
export function create( vz, opts ) {
  var obj = vz.createObjByType( Object.assign( {},opts,{type: "cinema-viewer",name:"dubins-cinema-viewer"} ) );
  
  var autoscale = vz.createObjByType( {type: "auto_scale",parent:obj} );

  obj.addViewType( "treki",treki_func );
  //obj.setParam("file","https://viewlang.ru/dubins/data/123/data.csv");
  //obj.setParam("file",vz.getDir(import.meta.url)+"./data.csv");
  obj.setParam("file","https://viewlang.ru/dubins/data/data.csv");
  
  // subscribe to obj data loaded -> autoscale

  return obj;
}
