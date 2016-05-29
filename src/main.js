import page from 'page'
import getGifAndUpdateDOM from 'vis/gif.js'

var api = 'ws://localhost:4200'

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

page('/*', function(context, next){
    // http://usualcarrot.com/nodejs-and-websocket-simple-chat-tutorial
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    console.log(context)
    var connection = new WebSocket(api);
    connection.onopen = function () {
        console.log('connected!');
        console.log(context)
        if (context.params[0]) {
            let params = {
                'type': 'iterate',
                'payload': {
                    'timestamp': context.params[0]
                }
            }
            connection.send(JSON.stringify(params));
        }
     };
 

    connection.onerror = function (error) {
        console.log(error)
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
            getGifAndUpdateDOM(json.nextStaNm)
            history.replaceState(null, null, json.prdt);
            console.log(json.nextStaNm);
        } catch (error) {
            console.log(error);
            return;
     }
    };
});


page('/follow', function(ctx, next){
    // http://usualcarrot.com/nodejs-and-websocket-simple-chat-tutorial
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var connection = new WebSocket(api);
    
    connection.onopen = function () {
        let params = {
              'type': 'iterate',
              'payload': {
                  'rn': getUrlVars()["rn"],
                  'prdt': getUrlVars()["ts"]
              }
          }
          
          connection.send(params);
    };

    connection.onerror = function (error) {
        console.log(error)
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);

            console.log(json);
        } catch (error) {
            console.log(error);
            return;
     }
        // handle incoming message
    };
});

page();