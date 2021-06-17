module.exports = {
  DBURL:
    'mongodb://' +
    process.env.MONGO_SERVER_HOST +
    ':' +
    process.env.MONGO_SERVER_PORT +
    '/' +
    process.env.MONOGO_DB_NAME,
  // JWT variables
  CLIENT_TOKEN_EXPIRY_DURATION: process.env.CLIENT_TOKEN_EXPIRY_DURATION, // token expiry time Eg: 60, "2 days", "10h", "7d"
  CLIENT_IDENTIFIER_SECRET: process.env.CLIENT_IDENTIFIER_SECRET,
  CRYPTR_SECRET: process.env.CRYPTR_SECRET, // Secret key for CRYPTR plugin
  // STORAGE OPTION
  STORAGE_OPTION: process.env.STORAGE_OPTION,
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
};
