"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class Queue {
    constructor(message) {
        this.message = message;
        this.songs = [];
        this.nowPlaying = false;
        this.dispatcher = null;
        this.connection = null;
        this.volume = 50;
        /**
         * `0` = disabled, `1` = song loop, `2` = queue loop
         */
        this.loopMode = 0;
        this.beginningToPlay = null;
        this.beginAt = 0;
        this.stopToPlay = null;
        this.stream = null;
        this.shuffle = false;
        this.autoPlay = false;
        this.panel = null;
    }
    ;
    get isEmpty() {
        return this.songs.length > 0 ? false : true;
    }
    ;
    get queueDurationTimestamp() {
        return this.songs.reduce((prev, next) => prev + next.duration.seconds * 1000, 0);
    }
    ;
    get queueDurationAt() {
        return new Date(this.queueDurationTimestamp);
    }
    ;
    get currentAt() {
        return new Date(this.currentTimestamp);
    }
    ;
    get currentTimestamp() {
        return this.dispatcher.streamTime + this.beginAt;
    }
    ;
    clearQueue() {
        return this.songs = [];
    }
    ;
}
exports.default = Queue;
;
//# sourceMappingURL=Queue.js.map