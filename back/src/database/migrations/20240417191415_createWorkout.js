exports.up = (knex) =>
  knex.schema.createTable("workout", (table) => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users");
    table.string("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("times_completed").defaultTo(0);
    table.timestamp("last_completed_at").defaultTo(null);
  });

exports.down = (knex) => knex.schema.dropTable("workout");
