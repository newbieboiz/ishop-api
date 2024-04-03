import convict from 'convict';
import path from 'path';

convict.addFormat({
  name: 'url-array',
  validate: function (sources) {
    if (!Array.isArray(sources)) {
      throw new Error('must be of type Array');
    }

    for (const source of sources) {
      convict({
        url: {
          doc: 'The source URL',
          format: 'url',
        },
      })
        .load({ url: source })
        .validate();
    }
  },
});

const configEnv = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  serverPort: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'SERVER_PORT',
    arg: 'port',
  },
  apiPrefix: {
    format: String,
    default: '/v1',
    env: 'API_PREFIX',
  },
  cors: {
    whitelist: {
      format: Array,
      default: [] as string[],
    },
  },
  session: {
    secret: {
      format: String,
      default: 'hashed-secret',
      env: 'SESSION_SECRET',
    },
    expiresIn: {
      format: Number,
      default: 3600,
      env: 'SESSION_EXPIRES_IN',
    },
  },
  database: {
    url: {
      format: String,
      default: '',
      env: 'DATABASE_URL',
    },
  },
  token: {
    secret: {
      format: String,
      default: 'hashed-secret',
      env: 'TOKEN_SECRET',
    },
    accessToken: {
      expiresIn: {
        format: Number,
        default: 3600,
        env: 'ACCESS_TOKEN_EXPIRES_IN',
      },
    },
    refreshToken: {
      expiresIn: {
        format: Number,
        default: 43200,
        env: 'REFRESH_TOKEN_EXPIRES_IN',
      },
    },
    verificationToken: {
      expiresIn: {
        format: Number,
        default: 900,
        env: 'VERIFICATION_TOKEN_EXPIRES_IN',
      },
    },
    passwordResetToken: {
      expiresIn: {
        format: Number,
        default: 900,
        env: 'PASSWORD_RESET_TOKEN_EXPIRES_IN',
      },
    },
    twoFactorToken: {
      expiresIn: {
        format: Number,
        default: 300,
        env: 'TWO_FACTOR_TOKEN_EXPIRES_IN',
      },
    },
  },
  appAdminURL: {
    format: String,
    default: 'http://localhost:3001',
    env: 'APP_ADMIN_URL',
  },
  appStoreURL: {
    format: String,
    default: 'http://localhost:3000',
    env: 'APP_STORE_URL',
  },
  resendAPIKey: {
    format: String,
    default: '',
    env: 'RESEND_API_KEY',
  },
  stripeAPIKey: {
    format: String,
    default: '',
    env: 'STRIPE_API_KEY',
  },
  stripeWebhookSecret: {
    format: String,
    default: '',
    env: 'STRIPE_WEBHOOK_SECRET',
  },
});

// // Load environment dependent configuration
// const env = configEnv.get('env');
// configEnv.loadFile(path.join(__dirname, `${env}.json`));

// Perform validation
configEnv.validate({ allowed: 'strict' });

export default configEnv;
