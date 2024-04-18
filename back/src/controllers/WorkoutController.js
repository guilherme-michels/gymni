const AppError = require("../utils/AppError");
const knex = require("../database");
const WorkoutExerciseController = require("./WorkoutExerciseController");

const workoutExerciseController = new WorkoutExerciseController();

class WorkoutController {
  async index(request, response) {
    const user_id = request.user.id;
    const workouts = await knex("workout")
      .select("*")
      .where({ user_id })
      .orderBy("created_at", "desc");

    for (let workout of workouts) {
      const workout_id = workout.id;
      workout.exercises =
        await workoutExerciseController.getExercisesByWorkoutId(workout_id);
    }

    return response.json(workouts);
  }

  async create(request, response) {
    const { description, exercises } = request.body;
    const user_id = request.user.id;
    if (!description || !exercises || exercises.length === 0) {
      throw new AppError("Informe a descrição e pelo menos um exercício.");
    }
    const [workout_id] = await knex("workout").insert({ user_id, description });
    const exercisesData = exercises.map((exercise) => ({
      workout_id,
      exercise_id: exercise.id,
    }));
    await knex("workout_exercises").insert(exercisesData);
    return response.status(201).json({ workout_id });
  }

  async update(request, response) {
    const { workout_id } = request.params;
    const { description, exercises } = request.body;
    const existingWorkout = await knex("workout")
      .where({ id: workout_id })
      .first();
    if (!existingWorkout) {
      throw new AppError("Treino não encontrado.", 404);
    }
    if (description) {
      await knex("workout").where({ id: workout_id }).update({ description });
    }
    if (exercises && exercises.length > 0) {
      await knex("workout_exercises").where({ workout_id }).del();
      const exercisesData = exercises.map((exercise) => ({
        workout_id,
        exercise_id: exercise.id,
      }));
      await knex("workout_exercises").insert(exercisesData);
    }
    return response.status(200).json();
  }
}

module.exports = WorkoutController;
