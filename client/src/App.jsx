import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const App = () => {
  const venues = ["Venue A", "Venue B"];
  const [venue, setVenue] = useState("Venue A");
  const [date, setDate] = useState("2025-05-25");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userName, setUserName] = useState("");
  const [sport, setSport] = useState("");

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/slots?venue=${venue}&date=${date}`);
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, [venue, date]);

  const bookSlot = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/book", {
        venue,
        date,
        time: selectedSlot,
        user: userName,
        sport
      });
      alert(res.data.message);
      fetchSlots();
    } catch (err) {
      alert("Booking failed: " + err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 className="text-3xl font-bold text-center text-purple-700 mb-6" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.8 }}>
          🎯 Sportomic Slot Booking
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
          <label className="block font-semibold">Venue:</label>
          <motion.select
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            whileFocus={{ scale: 1.02 }}
          >
            {venues.map(v => <option key={v} value={v}>{v}</option>)}
          </motion.select>

          <label className="block font-semibold">Date:</label>
          <motion.input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            whileFocus={{ scale: 1.02 }}
          />

          <label className="block font-semibold">Available Slots:</label>
          <AnimatePresence>
            <div className="space-y-2 mb-4">
              {slots.length === 0 ? (
                <motion.p exit={{ opacity: 0 }} className="text-gray-500 italic">No slots available.</motion.p>
              ) : (
                slots.map(s => (
                  <motion.label
                    key={s.time}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${s.isBooked ? 'bg-red-100 text-red-500 line-through' : 'bg-green-100 hover:bg-green-200 cursor-pointer'}`}
                  >
                    <input type="radio" name="slot" value={s.time} onChange={() => setSelectedSlot(s.time)} disabled={s.isBooked} />
                    <span>{s.time}</span>
                  </motion.label>
                ))
              )}
            </div>
          </AnimatePresence>

          <motion.input
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            placeholder="Sport"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#6B21A8" }}
            whileTap={{ scale: 0.95 }}
            onClick={bookSlot}
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Book Slot
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;