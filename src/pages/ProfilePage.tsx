import React, { useEffect, useState } from "react";
import { initDB, getProfiles, addProfile } from "../../db/api";
import { Profile } from "../../interfaces/Profile";

//data in here: ~/.local/share/com.tauri.dev/db.json

export default function ProfilePage(): React.JSX.Element {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDatabase() {
            try {
                await initDB();
                setProfiles(await getProfiles());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadDatabase();
    }, []);

    const makeProfile = async () => {
        const newProfile: Profile = {
            id: crypto.randomUUID(),
            name: `cool profile`,
            colorScheme: "red",
            channelIds: []
        };
        await addProfile(newProfile);
        setProfiles(await getProfiles());
    };

    if (loading) {
        return <div>loading</div>;
    }

    return (
        <div>
            <p>profiles</p>
            <button onClick={makeProfile}>create profile</button>
            <ul>
                {profiles.map((profile) => (
                    <li>{profile.name}</li>
                ))}
            </ul>
        </div>
    );
}