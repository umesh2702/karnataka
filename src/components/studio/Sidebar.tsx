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
  MapPin,
  Layers,
  Sparkles,
  FileCheck2,
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
    { href: "/studio/constituencies", label: "Constituencies", icon: MapPin },
    { href: "/studio/projects", label: "Works & Projects", icon: Layers },
    { href: "/studio/schemes", label: "5 Guarantees & Schemes", icon: Sparkles },
    { href: "/studio/issues", label: "Citizen Enquiries", icon: FileCheck2 },
    { href: "/studio/sources", label: "Source Registry", icon: BookMarked },
    { href: "/studio/permissions", label: "Consent & Rights", icon: ShieldAlert },
    { href: "/studio/audit", label: "Audit Log", icon: History },
    { href: "/studio/users", label: "Team & Roles", icon: UserCheck },
    { href: "/studio/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E6E1DA] flex flex-col shrink-0 min-h-screen">
      {/* Brand & Studio Title */}
      <div className="p-5 border-b border-[#E6E1DA]">
        <Link href="/studio" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E5E1D8] shadow-2xs p-1 flex items-center justify-center shrink-0">
            <img
              src="/images/inc-logo.svg"
              alt="Indian National Congress Symbol"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-[#17191B] leading-none">
              Karnataka Congress
            </h2>
            <span className="text-[10px] font-semibold text-[#173B65] uppercase tracking-wider block mt-0.5">
              Digital Administration
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b border-[#E6E1DA]/60">
        <Link
          href="/studio/leaders/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#173B65] text-white text-xs font-semibold rounded-lg hover:bg-[#0F2744] transition-colors shadow-2xs border border-[#F47A20]/40"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#F47A20]" />
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
                  ? "bg-[#173B65]/10 text-[#173B65] font-semibold border-l-2 border-[#F47A20]"
                  : "text-[#68645F] hover:bg-[#F8F6F2] hover:text-[#17191B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#173B65]" : "text-[#888]"}`} />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F47A20] text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Public View & Footer */}
      <div className="p-4 border-t border-[#E6E1DA] bg-[#FAF8F5]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-[#68645F] hover:text-[#173B65] transition-colors font-medium"
        >
          <span>View Public Platform</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
