import React, { useEffect, useState } from "react";
import { initDB, getChannels, addChannel } from "../../db/api";
import { Channel } from "../../interfaces/Channel";
import { SupportedPlatform } from "../../types/types";

export default function ChannelPage(): React.JSX.Element {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    const [nameInput, setNameInput] = useState<string>("");
    const [platformInput, setPlatformInput] = useState<SupportedPlatform>("YouTube");

    const updateChannelFeed = async (): Promise<void> => {
        try {
            await initDB();
            setChannels(await getChannels());
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect((): void => {
        updateChannelFeed();
    }, []);

    const makeChannel = async (): Promise<void> => {
        if (!nameInput.trim()) {
            return;
        }

        const newChannel: Channel = {
            id: crypto.randomUUID(),
            name: nameInput.trim(),
            platform: platformInput,
        };

        await addChannel(newChannel);
        setNameInput("");
        await updateChannelFeed();
    };

    if (loading) {
        return <div style={{ color: "var(--text-muted)" }}>loading...</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2>channels</h2>

            <div
                style={{
                    background: "var(--bg)",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface)",
                    display: "flex",
                    gap: "10px",
                    marginBottom: "24px",
                }}
            >
                <input
                    type="text"
                    placeholder="channel name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{ flex: 1 }}
                />
                <select
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value as SupportedPlatform)}
                >
                    <option value="YouTube">YouTube</option>
                    <option value="Odysee">Odysee</option>
                </select>
                <button
                    className="primary"
                    onClick={makeChannel}
                >
                    add feed
                </button>
            </div>

            <h3>channels</h3>
            <ul
                style={{
                    listStyleType: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {channels.map((channel) => (
                    <li
                        key={channel.id}
                        style={{
                            background: "var(--bg)",
                            padding: "12px 16px",
                            borderRadius: "4px",
                            border: "1px solid var(--surface)",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>{channel.name}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--accent)" }}>
                            {channel.platform}
                        </span>
                    </li>
                ))}
                {channels.length === 0 && (
                    <p style={{ color: "var(--text-muted)" }}>nothing added just yet</p>
                )}
            </ul>
        </div>
    );
}
