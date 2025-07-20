"use client";
import React from "react";
import { useAuthContext } from "./AuthContext";

export default function UserProfile() {
  const { user } = useAuthContext();

  if (!user) return <p className="text-red-500">Not logged in.</p>;

  return (
    <div
      className="p-4 bg-gray-800 text-white rounded-lg shadow-md min-w-[250px] max-w-xs"
    >
      <div className="flex items-center gap-4">
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-lg font-bold break-words">{user.displayName}</h2>
          <p className="text-sm break-words">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
