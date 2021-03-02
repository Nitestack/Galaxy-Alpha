import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from "cookie-parser";
import { join } from "path";
import methodOverride from 'method-override';
import { updateUser, validateUser, updateGuilds } from '@modules/middleware';
import authRoutes from '@routes/auth';
import dashboardRoutes from '@routes/dashboard';
import rootRoutes from '@routes/root';
import client from './Modules/auth-client';
export const subTitle = "A multipurpose bot";
const app = express();
app.set('views', join(__dirname, "Views"));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(join(__dirname, "Assets")));
app.locals.basedir = join(__dirname, "Assets");
app.use('/', updateUser, rootRoutes, authRoutes, validateUser, updateGuilds, dashboardRoutes);
app.all('*', (req, res) => res.render('Errors/404', {
    client: client,
    subTitle: "Error 404"
}));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The dashboard is live on https://localhost/${port} !`));