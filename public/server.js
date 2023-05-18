// server.js

const io = require('socket.io')(3000);
const carStates = new Map();

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Emit a player-joined event to all other clients
    socket.broadcast.emit('player-joined', socket.id);

    // Listen for car updates from the client
    socket.on('car-update', (carState) => {
        // Update the car's state
        carStates.set(socket.id, carState);

        // Broadcast the car's state to all other clients
        socket.broadcast.emit('car-update', carState);

        // Broadcast all other cars' states to the client
        const otherCarStates = Array.from(carStates.entries())
            .filter(([id]) => id !== socket.id)
            .map(([id, state]) => ({ id, ...state }));
        socket.emit('other-car-update', otherCarStates);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);

        // Remove the car's state
        carStates.delete(socket.id);

        // Emit a player-left event to all other clients
        socket.broadcast.emit('player-left', socket.id);
    });
});
