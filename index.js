const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const app_port = process.env.PORT || 3000
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

io.on('connection', function(socket){
    
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
  console.log('listening on *:'+app_port);
});
