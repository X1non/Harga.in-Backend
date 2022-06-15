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
  const requiredData = [
    "title", "description", "image", "cost", "startPrice", "endPrice", "categoryId", "brandId"
  ];
  let missingData;
  let emptyData = [];
  let invalidNumericData = [];

  requiredData.forEach((attr) => {
    // Check if req.body key/field missing required data
    if (!(attr in data)) {
      missingData = attr;
      return;
    } else {
      // Check if req.body value empty for string and zero/negative for number
      if (data[attr] === "") {
        emptyData.push(attr);
      } else if (data[attr] <= 0) {
        invalidNumericData.push(attr);
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

  // Check whether prices maintains cost < startPrice < endPrice
  if (data["cost"] >= data["startPrice"]) {
    res.status(400).send({
      error: true,
      message: `Please set the 'startPrice' value to be higher than 'cost'`,
    });
    return;
  } else if (data["startPrice"] >= data["endPrice"]) {
    res.status(400).send({
      error: true,
      message: `Please set the 'endPrice' value to be higher than 'startPrice'`,
    });
    return;
  }

  // Check req.body if there's uneeded data fields
  for (field in data) {
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

    let productsRef = admin.firestore().collection("products");
    const productsSnapshot = await productsRef.get();

    // Fetch by Queries
    if (titleQuery && !categoryQuery) {
      console.log(req.query);
      productsSnapshot.forEach((doc) => {
        let docTitle = doc.data().title.toLowerCase();

        if (docTitle.includes(titleQuery)) {
          let productId = doc.id;
          let productData = doc.data();
          products.push({ productId, ...productData });
        }
      });
    } else if (categoryQuery && (!titleQuery)) {
      console.log(req.query);
      productsSnapshot.forEach((doc) => {
        let docCategoryId = doc.data().categoryId;

        if (docCategoryId === categoryQuery) {
          let productId = doc.id;
          let productData = doc.data();
          products.push({ productId, ...productData });
        }
      });
    } else if (categoryQuery && titleQuery) {
      console.log(req.query);
      productsSnapshot.forEach((doc) => {
        let docTitle = doc.data().title.toLowerCase();
        let docCategoryId = doc.data().categoryId;

        if (docTitle.includes(titleQuery) && docCategoryId === categoryQuery) {
          let productId = doc.id;
          let productData = doc.data();
          products.push({ productId, ...productData });
        }
      });
    } else {
      productsSnapshot.forEach((doc) => {
        let productId = doc.id;
        let productData = doc.data();
  
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
      message: `Error fetching products ${error}`,
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

// Update Product
app.put("/:id", async (req, res) => {
  const data = req.body;
  const updatableData = [
    "title", "description", "image", "cost", "startPrice", "endPrice", "categoryId", "brandId"
  ];
  const updatablePriceData = ["cost", "startPrice", "endPrice"];
  let ongoingUpdatePrice = [];
  let emptyData = [];
  let invalidNumericData = [];

  // Check if req.body is empty
  if (isObjectEmpty(data)) {
    res.status(400).send({
      error: true,
      message: `There's no data provided`,
    });
    return;
  }

  // Check req.body if there's uneeded data fields
  for (field in data) {
    if (!updatableData.includes(field)) {
      res.status(403).send({
        error: true,
        message: `You are not allowed to add or change '${field}' data to product`,
      });
      return;
    } else if (data[field] === "") {  // Check req.body value
      emptyData.push(attr);
    } else if (data[field] <= 0) {
      invalidNumericData.push(attr);
    }

    if (updatablePriceData.includes(field)) { // Check if there's req.body prices update
      ongoingUpdatePrice.push(field);
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

  // Check whether prices maintains cost < startPrice < endPrice
  if (data["cost"] >= data["startPrice"]) {
    res.status(400).send({
      error: true,
      message: `Please set the 'startPrice' value to be higher than 'cost'`,
    });
    return;
  } else if (data["startPrice"] >= data["endPrice"]) {
    res.status(400).send({
      error: true,
      message: `Please set the 'endPrice' value to be higher than 'startPrice'`,
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

    if (ongoingUpdatePrice.length > 0) {
      // Validates ongoing-update prices with previous-old prices whether still maintains cost < startPrice < endPrice
      if (ongoingUpdatePrice.length <= 2) {
        for (field in ongoingUpdatePrice) {
          switch (ongoingUpdatePrice[field]) {
            case "cost":
              if (!data["startPrice"] && data["cost"] >= oldProductData["startPrice"]) return res.status(400).send({
                error: true,
                message: `Please set the 'cost' value to be lower than the previous 'startPrice'`,
              });
            case "startPrice":
              if (!data["endPrice"] && data["startPrice"] >= oldProductData["endPrice"]) return res.status(400).send({
                error: true,
                message: `Please set the 'startPrice' value to be lower than the previous 'endPrice'`,
              });
              if (!data["cost"] && data["startPrice"] <= oldProductData["cost"]) return res.status(400).send({
                error: true,
                message: `Please set the 'startPrice' value to be higher than the previous 'cost'`,
              });
            case "endPrice":
              if (!data["startPrice"] && data["endPrice"] <= oldProductData["startPrice"]) return res.status(400).send({
                error: true,
                message: `Please set the 'endPrice' value to be higher than the previous 'startPrice'`,
              });
          }
        } 
      }

      // Check to use inputted (req.body) or previous data prices
      const priceData = {
        "cost": (data["cost"]) ? data["cost"] : oldProductData["cost"],
        "startPrice": (data["startPrice"]) ? data["startPrice"] : oldProductData["startPrice"],
        "endPrice": (data["endPrice"]) ? data["endPrice"] : oldProductData["endPrice"]
      }
      
      const updatedPriceData = await getOptimalPrice(priceData);

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
