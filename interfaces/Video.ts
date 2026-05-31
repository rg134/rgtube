export interface Video {
    id: string;
    channelId: string;
    title: string;
    localFilePath: string;
    downloadedAt: number; // unix timestamp
    stoppingPoint: number;
    watched: boolean;
}
