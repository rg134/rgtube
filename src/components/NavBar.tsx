import React, { useState } from "react";

import { NavBarProps } from "../../interfaces/NavBarProps";
import { Profile } from "../../interfaces/Profile";

export default function NavBar({
    activeTab,
    setActiveTab,
    activeProfileId,
    setActiveProfileId,
}: NavBarProps): React.JSX.Element {
    const [m_profiles, setProfiles] = useState<Profile[]>([]);

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "50px",
                width: "100%",
                backgroundColor: "var(--surface)",
                borderBottom: "1px solid var(--bg)",
            }}
        >
            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    onClick={(): void => setActiveTab("home")}
                    className={activeTab === "home" ? "nav-button active" : "nav-button"}
                >
                    Home
                </button>

                <button
                    onClick={(): void => setActiveTab("profiles")}
                    className={activeTab === "profiles" ? "nav-button active" : "nav-button"}
                >
                    Profiles
                </button>

                <button
                    onClick={(): void => setActiveTab("channels")}
                    className={activeTab === "channels" ? "nav-button active" : "nav-button"}
                >
                    Channels
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "200px",
                    justifyContent: "flex-end",
                }}
            >
                {m_profiles.length > 0 && (
                    <>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>profile:</span>
                        <select
                            value={activeProfileId || ""}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setActiveProfileId(e.target.value)
                            }
                            style={{
                                padding: "4px 8px",
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                                border: "1px solid var(--surface)",
                                borderRadius: "4px",
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            <option
                                value=""
                                disabled
                            >
                                select...
                            </option>
                            {m_profiles.map((p) => (
                                <option
                                    key={p.id}
                                    value={p.id}
                                >
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
        </nav>
    );
}
