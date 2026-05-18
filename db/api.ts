import { LazyStore } from "@tauri-apps/plugin-store";

import { RGTubeDatabase } from "../interfaces/RGTubeDatabase";

import { DefaultDB } from "../defaults/DefaultDB";
import { Settings } from "../interfaces/Settings";
import { Profile } from "../interfaces/Profile";
import { Channel } from "../interfaces/Channel";
import { Video } from "../interfaces/Video";
import { Playlist } from "../interfaces/Playlist";

let store: LazyStore = new LazyStore("db.json");

export async function initDB(): Promise<void> {
    if (!(await store.has("settings"))) {
        await store.set("settings", DefaultDB.settings);
        await store.set("profiles", DefaultDB.profiles);
        await store.set("channels", DefaultDB.channels);
        await store.set("videos", DefaultDB.videos);
        await store.set("playlists", DefaultDB.playlists);
    }
}

export async function getDB(): Promise<RGTubeDatabase> {
    return {
        settings: (await store.get<Settings>("settings")) || DefaultDB.settings,
        profiles: (await store.get<Profile[]>("profiles")) || DefaultDB.profiles,
        channels: (await store.get<Channel[]>("channels")) || DefaultDB.channels,
        videos: (await store.get<Video[]>("videos")) || DefaultDB.videos,
        playlists: (await store.get<Playlist[]>("playlists")) || DefaultDB.playlists,
    };
}

export async function getProfiles(): Promise<Profile[]> {
    return (await store.get<Profile[]>("profiles")) || [];
}

export async function addProfile(newProfile: Profile): Promise<void> {
    await store.set("profiles", [...(await getProfiles()), ...[newProfile]] satisfies Profile[]);
}

export async function addVideo(newVideo: Video): Promise<void> {
    await store.set("videos", [...((await store.get<Video[]>("videos")) || []), ...[newVideo]]);
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<void> {
    await store.set("settings", {
        ...((await store.get<Settings>("settings")) || DefaultDB.settings),
        ...[newSettings],
    });
}
