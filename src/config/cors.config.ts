import { CorsOptions } from 'cors';

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];

const corsConfig: CorsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export default corsConfig;
