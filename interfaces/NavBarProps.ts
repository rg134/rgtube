export interface NavBarProps {
    activeTab: "home" | "profiles" | "channels";
    setActiveTab: (tab: "home" | "profiles" | "channels") => void;
    profiles: string[];
    activeProfileId: string | null;
    setActiveProfileId: (id: string) => void;
}
