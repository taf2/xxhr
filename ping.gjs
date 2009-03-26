google.gears.workerPool.allowCrossOrigin();

google.gears.workerPool.onmessage = function(a, b, message) {
  var type = message.body.type;
  var id = message.body.id;
  switch( type ) {
  case "ping":
  default:
    break;
  }
  google.gears.workerPool.sendMessage({id: message.body.id, res:"starting request"}, message.sender);
  var request = google.gears.factory.create('beta.httprequest');
  request.open("GET", "http://127.0.0.1:2001/test");
  request.onreadystatechange = function() {
    if( request.readyState == 4 ) {
      google.gears.workerPool.sendMessage({id: message.body.id, res:request.responseText}, message.sender);
    }
  }
  request.send();
}
