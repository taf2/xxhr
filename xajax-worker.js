/*
  xajax cross domain request handler.

  Request Message:
    Send this to initiate a request to the remote server

  body:
    request:{id:121, path:'/foo/bar', method:'POST'}

  Response Message:
    When the response returns include request info and additional response data.

  body:
    response:{id:121, path:'/foo/bar', method:'POST', status: 'success', responseText:''}
*/
function Request(message) {
  this.requestInfo = message.body;
  this.senderId    = message.sender;
  this.request     = google.gears.factory.create('beta.httprequest');
  this.request.onreadystatechange = this.onStateChange.bind(this);
}
Request.allowed = "http://127.0.0.1:2000";
Request.pool = google.gears.workerPool;

Request.prototype = {
  send: function() {
    this.request.open((this.requestInfo.method||"POST"), this.requestInfo.path);
    this.request.send();
  },
  onStateChange: function() {
    if( this.request.readyState == 4 ) {
      this.onComplete(this.request.status);
    }
  },
  onComplete: function(status) {
    response = {
      id: this.requestInfo.id,
      path: this.requestInfo.path,
      method: (this.requestInfo.method || "POST"),
      status: (status == 200) ? "success" : "failure",
      responseText: this.request.responseText
    }
    Request.pool.sendMessage(response, this.senderId);
  }
}

Request.onmessage = function(message) {
  // verify the request is from an allowed origin
  var origin = message.origin;
  if( origin != Request.allowed ) {
    message.body.status = 'error';
    message.body.responseText = 'Invalid origin';
    this.pool.sendMessage(message.body, message.sender);
    return;
  }

  //Request.pool.sendMessage({id:message.body.id,res:message.body}, message.sender);
  var request = new Request(message);
  request.send();
}

// allow cross origin requests
Request.pool.allowCrossOrigin();

Request.pool.onmessage = function(a, b, message ) {
  //Request.pool.sendMessage({res:"Invalid client origin:" + message.origin}, message.sender);
  Request.onmessage(message);
}
/*
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
};*/

Function.prototype.bind = function() {
  // copy arguments
  var len = arguments.length;
  var args = new Array(len);
  while(len--){ args[len] = arguments[len]; }

  var __bfunc = this;
  var object = args.shift();

  return function() {
    return __bfunc.apply(object, args.concat(arguments));
  }
}
