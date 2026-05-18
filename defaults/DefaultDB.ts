import { RGTubeDatabase } from "../interfaces/RGTubeDatabase";

export const DefaultDB: RGTubeDatabase = {
    settings: { downloadDir: "", globalCleanupInterval: 604800000 },
    profiles: [],
    channels: [],
    videos: [],
    playlists: [],
};
