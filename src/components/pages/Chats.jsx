import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slidebar from "../Slidebar.jsX";
import Form from "../Form";

const Chats = ({ socket }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Logged-in user {_id, username}
  const [chatInitiated, setchatInitiated] = useState(false);
  const [chats, setChats] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const chatEndRef = useRef(null);

  // Join socket room after user is set
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user, socket]);

  // Listen for new messages
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setChats((prevChats) => [
        ...prevChats,
        {
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp || new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  // Verify user token
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("chat-token");
      if (!token) return navigate("/");

      try {
        const res = await axios.post(
          "https://backend-6oku.onrender.com/api/verify", // ✅ changed
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = {
          _id: res.data._id,
          username: res.data.username,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Token error:", err);
        localStorage.removeItem("chat-token");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  // Fetch receiver name
  useEffect(() => {
    const fetchReceiverName = async () => {
      if (!receiverId) return;
      try {
        const res = await axios.get(
          `https://backend-6oku.onrender.com/chat/users/${receiverId}` // ✅ changed
        );
        setReceiverName(res.data.username || "Unknown User");
      } catch (err) {
        console.error("Failed to fetch receiver name", err);
        setReceiverName("Unknown User");
      }
    };
    fetchReceiverName();
  }, [receiverId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div
      className="h-screen flex"
      style={{
        backgroundImage: `url('/Home.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Slidebar
        setchatInitiated={setchatInitiated}
        setChats={setChats}
        setReceiverId={setReceiverId}
        setReceiverName={setReceiverName}
      />

      <div className="w-4/5 flex flex-col justify-between p-4">
        {user ? (
          chatInitiated ? (
            <div className="flex flex-col h-full justify-between bg-white/10 backdrop-blur-xl rounded-xl p-4 shadow-2xl">
              <div className="border-b border-gray-400 pb-2 mb-4 text-white text-xl font-semibold">
                Chatting with: {receiverName || "Select a user"}
              </div>

              <div className="flex-grow overflow-y-auto mb-4 px-2 text-white space-y-3">
                {chats.length > 0 ? (
                  chats.map((msg, index) => {
                    const isMyMessage = msg.sender === user._id;
                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isMyMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl max-w-md shadow-md ${
                            isMyMessage
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-700 text-white rounded-bl-none"
                          }`}
                          style={{ wordBreak: "break-word" }}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-300 mt-1 text-right">
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="italic text-center text-gray-300">
                    No messages yet
                  </p>
                )}
                <div ref={chatEndRef} />
              </div>

              <Form
                receiverId={receiverId}
                setChats={setChats}
                chats={chats}
                user={user}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white/70 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome
                </h1>
                <p className="text-gray-600 text-lg">
                  Select a user to start chatting
                </p>
              </div>
            </div>
          )
        ) : (
          <h1 className="text-white text-xl font-bold">Verifying...</h1>
        )}
      </div>
    </div>
  );
};

export default Chats;
