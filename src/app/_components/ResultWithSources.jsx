import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const MessageItem = ({ message, pngFile, isLast }) => {
  const userImage = "/assets/images/green-square.png";
  const botImage = `/assets/images/${pngFile}.png`;
  const [showSources, setShowSources] = useState(false);
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    console.log({ audioUrl });
    audio.play().catch((e) => console.error("Playback failed:", e)); // Handle any playback errors
  };

  console.log({ message });
  return (
    <div className={`flex flex-col ${isLast ? "flex-grow" : ""}`}>
      <div className="flex mb-4">
        <div className="rounded mr-4 h-10 w-10 relative overflow-hidden">
          <Image
            src={message.type === "user" ? userImage : botImage}
            alt={`${message.type}'s profile`}
            width={32}
            height={32}
            className="rounded"
            priority
            unoptimized
          />
        </div>
        <div className="flex-1">
          <p
            className={message.type === "user" ? "user" : "bot"}
            style={{ maxWidth: "100%" }}
          >
            {message.message}
            {message.audio && (
              // Repositioned the play button to be inline with the message, making it a part of the message flow
              <button
                onClick={() => playAudio(message.audio)}
                style={{ marginLeft: "8px" }}
                className="inline-flex items-center justify-center rounded-full bg-gray-200 p-2 text-blue-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Play Audio"
              >
                🔊
              </button>
            )}
          </p>
        </div>
      </div>

      {message.sourceDocuments && (
        <div className="mb-6">
          <button
            className="text-gray-600 text-sm font-bold"
            onClick={() => setShowSources(!showSources)}
          >
            Source Documents {showSources ? "(Hide)" : "(Show)"}
          </button>
          {showSources &&
            message.sourceDocuments.map((document, docIndex) => (
              <div key={docIndex}>
                <h3 className="text-gray-600 text-sm font-bold">
                  Source {docIndex + 1}:
                </h3>
                <p className="text-gray-800 text-sm mt-2">
                  {document.pageContent}
                </p>
                <pre className="text-xs text-gray-500 mt-2">
                  {JSON.stringify(document.metadata, null, 2)}
                </pre>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const ResultWithSources = ({ messages, pngFile, maxMsgs }) => {
  const messagesContainerRef = useRef();

  useEffect(() => {
    if (messagesContainerRef.current) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  // E.g. Before we reach the max messages, we should add the justify-end property, which pushes messages to the bottom
  const maxMsgToScroll = maxMsgs || 5;

  return (
    <div
      ref={messagesContainerRef}
      className={`bg-white p-10 rounded-3xl shadow-lg mb-8 overflow-y-auto h-[500px] max-h-[500px] flex flex-col space-y-4 ${
        messages.length < maxMsgToScroll && "justify-end"
      }`}
    >
      {messages &&
        messages.map((message, index) => (
          <MessageItem key={index} message={message} pngFile={pngFile} />
        ))}
    </div>
  );
};

export default ResultWithSources;
