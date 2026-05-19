import React, { useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ChannelPage from "./pages/ChannelPage";

function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<"home" | "profiles" | "channels">("home");
    return (
        <div>
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab}/>
            {activeTab === "home" && (
                <Home/>
            )}
            {activeTab === "profiles" && (
                <ProfilePage/>
            )}
            {activeTab === "channels" && (
                <ChannelPage/>
            )}
        </div>
    );
}

export default App;