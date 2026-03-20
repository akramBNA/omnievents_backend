const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.NEON_DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate()
  .then(() => console.log('Connected to Neon DB'))
  .catch(err => console.error('Connection error:', err));

module.exports = { sequelize };