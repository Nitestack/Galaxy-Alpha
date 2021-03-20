"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
;
class Feature {
    /**
     * @param {FeatureInfo} info The feature informations
     */
    constructor(info) {
        this.run = async (client) => {
            throw new Error(`${this.constructor.name} doesn't have a run() method.`);
        };
        this.name = info.name;
    }
    ;
}
exports.default = Feature;
;
//# sourceMappingURL=Feature.js.map