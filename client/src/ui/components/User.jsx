import React from "react";

export default function User() {
  return (
    <div className="flex items-center gap-2">
      <ion-icon
        className="text-2xl"
        name="person-circle-outline"
      ></ion-icon>
      <span className="font-semibold">User</span>
    </div>
  )
}