export interface Playlist {
    id: string;
    name: string;
    videoIds: string[];
    excludeFromCleanup: boolean;
}
