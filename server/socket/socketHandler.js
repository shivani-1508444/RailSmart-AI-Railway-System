const socketIO = require('socket.io');

let io;

const socketHandler = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log('[WebSocket] Client connected:', socket.id);

    socket.on('joinPNR', (pnr) => {
      socket.join(`pnr_${pnr}`);
      console.log(`Socket ${socket.id} joined room pnr_${pnr}`);
    });

    socket.on('joinTrain', (trainNumber) => {
      socket.join(`train_${trainNumber}`);
      console.log(`Socket ${socket.id} joined room train_${trainNumber}`);
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = socketHandler;
module.exports.getIO = getIO;