"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ShieldCheck } from "lucide-react";

interface StudioHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organisationName?: string;
  };
}

export default function StudioHeader({ user }: StudioHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/studio/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E6E1DA] px-6 flex items-center justify-between shrink-0">
      <div>
        <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
          {user.organisationName || "UCreates Karnataka Chapter"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 text-xs text-[#17191B]">
          <div className="w-7 h-7 rounded-full bg-[#922036]/10 text-[#922036] flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-semibold block leading-tight">{user.name}</span>
            <span className="text-[10px] text-[#68645F] uppercase font-semibold">{user.role.replace(/_/g, " ")}</span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="p-1.5 rounded-lg text-[#68645F] hover:text-[#922036] hover:bg-[#922036]/10 transition-colors"
          title="Sign out of Studio"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
