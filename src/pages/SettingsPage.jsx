import React from "react";
import Profile from "../components/Settings/Profile/Profile";
import Notifications from "../components/Settings/Notifications";
import Security from "../components/Settings/Security";
import ConnectedAccounts from "../components/Settings/ConnectedAccounts";
import DangerZone from "../components/Settings/DangerZone";

const SettingsPage = () => {
  return (
    <>
      <div className="flex-1 relative z-10">
        {/* <Header title={"Settings"} /> */}
        <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
          <Profile />
          <Notifications />
          <Security />
          <ConnectedAccounts />
          <DangerZone />
        </main>
      </div>
    </>
  );
};

export default SettingsPage;
