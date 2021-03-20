"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const method_override_1 = __importDefault(require("method-override"));
const middleware_1 = require("@modules/middleware");
const auth_1 = __importDefault(require("@routes/auth"));
const dashboard_1 = __importDefault(require("@routes/dashboard"));
const root_1 = __importDefault(require("@routes/root"));
const index_1 = __importDefault(require("@root/index"));
const rate_limiter_1 = __importDefault(require("@modules/rate-limiter"));
const api_utils_1 = require("@modules/api-utils");
const app = express_1.default();
app.set('views', path_1.join(__dirname, "Views"));
app.set('view engine', 'pug');
app.use(rate_limiter_1.default);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(method_override_1.default('_method'));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.join(__dirname, "Assets")));
app.locals.basedir = path_1.join(__dirname, "Assets");
app.use("/api/servers/:id/music", middleware_1.updateUser, middleware_1.validateUser, middleware_1.updateGuilds, middleware_1.validateGuild);
app.use("/api", (req, res) => res.json({ hello: "earth " }));
app.use("/api/*", (req, res) => api_utils_1.sendError(res, { code: 404, message: "Not found." }));
app.use('/', middleware_1.updateUser, root_1.default, auth_1.default, middleware_1.validateUser, middleware_1.updateGuilds, dashboard_1.default);
app.all('*', (req, res) => res.render('Errors/404', {
    client: index_1.default
}));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The dashboard is live on http://localhost:${port} !`));
//# sourceMappingURL=server.js.map