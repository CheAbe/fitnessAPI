const User = require("../models/User");

const bcrypt = require("bcrypt");
const auth = require("../auth"); 

module.exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).send({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10); 
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
    });
   
    const result = await newUser.save();

 
    return res.status(201).send({
      message: 'User registered successfully' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
      

module.exports.loginUser = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.body.email });

    if (!result) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

    if (isPasswordCorrect) {
      const accessToken = auth.createAccessToken(result);
      return res.status(200).send({ access: accessToken });
    } else {
      return res.status(400).send({ message: 'Incorrect email or password' });
    }

  } catch (error) {
    
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports.getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send({ 
    	user: {id: user._id, email: user.email,  __v: user.__v }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

