import { Profile } from "./Profile";

export interface HomeProps {
    activeProfile: Profile | undefined;
    refreshProfiles: () => Promise<void>;
}
