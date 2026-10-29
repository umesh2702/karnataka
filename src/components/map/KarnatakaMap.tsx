"use client";

import React, { useState, useId } from "react";
import mapData from "@/data/karnataka-map-paths.json";
import { MapPin, Compass, RotateCcw, ChevronRight, CheckCircle2, Info } from "lucide-react";

export interface DistrictInfo {
  id: string;
  name: string;
  region: string;
  path: string;
  center: [number, number];
}

interface KarnatakaMapProps {
  selectedDistrict?: string | null;
  onSelectDistrict?: (districtName: string | null) => void;
  highlightedDistricts?: string[];
  districtLeaderMap?: Record<string, { count: number; leaders: string[] }>;
  compact?: boolean;
  className?: string;
}

// Known mappings between common district aliases and normalized names
export const DISTRICT_ALIASES: Record<string, string> = {
  "bengaluru": "Bangalore",
  "bengaluru urban": "Bangalore",
  "bangalore urban": "Bangalore",
  "bengaluru rural": "Bangalore Rural",
  "mysuru": "Mysore",
  "tumakuru": "Tumkur",
  "kalaburagi": "Gulbarga",
  "vijayapura": "Bijapur",
  "belagavi": "Belgaum",
  "shivamogga": "Shimoga",
  "ballari": "Bellary",
  "chikkamagaluru": "Chikmagalur",
  "chamarajanagar": "Chamrajnagar",
};

export function normalizeDistrictName(name: string): string {
  const lower = name.trim().toLowerCase();
  return DISTRICT_ALIASES[lower] || name;
}

