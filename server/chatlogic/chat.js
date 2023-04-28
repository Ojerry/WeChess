
var io
var chatSocket
const initializeChat = (sio, socket) => {
    io = sio 
    chatSocket = socket

    chatSocket.on("sendMessage", sendMessage)
}

function sendMessage({name, message, gameId}, callback) {
    console.log({name, message, gameId})
    io.to(gameId).emit('message', {user: name, text: message})
    callback();
}

exports.initializeChat = initializeChat