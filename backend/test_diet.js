const axios = require('axios');

const test = async () => {
  try {
    const res = await axios.get('http://localhost:5002/api/diet', {
      headers: {
        'Authorization': 'Bearer test_token'
      }
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("FAILED:", err.response?.data || err.message);
  }
};

test();
