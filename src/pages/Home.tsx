import React, { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/core";

import { HomeProps } from "../../interfaces/HomeProps";
import { Channel } from "../../interfaces/Channel";

import { getChannels, updateProfile } from "../../db/api";

export default function Home({ activeProfile, refreshProfiles }: HomeProps): React.JSX.Element {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect((): void => {
        getChannels().then(setChannels);
    }, []);

    if (!activeProfile) {
        return (
            <div style={{ textAlign: "center", marginTop: "40px", color: "var(--text-muted)" }}>
                <p>no active profile selected. please create or select a profile first.</p>
            </div>
        );
    }

    const handleDirChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const value = e.target.value;
        await updateProfile(activeProfile!.id, { downloadDir: value });
        await refreshProfiles();
    };

    const handleDownload: () => Promise<void> = async (): Promise<void> => {
        if (!videoUrl.trim()) {
            setStatus("please provide an url");
            return;
        }
        if (!activeProfile!.downloadDir?.trim()) {
            setStatus("please select a path");
            return;
        }

        setLoading(true);
        setStatus("downloading. check your folder.");

        try {
            const response: string = await invoke<string>("download_video", {
                videoUrl: videoUrl.trim(),
                downloadDir: activeProfile!.downloadDir.trim(),
            });
            setStatus(`success: ${response}`);
            setVideoUrl("");
        } catch (e: unknown) {
            setStatus(`error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const activeChannels = channels.filter((c: Channel): boolean => activeProfile!.channelIds.includes(c.id));

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ color: "var(--accent)", margin: "0 0 8px 0" }}>rgtube</h1>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>youtube in zen mode</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                <div
                    style={{
                        background: "var(--bg)",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid var(--surface)",
                    }}
                >
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                        download folder for {activeProfile!.name}:
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. /home/user/Videos/rgtube"
                        value={activeProfile!.downloadDir || ""}
                        onChange={handleDirChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            boxSizing: "border-box",
                            backgroundColor: "var(--surface)",
                            color: "var(--text)",
                            border: "1px solid var(--surface)",
                            borderRadius: "4px",
                            outline: "none",
                        }}
                    />
                </div>

                <div
                    style={{
                        background: "var(--bg)",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid var(--surface)",
                    }}
                >
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>link:</label>
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "10px",
                            boxSizing: "border-box",
                            marginBottom: "12px",
                            backgroundColor: "var(--surface)",
                            color: "var(--text)",
                            border: "1px solid var(--surface)",
                            borderRadius: "4px",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: loading ? "var(--surface)" : "var(--accent)",
                            color: "var(--bg)",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "bold",
                            transition: "background-color 0.2s",
                        }}
                    >
                        {loading ? "processing" : "download"}
                    </button>
                </div>

                {status && (
                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "4px",
                            backgroundColor: "var(--bg)",
                            color: status.startsWith("error") ? "#ea6962" : "var(--text)",
                            border: `1px solid ${status.startsWith("error") ? "#ea6962" : "var(--accent)"}`,
                            wordBreak: "break-word",
                        }}
                    >
                        <strong>status:</strong> {status}
                    </div>
                )}
            </div>

            <div>
                <h2
                    style={{
                        borderBottom: "1px solid var(--surface)",
                        paddingBottom: "8px",
                        marginBottom: "20px",
                    }}
                >
                    feed for {activeProfile!.name}
                </h2>

                {activeChannels.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                        no channels added to this profile yet.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                            gap: "16px",
                        }}
                    >
                        {activeChannels.map((channel) => (
                            <div
                                key={channel.id}
                                style={{
                                    background: "var(--bg)",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--surface)",
                                }}
                            >
                                <h4 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>
                                    {channel.name}
                                </h4>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        marginTop: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "135px",
                                            backgroundColor: "var(--surface)",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                            thumbnail placeholder
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text)" }}>
                                        Latest Upload Mock
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
