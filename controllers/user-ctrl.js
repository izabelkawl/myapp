import User from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/security.js";
import { generateToken } from "../utils/security.js";
import { DatabaseInsertError } from "../errors/database.js";

// Load input validation
import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";
import validatePassword from  "../validation/password.js";
import validateUpdateUser from "../validation/updateUser.js";

import isEmpty from "is-empty";
//same

// @route POST api/users/register
// @desc Register user
// @access Public
const createUser = async (req, res) => {
  const userData = req.body;
  const { errors, isValid } = validateRegisterInput(userData);
  const isEmailUsed = await User.findOne({ email: userData.email });

  if (!isValid) return res.status(400).json(errors);
  if (!!isEmailUsed)
    return res.status(400).json({ email: "*Adres email jest już zajęty." });

  userData.password = await hashPassword(userData.password);

  const processedUser = new User(userData);

  try {
    processedUser.save();
  } catch (error) {
    throw new DatabaseInsertError(error.message);
  }
  
  return res.status(200).json({
    success: true,
    message: "*Rejestracja powiodła się!",
  });
};

//Login
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
const loginUser = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!isValid) return res.status(400).json(errors);

  const processedUser = await User.findOne({ email });

  if (!processedUser)
    return res
      .status(400)
      .json({ emailnotfound: "*Nieprawidłowy adres email." });

  const isPasswordValid = await comparePassword(
    password,
    processedUser.password
  );

  if (!isPasswordValid)
    return res
      .status(400)
      .json({ passwordincorrect: "*Nieprawidłowe hasło" });

  else {
    const payload = {
      id: processedUser.id,
      email: processedUser.email,
      firstname: processedUser.firstname,
      lastname: processedUser.lastname,
      address: processedUser.address,
      phone: processedUser.phone,
      position: processedUser.position,
    };

    return res
      .status(200)
      .json({ success: true, token: `Bearer ${generateToken(payload)}` });
  }
};

const updateUser = async (req, res) => {

  const fieldsToUpdate = { ...req.body };
  // pobiera password z formularza
  const password = req.body.password;
  // znajdz jednego użytkownika 
  const processedUser = await User.findOne({ _id: req.params.id });

  const isPasswordValid = await comparePassword(
    password,
    processedUser.password
  );

  if (!isPasswordValid)
    return res
      .status(400)
      .json({ passwordincorrect: "*Nieprawidłowe hasło" });

  if (isEmpty(fieldsToUpdate))
    return res.status(400).json({
      success: false,
      message: "*Wypełnij puste komórki.",
    });


  for (const field in fieldsToUpdate)
    processedUser[field] = fieldsToUpdate[field];

  try {
    await processedUser.save();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      id: processedUser._id,
      message: "*Aktualizacja nie powiodła się!",
    });
  }

  return res.status(200).json({
    success: true,
    id: processedUser._id,
    message: "*Aktualizacja powiodła się!",
  });
};

const updateUserAdmin = async (req, res) => {

  const fieldsToUpdate = { ...req.body };
  const processedUser = await User.findOne({ _id: req.params.id });
  if (isEmpty(fieldsToUpdate))
    return res.status(400).json({
      success: false,
      message: "*Wypełnij puste komórki.",
    });
  for (const field in fieldsToUpdate)
    processedUser[field] = fieldsToUpdate[field];
    
  if (isEmpty(fieldsToUpdate))
  return res.status(400).json({
    success: false,
    message: "*Wypełnij puste komórki.",
  });
  
  try {
    await processedUser.save();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      id: processedUser._id,
      message: "*Aktualizacja nie powiodła się!",
    });
  }

  return res.status(200).json({
    success: true,
    id: processedUser._id,
    message: "*Aktualizacja powiodła się!",
  });
};

const updateUserEmail = async (req, res) => {

  const fieldsToUpdate = { ...req.body };
  const password = req.body.password;
  const processedUser = await User.findOne({ _id: req.params.id });

  const isPasswordValid = await comparePassword(
    password,
    processedUser.password
  );

  fieldsToUpdate.password = await hashPassword( fieldsToUpdate.password );
  
  if (!isPasswordValid){
    return res
      .status(400)
      .json({ passwordincorrectemail: "*Nieprawidłowe hasło" });
  }
      
  for (const field in fieldsToUpdate)
  processedUser[field] = fieldsToUpdate[field];
  
    try {
      processedUser.save();
    } catch (error) {
      throw new DatabaseInsertError(error.message);
    }
  return res.status(200).json({
    success: true,
    id: processedUser._id,
    message: "*Aktualizacja powiodła się!"
  });
};

const updateUserPassword = async (req, res) => {
 
  const fieldsToUpdate = { ...req.body };
  const password = req.body.password;
  const passwordchange = req.body.passwordchange;
  const passwordchange2 = req.body.passwordchange2;

  const { errors, isValid } = validatePassword(fieldsToUpdate);
  
  const processedUser = await User.findOne({ _id: req.params.id });

  if (!isValid) return res.status(400).json(errors);

  const isPasswordValid = await comparePassword(
    password,
    processedUser.password
  );

  fieldsToUpdate.password = await hashPassword( passwordchange );
  
  if (!isPasswordValid){
    return res
      .status(400)
      .json({ passwordincorrectpassword: "*Nieprawidłowe hasło" });
  }
      
  for (const field in fieldsToUpdate)
  processedUser[field] = fieldsToUpdate[field];
  
    try {
      processedUser.save();
    } catch (error) {
      throw new DatabaseInsertError(error.message);
    }
  return res.status(200).json({
    success: true,
    id: processedUser._id,
    message: "*Aktualizacja powiodła się!"
  });
};


const deleteUser = async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }

    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

const getUserById = async (req, res) => {
  await User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

const getUsers = async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!users.length) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: users });
  }).catch((err) => console.log(err));
};

export default {
  updateUserEmail,
  updateUserPassword ,
  createUser,
  updateUserAdmin,
  loginUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
};
