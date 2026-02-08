const path = require('path');
const dotenv = require('dotenv');

// Ensure .env is loaded (Strapi may not load it when ENV_PATH is unset)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DEFAULT_SQLITE_CONNECTION = {
  connection: {
    client: 'sqlite',
    connection: { filename: path.join(__dirname, '..', '.tmp', 'data.db') },
    useNullAsDefault: true,
    acquireConnectionTimeout: 60000,
  },
};

module.exports = ({ env }) => {
  try {
    const client = env('DATABASE_CLIENT', 'sqlite');
    const VALID_CLIENTS = ['sqlite', 'postgres', 'mysql'];
    const resolvedClient = VALID_CLIENTS.includes(client) ? client : 'sqlite';

    const connections = {
      mysql: {
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 3306),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
      },
      postgres: {
        connection: {
          connectionString: env('DATABASE_URL'),
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
      },
      sqlite: {
        connection: {
          filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
    };

    const connectionConfig = connections[resolvedClient];
    if (!connectionConfig) {
      throw new Error(`Invalid DATABASE_CLIENT: "${client}". Use one of: ${VALID_CLIENTS.join(', ')}`);
    }
    const result = {
      connection: {
        client: resolvedClient,
        ...connectionConfig,
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
    if (!result.connection || result.connection.client === undefined) {
      return DEFAULT_SQLITE_CONNECTION;
    }
    return result;
  } catch (err) {
    console.warn('[config/database.js] Error loading database config, using SQLite default:', err?.message || err);
    return DEFAULT_SQLITE_CONNECTION;
  }
};
