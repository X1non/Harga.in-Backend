// require("dotenv").config();
const axios = require("axios").default;
const getUSDToIDRCurrency = require("../helpers/getUSDToIDRCurrency");

// Optimal price ML's model
const getOptimalPrice = async (productData) => {
  try {
    const BASE_URL = process.env.ML_MODEL_URL;
    const ML_MODEL_ENDPOINT = `${BASE_URL}/predict`;
    const currency = await getUSDToIDRCurrency();

    const productPrice = {
      cost: productData.cost * currency["IDR_USD"],
      start: productData.startPrice * currency["IDR_USD"],
      end: productData.endPrice * currency["IDR_USD"],
    };

    const data = {
      cost: productPrice.cost,
      start_price: productPrice.start,
      end_price: productPrice.end,
      increment: (productPrice.end - productPrice.start) / 100,
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

      return predictResult;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = getOptimalPrice;
