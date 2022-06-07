const axios = require("axios").default;
const getUSDToIDRCurrency = require("../helpers/getUSDToIDRCurrency")

// Optimal price ML's model
const getOptimalPrice = async (productData) => {
  try {
    const ML_MODEL_URL = "http://35.223.244.20:5000/"
    const ML_MODEL_ENDPOINT = `${ML_MODEL_URL}/predict`;
    const currency = await getUSDToIDRCurrency();

    const productPrice = {
      "cost": productData.cost * currency["IDR_USD"],
      "start": productData.startPrice * currency["IDR_USD"],
      "end": productData.endPrice * currency["IDR_USD"]
    };

    const data = { 
      "cost": productPrice.cost,
      "start_price": productPrice.start,
      "end_price": productPrice.end,
      "increment": (productPrice.end - productPrice.start) / 100
    };

    const response = await axios({
      method: "post",
      url: ML_MODEL_ENDPOINT,
      headers: {
        "Content-Type": "application/json"
      },
      data: data,
    });

    if (response.status === 200 && response.statusText === "OK") {
      const rawPrice = response.data;
      const revampResult = {};

      // Convert prediction prices to Indonesian Rupiahs
      const convertPriceToIDR = (item, index, arr) => {
        // selling price & total profit converted, sales is not converted
        if (index % 2 === 0) {
          arr[index] = item * currency["USD_IDR"];
        }
      }

      for (let attr in rawPrice) {
        if (rawPrice[attr] instanceof Array) {  // predictions
          revampResult[attr] = [];

          rawPrice[attr].forEach(x => { 
            x.forEach(convertPriceToIDR);  
            revampResult[attr] = [...revampResult[attr], x];
          })

        } else { // optimal_price
          revampResult[attr] = rawPrice[attr] * currency["USD_IDR"];
        }
      }
      
      // Convert array to object
      revampResult.predictions = Object.assign({}, revampResult.predictions)

      // Renaming default object key of predictions
      for (let i in revampResult.predictions) {
        revampResult.predictions[i] = Object.assign({}, revampResult.predictions[i]);
        
        revampResult.predictions[i]["selling_price"] = revampResult.predictions[i][0];
        delete revampResult.predictions[i][0];
        
        revampResult.predictions[i]["total_sales"] = revampResult.predictions[i][1];
        delete revampResult.predictions[i][1];
        
        revampResult.predictions[i]["total_profit"] = revampResult.predictions[i][2];
        delete revampResult.predictions[i][2];
      }

      return revampResult;
    } 
  } catch (error) {
    throw error;
  }
};

module.exports = getOptimalPrice;
