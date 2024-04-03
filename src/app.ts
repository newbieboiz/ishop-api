import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import path from 'path';

import corsConfig from '@/config/cors.config';
import errorHandler from '@/middlewares/error-handler';

import configEnv from './config';

export class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    const SERVER_PORT = configEnv.get('serverPort');
    this.app.listen(SERVER_PORT, () => {
      console.log(`Server listening on the port ${SERVER_PORT}`);
    });
  }

  private initializeMiddleware() {
    // Be used to enable CORS with various options.
    this.app.use(cors(corsConfig));

    // Helmet helps secure Express apps by setting HTTP response headers.
    this.app.use(helmet());

    // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    this.app.use(cookieParser());

    // To manage sessions
    // this.app.use(session(getSessionConfig()));

    // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(bodyParser.json({ limit: '5mb' }));

    // It serves static files.
    this.app.use(express.static(path.join(process.cwd(), 'static')));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(configEnv.get('apiPrefix'), controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
}
