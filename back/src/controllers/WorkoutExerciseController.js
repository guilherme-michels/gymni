const AppError = require("../utils/AppError");
const knex = require("../database");

class WorkoutExerciseController {
  async index(request, response) {
    const { workout_id } = request.params;
    const exercises = await knex("workout_exercise")
      .select("*")
      .where({ workout_id });
    return response.json(exercises);
  }

  async create(request, response) {
    const { workout_id } = request.params;
    const { exercise_id } = request.body;

    const existingWorkout = await knex("workout")
      .where({ id: workout_id })
      .first();
    if (!existingWorkout) {
      throw new AppError("Treino não encontrado.", 404);
    }

    const existingExercise = await knex("exercises")
      .where({ id: exercise_id })
      .first();
    if (!existingExercise) {
      throw new AppError("Exercício não encontrado.", 404);
    }

    const existingRelation = await knex("workout_exercise")
      .where({ workout_id, exercise_id })
      .first();
    if (existingRelation) {
      throw new AppError(
        "Este exercício já está associado a este treino.",
        400
      );
    }

    await knex("workout_exercise").insert({ workout_id, exercise_id });

    return response.status(201).json({ workout_id, exercise_id });
  }

  async delete(request, response) {
    const { workout_id, exercise_id } = request.params;

    const existingRelation = await knex("workout_exercise")
      .where({ workout_id, exercise_id })
      .first();
    if (!existingRelation) {
      throw new AppError(
        "Relação entre treino e exercício não encontrada.",
        404
      );
    }

    await knex("workout_exercise").where({ workout_id, exercise_id }).del();

    return response.status(204).send();
  }

  async getExercisesByWorkoutId(workout_id) {
    const exercises = await knex("workout_exercise")
      .select("exercises.*")
      .join("exercises", "workout_exercise.exercise_id", "exercises.id")
      .where({ workout_id });
    return exercises;
  }
}

module.exports = WorkoutExerciseController;
