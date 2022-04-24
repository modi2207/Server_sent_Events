var http = require('http');
var fs = require('fs');
const express = require('express');
const { Server } = require('socket.io');
/*
 * send interval in millis
 */
var sendInterval = 5000;
var clients=[]
function sendServerSendEvent(req, res) {
 res.writeHead(200, {
 'Content-Type' : 'text/event-stream',
 'Cache-Control' : 'no-cache',
 'Connection' : 'keep-alive'
 });
 
 var sseId = (new Date()).toLocaleTimeString();
 var c1={
     id:sseId,
     res:res
 }
 clients.push(c1)
 console.log("client id: "+sseId)
//  setInterval(function() {
//  writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
//  }, sendInterval);
 
 writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
}
 
function writeServerSendEvent(res, sseId, data) {
  //res.write('id: ' + sseId + '\n\n');
 res.write("data: " + sseId + '\n\n');
}
 
function sendMessageToClient(peerID,message)
{
       //console.log(req)
       clients.forEach((c)=>
       {
           if(c.id===peerID)
           {
                 console.log("client found to send message")
                 c.res.write("data: "+ message+ '\n\n')
           }
       })
}
const app = express()
 httpServer = http.createServer(app);
 httpServer.listen(1234)


app.get('/talk', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    console.log("request accepted")
    sendServerSendEvent(req, res);
})

//httpServer.listen(1234)
// function eventHandler(req,res,next)
// {
//     sendServerSendEvent(req, res);
// }
//app.get('/talk',eventHandler)

//app.post('/send',sendMessageToClient)

// httpServer=http.createServer(function(req, res) {
//    // console.log("hello")
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         if (req.headers.accept && req.headers.accept == 'text/event-stream') {
//              if (req.url == '/talk') {
//                 console.log("request accepted")
//                 sendServerSendEvent(req, res);
//               } 
//               else if(req.url == '/send')
//               {
//                 sendMessageToClient(req)  
//               }
//               else {
//                 res.writeHead(404);
//                 res.end();
//               }
//         } 
//         else {
//               res.writeHead(200, {
//               'Content-Type' : 'text/html'
//               });
//               res.write(fs.readFileSync(__dirname + '/index.html'));
//               res.end();
//              }
// })

// httpServer.listen(1234)


const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on("connection", socket => {

  console.log("connection established")
  socket.on("peerData", (data,callback) => {

      let {peerID,message}=data
     // console.log("data: "+peerID)
      console.log("peerID: "+peerID+" message: "+message)
      sendMessageToClient(peerID,message)
      callback({success:true})
  });
});