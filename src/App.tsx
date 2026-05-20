import React, { useState, useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ChannelPage from "./pages/ChannelPage";
import { initDB } from "../db/api";
import { themes } from "./styles/themes";
import { ThemeColors } from "../types/types";

function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<"home" | "profiles" | "channels">("home");
    const [currentTheme, setCurrentTheme] = useState<string>("catppuccin-mocha");

    useEffect(() => {
        const selectedTheme: ThemeColors = themes[currentTheme] || themes["catppuccin-mocha"];
        const root: HTMLElement = document.documentElement;

        root.style.setProperty("--bg", selectedTheme.bg);
        root.style.setProperty("--surface", selectedTheme.surface);
        root.style.setProperty("--text", selectedTheme.text);
        root.style.setProperty("--text-muted", selectedTheme.textMuted);
        root.style.setProperty("--accent", selectedTheme.accent);
    }, [currentTheme]);

    useEffect((): void => {
        async function setup(): Promise<void> {
            await initDB();
        }
        setup();
    }, []);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--surface)", color: "var(--text)" }}>
            <NavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div style={{ padding: "20px" }}>
                {activeTab === "home" && <Home />}
                {activeTab === "profiles" && (
                    <ProfilePage
                        onThemeChange={setCurrentTheme}
                        currentTheme={currentTheme}
                    />
                )}
                {activeTab === "channels" && <ChannelPage />}
            </div>
        </div>
    );
}

export default App;
