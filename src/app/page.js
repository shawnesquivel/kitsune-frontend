"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "./_components/PageHeader";
import PromptBox from "./_components/PromptBox";
import ResultWithSources from "./_components/ResultWithSources";
import Title from "./_components/Title";
import TwoColumnLayout from "./_components/TwoColumnLayout";
import {
  generateUniqueID,
  getChatID,
  setCookiesChatId,
  generateTimeStamp,
  clearChatIDCookie,
} from "./_utils/chatHelpers";

/**
 *
 * MODULE 4: YOUTUBE CHATBOT:
 *
 * Start with the UI.. no need to recreate!
 *
 *  */

const LOCAL_ENDPOINT = "http://127.0.0.1:8000";
const AWS_EC2_ENDPOINT = "http://35.167.111.84";
const AWS_LAMBDA_ENDPOINT =
  "https://jk88xtfj1j.execute-api.us-west-2.amazonaws.com/api";
const TESTING_CHAT_ID = "hvz43xdu9xv09myyz5oz3nw";

const ENDPOINT = AWS_LAMBDA_ENDPOINT;

const Chatbot = () => {
  // We'll set a default YouTube video so we don't have to copy and paste this every time
  const [userMessage, setUserMessage] = useState("Hi, what's up?");
  const [error, setError] = useState(null);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [promptTemplate, setPromptTemplate] = useState("girlfriend");
  const [temperature, setTemperature] = useState(0.5);
  // And we'll set an initial message as well, to make the UI look a little nicer.
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(getChatID()); // Initialize chatId state

  useEffect(() => {
    // Define the async function inside the effect
    async function fetchMessages() {
      if (chatId && messages.length === 0) {
        // Fetch previous messages if chatId is available
        console.log("fetching messages");
        await fetchPreviousMessages();
      } else {
        console.log("chatID not set, ");
        // If chatId is not set, create a new one and update the state
        const newChatId = generateUniqueID();
        setCookiesChatId(newChatId);
        setChatId(newChatId);
        console.log(`Setting a new chat ID ${newChatId}`);
      }
    }

    // Call the async function
    fetchMessages();
  }, [chatId]); // Dependencies array

  useEffect(() => {
    // Test basic function
    async function testLambda() {
      await testEndpoint();
    }

    testLambda();
  }, []);

  const testEndpoint = async () => {
    try {
      console.log(`Testing Chalice Deployed: ${ENDPOINT}`);
      const response = await fetch(`${ENDPOINT}`);
      console.log({ response });

      const resJson = await response.json();

      console.log({ resJson });
    } catch (err) {
      console.log(`error testing the endpoint: ${err}`);
    }
  };
  const handlePromptChange = (e) => {
    setUserMessage(e.target.value);
  };

  // The only differences here will be the "URL" for the api call
  // And the body will send a prompt as well as a firstMsg, which tells us if its the first message in the chat or not
  // Because the first message will tell us to create the YouTube Chat bot
  const handleSubmit = async () => {
    try {
      // If there is no conversation ID, create one and store it in the cookies.
      const chatId = getChatID();
      const timestamp = generateTimeStamp();

      // Push the user's message into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: userMessage, type: "user", sourceDocuments: null },
      ]);

      const body = JSON.stringify({
        chat_id: chatId,
        timestamp: timestamp,
        message: userMessage,
        model: model,
        prompt_template: promptTemplate,
        temperature: temperature,
      });
      console.log({ body });

      // Clear the user message
      setUserMessage("");

      const response = await fetch(`${ENDPOINT}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      console.log({ response });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resJson = await response.json();
      console.log({ resJson });
      // Push the response into the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: resJson?.data?.response,
          type: "bot",
          audio_file_url: resJson?.audio_link,
        },
      ]);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching transcript. Please try again.");
    }
  };
  const handleClearChat = () => {
    clearChatIDCookie();
    console.log("ChatID was cleared from cookies.");
    // Optionally, reset chatId state and any other relevant states
    setChatId(null);
    setMessages([]);
  };

  const fetchPreviousMessages = async () => {
    try {
      // If there is no conversation ID, create one and store it in the cookies.
      // TODO: remove for testing: hardcoded ChatID
      // const chatId = TESTING_CHAT_ID;
      const chatId = getChatID();

      const response = await fetch(`${ENDPOINT}/chat/messages/${chatId}`, {
        method: "GET",
      });

      console.log({ response });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resJson = await response.json();
      console.log({ resJson });

      console.log(`Retrieved messages: ${resJson.data.messages}`);

      // Push the response into the messages array
      setMessages(resJson.data);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching messages.");
    }
  };

  return (
    <>
      <Title emoji="🦊" headingText="Chatbot" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Kitsune AI"
              boldText="Prompt Engineering. Few Shot Learning. Text to Speech. AWS Bedrock."
              description="Named after the mythical fox Kitsune, with renowned intelligence and shapeshifting abilities.

              Create a fully customizable and adaptable AI chatbot for any use case."
            />
            {/* Form */}
            <div className="space-y-6">
              <div className="p-4 bg-white shadow rounded-lg">
                <label
                  htmlFor="prompt-template"
                  className="block text-lg  text-gray-800 mb-3"
                >
                  Choose Your Character
                </label>
                <select
                  id="prompt-template"
                  className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  value={promptTemplate}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPromptTemplate(e.target.value);
                  }}
                >
                  <option value="girlfriend">🙋‍♀️ Girlfriend</option>
                  <option value="trainer">🏋️ Trainer</option>
                  <option value="therapist">🧑‍💼 Therapist</option>
                </select>
              </div>

              <div className="p-4 bg-white shadow rounded-lg">
                <label
                  htmlFor="model"
                  className="text-lg text-gray-800 mb-3 flex items-center gap-2"
                >
                  Model
                </label>
                <select
                  id="model"
                  className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  value={model}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setModel(e.target.value);
                  }}
                >
                  <option value="gpt-3.5-turbo">⚡️ GPT-3.5-Turbo</option>
                  <option value="gpt-4">🧠 GPT-4</option>
                </select>
              </div>

              <div className="p-4 bg-white shadow rounded-lg">
                <label
                  htmlFor="temperature"
                  className="text-lg text-gray-800 mb-3 flex items-center gap-2"
                >
                  Temperature:
                  <span className="text-base font-normal underline underline-offset-2">
                    {temperature}
                  </span>{" "}
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" // Basic styling for the slider track
                />
              </div>
            </div>
          </>
        }
        rightChildren={
          <>
            <div className=" flex flex-col justify-end items-end">
              <button
                onClick={handleClearChat}
                className="bg-gray-400 hover:bg-gray-700 text-white text-xs py-2 px-4 rounded mb-4 w-1/7"
              >
                New Chat
              </button>
              <p>{chatId}</p>
            </div>
            <ResultWithSources
              messages={messages}
              pngFile={`kitsune-${promptTemplate}`}
            />
            <PromptBox
              prompt={userMessage}
              handlePromptChange={handlePromptChange}
              handleSubmit={handleSubmit}
              placeHolderText={`Message your ${promptTemplate}...`}
              error={error}
            />
          </>
        }
      />
    </>
  );
};

export default Chatbot;
