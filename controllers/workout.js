const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {
  Workout.findOne({ userId: req.body.userId, name: req.body.name  })
    .then(existingWorkout => {
      if (existingWorkout) {
        return res.status(409).send({ message: "Workout already exists" });
      } else {
        const newWorkout = new Workout({
          userId: req.body.userId,
          name: req.body.name,
          duration: req.body.duration,
        });

        return newWorkout.save()
          .then((addedWorkout) => {
            return res.status(200).send(addedWorkout);
          })
          .catch(err => {
            console.error(err);
            return res.status(500).send({ message: "Failed to add workout" });
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send({ message: "Failed to check existing workout" });
    });
};


module.exports.getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });

    if (workouts.length > 0) {
      return res.status(200).send({
        workouts: workouts
      });
    } else {
      return res.status(404).send({ message: "No workouts found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports.updateWorkout = async (req, res) => {
  try {
    const updates = req.body;  
    const workoutId = req.params.id;  

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
   
    const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, updates, { new: true });
   
    return res.status(200).send({
      message: "Workout Updated Successfully",
      workout: updatedWorkout,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports.deleteWorkout = async (req, res) => {
	const workoutId = req.params.id;

	try{
		const deleteWorkout = await Workout.findByIdAndDelete(workoutId);

		if(!deleteWorkout){
			return res.status(404).send({message: "Workout not found"});
		}
		res.status(200).send({message: "Workout deleted successfully"});
	} catch (error){
	  console.error("Error:", err);
      return res.status(500).send({ message: "Internal server error" });	
	}
}

module.exports.completeWorkoutStatus = async (req, res) => {
  try {
  	const workoutId = req.params.id;  
    
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId, 
      { status: "completed" },  
      { new: true }  
    );

    
    if (!updatedWorkout) {
      return res.status(404).send({ message: "Workout not found" });
    }

    
    return res.status(200).send({
      message: "Workout status updated successfully",
      updatedWorkout
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};