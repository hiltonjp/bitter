exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', table => {
      table.string('fname').notNullable();
      table.string('lname').notNullable();
      table.dropColumn('name');
    }),
  ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
      table.string('name').notNullable();
      table.dropColumn('fname');
      table.dropColumn('lname');
    });
};
