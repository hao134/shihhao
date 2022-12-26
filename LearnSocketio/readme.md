# socket.io

# socketio101 Note
### https://github.com/hao134/shihhao/tree/main/LearnSocketio/socket_io/socketio101

1. Socket emit is going to send this event to the socket; Socket on is going to listen for this event from socket

- **io.on**: means listen for an event on the namespace from ANY socket. So in the chat app, if any socket joins the server, run a callback. Generally, we use it for the connect event.
- **socket.on**: means listen for an event from a particular (ONE) socket. The occasion we use that in the Slack app is when we get a message from a socket. We need to know which one sent it so we can add the correct Avatar, user, etc. This is the one you will use most of the time.

## flow

1.  在 chat.html

```
document
    .querySelector("#message-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const newMessage = document.querySelector("#user-message").value;
      socket.emit("newMessageToServer", { text: newMessage });
    });
```

在 form 中繳出的 message 透過 socket emit 傳送到後端

2. 在 chat.js

```
socket.on("newMessageToServer", (msg) => {
    //console.log(msg);
    io.emit("messageToClients", { text: msg.text });
  });
```

在後端收到前端收到的 message 後(newMessageToServer),廣播到所有 socket(io.emit)

3. 在 chat.html

```
socket.on("messageToClients", (msg) => {
    console.log(msg);
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
  });
```

收到訊息(messageToClients)後，在 html 的特定區塊(id = messages)中條列出訊息

# socketio201 Note
### https://github.com/hao134/shihhao/tree/main/LearnSocketio/socket_io/socketio201

quick note on name spaces, name spaces are just the bucket inside of the socket.io server, like the workspaces in slack or there like overall accounts that you have with your one email address

## Namespace/Group Cheatsheet

**All these are server only**

- Send an event from the server to this socket only:

```
socket.emit()
socket.send()
```

- Send an event from a socket to a room:
  NOTE: remember, this will not go to the sending socket

```
socket.to(roomName).emit()
socket.in(roomName).emit()
```

- Because each socket has it's own room, named by it's socket.id, a socket can send a messae to another socket:

```
socket.to(anotherSocketId).emit('hey');
socket.in(anotherSocketId).emit('hey');
```

- A namespace can send a message to any room:

```
io.of(aNamespace).to(roomName).emit()
io.of(aNamespace).in(roomName).emit()
```

- A namespace can send a message to the entire namespace

```
io.emit()
io.of('/').emit()
io.of('/admin').emit()
```
