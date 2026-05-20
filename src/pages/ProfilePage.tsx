import React, { useEffect, useState } from "react";

import { Profile } from "../../interfaces/Profile";
import { Channel } from "../../interfaces/Channel";
import { ProfilePageProps } from "../../interfaces/ProfilePageProps";

import { themes } from "../styles/themes";

import { initDB, getProfiles, addProfile, deleteProfile, updateProfile, getChannels } from "../../db/api";

export default function ProfilePage({
    currentTheme,
    overrideTheme,
    setOverrideTheme,
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
        setOverrideTheme(profile.colorScheme);
        setEditNameInput(profile.name);
        setEditDownloadDirInput(profile.downloadDir || "");
        onThemeChange(profile.colorScheme);
    };

    const doneEditing = (): void => {
        setEditingProfileId(null);
        setOverrideTheme(null);
    };1

    const saveProfileEdits: (id: string) => Promise<void> = async (id: string): Promise<void> => {
        if (!editNameInput.trim()) {
            return;
        }

        await updateProfile(id, {
            name: editNameInput.trim(),
            colorScheme: overrideTheme,
            downloadDir: editDownloadDirInput.trim(),
        });

        setEditingProfileId(null);
        setOverrideTheme(null);

        await loadData();
        await refreshProfiles();
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
        await refreshProfiles();
    };

    if (loading) {
        return <div style={{ color: "var(--text-muted)" }}>loading configs...</div>;
    }

    const activeProfile = profiles.find((p) => p.id === editingProfileId);
    if (editingProfileId && activeProfile) {
        return (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <button
                    className= "primary"
                    style={{ marginBottom: "10px", cursor: "pointer" }}
                    onClick={() => 
                        doneEditing()
                    }
                >
                    back to profiles
                </button>

                <h2>editing profile</h2>

                <div
                    style={{
                        background: "var(--bg)",
                        padding: "20px",
                        borderRadius: "8px",
                        border: `1px solid var(--surface)`,
                        marginBottom: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <div>
                        <label style={{ color: "var(--text-muted)" }}>name</label>
                        <input
                            type="text"
                            value={editNameInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditNameInput(e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label style={{ color: "var(--text-muted)" }}>download dir</label>
                        <input
                            type="text"
                            value={editDownloadDirInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditDownloadDirInput(e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label style={{ color: "var(--text-muted)" }}>theme</label>
                        <select
                            value={overrideTheme}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setOverrideTheme(e.target.value);
                            }}
                        >
                            {Object.keys(themes).map((key: string) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {themes[key].name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            className="primary"
                            onClick={async () => await saveProfileEdits(activeProfile.id)}
                        >
                            save profile settings
                        </button>
                    </div>
                </div>

                <h3>manage channels</h3>

                <div
                    style={{
                        background: "var(--bg)",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid var(--surface)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {allChannels.length === 0 ? (
                        <p style={{ color: "var(--text-muted)" }}>no channels yet</p>
                    ) : (
                        allChannels.map((channel) => {
                            const isAssigned = activeProfile.channelIds.includes(channel.id);
                            return (
                                <div
                                    key={channel.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px",
                                        border: "2px solid var(--surface)",
                                        borderRadius: "6px",
                                        background: "var(--bg)",
                                    }}
                                >
                                    <p>{channel.name}</p>

                                    {isAssigned ? (
                                        <button
                                            className="danger"
                                            onClick={async () =>
                                                await toggleChannelInProfile(activeProfile, channel.id)
                                            }
                                        >
                                            remove
                                        </button>
                                    ) : (
                                        <button
                                            className="primary"
                                            onClick={async () =>
                                                await toggleChannelInProfile(activeProfile, channel.id)
                                            }
                                        >
                                            add
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setProfileNameInput(e.target.value)
                        }
                        style={{ flex: 1, minWidth: "200px" }}
                    />
                    <input
                        type="text"
                        placeholder="default download folder (optional)"
                        value={downloadDirInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setDownloadDirInput(e.target.value)
                        }
                        style={{ flex: 1, minWidth: "200px" }}
                    />
                    <select
                        value={currentTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onThemeChange(e.target.value)}
                    >
                        {Object.keys(themes).map((key: string) => (
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
                    const profileChannels = allChannels.filter((c) => profile.channelIds.includes(c.id));

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
                                <div>
                                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1.2rem" }}>
                                        {profile.name}
                                    </h4>
                                    <span style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
                                        theme: {themes[profile.colorScheme]?.name || profile.colorScheme}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        className="primary"
                                        style={{ padding: "6px 12px" }}
                                        onClick={() => startEditing(profile)}
                                    >
                                        edit profile
                                    </button>
                                    <button
                                        className="danger"
                                        onClick={async () => await handleDelete(profile.id)}
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
                                {profileChannels.length === 0 ? (
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                                        no channels assigned
                                    </p>
                                ) : (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {profileChannels.map((channel) => (
                                            <span
                                                key={channel.id}
                                                style={{
                                                    background: "var(--surface)",
                                                    padding: "4px 10px",
                                                    borderRadius: "10px",
                                                    fontSize: ".85rem",
                                                }}
                                            >
                                                {channel.name}
                                            </span>
                                        ))}
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