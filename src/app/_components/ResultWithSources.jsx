import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import styles from "../_styles/spinner.module.css";

// Memo: Do not re-render the component if props havent changed between re-renders
const MessageItem = memo(({ message, pngFile, isLast }) => {
  const userImage = "/assets/images/green-square.png";
  const botImage = `/assets/images/${pngFile}.png`;
  const [showSources, setShowSources] = useState(false);
  const playAudio = useCallback((audioUrl) => {
    const audio = new Audio(audioUrl);
    console.log({ audioUrl });
    audio.play().catch((e) => console.error("Playback failed:", e));
  }, []);
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
            {message.audio_file_url && (
              // Repositioned the play button to be inline with the message, making it a part of the message flow
              <button
                onClick={() => playAudio(message.audio_file_url)}
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
});

const ResultWithSources = ({
  messages,
  pngFile,
  maxMsgs,
  isLoadingMessages,
}) => {
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
      {/* Show loading spinner only when isLoadingMessages is true */}
      {isLoadingMessages && (
        <div className="flex justify-center items-center h-full">
          <div className={styles.spinner}></div> {/* Use the spinner here */}
        </div>
      )}

      {/* Display messages if isLoadingMessages is false, regardless of messages count */}
      {!isLoadingMessages &&
        messages.map((message, index) => (
          <MessageItem
            key={`${message.chatId}-${message.timestamp}`} // Ensuring unique key
            message={message}
            pngFile={pngFile}
          />
        ))}
    </div>
  );
};
export default ResultWithSources;
