const pJson = require('../../package');
const {SocketEvents} = require('battleship-shared-module');

module.exports = (socket, next) => {
    const {accept} = socket.handshake.query;

    const {version} = pJson;

    const splitedVersion = version.split('.');
    const acceptVersionSplited = accept.split('.');

    if (splitedVersion[0] !== acceptVersionSplited[0] || splitedVersion[1] !== acceptVersionSplited[1]) {
        socket.emit(SocketEvents.WRONG_API_VERSION);
        socket.close();
        return;
    }

    next();
};
