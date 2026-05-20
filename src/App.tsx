import React, { useState, useEffect } from "react";

import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import ChannelPage from "./pages/ChannelPage";

import NavBar from "./components/NavBar";

import { Profile } from "../interfaces/Profile";
import { ThemeColors } from "../interfaces/ThemeColors";

import { getProfiles, initDB } from "../db/api";

import { themes } from "./styles/themes";

function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<"home" | "profiles" | "channels">("home");
    const [currentTheme, setCurrentTheme] = useState<string>("gruvbox");
    const [profiles, _setProfiles] = useState<Profile[]>([]);
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

    const loadProfiles: () => Promise<void> = async (): Promise<void> => {
        const loadedProfiles: Profile[] = await getProfiles();

        if (loadProfiles.length > 0 && !activeProfileId) {
            setActiveProfileId(loadProfiles[0].id);
        } else if (loadedProfiles.length === 0) {
            setActiveProfileId(null);
        }
    };

    useEffect((): void => {
        async function setup(): Promise<void> {
            await initDB();
            await loadProfiles();
        }
        setup();
    }, []);

    useEffect((): void => {
        const activeProfile: Profile | undefined = profiles.find(
            (p: Profile): boolean => p.id === activeProfileId,
        );

        if (activeProfile) {
            setCurrentTheme(activeProfile.colorScheme);
        }
    }, [activeProfileId, profiles]);

    useEffect((): void => {
        const selectedTheme: ThemeColors = themes[currentTheme] || themes["gruvbox"];
        const root: HTMLElement = document.documentElement;

        root.style.setProperty("--bg", selectedTheme.bg);
        root.style.setProperty("--surface", selectedTheme.surface);
        root.style.setProperty("--text", selectedTheme.text);
        root.style.setProperty("--text-muted", selectedTheme.textMuted);
        root.style.setProperty("--accent", selectedTheme.accent);
    }, [currentTheme]);

    const activeProfile: Profile | undefined = profiles.find(
        (p: Profile): boolean => p.id === activeProfileId,
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--surface)", color: "var(--text)" }}>
            <NavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                profiles={profiles.map((p: Profile): string => p.id)}
                activeProfileId={activeProfileId}
                setActiveProfileId={setActiveProfileId}
            />
            <div style={{ padding: "20px" }}>
                {activeTab === "home" && (
                    <Home
                        activeProfile={activeProfile}
                        refreshProfiles={loadProfiles}
                    />
                )}
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
