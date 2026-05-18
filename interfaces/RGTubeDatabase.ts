import { Channel } from "./Channel";
import { Profile } from "./Profile";
import { Settings } from "./Settings";
import { Video } from "./Video";
import { Playlist } from "./Playlist";

export interface RGTubeDatabase {
    settings: Settings;
    profiles: Profile[];
    channels: Channel[];
    videos: Video[];
    playlists: Playlist[];
}
