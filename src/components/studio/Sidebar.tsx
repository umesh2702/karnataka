"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  GitPullRequest,
  BookMarked,
  ShieldAlert,
  History,
  Settings,
  UserCheck,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

interface SidebarProps {
  pendingReviewsCount?: number;
}

export default function Sidebar({ pendingReviewsCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/studio", label: "Overview", icon: LayoutDashboard },
    { href: "/studio/leaders", label: "Profile Manager", icon: Users2 },
    {
      href: "/studio/reviews",
      label: "Review Queue",
      icon: GitPullRequest,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { href: "/studio/sources", label: "Source Registry", icon: BookMarked },
    { href: "/studio/permissions", label: "Consent & Rights", icon: ShieldAlert },
    { href: "/studio/audit", label: "Audit Log", icon: History },
    { href: "/studio/users", label: "Team & Roles", icon: UserCheck },
    { href: "/studio/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E5E5E0] flex flex-col shrink-0 min-h-screen">
      {/* Brand & Studio Title */}
      <div className="p-5 border-b border-[#E5E5E0]">
        <Link href="/studio" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#8A1C2C] text-white flex items-center justify-center font-serif font-bold text-base">
            U
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-[#191A1C] leading-none">
              UCreates Studio
            </h2>
            <span className="text-[10px] font-medium text-[#8A1C2C] uppercase tracking-wider">
              Karnataka Editorial Desk
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b border-[#F0F0EB]">
        <Link
          href="/studio/leaders/new"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-[#8A1C2C] text-white text-xs font-semibold rounded-lg hover:bg-[#721422] transition-colors shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Leader Profile</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === "/studio"
              ? pathname === "/studio"
              : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#FAF0F2] text-[#8A1C2C] font-semibold"
                  : "text-[#4A4B4F] hover:bg-[#FAF8F5] hover:text-[#191A1C]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#8A1C2C]" : "text-[#707278]"}`} />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8A1C2C] text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Public View & Footer */}
      <div className="p-4 border-t border-[#E5E5E0] bg-[#FAF8F5]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-[#5E6066] hover:text-[#8A1C2C] transition-colors font-medium"
        >
          <span>View Public Platform</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
