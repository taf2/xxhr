function anerian() {}
anerian.xajax = function(path, options) {
  if( !anerian.pool || !anerian.worker ) { anerian.init(); }

  var body = {};
  body.path = path;
  body.method = options.method;
  anerian.send(body,function(msg) {
    if( msg.body.status == "success" ) {
      options.success(msg.body);
    }
    else {
      options.failure(msg.body);
    }
  });
}
anerian.send = function(body, cb) {
  var worker = anerian.pool.createWorkerFromUrl("http://127.0.0.1:2001/xajax-worker.js");
  body.id = anerian.idc++;
  anerian.mbus[body.id] = cb; // register the cb
  anerian.pool.sendMessage(body, worker);
}
anerian.init = function() {
  anerian.idc = 0;
  anerian.pool = google.gears.factory.create('beta.workerpool');
  anerian.mbus = [];
  anerian.pool.onmessage = function(a,b,message) {
    var id = message.body.id;
    var cb = anerian.mbus[id];
    if( cb ) { cb(message); }
    else { throw "unknown message request type" }
  };
}
