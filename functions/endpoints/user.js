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

// Applying CORS, Cookie Parser, and Middleware that validates Firebase ID Token
app.use(cors);
app.use(cookieParser);
app.use(authMiddleware);

// Create User 
app.post("/", async (req, res) => {
  const data = req.body;

  if (!data["username"]) {
    res.status(400).send("Username is not defined.");
  }

  const userSnapshot = await admin.firestore().collection("users").doc(req.user.user_id).get();
  
  if (userSnapshot.exists) {
    res.status(403).send("User already existed.");
  } else {
    await admin.firestore().collection("users").doc(req.user.user_id).set(data);
    res.status(201).send("Successfully created!");
  }
});

// Get all Users
app.get("/", async (req, res) => {
  const usersSnapshot = await admin.firestore().collection("users").get();

  let users = [];
  usersSnapshot.forEach((doc) => {
    let userId = doc.id;
    let userData = doc.data();

    users.push({ userId, ...userData });
  });

  res.status(200).send(JSON.stringify(users));
});

// Get specified User by ID
app.get("/:id", async (req, res) => {
  const userSnapshot = await admin.firestore().collection("users").doc(req.params.id).get();

  const userId = userSnapshot.id;
  const userData = userSnapshot.data();

  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

// Update User
app.put("/:id", async (req, res) => {
  const data = req.body;

  await admin.firestore().collection("users").doc(req.params.id).update(data);

  res.status(200).send("Successfully updated!");
});

// Delete User
app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("users").doc(req.params.id).delete();

  res.status(200).send("Successfully deleted!");
});

exports.app = app;
