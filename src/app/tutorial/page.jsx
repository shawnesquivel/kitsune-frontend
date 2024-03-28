"use client";
import React, { useState, useEffect } from "react";

const CHAT_LOCAL = "http://127.0.0.1:8000/tutorial";
const TEST_ENDPOINT =
  "https://jk88xtfj1j.execute-api.us-west-2.amazonaws.com/api/";
const CHAT_ENDPOINT =
  "https://jk88xtfj1j.execute-api.us-west-2.amazonaws.com/api/tutorial";

const ChatGPT = () => {
  const [userInput, setUserInput] = useState(""); // Tracks the user's input
  const [response, setResponse] = useState(null); // Stores the chatbot's response
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  useEffect(() => {
    // on page load, do something
  }, []);
  // Function to handle the change in the input field
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Function to send the user's message to the chatbot and fetch the response
  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({
        message: userInput,
      });

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      console.log({ data });
      setResponse(data); // Assuming the API response is in a format that can be directly set
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching the response:", error);
      setIsLoading(false);
    }
  };

  // Function to handle the submit action
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    sendMessage();
  };

  return (
    <div>
      <h1>ChatGPT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      {/* Conditional rendering for loading state and response */}
      {isLoading ? (
        <p>Sending message...</p>
      ) : (
        // If resposne is true, display the next value
        response && (
          <>
            <p>ChatGPT: </p>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </>
        )
      )}
    </div>
  );
};

export default ChatGPT;
