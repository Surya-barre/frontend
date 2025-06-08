import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Slidebar = ({ setchatInitiated, setChats, setReceiverId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const currentUserId = localStorage.getItem("user");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/chat/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chat-token")}`,
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUserClick = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `http://localhost:3000/chat/message/read/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chat-token")}`,
            "x-user": JSON.stringify(user), // send whole user object
          },
        }
      );

      setChats(response.data);
    } catch (err) {
      if (err.response?.data) {
        console.error("here is the error", err.response.data);
      } else {
        console.error("Unknown error", err);
      }
    }

    setReceiverId(id);
    setchatInitiated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("chat-token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const filteredUsers = users
    .filter((user) => user._id !== currentUserId) // Exclude logged-in user
    .filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="w-1/5 h-full bg-gradient-to-b from-yellow-400 to-yellow-500 text-white flex flex-col p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Chats</h1>

      <input
        type="text"
        placeholder="Search user..."
        className="w-full px-3 py-2 mb-4 text-black rounded-md outline-none focus:ring-2 focus:ring-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="flex items-center p-2 bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition duration-200"
          >
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-md font-medium text-white">
              {user.username}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md shadow transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Slidebar;
