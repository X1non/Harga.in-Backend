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

// Create Category 
app.post("/", async (req, res) => {
  const data = req.body;
  const requiredData = ["name"];
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
      "message": `Category needs to have ${missingData} attribute`
    });
    return;
  }
  data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
  data["updatedAt"] = "";
  
  try {
    const createdCategoryRef = await admin.firestore().collection("categories").add(data);
    const createdCategory = await createdCategoryRef.get();
    res.status(201).send({
      "error": false,
      "message": `Category successfully created`,
      "createdCategory": {id: createdCategory.id, ...createdCategory.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error creating category`,
    });
  }
});

// Get all Categories
app.get("/", async (req, res) => {
  try {
    const categoriesSnapshot = await admin.firestore().collection("categories").get();
    let categories = [];

    categoriesSnapshot.forEach((doc) => {
      let categoryId = doc.id;
      let categoryData = doc.data();

      categories.push({ categoryId, ...categoryData });
    });

    res.status(200).send({
      "error": false,
      "message": "Categories fetched successfully",
      "categories": categories
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching categories`,
    });
  }
});

// Get specified Category by ID
app.get("/:id", async (req, res) => {
  try {
    const categorySnapshot = await admin.firestore().collection("categories").doc(req.params.id).get();
    const categoryId = categorySnapshot.id;
    const categoryData = categorySnapshot.data();

    if (!categoryData) {
      res.status(200).send({
        "error": false,
        "message": "Category fetched successfully",
        "category": {}
      });
    } else {
      res.status(200).send({
        "error": false,
        "message": "Category fetched successfully",
        "category": {id: categoryId, ...categoryData}
      });
    }
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching category`,
    });
  }
});

// Update Category
app.put("/:id", async (req, res) => {
  const data = req.body;

  if (isObjectEmpty(data)) {
    res.status(400).send({
      "error": true,
      "message": `There's no data provided`
    });
    return;
  } 
  
  try {
    const categoryRef = admin.firestore().collection("categories").doc(req.params.id);
    const categorySnapshot = await categoryRef.get();
    const categoryData = categorySnapshot.data();
    
    if (!categoryData) {
      res.status(404).send({
        "error": true,
        "message": `No category data to be found`
      });
      return;
    }

    data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();

    await categoryRef.update(data);
    const categoryUpdated = await categoryRef.get();

    res.status(200).send({
      "error": false,
      "message": "Category updated successfully",
      "updatedCategory": {id: categoryUpdated.id, ...categoryUpdated.data()}
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      "error": true,
      "message": `Error updating category`,
    });
  }
});

// Delete Category
app.delete("/:id", async (req, res) => {
  try {
    const categoryRef = admin.firestore().collection("categories").doc(req.params.id);
    const categorySnapshot = await categoryRef.get();
    const categoryData = categorySnapshot.data();

    if (!categoryData) {
      res.status(404).send({
        "error": true,
        "message": `No category data to be found`
      });
      return;
    }

    const categoryDeleted = await categoryRef.get();
    await categoryRef.delete();
  
    res.status(200).send({
      "error": false,
      "message": "Category deleted successfully",
      "deletedCategory": {id: categoryDeleted.id, ...categoryDeleted.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error deleting category`,
    });
  }
});

exports.app = app;
