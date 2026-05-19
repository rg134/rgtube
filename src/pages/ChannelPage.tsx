import React, { useEffect, useState } from "react";
import { initDB, getChannels, addChannel } from "../../db/api";
import { Channel } from "../../interfaces/Channel";
import { SupportedPlatform } from "../../types/types";

export default function ChannelPage(): React.JSX.Element {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    const [nameInput, setNameInput] = useState<string>("");
    const [platformInput, setPlatformInput] = useState<SupportedPlatform>("YouTube");

    useEffect(() => {
        async function loadDatabase() {
            try {
                await initDB();
                setChannels(await getChannels());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadDatabase();
    }, []);

    const makeChannel = async () => {
        if(!nameInput.trim()) return;
        const newChannel: Channel = {
            id: crypto.randomUUID(),
            name: nameInput,
            platform: platformInput
        };
        await addChannel(newChannel);
        setChannels(await getChannels());

        setNameInput("");
    };

    if (loading) {
        return <div>loading</div>;
    }

    return (
        <div>
            <p>channels</p>
            <input
                type="text"
                placeholder="name"
                value={nameInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)}
            />
            <select
                value={platformInput}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformInput(e.target.value as SupportedPlatform)}
            >
                <option value="YouTube">YouTube</option>
                <option value="Odysee">Odysee</option>
            </select>
            <button onClick={makeChannel}>create channel</button>
            <ul>
                {channels.map((channel) => (
                    <li>{channel.name} - {channel.platform}</li>
                ))}
            </ul>
        </div>
    );
}