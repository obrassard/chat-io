
class Message {
    constructor(sender, text, type) {
        this.sender = sender;
        this.text = text;
        this.type = type;
    }
}

var socket = io();

var messagesList = [];

var app = new Vue({
    el: '#app',
    mounted: function(){
        socket.emit('join', this.getUser());
        this.defineSockets();
        window.addEventListener('beforeunload', () => {
            this.leaveRoom();
        }, false)
    },
    data: {
      messages: messagesList,
      currentMessage: ""
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();
            let msg = new Message(this.getUser(), this.currentMessage, null);
            socket.emit('chat message', msg);
            msg.type = "blue";
            this.messages.push(msg);
            this.currentMessage = "";
        },

        defineSockets() {
            //Show 'Hello user' message
            socket.on('welcome', function(msg){
                messagesList.push(new Message(null, msg, 'inline'));;
            });
        
            // Show 'Other user as join the room'
            socket.on('joined', function(user){
                let text = `${user} as joined the room !`
                messagesList.push(new Message(null, text, 'inline'));
            });
        
            // Show 'Other user as left the room'
            socket.on('bye', function(user){
                let text = `${user} as left the room, bye bye !`
                messagesList.push(new Message(null, text, 'inline'));
            });

            // Display new user message
            socket.on('chat message', function(msg){
                msg.type = "gray";
                messagesList.push(msg)
            });
        },

        getUser(){
            let usr = localStorage.getItem('username');
            if (!usr){
                usr = prompt('What is your name ?');
                localStorage.setItem('username', usr);
            }
            return usr;
        },

        leaveRoom() {
            socket.emit('leave', this.getUser());
        }
    }
})

