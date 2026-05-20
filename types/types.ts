export type SupportedPlatform = "YouTube" | "Odysee";

export interface NavBarProps {
    activeTab: "home" | "profiles" | "channels";
    setActiveTab: (tab: "home" | "profiles" | "channels") => void;
}

export interface ProfilePageProps {
    currentTheme: string;
    onThemeChange: (themeKey: string) => void;
}

export interface ThemeColors {
    name: string;
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
}
