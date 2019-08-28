$(function () {

    var socket = io();

    socket.emit('join', getUser());

    //Send message
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      
      let msg = {
          username: getUser(),
          content: $('#m').val()
      }
      socket.emit('chat message', msg);
      msg.username = 'You'
      showMessage(msg, true);
      $('#m').val(''); // clear box
      return false;
    });

    socket.on('chat message', function(msg){
        showMessage(msg, false);
    });

    socket.on('joined', function(user){
        let message = `${user} as joined the room !`
        showSystemMessage(message, "blue");
    });

    socket.on('welcome', function(msg){
        showSystemMessage(msg,"");
    });

    socket.on('bye', function(user){
        let message = `${user} as leaved the room, bye bye !`
        showSystemMessage(message,"red");
    });

    $(window).on("beforeunload", function() {
        socket.emit('leave', getUser());
    })

    function showMessage(message, self){
        let mclass = ""
        if (self) {
           mclass = 'self'; 
        }
        $('#messages').append($('<li>').addClass(mclass).html(`<strong>${message.username}</strong>: ${message.content}`));
    }

    function showSystemMessage(message, color){
        $('#messages').append($('<li>').addClass(color).text(message));
    }

    function getUser(){
        let usr = localStorage.getItem('username');
        if (!usr){
            usr = prompt('What is your name ?');
            usr.setItem('username', user);
        }
        return usr;
    }

  });