const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Message = mongoose.model("Message", messageSchema);

// ✅ Fix 3: Add a GET / route for status check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend is running!" });
});

// ✅ Fix 1: Return JSON instead of plain text
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(200).json({ success: true, message: "Message saved!" }); // ✅ JSON now
  } catch (error) {
    res.status(500).json({ success: false, error: "Error saving message" }); // ✅ JSON now
  }
});

// ✅ Fix 2: Use dynamic PORT from Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend working ✅" });
});