const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

// API Endpoints
const userEndpoints = require("./endpoints/user");

// Expose Express API as a single Cloud Function
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.users = functions.https.onRequest(userEndpoints.app);
