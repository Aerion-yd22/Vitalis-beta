const fetch = require('node-fetch');

const test = async () => {
  try {
    const email = "test_" + Date.now() + "@example.com";
    
    console.log("Testing Register...");
    const regRes = await fetch('http://localhost:5002/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: "Test User",
        email: email,
        password: "password123"
      })
    });
    const regData = await regRes.json();
    console.log("Register Status:", regRes.status);
    console.log("Register Response:", regData);

    console.log("\nTesting Login...");
    const loginRes = await fetch('http://localhost:5002/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: "password123"
      })
    });
    const loginData = await loginRes.json();
    console.log("Login Status:", loginRes.status);
    console.log("Login Response:", loginData);
    
    if (loginData.success && loginData.token) {
      console.log("\n✅ AUTH TEST PASSED");
    } else {
      console.log("\n❌ AUTH TEST FAILED");
    }
  } catch (err) {
    console.error("\n❌ TEST ERROR:", err.message);
  }
};

test();