export default function KarnatakaMap({
  selectedDistrict = null,
  onSelectDistrict,
  highlightedDistricts = ["Bangalore", "Ramanagara", "Mysore", "Tumkur", "Gulbarga", "Bijapur", "Belgaum", "Bidar", "Gadag"],
  districtLeaderMap = {
    "Ramanagara": { count: 1, leaders: ["D. K. Shivakumar (Deputy Chief Minister & KPCC President)"] },
    "Bangalore": { count: 4, leaders: ["D. K. Shivakumar (Bengaluru Dev.)", "Krishna Byre Gowda (Revenue)", "K. J. George (Energy)", "Ramalinga Reddy (Transport)"] },
    "Mysore": { count: 1, leaders: ["Siddaramaiah (Chief Minister of Karnataka)"] },
    "Tumkur": { count: 1, leaders: ["Dr. G. Parameshwara (Minister for Home Affairs)"] },
    "Gulbarga": { count: 1, leaders: ["Priyank Kharge (Minister for RDPR, IT & BT)"] },
    "Bijapur": { count: 1, leaders: ["M. B. Patil (Minister for Large & Medium Industries)"] },
    "Belgaum": { count: 2, leaders: ["Satish Jarkiholi (Minister for PWD)", "Laxmi Hebbalkar (Minister for WCD)"] },
    "Bidar": { count: 1, leaders: ["Eshwar Khandre (Minister for Forest & Environment)"] },
    "Gadag": { count: 1, leaders: ["H. K. Patil (Minister for Law & Tourism)"] },
  },
  compact = false,
  className = "",
}: KarnatakaMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [showListAlternative, setShowListAlternative] = useState(false);
  const selectId = useId();

  const handleDistrictClick = (name: string) => {
    if (selectedDistrict === name) {
      onSelectDistrict?.(null);
    } else {
      onSelectDistrict?.(name);
    }
  };

  const activeDistrictName = selectedDistrict ? normalizeDistrictName(selectedDistrict) : null;
  const activeRecord = activeDistrictName ? districtLeaderMap[activeDistrictName] : null;

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Map Control Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E6E1DA]/80 text-xs">
        <div className="flex items-center gap-2 text-[#68645F]">
          <Compass className="w-3.5 h-3.5 text-[#922036]" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#17191B]">
            Karnataka Cartographic Registry
          </span>
          {activeDistrictName && (
            <span className="px-2 py-0.5 rounded-full bg-[#922036]/10 text-[#922036] font-medium text-[11px]">
              {activeDistrictName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeDistrictName && (
            <button
              type="button"
              onClick={() => onSelectDistrict?.(null)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#922036] hover:bg-[#922036]/10 rounded transition-colors"
              title="Reset map selection to statewide"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowListAlternative(!showListAlternative)}
            className="text-[11px] text-[#68645F] hover:text-[#17191B] underline font-medium"
            aria-expanded={showListAlternative}
          >
            {showListAlternative ? "Show Map" : "Accessible List View"}
          </button>
        </div>
      </div>

      {/* Accessible List Alternative for screen reader users or keyboard-only navigation */}
      {showListAlternative ? (
        <div className="p-4 bg-white rounded-xl border border-[#E6E1DA] editorial-shadow space-y-4">
          <div>
            <label htmlFor={selectId} className="block text-xs font-semibold text-[#17191B] mb-1.5">
              Select District to Filter Leadership Records:
            </label>
            <select
              id={selectId}
              value={activeDistrictName || ""}
              onChange={(e) => onSelectDistrict?.(e.target.value || null)}
              className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#922036]"
            >
              <option value="">-- All Karnataka Districts (Statewide) --</option>
              {mapData.districts.map((d) => {
                const info = districtLeaderMap[d.name];
                return (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.region}) {info ? `• ${info.count} leader(s)` : "• No mapped records"}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#E6E1DA] text-xs">
            {mapData.districts.map((d) => {
              const info = districtLeaderMap[d.name];
              const isSelected = activeDistrictName === d.name;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictClick(d.name)}
                  className={`w-full py-2 px-2 flex items-center justify-between text-left transition-colors ${
                    isSelected ? "bg-[#922036] text-white font-semibold" : "hover:bg-[#F8F6F2] text-[#17191B]"
                  }`}
                >
                  <div>
                    <span className="block font-medium">{d.name}</span>
                    <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#68645F]"}`}>
                      {d.region}
                    </span>
                  </div>
                  {info ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSelected ? "bg-white text-[#922036]" : "bg-[#922036]/10 text-[#922036]"}`}>
                      {info.count} Leader(s)
                    </span>
                  ) : (
                    <span className={`text-[10px] ${isSelected ? "text-white/60" : "text-[#888]"}`}>
                      No records
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vector SVG Interactive Map */
        <div className="relative w-full rounded-2xl border border-[#E6E1DA] bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#ECE7DE] p-3 sm:p-5 overflow-hidden editorial-shadow">
          {/* Background Topographic Texture */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none topo-lines" />

          {/* Compass / Provenance Stamp */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-center pointer-events-none select-none text-[#68645F]">
            <div className="w-7 h-7 rounded-full border border-[#D9D3C7] bg-white/70 backdrop-blur-xs flex items-center justify-center font-serif text-[10px] font-bold text-[#922036]">
              N
            </div>
            <div className="w-0.5 h-2 bg-[#922036] mt-0.5" />
          </div>

          {/* Live SVG Vector Map */}
          <div className="relative w-full aspect-3/4 max-h-[580px] flex items-center justify-center">
            <svg
              viewBox={mapData.viewBox}
              className="w-full h-full filter drop-shadow-sm transition-all duration-300"
              role="img"
              aria-label="Interactive map of Karnataka showing 30 administrative district boundaries"
            >
              <defs>
                {/* Subtle drop shadow for selected district */}
                <filter id="district-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#17191B" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* District Vector Polygons */}
              {mapData.districts.map((district) => {
                const isSelected = activeDistrictName === district.name;
                const isHovered = hoveredDistrict?.id === district.id;
                const hasRecords = Boolean(districtLeaderMap[district.name]);

                // Styling logic per design guidelines: neutral base with burgundy hover/selection
                let fill = "#F5F2EC";
                let stroke = "#D3CDC1";
                let strokeWidth = 1;

                if (hasRecords) {
                  fill = "#EFE9DF";
                  stroke = "#C8BFB0";
                }

                if (isHovered) {
                  fill = "#F2DEE2"; // soft rose tint
                  stroke = "#922036";
                  strokeWidth = 1.8;
                }

                if (isSelected) {
                  fill = "#922036"; // deep primary burgundy
                  stroke = "#681323";
                  strokeWidth = 2.4;
                }

                return (
                  <path
                    key={district.id}
                    d={district.path}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="cursor-pointer transition-colors duration-150 ease-out focus:outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label={`${district.name} District, ${district.region}. ${hasRecords ? `${districtLeaderMap[district.name]?.count} leadership record(s)` : "No mapped leadership records"}`}
                    aria-pressed={isSelected}
                    onClick={() => handleDistrictClick(district.name)}
                    onMouseEnter={() => setHoveredDistrict(district as DistrictInfo)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onFocus={() => setHoveredDistrict(district as DistrictInfo)}
                    onBlur={() => setHoveredDistrict(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDistrictClick(district.name);
                      }
                    }}
                    filter={isSelected ? "url(#district-shadow)" : undefined}
                  />
                );
              })}

              {/* District Center Markers for Seeded Leadership Centers */}
              {mapData.districts.map((district) => {
                const info = districtLeaderMap[district.name];
                if (!info) return null;

                const isSelected = activeDistrictName === district.name;
                const [cx, cy] = district.center;

                return (
                  <g key={`marker-${district.id}`} className="pointer-events-none">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? "#FFFFFF" : "#922036"}
                      stroke={isSelected ? "#922036" : "#FFFFFF"}
                      strokeWidth={1.5}
                    />
                    {/* Small pulse ring on selected */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={11}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={1.2}
                        opacity={0.8}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredDistrict && (
              <div
                className="absolute z-20 pointer-events-none bg-[#17191B]/95 text-white px-3 py-2 rounded-lg shadow-xl text-xs backdrop-blur-xs border border-white/10 max-w-[220px] transition-all"
                style={{
                  top: "16px",
                  left: "16px",
                }}
              >
                <div className="font-serif font-bold text-sm text-[#F8F6F2] flex items-center justify-between gap-2">
                  <span>{hoveredDistrict.name}</span>
                  <span className="text-[10px] font-sans font-normal text-white/70">
                    {hoveredDistrict.region}
                  </span>
                </div>
                {districtLeaderMap[hoveredDistrict.name] ? (
                  <div className="mt-1 pt-1 border-t border-white/15 text-[11px] text-[#D9A0A9]">
                    <div className="font-semibold text-white">
                      {districtLeaderMap[hoveredDistrict.name]?.count} Documented Leader(s)
                    </div>
                    <ul className="mt-0.5 list-disc list-inside text-[10px] text-white/80">
                      {districtLeaderMap[hoveredDistrict.name]?.leaders.map((ldr, i) => (
                        <li key={i} className="truncate">{ldr}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-1 pt-1 border-t border-white/15 text-[10px] text-white/60 italic">
                    No verified records in this district
                  </div>
                )}
                <div className="mt-1 text-[9px] text-white/40 uppercase tracking-wider">
                  Click to filter directory
                </div>
              </div>
            )}
          </div>

          {/* Active District Selection Banner */}
          {activeDistrictName && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-[#E6E1DA] editorial-shadow text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#922036] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#17191B]">
                    Active Filter: {activeDistrictName} District
                  </div>
                  {activeRecord ? (
                    <div className="text-[11px] text-[#68645F]">
                      Showing verified leadership records representing {activeDistrictName}.
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-800">
                      No published leadership profiles are currently mapped to {activeDistrictName}.
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectDistrict?.(null)}
                className="px-2.5 py-1 text-xs font-semibold text-[#922036] bg-[#922036]/10 rounded hover:bg-[#922036]/20 transition-colors shrink-0"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Legal / Cartographic Provenance Footer */}
          <div className="mt-2 text-[10px] text-[#68645F] flex flex-wrap items-center justify-between gap-1 border-t border-[#E6E1DA]/60 pt-2 font-sans">
            <span>
              Cartographic Data: Survey of India & Census 2011 via CivicTech India Open Data (ODbL)
            </span>
            <span>30 Districts • Vector SVG</span>
          </div>
        </div>
      )}
    </div>
  );
}
