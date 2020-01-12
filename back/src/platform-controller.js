module.exports = class PlatformController {
    constructor() {
        this.platformConnected = {};
    }

    newConnection(platform) {
        if (this.platformConnected[platform] === undefined) {
            this.platformConnected[platform] = 0;
        }

        this.platformConnected[platform] += 1;

        console.log(this.platformConnected);
    }

    newDeconnection(platform) {
        this.platformConnected[platform] -= 1;
        console.log(this.platformConnected);
    }
};
