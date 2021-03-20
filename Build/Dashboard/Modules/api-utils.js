"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
function sendError(res, json) {
    if (!json.code)
        json.code = 400;
    if (!json.message)
        json.message = "An unknown error occurred.";
    res.status(400).json({
        code: json.code,
        message: json.message
    });
}
exports.sendError = sendError;
;
//# sourceMappingURL=api-utils.js.map