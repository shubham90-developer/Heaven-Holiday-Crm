import React from "react";
import PageTitle from "@/components/PageTitle";
import ManageNotification from "./ManageNotification";
const ManageNotificationsPage = () => {
  return (
    <>
      <PageTitle title="Setting - Manage Notifications" />
      <ManageNotification/>
    </>
  );
};

export default ManageNotificationsPage;