
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('hash').notNullable();
      table.string('username').notNullable();
      table.string('fname').notNullable();
      table.string('lname').notNullable();
      table.string('role').notNullable();
      table.string('favcolor');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
  ]);
};
