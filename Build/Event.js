"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
;
class Event {
    /**
     * @param {EventInfos} info The event informations
     */
    constructor(info) {
        this.run = async (client, ...args) => {
            throw new Error(`${this.constructor.name} doesn't have a run() method.`);
        };
        this.name = info.name;
    }
    ;
}
exports.default = Event;
;
//# sourceMappingURL=Event.js.map