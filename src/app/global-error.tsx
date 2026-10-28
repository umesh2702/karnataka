"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
  retry,
}: {
  error: unknown;
  reset?: () => void;
  retry?: () => void;
}) {
  const handleReset = () => {
    if (typeof retry === "function") retry();
    else if (typeof reset === "function") reset();
    else if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <html>
      <body style={{ fontFamily: "sans-serif", padding: "40px", backgroundColor: "#F7F7F4" }}>
        <h2 style={{ color: "#8A1C2C" }}>Something went wrong!</h2>
        <button
          onClick={handleReset}
          style={{
            padding: "8px 16px",
            backgroundColor: "#8A1C2C",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
