var wp = google.gears.workerPool;
wp.allowCrossOrigin();

var clientDomain = "http://127.0.0.1:2000";

wp.onmessage = function(a, b, message) {
  var origin = message.origin;
  if( origin != clientDomain ) {
    wp.sendMessage({res:"Invalid client origin:" + origin}, message.sender);
    return;
  }
  wp.sendMessage({res:"starting request"}, message.sender);
  var request = google.gears.factory.create('beta.httprequest');
  request.open("GET", "http://127.0.0.1:2001/test");
  request.onreadystatechange = function() {
    if( request.readyState == 4 ) {
      wp.sendMessage({res:request.responseText}, message.sender);
    }
  }
  request.send();
};
