import React, { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/core";

import { getSettings, updateSettings } from "../../db/api";

export default function Home(): React.JSX.Element {
    const [downloadDir, setDownloadDir] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function loadSettings() {
            setDownloadDir((await getSettings()).downloadDir || "");
        }
        loadSettings();
    }, []);

    const handleDirChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const value: string = e.target.value;
        setDownloadDir(value);
        await updateSettings({ downloadDir: value });
    };

    const handleDownload: () => Promise<void> = async (): Promise<void> => {
        if (!videoUrl.trim()) {
            setStatus("please provide an url");
            return;
        }
        if (!downloadDir.trim()) {
            setStatus("please provide a directory path");
            return;
        }

        setLoading(true);
        setStatus("downloading. check your folder.");

        try {
            const response: string = await invoke<string>("download_video", {
                videoUrl: videoUrl.trim(),
                downloadDir: downloadDir.trim(),
            });
            setStatus(`success: ${response}`);
            setVideoUrl("");
        } catch (e: unknown) {
            setStatus(`error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ color: "var(--accent)", margin: "0 0 8px 0" }}>rgtube</h1>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>youtube in zen mode</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                    style={{
                        background: "var(--bg)",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid var(--surface)",
                    }}
                >
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold",
                            color: "var(--text)",
                        }}
                    >
                        target folder path:
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. /home/user/Videos/rgtube"
                        value={downloadDir}
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
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold",
                            color: "var(--text)",
                        }}
                    >
                        link:
                    </label>
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void =>
                            setVideoUrl(e.target.value)
                        }
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
        </div>
    );
}
