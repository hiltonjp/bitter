exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('images', table => {
      table.string('title').notNullable().defaultTo("Untitled Creation");
    }),
  ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.table('images', table => {
      table.dropColumn('title');
    });
};
