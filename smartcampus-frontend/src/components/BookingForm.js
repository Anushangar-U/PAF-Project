import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = () => {
    const [resources, setResources] = useState([]);
    const [form, setForm] = useState({
        resourceId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        attendees: "",
    });

    useEffect(() => {
        // Fetch resources for dropdown
        axios
            .get("/api/resources")
            .then((res) => setResources(res.data))
            .catch(() => setResources([]));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            resourceId: form.resourceId,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            purpose: form.purpose,
            attendees: form.attendees,
        };
        axios
            .post("/api/bookings", data)
            .then(() => alert("Booking Created"))
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.includes("conflict")
                ) {
                    alert("Time slot already booked!");
                } else {
                    alert(err.response?.data || "Error creating booking");
                }
            });
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: 400,
                margin: "2rem auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <select
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                required
            >
                <option value="">Select Resource</option>
                {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
                ))}
            </select>
            <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
            />
            <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
            />
            <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="purpose"
                placeholder="Purpose"
                value={form.purpose}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="attendees"
                placeholder="Attendees"
                value={form.attendees}
                onChange={handleChange}
                required
                min="1"
            />
            <button type="submit">Book</button>
        </form>
    );
};

export default BookingForm;
