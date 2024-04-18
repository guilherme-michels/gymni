const { Router } = require("express");

const WorkoutController = require("../controllers/WorkoutController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const workoutRoutes = Router();

const workoutController = new WorkoutController();

workoutRoutes.use(ensureAuthenticated);

workoutRoutes.get("/", workoutController.index);
workoutRoutes.post("/", workoutController.create);
workoutRoutes.get("/:id", workoutController.show);
workoutRoutes.put("/history/:id", workoutController.history);

module.exports = workoutRoutes;
