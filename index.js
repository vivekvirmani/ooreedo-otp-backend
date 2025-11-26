import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OOREDOO_API_URL = process.env.OOREDOO_API_URL;
const OOREDOO_API_KEY = process.env.OOREDOO_API_KEY;

/**
 * Demo / Real OTP endpoint
 */
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone number required" });

  try {
    // If Ooredoo API key is not set, use demo OTP
    if (!OOREDOO_API_KEY || OOREDOO_API_KEY === "YOUR_OOREDOO_API_KEY_HERE") {
      console.log(`Demo OTP sent to ${phone}`);
      return res.json({
        message: `OTP sent successfully to ${phone}`,
        otp: "123456",
      });
    }

    // Real Ooredoo API request
    const response = await fetch(OOREDOO_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OOREDOO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed to send OTP");

    res.json({ message: "OTP sent successfully", data });
  } catch (err) {
    console.error("Ooredoo API Error:", err.message);
    res
      .status(500)
      .json({
        error: "The website encountered an unexpected error. Try again later.",
      });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
