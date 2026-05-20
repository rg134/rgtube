import React, { useEffect, useState } from "react";

import { Profile } from "../../interfaces/Profile";
import { Channel } from "../../interfaces/Channel";
import { ProfilePageProps } from "../../interfaces/ProfilePageProps";

import { themes } from "../styles/themes";

import { initDB, getProfiles, addProfile, deleteProfile, updateProfile, getChannels } from "../../db/api";

export default function ProfilePage({
    currentTheme,
    onThemeChange,
    refreshProfiles,
}: ProfilePageProps): React.JSX.Element {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [allChannels, setAllChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    const [profileNameInput, setProfileNameInput] = useState<string>("");
    const [downloadDirInput, setDownloadDirInput] = useState<string>("");

    const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
    const [editNameInput, setEditNameInput] = useState<string>("");
    const [editDownloadDirInput, setEditDownloadDirInput] = useState<string>("");

    const loadData: () => Promise<void> = async (): Promise<void> => {
        try {
            await initDB();
            setProfiles(await getProfiles());
            setAllChannels(await getChannels());
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect((): void => {
        loadData();
    }, []);

    const handleCreateProfile: () => Promise<void> = async (): Promise<void> => {
        if (!profileNameInput.trim()) {
            return;
        }

        await addProfile({
            id: crypto.randomUUID(),
            name: profileNameInput.trim(),
            colorScheme: currentTheme,
            channelIds: [],
            downloadDir: downloadDirInput.trim(),
        });

        setProfileNameInput("");
        setDownloadDirInput("");

        await loadData();
        await refreshProfiles();
    };

    const handleDelete: (id: string) => Promise<void> = async (id: string): Promise<void> => {
        await deleteProfile(id);
        await loadData();
        await refreshProfiles();
    };

    const startEditing: (profile: Profile) => void = (profile: Profile): void => {
        setEditingProfileId(profile.id);
        setEditNameInput(profile.name);
        setEditDownloadDirInput(profile.downloadDir || "");
        onThemeChange(profile.colorScheme);
    };

    const saveProfileEdits: (id: string) => Promise<void> = async (id: string): Promise<void> => {
        if (!editNameInput.trim()) {
            return;
        }

        await updateProfile(id, {
            name: editNameInput.trim(),
            colorScheme: currentTheme,
        });

        setEditingProfileId(null);

        await loadData();
    };

    const toggleChannelInProfile: (profile: Profile, channelId: string) => Promise<void> = async (
        profile: Profile,
        channelId: string,
    ): Promise<void> => {
        await updateProfile(profile.id, {
            channelIds: profile.channelIds.includes(channelId)
                ? profile.channelIds.filter((id) => id !== channelId)
                : [...profile.channelIds, channelId],
        });

        await loadData();
    };

    if (loading) {
        return <div style={{ color: "var(--text-muted)" }}>loading configs...</div>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "60px" }}>
            <h2>profiles</h2>

            <div
                style={{
                    background: "var(--bg)",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface)",
                    marginBottom: "30px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <h3>new profile</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="profile name"
                        value={profileNameInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void =>
                            setProfileNameInput(e.target.value)
                        }
                        style={{ flex: 1, minWidth: "200px" }}
                    />
                    <select
                        value={currentTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) =>
                            onThemeChange(e.target.value)
                        }
                    >
                        {Object.keys(themes).map((key) => (
                            <option
                                key={key}
                                value={key}
                            >
                                {themes[key].name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="primary"
                        onClick={handleCreateProfile}
                    >
                        create
                    </button>
                </div>
            </div>

            <h3>profiles:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {profiles.map((profile: Profile) => {
                    const isEditing: boolean = editingProfileId === profile.id;

                    return (
                        <div
                            key={profile.id}
                            style={{
                                background: "var(--bg)",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid var(--surface)",
                                borderLeft: `6px solid ${themes[profile.colorScheme]?.accent || "var(--accent)"}`,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px",
                                }}
                            >
                                {isEditing ? (
                                    <div
                                        style={{ display: "flex", gap: "8px", flex: 1, marginRight: "12px" }}
                                    >
                                        <input
                                            type="text"
                                            value={editNameInput}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
                                            ) => setEditNameInput(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <select
                                            value={currentTheme}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>,
                                            ) => onThemeChange(e.target.value)}
                                        >
                                            {Object.keys(themes).map(
                                                (key: string): React.JSX.Element => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {themes[key].name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <button
                                            className="primary"
                                            onClick={async (): Promise<void> =>
                                                await saveProfileEdits(profile.id)
                                            }
                                        >
                                            save
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 style={{ margin: "0 0 4px 0", fontSize: "1.2rem" }}>
                                            {profile.name}
                                        </h4>
                                        <span style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
                                            theme: {themes[profile.colorScheme]?.name || profile.colorScheme}
                                        </span>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "8px" }}>
                                    {!isEditing && (
                                        <button
                                            className="primary"
                                            style={{ padding: "6px 12px" }}
                                            onClick={(): void => startEditing(profile)}
                                        >
                                            edit
                                        </button>
                                    )}
                                    <button
                                        className="danger"
                                        onClick={async (): Promise<void> => await handleDelete(profile.id)}
                                    >
                                        delete
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{
                                    borderTop: "1px solid var(--surface)",
                                    paddingTop: "12px",
                                    marginTop: "12px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        margin: "0 0 8px 0",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    channels:
                                </p>
                                {allChannels.length === 0 ? (
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                                        no channels created yet:
                                    </p>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {allChannels.map((channel) => {
                                            const isChecked = profile.channelIds.includes(channel.id);
                                            return (
                                                <label
                                                    key={channel.id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        background: isChecked
                                                            ? "var(--surface)"
                                                            : "transparent",
                                                        padding: "6px 10px",
                                                        borderRadius: "4px",
                                                        border: "1px solid var(--surface)",
                                                        cursor: "pointer",
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={async (): Promise<void> =>
                                                            await toggleChannelInProfile(profile, channel.id)
                                                        }
                                                    />
                                                    {channel.name}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {profiles.length === 0 && (
                    <p style={{ color: "var(--text-muted)" }}>no profiles exist yet. create one.</p>
                )}
            </div>
        </div>
    );
}
