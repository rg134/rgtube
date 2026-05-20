export interface ProfilePageProps {
    currentTheme: string;
    overrideTheme: string;
    setOverrideTheme: (string) => void;
    onThemeChange: (themeKey: string) => void;
    refreshProfiles: () => Promise<void>;
}
