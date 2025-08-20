const Workout = require("../models/Workout");

module.exports.addWorkout = async (req, res) => {
  const { name, duration } = req.body;

  if (!name || !duration) {
    return res.status(400).send({ message: "Missing required fields: name, or duration" });
  }

   try {
    
    const userId = req.user._id; 

    const existingWorkout = await Workout.findOne({ userId, name });

    if (existingWorkout) {
      return res.status(409).send({ message: "Workout already exists" });
    }

    const newWorkout = new Workout({ userId, name, duration });
    const savedWorkout = await newWorkout.save();

    return res.status(200).send(savedWorkout);
  } catch (err) {
    console.error("Error adding workout:", err);
    return res.status(500).send({ message: "Failed to add workout" });
  }
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
      return res.status(404).send({ message: "No workouts found" });
    }
   
    const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, updates, { new: true });
   
    return res.status(200).send({
      message: "Workout Updated Successfully",
      updatedWorkout: updatedWorkout
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
			return res.status(404).send({message: "No workouts found"});
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
      return res.status(404).send({ message: "No workouts found" });
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