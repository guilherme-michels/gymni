exports.up = function (knex) {
  return knex.schema.createTable("workout_exercise", function (table) {
    table.increments("id").primary();
    table.integer("workout_id").unsigned().references("id").inTable("workout");
    table
      .integer("exercise_id")
      .unsigned()
      .references("id")
      .inTable("exercises");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("workout_exercise");
};
