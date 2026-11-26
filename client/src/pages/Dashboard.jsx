import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboradSidebar from "../components/DashboradSidebar";
import DashboardProfile from "../components/DashboardProfile";
import DashPosts from "../components/DashPosts.jsx";
import DashUsers from "../components/DashUsers.jsx";
import DashComments from "../components/DashComments.jsx";
import DashBoardComp from "../components/DashBoardComp.jsx";

function Dashboard() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return null;
  }

  const urlParams = new URLSearchParams(location.search);

  const requestedTab = urlParams.get("tab");

  // Default tab depends on the user's role
  const tab =
    requestedTab || (currentUser.isAdmin ? "dash" : "profile");

  // Non-admin users can only access their profile through this page
  const allowedTab = currentUser.isAdmin
    ? tab
    : "profile";

  const renderTab = () => {
    switch (allowedTab) {
      case "dash":
        return <DashBoardComp />;

      case "profile":
        return <DashboardProfile />;

      case "posts":
        return <DashPosts />;

      case "users":
        return <DashUsers />;

      case "comments":
        return <DashComments />;

      default:
        return currentUser.isAdmin
          ? <DashBoardComp />
          : <DashboardProfile />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 sm:flex-row">

      {/* Sidebar */}
      <div className="shrink-0">
        <DashboradSidebar />
      </div>

      {/* Dashboard Content */}
      <main className="min-w-0 flex-1">
        {renderTab()}
      </main>

    </div>
  );
}

export default Dashboard;
