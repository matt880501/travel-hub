"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BY_YEAR } from "./data";

function IconTravel({ active }: { active?: boolean }) {
  const c = active ? "#c4a882" : "#555";
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
}
function IconMountain({ active }: { active?: boolean }) {
  const c = active ? "#c4a882" : "#555";
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>;
}

const NAV = [
  { label: "TRAVEL",    href: "/",          icon: IconTravel },
  { label: "MOUNTAINS", href: "/mountains", icon: IconMountain, active: true },
];

export default function MountainsShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile]     = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const SidebarInner = ({ onNav }: { onNav?: () => void }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Nav */}
      <div style={{ padding: "0 8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        {NAV.map(({ label, href, icon: Icon, active }) => (
          <a key={label} href={href} onClick={onNav} style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 12px", borderRadius: 8, marginBottom: 1,
              background: active ? "rgba(196,168,130,0.1)" : "transparent",
              border: `1px solid ${active ? "rgba(196,168,130,0.15)" : "transparent"}`,
            }}>
              <Icon active={active} />
              <span style={{ fontSize: 12, color: active ? "#c4a882" : "#555", letterSpacing: "0.08em", fontWeight: active ? 500 : 400 }}>{label}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Peaks list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        <div style={{ padding: "12px 8px 6px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>PEAKS</div>
        {BY_YEAR.map(([year, exps]) => (
          <div key={year} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", padding: "2px 10px 4px", fontWeight: 600 }}>{year === "2017" ? "Before 2017" : year}</div>
            {exps.map(exp => {
              const href = exp.slug ? `/mountains/${exp.slug}` : null;
              const active = href ? pathname === href : false;
              const row = (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 6, background: active ? "rgba(196,168,130,0.1)" : "transparent" }}>
                  <svg width={10} height={10} viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="#c4a882" opacity={0.7} /></svg>
                  <span style={{ fontSize: 11, color: active ? "#c4a882" : href ? "#aaa" : "#777", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.label}</span>
                </div>
              );
              return href ? (
                <a key={exp.label} href={href} onClick={onNav} style={{ textDecoration: "none", display: "block" }}>{row}</a>
              ) : (
                <div key={exp.label}>{row}</div>
              );
            })}
          </div>
        ))}
        <div style={{ padding: "4px 10px 16px", fontSize: 11, color: "#3a3a3a" }}>...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#161616", fontFamily: "SF Pro Display, -apple-system, sans-serif", color: "#e8e4dc" }}>

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "rgba(22,22,22,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowDrawer(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 14, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4" }}>MATT</div>
              <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>MOUNTAINS</div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <>
          {showDrawer && <div onClick={() => setShowDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 250, backdropFilter: "blur(2px)" }} />}
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, zIndex: 300, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", transform: showDrawer ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4" }}>MATT</div>
                <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>ARCHIVE</div>
              </div>
              <button onClick={() => setShowDrawer(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <SidebarInner onNav={() => setShowDrawer(false)} />
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div style={{ width: 248, flexShrink: 0, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", display: isMobile ? "none" : "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "28px 20px 20px", flexShrink: 0 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#f0ece4" }}>MATT</div>
            <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", marginTop: 2 }}>ARCHIVE</div>
          </a>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <SidebarInner />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", paddingTop: isMobile ? 56 : 0 }}>
        {children}
      </div>
    </div>
  );
}
