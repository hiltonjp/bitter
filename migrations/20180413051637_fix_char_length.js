
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('images', table => {
        table.dropColumn('data');
        table.string('pixels', 131072).notNullable();
    }),
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.table('images', table => {
      table.dropColumn('pixels');
      table.string('data', lim).notNullable();
    });
};
