const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

// API Endpoints
const userEndpoints = require("./endpoints/user");
const productEndpoints = require("./endpoints/product");
const brandEndpoints = require("./endpoints/brand");
const categoryEndpoints = require("./endpoints/category");

// Expose Express API as a single Cloud Function
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.users = functions.https.onRequest(userEndpoints.app);
exports.products = functions.https.onRequest(productEndpoints.app);
exports.brands = functions.https.onRequest(brandEndpoints.app);
exports.categories = functions.https.onRequest(categoryEndpoints.app);
