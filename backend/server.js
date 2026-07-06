require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mpesa = require("./routes/mpesa");


const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/mpesa", mpesa);

app.get("/", (req, res) => {
  res.send("Nairobi Events API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/api/mpesa/callback", (req, res) => {

    console.log("Callback received!");

    console.log(req.body);

    // Tell M-Pesa we received the callback
    res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted"
    });

});