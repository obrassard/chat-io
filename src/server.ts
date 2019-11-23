import express from 'express';
import socketio from "socket.io";
import { SessionService } from './services/sessionService';
import bodyParser from 'body-parser';
import { Session } from 'inspector';
import { SessionDataStore } from './models/sessionDataStore';

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const app_port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionService = new SessionService();

app.use(express.static('public'));

// ============= ROUTES =====================

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.get('/room', function(req, res){
  res.sendfile('public/room.html');
});

app.post('/create', function(req, res){
  let body = req.body;

  if (isNullOrEmpty(body.username) || isNullOrEmpty(body.password) || isNullOrEmpty(body.email)){
    res.status(400).send("Bad request");
  } else {
    try {
      let sessionDto = sessionService.createSession(body.password, body.username, body.email);
      res.send(sessionDto);
    } catch (e) {
      res.status(403).send({ error : 'Unauthorized', exception : e});
    }
  }
});

app.post('/join', function(req, res){
  let body = req.body;
  
  if (isNullOrEmpty(body.identifier) || isNullOrEmpty(body.username) || 
      isNullOrEmpty(body.password) || isNullOrEmpty(body.email)){
    res.status(400).send("Bad request");
  } else {
    try {
      let sessionDto = sessionService.joinSession(body.identifier, body.password, body.username, body.email);
      res.send(sessionDto);
    } catch (e) {
      res.status(403).send({ error : 'Unauthorized', exception : e});
    }
  }
});

// ============= SOCKET =====================

io.on('connection', function(socket){

    //TODO catch si les infos de session sont absentes
    let session = { uid: socket.request._query.uid,
                    identifier: socket.request._query.session };
    console.log(session);

    // socket.disconnect();
    // socket.emit('welcome', 'This is a pram '+ test);
    socket.on('join', function(user){
        console.log('join: ' + user);

        /// Send welcome to new user
        socket.emit('welcome', `Hello ${user} !`)

        /// Send join notification to other users
        socket.broadcast.emit('joined',user);
    });

    /// Send 'user leaved' message to other
    socket.on('leave', function(user){
        console.log(user + ' leaved');
        socket.broadcast.emit('bye',user);
    });

    /// Send message to everyone
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);
    });
});

http.listen(app_port, function(){
  console.log('Listening on http://localhost:'+app_port);
});


// ============= SCHEDULED EVENT =====================

setInterval(() => {
  console.log('Auto event');
  // TODO Clear expired sessions
}, 30000)


// ============= Utilities =====================

function isNullOrEmpty(string: String){
  return (string == null || string.trim() == "");
}