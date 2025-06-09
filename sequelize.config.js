require('dotenv/config')
const env = process.env

module.exports = {
  replication: {
    write: {
      host: env.DB_HOST,
      port: env.DB_PORT || 5432,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    },
    read: [{
      host: env.DB_HOST,
      port: env.DB_PORT || 5432,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    }],
  },
  dialect: 'postgresql',
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  logQueryParameters: true,
}
