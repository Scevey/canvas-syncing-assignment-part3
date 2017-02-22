
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    // if err, throw it for now
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};
const drawList = {};
const app = http.createServer(handler);
const io = socketio(app);
app.listen(PORT);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('draw', (data) => {
    drawList[data.user] = { coords: data.coords, user: data.user, lastUpdate: data.lastUpdate };

    io.sockets.in('room1').emit('draw', drawList);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});
