
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('images', table => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('data').notNullable();
      table.integer('creator_id').unsigned().notNullable().references('id').inTable('users');
      table.integer('univ_edit').unsigned().notNullable();
      table.dateTime('created').notNullable();
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('images'),
  ])
};
