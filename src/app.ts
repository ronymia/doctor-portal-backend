import cors from 'cors';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import notFoundRoute from './app/middlewares/notFoundRoute';
import path from 'path';

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VIEW ENGINE SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/app/views'));

// Application routes
app.use('/api/', routes);

//global error handler
app.use(globalErrorHandler);

//handle not found route
app.use(notFoundRoute);

export default app;
