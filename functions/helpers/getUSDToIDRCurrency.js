const admin = require("firebase-admin");
const axios = require("axios").default;

const getUSDToIDRCurrency = async () => {
  const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;
  const CURRENCY_API_URL = `https://free.currconv.com/api/v7/convert?q=USD_IDR,IDR_USD&compact=ultra&apiKey=${CURRENCY_API_KEY}`;

  try {
    const response = await axios({
      method: "get",
      url: CURRENCY_API_URL,
    });

    if (response.status === 200 && response.statusText === "OK") {
      const data = response.data;
      await admin.firestore().collection("constants").doc("currencyRate").set({
        "USD_IDR": data.USD_IDR,
        "IDR_USD": data.IDR_USD,
      }, { merge: true });
      return data;
    }
  } catch (error) {
    return error;
  }
};

module.exports = getUSDToIDRCurrency;
