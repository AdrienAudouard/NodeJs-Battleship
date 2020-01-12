const {SocketEvents} = require('battleship-shared-module');
const HEADERS = require('../models/headers');

module.exports = (socket, next) => {
    const keys = Object.keys(HEADERS);

    for (const key of keys) {
        const value = socket.handshake.query[key];

        if(!value || !value.match(HEADERS[key])) {
            socket.emit(SocketEvents.WRONG_HEADER, 'Headers are incorrect');
            socket.close();
            return;
        }
    }

    next();
};
