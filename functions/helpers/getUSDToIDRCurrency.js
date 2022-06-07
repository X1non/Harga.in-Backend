require('dotenv').config();
const axios = require('axios').default;

const defaultUSDtoIDRCurrency = {
  USD_IDR: 14500, IDR_USD: 0.00006896551
}

const getUSDToIDRCurrency = async () => {
  const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;
  const CURRENCY_API_URL = `https://free.currconv.com/api/v7/convert?q=USD_IDR,IDR_USD&compact=ultra&apiKey=${CURRENCY_API_KEY}`;

  try {
    const response = await axios({
      method: "get",
      url: CURRENCY_API_URL,
    });
    if (response.status === 200 && response.statusText === "OK") {
      return response.data;
    } else {
      return defaultUSDtoIDRCurrency
    };
  } catch (error) {
    return defaultUSDtoIDRCurrency;
  }
};

module.exports = getUSDToIDRCurrency;