const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

let deleteUsers = () => {
  return knex('users').del();
}

let deleteCreations = () => {
  return knex('images').del();
}

deleteCreations().then(() => {
  return deleteUsers();
});
