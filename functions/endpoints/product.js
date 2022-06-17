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
const dm = require("../helpers/dataModifier");
const app = express();

// Applying CORS, Cookie Parser, and Middleware that validates Firebase ID Token
app.use(cors);
app.use(cookieParser);
app.use(authMiddleware);

// Create Product
app.post("/", async (req, res) => {
  const data = req.body;
  const requiredData = [
    "title",
    "description",
    "image",
    "cost",
    "currentPrice",
    "categoryId",
    "brandId",
  ];
  const pricesData = ["cost", "currentPrice"];
  const stringOfNumberData = ["categoryId"];
  let missingData;
  let emptyData = [];
  let invalidNumericData = [];
  let invalidStringOfNumData = [];

  requiredData.forEach((attr) => {
    // Check if req.body key/field missing required data
    if (!(attr in data)) {
      missingData = attr;
      return;
    } else {
      // Check if req.body value empty for string, zero/negative number for prices data,
      // and data with string type that's need to be represented as number
      if (data[attr] === "") {
        emptyData.push(attr);
      } else if (attr in pricesData && data[attr] <= 0) { 
        invalidNumericData.push(attr);
      } else if (attr in stringOfNumberData && Number(data[attr]) === NaN) {
        invalidStringOfNumData.push(attr);
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

  if (invalidNumericData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${invalidNumericData}' cannot be zero or negative`,
    });
    return;
  }

  if (invalidStringOfNumData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${invalidStringOfNumData}' should be represented as string of number`,
    });
    return;
  }

  for (field in data) {
    // Check req.body if there's uneeded data fields
    if (!requiredData.includes(field)) {
      res.status(403).send({
        error: true,
        message: `You are not allowed to add '${field}' data to product`,
      });
      return;
    }
  }

  data["createdAt"] = admin.firestore.FieldValue.serverTimestamp();
  data["updatedAt"] = "";

  try {
    const calculatedPrice = await getOptimalPrice(data["cost"], data["categoryId"]);
    data["startPrice"] = calculatedPrice.start_price;
    data["endPrice"] = calculatedPrice.end_price;
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
      message: `Error creating product`,
    });
  }
});

// Get all Products
app.get("/", async (req, res) => {
  try {
    const titleQuery = req.query.title?.toLowerCase();
    const categoryQuery = req.query.category;
    let products = [];
    const brandsMap = new Map();
    const categoriesMap = new Map();

    let productsRef = admin.firestore().collection("products");
    const productsSnapshot = await productsRef.get();

    let brandSnapshot = await admin.firestore().collection("brands").get();
    let categorySnapshot = await admin.firestore().collection("categories").get();

    brandSnapshot.forEach((doc) => {
      brandsMap.set(doc.id, doc.data().name);
    });

    categorySnapshot.forEach((doc) => {
      categoriesMap.set(doc.id, doc.data().name);
    });

    // Fetch by Queries
    if (titleQuery && !categoryQuery) {
      productsSnapshot.forEach((doc) => {
        let docTitle = doc.data().title.toLowerCase();

        if (docTitle.includes(titleQuery)) {
          let productId = doc.id;
          let productData = doc.data();
          dm.setBrandCategory(brandsMap, categoriesMap, productData)

          products.push({ productId, ...productData });
        }
      });
    } else if (categoryQuery && !titleQuery) {
      productsSnapshot.forEach((doc) => {
        let docCategoryId = doc.data().categoryId;

        if (docCategoryId === categoryQuery) {
          let productId = doc.id;
          let productData = doc.data();
          dm.setBrandCategory(brandsMap, categoriesMap, productData)
      
          products.push({ productId, ...productData });
        }
      });
    } else if (categoryQuery && titleQuery) {
      productsSnapshot.forEach((doc) => {
        let docTitle = doc.data().title.toLowerCase();
        let docCategoryId = doc.data().categoryId;

        if (docTitle.includes(titleQuery) && docCategoryId === categoryQuery) {
          let productId = doc.id;
          let productData = doc.data();
          dm.setBrandCategory(brandsMap, categoriesMap, productData);

          products.push({ productId, ...productData });
        }
      });
    } else {
      productsSnapshot.forEach((doc) => {
        let productId = doc.id;
        let productData = doc.data();
        dm.setBrandCategory(brandsMap, categoriesMap, productData);

        products.push({ productId, ...productData });
      });
    }

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
    let productData = productSnapshot.data();

    productData = await dm.appendBrandCategory(productData);
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

// Update Product
app.put("/:id", async (req, res) => {
  const data = req.body;
  const updatableData = [
    "title",
    "description",
    "image",
    "cost",
    "currentPrice",
    "categoryId",
    "brandId",
  ];
  const pricesData = ["cost", "currentPrice"];
  const stringOfNumberData = ["categoryId"];
  let emptyData = [];
  let invalidNumericData = [];
  let invalidStringOfNumData = [];

  // Check if req.body is empty
  if (isObjectEmpty(data)) {
    res.status(400).send({
      error: true,
      message: `There's no data provided`,
    });
    return;
  }

  // Validate data that's going to be updated
  for (field in data) {
    // Check req.body if there's uneeded data fields
    if (!updatableData.includes(field)) {
      res.status(403).send({
        error: true,
        message: `You are not allowed to add or change '${field}' data to product`,
      });
      return;
    } else if (data[field] === "") { // Check req.body empty string 
      emptyData.push(attr);
    } else if (field in pricesData && data[field] <= 0) {  // Check req.body zero or negative number for prices data
      invalidNumericData.push(attr);
    } else if (attr in stringOfNumberData && Number(data[attr]) === NaN) { // Check for data with string type that's need to be represented as number
      invalidStringOfNumData.push(attr);
    }
  }

  if (emptyData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${emptyData}' cannot be empty`,
    });
    return;
  }

  if (invalidNumericData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${invalidNumericData}' cannot be zero or negative`,
    });
    return;
  }

  if (invalidStringOfNumData.length > 0) {
    res.status(400).send({
      error: true,
      message: `This property: '${invalidStringOfNumData}' should be represented as string of number`,
    });
    return;
  }

  try {
    const oldProductRef = admin.firestore().collection("products").doc(req.params.id);
    const oldProductSnapshot = await oldProductRef.get();
    const oldProductData = oldProductSnapshot.data();

    // Check if Product data with param ID exist
    if (!oldProductData) {
      res.status(404).send({
        error: true,
        message: `No product data to be found`,
      });
      return;
    }

    // Trigger the ML model computation if there are changes on these data
    if (data["cost"] || data["categoryId"]) {
      // Check to use inputted (req.body) or previous data prices
      const cost = data["cost"] ? data["cost"] : oldProductData["cost"];
      const category = data["categoryId"] ? data["categoryId"] : oldProductData["categoryId"];

      const updatedPriceData = await getOptimalPrice(cost, category);

      data["startPrice"] = updatedPriceData.start_price;
      data["endPrice"] = updatedPriceData.end_price;
      data["optimalPrice"] = updatedPriceData.optimal_price;
      data["pricePredictions"] = updatedPriceData.predictions;
    }

    data["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
    await oldProductRef.update(data);
    const productUpdated = await oldProductRef.get();

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

    // Check if Product data with param ID exist
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
