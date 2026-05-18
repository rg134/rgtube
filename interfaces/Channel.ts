import { SupportedPlatform } from "../types/types";

export interface Channel {
    id: string; // yt id
    name: string;
    platform: SupportedPlatform;
}
