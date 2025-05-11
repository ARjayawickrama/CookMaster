import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { chatbotMessages } from "../ChatBot/messages"; // ✅ Correct for named exports

import assistantAvatar from "../../assets/1.png";
import chatbotIcon from "../../assets/1.png";
import {
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaBook,
  FaGamepad,
  FaMusic,
  FaPaintBrush,
  FaSmile,
  FaCog,
  FaHistory,
  FaUtensils,
  FaCookieBite,
  FaPizzaSlice,
  FaIceCream,
  FaHamburger,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    favoriteColor: "pink",
    interests: ["games", "cooking"],
    age: "5-7",
    favoriteFood: "pizza",
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const divRef = useRef(null);

  // Facebook-inspired color theme
  const theme = {
  primary: "#155E95",       
  secondary: "#3674B5",      // Facebook green
  accent: "#ff69b4",         // Pink accent (your custom touch)
  background: "white",     // Facebook-like light background
  card: "white",           // Card background (white)
  text: "#050505",           // Primary dark text
  textSecondary: "#65676b",  // Muted/secondary text
};


  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }

    const savedPrefs = localStorage.getItem("userPreferences");
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponse = async (input) => {
    // Check predefined messages first
    const message = chatbotMessages.find(
      (msg) => msg.prompt.toLowerCase() === input.toLowerCase()
    )?.message;

    if (message) {
      return message;
    }

    // Check for cooking-related responses
    if (
      input.toLowerCase().includes("cook") ||
      input.toLowerCase().includes("recipe")
    ) {
      return `Let's cook something yummy! I know great ${userPreferences.favoriteFood} recipes! 🍕 Want to hear one?`;
    }

    if (input.toLowerCase().includes("favorite food")) {
      return `My favorite food is ${userPreferences.favoriteFood}! What's yours? We should cook it together! 👩‍🍳`;
    }

    // Check for kid-friendly responses
    if (input.toLowerCase().includes("how are you")) {
      return "I'm super happy today! 😊 How about you?";
    }

    if (input.toLowerCase().includes("favorite color")) {
      return `My favorite color is ${userPreferences.favoriteColor} too! It's such a happy color! 🌈`;
    }

    // Check for game request
    if (
      input.toLowerCase().includes("play") ||
      input.toLowerCase().includes("game")
    ) {
      return "Let's play a cooking game! Can you guess this food riddle:\n\nI'm red or green, grow on vines, and can be made into sauce or eaten raw. What am I? (Reply with your guess!)";
    }

    try {
      // Enhanced prompt with kid context
      const enhancedPrompt = `You are talking to a child aged ${
        userPreferences.age
      } who likes ${userPreferences.interests.join(", ")} and loves ${
        userPreferences.favoriteFood
      }. 
      Respond to this in a fun, simple way with emojis: ${input}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAYlbY24NVBEmXcTuoJj-7BMqFF0V99q18`,
        {
          contents: [{ parts: [{ text: enhancedPrompt }] }],
        }
      );
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Hmm, I'm not sure about that. Let's talk about cooking instead! 👩‍🍳"
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Oops! I'm having trouble thinking right now. Can you ask me again? 😅";
    }
  };

  const generateCookingGame = () => {
    const games = [
      {
        question: "What's the secret ingredient in magic cookies?",
        answer: "Love! And maybe some chocolate chips! 🍪❤️",
      },
      {
        question:
          "I'm white, you drink me, and I make your bones strong. What am I?",
        answer: "Milk! Got milk? 🥛",
      },
      {
        question: "What vegetable is also a fun dip for chips?",
        answer: "Guacamole made from avocados! 🥑",
      },
    ];

    const randomGame = games[Math.floor(Math.random() * games.length)];
    return `COOKING GAME TIME! 👩‍🍳\n\n${randomGame.question}\n\n(Reply with your guess or say 'answer' to know!)`;
  };

  const handleScrollToBottom = () => {
    if (divRef.current) {
      setTimeout(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }, 100);
    }
  };

  const sendMessage = async (messageText) => {
    const userMessage = {
      text: messageText,
      fromUser: true,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const botResponseText = await getResponse(messageText);
    const botMessage = {
      text: botResponseText,
      fromUser: false,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleQuickAction = async (text) => {
    await sendMessage(text);
  };

  const updatePreferences = (key, value) => {
    const newPrefs = { ...userPreferences };
    if (Array.isArray(newPrefs[key])) {
      // Toggle array values
      const index = newPrefs[key].indexOf(value);
      if (index === -1) {
        newPrefs[key].push(value);
      } else {
        newPrefs[key].splice(index, 1);
      }
    } else {
      newPrefs[key] = value;
    }

    setUserPreferences(newPrefs);
    localStorage.setItem("userPreferences", JSON.stringify(newPrefs));
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <>
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
            zIndex: 50,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={chatbotIcon}
            alt="Chat Icon"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              boxShadow: `0 4px 8px ${theme.primary}30`,
              border: `2px solid ${theme.primary}`,
            }}
          />
        </motion.div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          maxWidth: "28rem",
          width: "100%",
          height: "500px",
          zIndex: 50,
          transition: "transform 300ms ease-in-out",
          transform: isChatbotOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div
          style={{
            backgroundColor: theme.background,
            boxShadow: `0 4px 20px ${theme.primary}20`,
            borderRadius: "1.5rem 1.5rem 0 0",
            border: `2px solid ${theme.primary}`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={assistantAvatar}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
                alt="Bot"
              />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  letterSpacing: "0.025em",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Cooking Fun Buddy 👩‍🍳
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Chat History"
              >
                <FaHistory />
              </button>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Preferences"
              >
                <FaCog />
              </button>
              <button
                onClick={() => setIsChatbotOpen(false)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Preferences Panel */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#e7f3ff",
                padding: "1rem",
                borderBottom: `1px solid ${theme.primary}`,
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: theme.primary,
                }}
              >
                My Favorite Things
              </h3>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: theme.primary,
                  }}
                >
                  Favorite Color
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["pink", "blue", "green", "yellow", "red"].map((color) => (
                    <button
                      key={color}
                      onClick={() => updatePreferences("favoriteColor", color)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          userPreferences.favoriteColor === color
                            ? theme.primary
                            : "#ffffff",
                        color:
                          userPreferences.favoriteColor === color
                            ? "#ffffff"
                            : theme.primary,
                        border: `1px solid ${
                          userPreferences.favoriteColor === color
                            ? theme.primary
                            : "#a8d0ff"
                        }`,
                      }}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: theme.primary,
                  }}
                >
                  Age Group
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["3-5", "5-7", "7-9", "9-12"].map((age) => (
                    <button
                      key={age}
                      onClick={() => updatePreferences("age", age)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          userPreferences.age === age
                            ? theme.primary
                            : "#ffffff",
                        color:
                          userPreferences.age === age
                            ? "#ffffff"
                            : theme.primary,
                        border: `1px solid ${
                          userPreferences.age === age
                            ? theme.primary
                            : "#a8d0ff"
                        }`,
                      }}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: theme.primary,
                  }}
                >
                  Favorite Food
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["pizza", "burger", "ice cream", "pasta", "cookies"].map(
                    (food) => (
                      <button
                        key={food}
                        onClick={() => updatePreferences("favoriteFood", food)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          backgroundColor:
                            userPreferences.favoriteFood === food
                              ? theme.primary
                              : "#ffffff",
                          color:
                            userPreferences.favoriteFood === food
                              ? "#ffffff"
                              : theme.primary,
                          border: `1px solid ${
                            userPreferences.favoriteFood === food
                              ? theme.primary
                              : "#a8d0ff"
                          }`,
                        }}
                      >
                        {food.charAt(0).toUpperCase() + food.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: theme.primary,
                  }}
                >
                  Things I Like
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["games", "cooking", "music", "stories", "drawing"].map(
                    (interest) => (
                      <button
                        key={interest}
                        onClick={() => updatePreferences("interests", interest)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          backgroundColor: userPreferences.interests.includes(
                            interest
                          )
                            ? theme.primary
                            : "#ffffff",
                          color: userPreferences.interests.includes(interest)
                            ? "#ffffff"
                            : theme.primary,
                          border: `1px solid ${
                            userPreferences.interests.includes(interest)
                              ? theme.primary
                              : "#a8d0ff"
                          }`,
                        }}
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Panel */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#e7f3ff",
                padding: "1rem",
                borderBottom: `1px solid ${theme.primary}`,
                maxHeight: "160px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ fontWeight: 600, color: theme.primary }}>
                  Our Chat
                </h3>
                <button
                  onClick={clearChatHistory}
                  style={{
                    fontSize: "0.75rem",
                    color: theme.primary,
                  }}
                >
                  Clear Chat
                </button>
              </div>
              {messages.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: theme.primary }}>
                  No messages yet! Say hi! 👋
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {messages
                    .filter((m) => m.fromUser)
                    .slice(-5)
                    .map((msg, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setInput(msg.text);
                          setShowHistory(false);
                        }}
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.5rem",
                          backgroundColor: "#ffffff",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          border: `1px solid ${theme.primary}`,
                          color: theme.primary,
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Body */}
          <div
            ref={divRef}
            style={{
              flex: 1,
              backgroundColor: theme.background,
              padding: "0.75rem 1rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Welcome Banner */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  color: "#ffffff",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textAlign: "center",
                  boxShadow: `0 4px 6px ${theme.primary}10`,
                }}
              >
                🎉 Hi Little Chef! I'm your Cooking Fun Buddy! 👩‍🍳
                <br />
                Let's cook, play food games, and have yummy fun! 🍕🍪
              </motion.div>
            )}

            {/* Quick Action Buttons */}
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingTop: "8px",
                }}
              >
                <button
                  onClick={() => handleQuickAction("Tell me a cooking story")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: `1px solid ${theme.primary}`,
                    borderRadius: "0.5rem",
                    boxShadow: `0 1px 2px ${theme.primary}10`,
                    fontSize: "0.875rem",
                    color: theme.primary,
                  }}
                >
                  <FaBook /> Tell me a cooking story
                </button>
                <button
                  onClick={() => handleQuickAction("Let's play a cooking game")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: `1px solid ${theme.primary}`,
                    borderRadius: "0.5rem",
                    boxShadow: `0 1px 2px ${theme.primary}10`,
                    fontSize: "0.875rem",
                    color: theme.primary,
                  }}
                >
                  <FaUtensils /> Let's play a cooking game
                </button>
                <button
                  onClick={() => handleQuickAction("Share a simple recipe")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: `1px solid ${theme.primary}`,
                    borderRadius: "0.5rem",
                    boxShadow: `0 1px 2px ${theme.primary}10`,
                    fontSize: "0.875rem",
                    color: theme.primary,
                  }}
                >
                  <FaCookieBite /> Share a simple recipe
                </button>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.fromUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "1rem",
                    maxWidth: "75%",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    backgroundColor: msg.fromUser ? "#ffffff" : theme.primary,
                    color: msg.fromUser ? theme.text : "#ffffff",
                    border: msg.fromUser
                      ? `1px solid ${theme.primary}`
                      : "none",
                  }}
                >
                  {msg.text.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <p
                    style={{
                      fontSize: "10px",
                      marginTop: "4px",
                      textAlign: "right",
                      opacity: 0.6,
                      color: msg.fromUser ? theme.primary : "#ffffff",
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 20, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                    }}
                  >
                    👩‍🍳
                  </motion.div>
                  Cooking up a response...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              borderTop: `1px solid ${theme.primary}`,
              backgroundColor: theme.background,
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#ffffff",
                border: `1px solid ${theme.primary}`,
                borderRadius: "0.5rem",
                outline: "none",
                color: theme.text,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "0.75rem",
                backgroundColor: theme.primary,
                color: "#ffffff",
                borderRadius: "9999px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Chatbot;
