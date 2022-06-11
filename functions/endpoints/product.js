const admin = require("firebase-admin");

const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({
  origin: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Authorization",
});
const authMiddleware = require("../authMiddleware");
const getOptimalPrice = require("../helpers/getOptimalPrice");
const isObjectEmpty = require("../helpers/isObjectEmpty");
const app = express();

// Applying CORS, Cookie Parser, and Middleware that validates Firebase ID Token
app.use(cors);
app.use(cookieParser);
app.use(authMiddleware);

// Create Product
app.post("/", async (req, res) => {
  const data = req.body;
  const requiredData = ["title", "description", "image", "cost", "startPrice", "endPrice"];
  let missingData;
  let emptyData = [];

  requiredData.forEach((attr) => {
    if (!(attr in data)) {
      missingData = attr;
      return;
    } else {
      // Check if req.body value empty
      if (data[attr] === "") {
        emptyData.push(attr);
      }
    }
  });

  if (missingData) {
    res.status(400).send({
      error: true,
      message: `Product needs to have ${missingData} property`,
    });
    return;
  }

  if (emptyData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${emptyData}' cannot be empty`,
    });
    return;
  }

  data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
  data["updatedAt"] = "";

  try {
    const calculatedPrice = await getOptimalPrice(data);
    data["optimalPrice"] = calculatedPrice.optimal_price;
    data["pricePredictions"] = calculatedPrice.predictions;

    const createdProductRef = await admin.firestore().collection("products").add(data);
    const createdProduct = await createdProductRef.get();
    res.status(201).send({
      error: false,
      message: `Product successfully created`,
      data: { id: createdProduct.id, ...createdProduct.data() },
    });
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error creating product: ${error}`,
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
      error: false,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error fetching products`,
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
        error: false,
        message: "Product fetched successfully",
        data: {},
      });
    } else {
      res.status(200).send({
        error: false,
        message: "Product fetched successfully",
        data: { id: productId, ...productData },
      });
    }
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error fetching product`,
    });
  }
});

// Get specified Product by Title
app.get("/search/:title", async (req, res) => {
  try {
    const productsSnapshot = await admin.firestore().collection("products").get();
    const productTitle = req.params.title.toLowerCase();
    let products = [];

    productsSnapshot.forEach((doc) => {
      let docTitle = doc.data().title.toLowerCase();
      if (docTitle.includes(productTitle)) {
        let productId = doc.id;
        let productData = doc.data();

        products.push({ productId, ...productData });
      }
    });

    res.status(200).send({
      error: false,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error fetching products`,
    });
  }
});

// Update Product
app.put("/:id", async (req, res) => {
  const data = req.body;
  const avaliableToUpdateData = ["title", "description", "image", "cost", "startPrice", "endPrice"];
  const priceData = ["cost", "startPrice", "endPrice"];
  let isUpdatePrice = false;
  let emptyData = [];

  if (isObjectEmpty(data)) {
    res.status(400).send({
      error: true,
      message: `There's no data provided`,
    });
    return;
  }

  for (field in data) {
    if (!avaliableToUpdateData.includes(field)) {
      res.status(403).send({
        error: true,
        message: `You are not allowed to add or change '${field}' data to product`,
      });
      return;
    } else if (priceData.includes(field)) {
      isUpdatePrice = true;
    }
  }

  avaliableToUpdateData.forEach((attr) => {
    if (attr in data && data[attr] === "") {
      emptyData.push(attr);
    }
  });

  if (emptyData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${emptyData}' cannot be empty`,
    });
    return;
  }

  try {
    const productRef = admin.firestore().collection("products").doc(req.params.id);
    const productSnapshot = await productRef.get();
    const productData = productSnapshot.data();

    if (!productData) {
      res.status(404).send({
        error: true,
        message: `No product data to be found`,
      });
      return;
    }

    data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();

    if (isUpdatePrice) {
      const updatedPriceData = await getOptimalPrice(data);

      data["optimalPrice"] = updatedPriceData.optimal_price;
      data["pricePredictions"] = updatedPriceData.predictions;
    }

    await productRef.update(data);
    const productUpdated = await productRef.get();

    res.status(200).send({
      error: false,
      message: "Product updated successfully",
      data: { id: productUpdated.id, ...productUpdated.data() },
    });
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error updating product`,
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
        error: true,
        message: `No product data to be found`,
      });
      return;
    }

    const productDeleted = await productRef.get();
    await productRef.delete();

    res.status(200).send({
      error: false,
      message: "Product deleted successfully",
      data: { id: productDeleted.id, ...productDeleted.data() },
    });
  } catch (error) {
    res.status(404).send({
      error: true,
      message: `Error deleting product`,
    });
  }
});

exports.app = app;
