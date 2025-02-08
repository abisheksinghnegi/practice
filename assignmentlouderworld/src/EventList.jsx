import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventList.css"; // Import the CSS

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [ticketLinks, setTicketLinks] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://api.eventyay.com/v1/events?include=sessions"
        );
        setEvents(response.data.data || []);
      } catch (error) {
        setError("Failed to load events.");
      }
    };

    fetchEvents();
  }, []);

  const handleGetTickets = (eventId, eventUrl) => {
    const email = prompt("Please enter your email to continue:");
    if (email && validateEmail(email)) {
      alert("Thank you! Here's your ticket link.");
      const ticketUrl = `${eventUrl}?email=${encodeURIComponent(email)}`;
      setTicketLinks((prev) => ({ ...prev, [eventId]: ticketUrl }));
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <h2>Explore Events</h2>
      {error ? (
        <p>{error}</p>
      ) : events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.attributes.name}</strong> <br />
              Date: {new Date(event.attributes.starts_at).toLocaleString()} <br />
              Location: {event.attributes.location_name || "Online"} <br />
              <button
                onClick={() =>
                  handleGetTickets(event.id, event.attributes.external_ticket_url || "#")
                }
              >
                GET TICKETS
              </button>
              {ticketLinks[event.id] && (
                <p>
                  <a
                    href={ticketLinks[event.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ticket-link"
                  >
                    Click here to get your tickets!
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default EventList;
