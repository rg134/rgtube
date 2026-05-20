export interface ProfilePageProps {
    currentTheme: string;
    onThemeChange: (themeKey: string) => void;
    refreshProfiles: () => Promise<void>;
}
