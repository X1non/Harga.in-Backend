const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

// API Endpoints
const userEndpoints = require("./endpoints/user");
const productEndpoints = require("./endpoints/product");
const brandEndpoints = require("./endpoints/brand");
const categoryEndpoints = require("./endpoints/category");

// Scheduled Helper Function
const getUSDToIDRCurrency = require("./helpers/getUSDToIDRCurrency");

// Expose Express API as a single Cloud Function
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.users = functions.https.onRequest(userEndpoints.app);
exports.products = functions.https.onRequest(productEndpoints.app);
exports.brands = functions.https.onRequest(brandEndpoints.app);
exports.categories = functions.https.onRequest(categoryEndpoints.app);

// Scheduled Cloud Function
exports.currencyRate = functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
  try {
    const currencyData = await getUSDToIDRCurrency();
    functions.logger.info(`Currency has been updated with these rates: ${currencyData}`);
    return null;
  } catch (error) {
    functions.logger.info(`There is something wrong with updating the currency rate: ${error}`);
    return null;
  }
});
