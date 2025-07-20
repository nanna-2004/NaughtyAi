"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthContext } from "../../_components/AuthContext";

function AppHeader() {
  const { user } = useAuthContext();

  // Determine initial avatar source
  const initialSrc =
    user?.photoURL && user.photoURL.startsWith("http")
      ? user.photoURL
      : "/default-avatar.png";

  // State to manage avatar image source
  const [avatarSrc, setAvatarSrc] = useState(initialSrc);

  // Fallback to default avatar if image fails to load
  const handleImageError = () => {
    if (avatarSrc !== "/default-avatar.png") {
      setAvatarSrc("/default-avatar.png");
    }
  };

  return (
    <div className="p-3 flex justify-between items-center">
      <SidebarTrigger />
      <div className="w-10 h-10 relative rounded-full overflow-hidden border">
        <Image
          src={avatarSrc}
          alt="user"
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
          onError={handleImageError}
        />
      </div>
    </div>
  );
}

export default AppHeader;
