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
    await knex("workout_exercise").insert(exercisesData);
    return response.status(201).json();
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
      await knex("workout_exercise").where({ workout_id }).del();
      const exercisesData = exercises.map((exercise) => ({
        workout_id,
        exercise_id: exercise.id,
      }));
      await knex("workout_exercise").insert(exercisesData);
    }
    return response.status(200).json();
  }

  async show(request, response) {
    try {
      const { id } = request.params;

      const workout = await knex("workout").where({ id }).first();

      if (!workout) {
        return response.status(404).json({ error: "Treino não encontrado." });
      }

      const workoutExerciseController = new WorkoutExerciseController();
      const exercises = await workoutExerciseController.getExercisesByWorkoutId(
        id
      );

      workout.exercises = exercises;

      return response.json(workout);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao buscar o treino." });
    }
  }

  async history(request, response) {
    const { id } = request.params;

    try {
      const workout = await knex("workout").where({ id: id }).first();

      if (!workout) {
        return response.status(404).json({ error: "Treino não encontrado." });
      }

      await knex("workout")
        .where({ id: id })
        .update({
          last_completed_at: knex.fn.now(),
          times_completed: workout.times_completed
            ? knex.raw("times_completed + 1")
            : 1,
        });

      return response
        .status(200)
        .json({ message: "Histórico atualizado com sucesso." });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro ao atualizar o histórico do treino." });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const deletedCount = await knex("workout").where({ id: id }).del();

      if (deletedCount === 0) {
        throw new AppError("Treino não encontrado.", 404);
      }

      await knex("workout_exercise").where({ id }).del();

      return response
        .status(200)
        .json({ message: "Treino deletado com sucesso." });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao deletar o treino." });
    }
  }
}

module.exports = WorkoutController;
