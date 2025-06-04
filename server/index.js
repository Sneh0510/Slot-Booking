const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let slots = {
  "Venue A": {
    "2025-06-05": [
      { time: "10:00 AM", isBooked: false },
      { time: "11:00 AM", isBooked: false },
      { time: "12:00 PM", isBooked: false },
    ]
  },
  "Venue B": {
    "2025-06-05": [
      { time: "10:00 AM", isBooked: false },
      { time: "11:00 AM", isBooked: false }
    ]
  }
};

app.get("/", (req, res) => {
  res.send("Slot Booking API is running");
});


app.get("/api/slots", (req, res) => {
  const { venue, date } = req.query;
  const venueSlots = slots[venue]?.[date] || [];
  res.json(venueSlots);
});

app.post("/api/book", (req, res) => {
  const { venue, date, time, user } = req.body;
  const daySlots = slots[venue]?.[date];
  if (daySlots) {
    const slot = daySlots.find(s => s.time === time);
    if (slot && !slot.isBooked) {
      slot.isBooked = true;
      return res.json({ message: "Booking successful" });
    }
  }
  res.status(400).json({ message: "Slot not available" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));