import express from 'express';
import socketio from "socket.io";

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const app_port = process.env.PORT || 3000

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('public/room.html');
});

app.post('/create', function(req, res){
  // TODO Create new session (return Session dto)
});

app.post('/join', function(req, res){
  // TODO
});

io.on('connection', function(socket){
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

// TODO Clear expired sessions

http.listen(app_port, function(){
  console.log('Listening on http://localhost:'+app_port);
});
