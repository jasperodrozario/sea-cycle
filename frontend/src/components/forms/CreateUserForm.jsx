"use client";
import React, { useState } from "react";

const CreateUserForm = ({ onUserCreated }) => {
  // State for the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CollectionCrew");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userData = { name, email, password, role };
    const token = localStorage.getItem("token"); // Get the admin's token

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/create-by-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess(data.message);
      if (onUserCreated) {
        onUserCreated(); // Refresh the user list on the parent page
      }
      // Clear the form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Failed to create user.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="CollectionCrew">Collection Crew</option>
          <option value="Authority">Authority</option>
          <option value="Citizen">Citizen</option>
        </select>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-700"
        >
          Create User
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default CreateUserForm;
