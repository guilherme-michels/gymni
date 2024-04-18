const { Router } = require("express");

const WorkoutController = require("../controllers/WorkoutController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const workoutRoutes = Router();

const workoutController = new WorkoutController();

workoutRoutes.use(ensureAuthenticated);

workoutRoutes.get("/", workoutController.index);
workoutRoutes.post("/", workoutController.create);

module.exports = workoutRoutes;
