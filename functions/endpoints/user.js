const admin = require("firebase-admin");

const express = require("express");
const cookieParser = require('cookie-parser')();
const cors = require('cors')({
  origin: true, 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Authorization"
});
const authMiddleware = require("../authMiddleware");
const app = express();

const isObjectEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

// Applying CORS, Cookie Parser, and Middleware that validates Firebase ID Token
app.use(cors);
app.use(cookieParser);
app.use(authMiddleware);

// Create User 
app.post("/", async (req, res) => {
  const data = req.body;
  const requiredData = ["name", "username", "email"];
  let missingData;

  requiredData.forEach((attr) => {
    if(!(attr in data)) {
      missingData = attr;
      return;
    }
  })

  if (missingData) {
    res.status(400).send({
      "error": true,
      "message": `User needs to have ${missingData} attribute`
    });
    return;
  }

  data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
  data["updatedAt"] = "";
  
  try {
    const userRef = admin.firestore().collection("users").doc(req.user.user_id);
    const user = await userRef.get();

    if (user.exists) {
      res.status(403).send({
        "error": true,
        "message": `User already existed`
      });
    } else {
      await userRef.set(data);
      const createdUser = await userRef.get();
      res.status(201).send({
        "error": false,
        "message": `User successfully created`,
        "createdUser": {id: createdUser.id, ...createdUser.data()}
      });
    }

  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error creating user`,
    });
  }
});

// Get all Users
app.get("/", async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore().collection("users").get();
    let users = [];

    usersSnapshot.forEach((doc) => {
      let userId = doc.id;
      let userData = doc.data();

      users.push({ userId, ...userData });
    });

    res.status(200).send({
      "error": false,
      "message": "Users fetched successfully",
      "users": users
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching users`,
    });
  }
});

// Get specified User by ID
app.get("/:id", async (req, res) => {
  try {
    const userSnapshot = await admin.firestore().collection("users").doc(req.params.id).get();
    const userId = userSnapshot.id;
    const userData = userSnapshot.data();
    if (!userData) {
      res.status(200).send({
        "error": false,
        "message": "User fetched successfully",
        "user": {}
      });
    } else {
      res.status(200).send({
        "error": false,
        "message": "User fetched successfully",
        "user": {id: userId, ...userData}
      });
    }
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching user`,
    });
  }
});

// Update User
app.put("/:id", async (req, res) => {
  const data = req.body;

  if (isObjectEmpty(data)) {
    res.status(400).send({
      "error": true,
      "message": `There's no data provided`
    });
    return;
  } else if (req.params.id !== req.user.user_id) {  // Handle changing others data
    res.status(403).send({
      "error": true,
      "message": `You are not allowed to change other user's data`
    });
    return;
  }

  data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();

  try {
    const userRef = admin.firestore().collection("users").doc(req.params.id);
    await userRef.update(data);
    const userUpdated = await userRef.get();

    res.status(200).send({
      "error": false,
      "message": "User updated successfully",
      "updatedUser": {id: userUpdated.id, ...userUpdated.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error updating user`,
    });
  }
});

// Delete User
app.delete("/:id", async (req, res) => {
  if (req.params.id !== req.user.user_id) {
    res.status(403).send({
      "error": true,
      "message": `You are not allowed to change other user's data`
    });
    return;
  }

  try {
    const userRef = admin.firestore().collection("users").doc(req.params.id);
    const userDeleted = await userRef.get();
    await userRef.delete();
  
    res.status(200).send({
      "error": false,
      "message": "User deleted successfully",
      "deletedUser": {id: userDeleted.id, ...userDeleted.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error deleting user`,
    });
  }
});

exports.app = app;
