// app/_components/Header.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import Authentication from "./Authentication";
import { useAuthContext } from "./AuthContext";
import { signOut } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth } from "../Configs/firebaseConfig";

function Header() {
  const { user } = useAuthContext();
  const [imgSrc, setImgSrc] = useState("/default-avatar.png");
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user?.photoURL) {
      setImgSrc(user.photoURL);
    } else {
      setImgSrc("/default-avatar.png");
    }
  }, [user]);

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="site-header relative">
      <div className="p-1 shadow-md flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h2 className="text-2xl font-bold">Naught AI</h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 relative">
          {!user ? (
            <Authentication>
              <Button>Get Started</Button>
            </Authentication>
          ) : (
            <>
              <Link href="/dashboard">
                <Button className={'cursor-pointer'}>Dashboard</Button>
              </Link>

              {/* Avatar (click to toggle profile) */}
              <div onClick={() => setShowProfile(!showProfile)} className="cursor-pointer">
                <Image
                  src={imgSrc}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full border"
                  onError={() => setImgSrc("/default-avatar.png")}
                />
              </div>

              <Button variant="outline" className={'cursor-pointer'} onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          <ThemeSwitcher />
        </div>
      </div>

      {/* Profile dropdown */}
      {user && showProfile && (
        <div
          ref={profileRef}
          className="absolute right-24 mt-2 bg-blue-900 text-white px-4 py-2 rounded-md shadow-lg w-fit z-50"
        >
          <div className="flex items-center gap-3">
            <Image
              src={imgSrc}
              alt="User"
              width={40}
              height={40}
              className="rounded-full border"
            />
            <div>
              <p className="font-bold">{user.displayName}</p>
              <p className="text-sm break-all">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
