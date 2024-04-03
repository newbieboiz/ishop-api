// import MongoStore from 'connect-mongo';
import { SessionOptions } from 'express-session';

import configEnv from '.';

function getSessionConfig(): SessionOptions {
  const SESSION_SECRET = configEnv.get('session.secret');
  const DATABASE_URL = configEnv.get('database.url');
  const SESSION_EXPIRES_IN = configEnv.get('session.expiresIn');
  const isProduction = configEnv.get('env') === 'production';

  // const store = MongoStore.create({
  //   mongoUrl: DATABASE_URL,
  //   dbName: 'test-app',
  //   collectionName: 'session',
  //   crypto: { secret: SESSION_SECRET },
  // });

  const sessionConfig: SessionOptions = {
    secret: SESSION_SECRET,
    // store,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_EXPIRES_IN,
      secure: isProduction ? true : false,
    },
  };

  return sessionConfig;
}

export default getSessionConfig;
