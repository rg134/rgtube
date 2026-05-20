import React from "react";

import { NavBarProps } from "../../interfaces/NavBarProps";

export default function NavBar({ activeTab, setActiveTab }: NavBarProps): React.JSX.Element {
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
                    onClick={() => setActiveTab("home")}
                    className={activeTab === "home" ? "nav-button active" : "nav-button"}
                >
                    Home
                </button>

                <button
                    onClick={() => setActiveTab("profiles")}
                    className={activeTab === "profiles" ? "nav-button active" : "nav-button"}
                >
                    Profiles
                </button>

                <button
                    onClick={() => setActiveTab("channels")}
                    className={activeTab === "channels" ? "nav-button active" : "nav-button"}
                >
                    Channels
                </button>
            </div>
        </nav>
    );
}
