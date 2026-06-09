require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const faktaRoute = require("./routes/fact");
const produkRoute = require("./routes/dimension");

// app.use("/api/produk", produkRoute);
// app.use("/api/fakta", faktaRoute);

const startSever = async () => {
  try {
    await require("./database/db");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

startSever();
