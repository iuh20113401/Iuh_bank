const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let newUser = [];
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }})
io.on('connection', (socket) => {
  console.log('A client connected.');
  // Listen for 'join' event
  socket.on('join', (room) => {
    const index = newUser.findIndex(item => item.id === room);
    if(index == -1){
      newUser.push({id: room, value: 0})
      console.log(index)
    }
  });
  socket.on('admin', message => {
    console.log(message);
  });
  // Listen for 'leave' event
  socket.on('leave', (room) => {
    // Leave the specified room
    socket.leave(room);
    console.log(`Client left room: ${room}`);
  });
 
  // Listen for 'message' event
  socket.on('userValue', (data) => {
    console.log(data.id)
    console.log(data.value)
    for (let i = 0; i < newUser.length; i++) {
    if (newUser[i].id === data.id) {
      newUser[i].value = data.value;
      console.log(newUser[i]);
      break; // Stop looping once we find the match
  }}
    
  });
  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

app.post('/admin', (req, res) => {
  console.log(newUser);
  res.send(newUser); 
});
app.post('/login', (req, res) => {
  const { account } = req.body;
  const admin = '0xCB13eb42CF5acFc5E7B27Cb5fdb217c0dc318fAD';
  let newRedirect= 0;
  if(account == admin){
    newRedirect = '2';
  }else{
    newRedirect = '1';}
  res.send(newRedirect);
});
app.post('/request', (req, res) => {
  const {account}  = req.body;
  for (let i = 0; i <= newUser.length; i++) {
  if (newUser[i].id === account) {
    const value = newUser[i].value;
    res.send(value);
    break; // Stop looping once we find the match
  }
}});
app.post('/delete', (req, res) => {
  const {account}  = req.body;
  for (let i = 0; i <= newUser.length; i++) {
  if (newUser[i].id == account) {
    newUser.splice(i,1);
    console.log(newUser);
    break; // Stop looping once we find the match
  }
}
});
http.listen(3000, () => {
  console.log('listening on *:3000');
});

