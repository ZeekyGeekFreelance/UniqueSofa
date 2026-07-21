import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "sanity";
import studioConfig from "./cms/studioConfig";
import { getSanityConnection } from "./cms/runtimeConfig";

// Studio-only CSS reset — reverts app styles that break Sanity's internal layout
import "./admin.css";

const { isConfigured } = getSanityConnection(import.meta.env as unknown as Record<string, unknown>);

function AdminApp() {
  if (!isConfigured) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0f172a",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 600 }}>
            Sanity project not configured
          </p>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.9rem" }}>
            Add <code>VITE_SANITY_PROJECT_ID</code> to <code>.env</code> and reload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", minHeight: 0, overflow: "hidden" }}>
      <Studio config={studioConfig} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
