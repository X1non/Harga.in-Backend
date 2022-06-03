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

// Create Product 
app.post("/", async (req, res) => {
  const data = req.body;
  const requiredData = ["title", "description"];
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
      "message": `Product needs to have ${missingData} attribute`
    });
    return;
  }
  data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
  data["updatedAt"] = "";
  
  try {
    const createdProductRef = await admin.firestore().collection("products").add(data);
    const createdProduct = await createdProductRef.get();
    res.status(201).send({
      "error": false,
      "message": `Product successfully created`,
      "createdProduct": {id: createdProduct.id, ...createdProduct.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error creating product`,
    });
  }
});

// Get all Products
app.get("/", async (req, res) => {
  try {
    const productsSnapshot = await admin.firestore().collection("products").get();
    let products = [];

    productsSnapshot.forEach((doc) => {
      let productId = doc.id;
      let productData = doc.data();

      products.push({ productId, ...productData });
    });

    res.status(200).send({
      "error": false,
      "message": "Products fetched successfully",
      "products": products
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching products`,
    });
  }
});

// Get specified Product by ID
app.get("/:id", async (req, res) => {
  try {
    const productSnapshot = await admin.firestore().collection("products").doc(req.params.id).get();
    const productId = productSnapshot.id;
    const productData = productSnapshot.data();

    if (!productData) {
      res.status(200).send({
        "error": false,
        "message": "Product fetched successfully",
        "product": {}
      });
    } else {
      res.status(200).send({
        "error": false,
        "message": "Product fetched successfully",
        "product": {id: productId, ...productData}
      });
    }
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error fetching product`,
    });
  }
});

// Update Product
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
    const productRef = admin.firestore().collection("products").doc(req.params.id);
    const productSnapshot = await productRef.get();
    const productData = productSnapshot.data();
    
    if (!productData) {
      res.status(404).send({
        "error": true,
        "message": `No product data to be found`
      });
      return;
    }

    data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();

    await productRef.update(data);
    const productUpdated = await productRef.get();

    res.status(200).send({
      "error": false,
      "message": "Product updated successfully",
      "updatedProduct": {id: productUpdated.id, ...productUpdated.data()}
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      "error": true,
      "message": `Error updating product`,
    });
  }
});

// Delete Product
app.delete("/:id", async (req, res) => {
  try {
    const productRef = admin.firestore().collection("products").doc(req.params.id);
    const productSnapshot = await productRef.get();
    const productData = productSnapshot.data();

    if (!productData) {
      res.status(404).send({
        "error": true,
        "message": `No product data to be found`
      });
      return;
    }

    const productDeleted = await productRef.get();
    await productRef.delete();
  
    res.status(200).send({
      "error": false,
      "message": "Product deleted successfully",
      "deletedProduct": {id: productDeleted.id, ...productDeleted.data()}
    });
  } catch (error) {
    res.status(404).send({
      "error": true,
      "message": `Error deleting product`,
    });
  }
});

exports.app = app;
