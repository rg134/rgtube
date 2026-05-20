import React from "react";

interface NavBarProps {
    activeTab: "home" | "profiles" | "channels";
    setActiveTab: (tab: "home" | "profiles" | "channels") => void;
}

export default function NavBar({ activeTab, setActiveTab }: NavBarProps): React.JSX.Element {
    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "45px",
                width: "100%",
                backgroundColor: "#272727",
            }}
        >
            <div style={{ display: "flex", gap: "6px" }}>
                <button
                    onClick={() => setActiveTab("home")}
                    className={activeTab === "home" ? "nav-button.active" : "nav-button"}
                >
                    Home
                </button>

                <button
                    onClick={() => setActiveTab("profiles")}
                    className={activeTab === "profiles" ? "nav-button.active" : "nav-button"}
                >
                    Profiles
                </button>

                <button
                    onClick={() => setActiveTab("channels")}
                    className={activeTab === "channels" ? "nav-button.active" : "nav-button"}
                >
                    Channels
                </button>
            </div>
        </nav>
    );
}
