import React, { useState } from "react";
import axios from "axios";

const Form = ({ receiverId, setChats, chats }) => {
  const [message, setMessage] = useState("");

  let userId;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    userId = user?._id;
  } catch (err) {
    console.error("Invalid user in localStorage", err);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `https://backend-6oku.onrender.com/chat/message/send/${receiverId}`, // ⬅️ changed to localhost
        {
          content: message,
          senderId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chat-token")}`,
          },
        }
      );

      setChats([...chats, response.data]);
      setMessage("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  return (
    <div className="flex gap-2">
      <form onSubmit={sendMessage} className="flex w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Form;
