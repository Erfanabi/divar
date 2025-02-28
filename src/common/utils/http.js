const axios = require("axios");

const getAddressDetail = async (lat, lng) => {
  const result = await axios.get(`${process.env.MAP_IR_URL}?lat=${lat}&lon=${lng}`, {
    headers: {
      "x-api-key": process.env.MAP_API_KEY,
    }
  }).then((res) => res.data)

  return {
    province: result?.province, // استان
    city: result?.city, // شهر
    district: result?.district, // منطقه
    address: result?.address, // آدرس
  }
}


module.exports = { getAddressDetail }