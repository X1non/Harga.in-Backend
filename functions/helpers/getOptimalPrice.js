const admin = require("firebase-admin");
const axios = require("axios").default;

// Optimal price ML model
const getOptimalPrice = async (priceCost, category) => {
  const defaultPriceLimit = {
    "start": 1.15,
    "end": 1.5
  }

  const defaultUSDtoIDRCurrency = {
    "USD_IDR": 14500,
    "IDR_USD": 0.00006896551,
  };

  const priceLimitSnapshot = await admin.firestore().collection("constants").doc("priceLimit").get();
  const priceLimit = priceLimitSnapshot.data();

  const currencyRateSnapshot = await admin.firestore().collection("constants").doc("currencyRate").get();
  const currencyRate = currencyRateSnapshot.data();

  try {
    const BASE_URL = process.env.ML_MODEL_URL;
    const ML_MODEL_ENDPOINT = `${BASE_URL}/predict`;
    const limit = (priceLimit.exists) ? priceLimit : defaultPriceLimit
    const currency = (currencyRate.exists) ? currencyRate : defaultUSDtoIDRCurrency;

    const convertedPrice = {
      cost: priceCost * currency["IDR_USD"],
      start: priceCost * limit["start"] * currency["IDR_USD"],
      end: priceCost * limit["end"] * currency["IDR_USD"],
    };

    const data = {
      cost: convertedPrice.cost,
      start_price: convertedPrice.start,
      end_price: convertedPrice.end,
      increment: (convertedPrice.end - convertedPrice.start) / 100,
      category: category
    };

    const response = await axios({
      method: "post",
      url: ML_MODEL_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    if (response.status === 200 && response.statusText === "OK") {
      const predictResult = response.data;

      // Convert prediction prices to Indonesian Rupiahs
      const convertPriceToIDR = (item, index, arr) => {
        // selling price & total profit converted, sales is not converted
        if (index % 2 === 0) {
          arr[index] = item * currency["USD_IDR"];
        }
      };

      for (let attr in predictResult) {
        // predictions
        if (attr === "predictions") {
          predictResult["predictions"].forEach((x) => {
            x.forEach(convertPriceToIDR);
          });

          // Convert array_of _array to array_of_object
          let arrOfObjects = predictResult["predictions"].map((val) => ({
            selling_price: val[0],
            total_sales: val[1],
            total_profit: val[2],
          }));

          //Order By selling_price ascending
          let sortedPrediction = arrOfObjects.sort((a, b) => {
            return a.selling_price - b.selling_price;
          });

          predictResult["predictions"] = sortedPrediction;
        } else {
          // optimal_price
          predictResult["optimal_price"] = predictResult[attr] * currency["USD_IDR"];
        }
      }

      // add system-defined startPrice and endPrice to be returned
      predictResult["start_price"] = convertedPrice["start"] * currency["USD_IDR"];
      predictResult["end_price"] = convertedPrice["end"] * currency["USD_IDR"];

      return predictResult;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = getOptimalPrice;
