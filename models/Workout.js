const mongoose = require ("mongoose");

const workoutSchema = new mongoose.Schema({

userId: {
	type: String,
	required: [true, "User Id is required"]
},

name: {
	type: String,
	required: [true, "Name is required"]
},

duration: {
	type: String,
	required: [true, "Duration is required"]
},

dateAdded: {
	type: Date,
	default: Date.now,
},

status: {
	type: String,
	default: "pending"
}

})

module.exports = mongoose.model("Workout", workoutSchema)