import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InviteUser from "../components/InviteUser";
import CreateTask from "../components/CreateTask";
import TaskBoard from "../components/TaskBoard";
import WorkspaceChat from "../WorkspaceChat";
import ActivitiesSection from "../components/ActivitiesSection"; // New import
import { AuthContext } from "../context/AuthContext";
import { WorkspaceContext } from "../context/WorkspaceContext";
import { 
  FiGrid, 
  FiUsers, 
  FiPlusCircle, 
  FiFolder,
  FiChevronRight,
  FiChevronLeft,
  FiBarChart,
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiActivity,
} from "react-icons/fi";

export default function WorkspaceDetails() {
  const { id } = useParams();
  const { profile } = useContext(AuthContext);
  const { currentWorkspace, workspaceMembers, fetchWorkspaceStats } = useContext(WorkspaceContext);
  const [activeTab, setActiveTab] = useState("tasks");
  const [workspaceStats, setWorkspaceStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    membersCount: 0,
    pendingInvites: 0
  });
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]); // New state for activities

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      { 
        id: "tasks", 
        label: "Task Board", 
        icon: FiGrid, 
        color: "blue",
        description: "Organize and track your project tasks"
      },
      { 
        id: "chat", 
        label: "Workspace Chat", 
        icon: FiMessageSquare, 
        color: "indigo",
        description: "Chat with team members in real-time"
      },
      { 
        id: "activities", 
        label: "Activities", 
        icon: FiActivity, 
        color: "orange",
        description: "View all workspace activities and logs"
      },
      { 
        id: "invite", 
        label: "Team Members", 
        icon: FiUsers, 
        color: "purple",
        description: "Manage team access and permissions"
      },
    ];

    // Add "Create Task" tab only if user is not a client
    if (profile?.role !== "client") {
      baseTabs.push({ 
        id: "create", 
        label: "Create Task", 
        icon: FiPlusCircle, 
        color: "green",
        description: "Add new tasks to your project"
      });
    }

    return baseTabs;
  };

  const tabs = getTabs();

  // Helper functions for dynamic Tailwind classes
  const getActiveTabClass = (color) => {
    switch(color) {
      case "blue": return "bg-white text-blue-600 shadow-sm";
      case "indigo": return "bg-white text-indigo-600 shadow-sm";
      case "purple": return "bg-white text-purple-600 shadow-sm";
      case "green": return "bg-white text-green-600 shadow-sm";
      case "orange": return "bg-white text-orange-600 shadow-sm";
      default: return "bg-white text-blue-600 shadow-sm";
    }
  };

  const getActiveCardClass = (color) => {
    switch(color) {
      case "blue": return "border-blue-300 bg-gradient-to-br from-blue-50 to-white";
      case "indigo": return "border-indigo-300 bg-gradient-to-br from-indigo-50 to-white";
      case "purple": return "border-purple-300 bg-gradient-to-br from-purple-50 to-white";
      case "green": return "border-green-300 bg-gradient-to-br from-green-50 to-white";
      case "orange": return "border-orange-300 bg-gradient-to-br from-orange-50 to-white";
      default: return "border-blue-300 bg-gradient-to-br from-blue-50 to-white";
    }
  };

  const getActiveIndicatorClass = (color) => {
    switch(color) {
      case "blue": return "bg-blue-600 text-white";
      case "indigo": return "bg-indigo-600 text-white";
      case "purple": return "bg-purple-600 text-white";
      case "green": return "bg-green-600 text-white";
      case "orange": return "bg-orange-600 text-white";
      default: return "bg-blue-600 text-white";
    }
  };

  const getInactiveIndicatorClass = (color) => {
    switch(color) {
      case "blue": return "bg-blue-100 text-blue-600";
      case "indigo": return "bg-indigo-100 text-indigo-600";
      case "purple": return "bg-purple-100 text-purple-600";
      case "green": return "bg-green-100 text-green-600";
      case "orange": return "bg-orange-100 text-orange-600";
      default: return "bg-blue-100 text-blue-600";
    }
  };

  const getIndicatorLineClass = (color) => {
    switch(color) {
      case "blue": return "bg-blue-300";
      case "indigo": return "bg-indigo-300";
      case "purple": return "bg-purple-300";
      case "green": return "bg-green-300";
      case "orange": return "bg-orange-300";
      default: return "bg-blue-300";
    }
  };

  const getIconClass = (color, isActive) => {
    switch(color) {
      case "blue": return isActive ? "text-white" : "text-blue-600";
      case "indigo": return isActive ? "text-white" : "text-indigo-600";
      case "purple": return isActive ? "text-white" : "text-purple-600";
      case "green": return isActive ? "text-white" : "text-green-600";
      case "orange": return isActive ? "text-white" : "text-orange-600";
      default: return isActive ? "text-white" : "text-blue-600";
    }
  };

  const getIconBgClass = (color, isActive) => {
    switch(color) {
      case "blue": return isActive ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-blue-100 to-blue-200";
      case "indigo": return isActive ? "bg-gradient-to-br from-indigo-500 to-indigo-600" : "bg-gradient-to-br from-indigo-100 to-indigo-200";
      case "purple": return isActive ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-purple-100 to-purple-200";
      case "green": return isActive ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-green-100 to-green-200";
      case "orange": return isActive ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-gradient-to-br from-orange-100 to-orange-200";
      default: return isActive ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-blue-100 to-blue-200";
    }
  };

  // New: Fetch activities function
  const fetchActivities = async (workspaceId) => {
    try {
      // This is a placeholder - replace with your actual API call
      // const response = await fetch(`/api/workspaces/${workspaceId}/activities`);
      // const data = await response.json();
      
      // For now, return mock data
      const mockActivities = [
        {
          id: 1,
          type: "task_created",
          user: { name: "John Doe", avatar: null },
          description: "created a new task 'Design Homepage'",
          timestamp: "2024-01-15T10:30:00Z",
          metadata: { taskId: "123" }
        },
        {
          id: 2,
          type: "task_completed",
          user: { name: "Jane Smith", avatar: null },
          description: "marked task 'Fix Login Bug' as completed",
          timestamp: "2024-01-15T09:15:00Z",
          metadata: { taskId: "456" }
        },
        {
          id: 3,
          type: "member_added",
          user: { name: "Admin User", avatar: null },
          description: "added new member 'Alex Johnson' to workspace",
          timestamp: "2024-01-14T16:45:00Z"
        },
        {
          id: 4,
          type: "comment_added",
          user: { name: "Mike Wilson", avatar: null },
          description: "commented on 'API Integration' task",
          timestamp: "2024-01-14T14:20:00Z",
          metadata: { taskId: "789" }
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const stats = await fetchWorkspaceStats(id);
        if (stats) {
          setWorkspaceStats({
            totalTasks: stats.totalTasks || 0,
            completedTasks: stats.completedTasks || 0,
            membersCount: workspaceMembers?.length || 0,
            pendingInvites: stats.pendingInvites || 0
          });
        }
        
        // Fetch activities
        await fetchActivities(id);
      } catch (error) {
        console.error("Error loading workspace data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaceData();
  }, [id, workspaceMembers]);

  const TabContent = () => {
    switch(activeTab) {
      case "tasks":
        return <TaskBoard workspaceId={id} userRole={profile?.role} />;
      case "chat":
        return <WorkspaceChat workspaceId={id} currentUser={profile} />;
      case "activities":
        return <ActivitiesSection activities={activities} workspaceId={id} />;
      case "invite":
        return <InviteUser workspaceId={id} />;
      case "create":
        return <CreateTask workspaceId={id} />;
      default:
        return <TaskBoard workspaceId={id} userRole={profile?.role} />;
    }
  };

  const calculateCompletionRate = () => {
    if (workspaceStats.totalTasks === 0) return 0;
    return Math.round((workspaceStats.completedTasks / workspaceStats.totalTasks) * 100);
  };

  // Check if user can access create task tab
  const canCreateTask = profile?.role !== "client";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            {/* Workspace Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                  <FiFolder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentWorkspace?.name || "Workspace"}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {currentWorkspace?.description || "Project workspace"}
                  </p>
                </div>
              </div>
              
              {/* Real Stats */}
              {!loading && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiBarChart className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Tasks</p>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-900">{workspaceStats.totalTasks}</span>
                          {workspaceStats.totalTasks > 0 && (
                            <span className="text-xs text-gray-500">
                              ({workspaceStats.completedTasks} completed)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs text-gray-600">Progress</p>
                        <span className="font-semibold text-gray-900">{calculateCompletionRate()}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Members</p>
                        <span className="font-semibold text-gray-900">{workspaceStats.membersCount}</span>
                      </div>
                    </div>
                  </div>

                  {workspaceStats.pendingInvites > 0 && (
                    <div className="px-3 py-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-600">Pending</p>
                          <span className="font-semibold text-gray-900">{workspaceStats.pendingInvites}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role Badge */}
            {currentWorkspace?.user_role && (
              <div className={`px-4 py-2 rounded-lg font-medium ${
                currentWorkspace.user_role === "admin" 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                  : currentWorkspace.user_role === "client"
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              }`}>
                <span className="text-sm">
                  {currentWorkspace.user_role === "admin" 
                    ? "Administrator" 
                    : currentWorkspace.user_role === "client"
                    ? "Client"
                    : "Member"
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            {/* Desktop Tabs */}
            <div className="hidden sm:flex rounded-lg bg-gray-100 p-1">
              {tabs.map((tab) => {
                // Hide create task tab for client users in navigation
                if (tab.id === "create" && !canCreateTask) {
                  return null;
                }
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? getActiveTabClass(tab.color)
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Select */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {tabs.map((tab) => {
                  if (tab.id === "create" && !canCreateTask) {
                    return null;
                  }
                  return (
                    <option key={tab.id} value={tab.id} className="flex items-center gap-2">
                      {tab.label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  const prevTab = tabs[currentIndex - 1];
                  if (prevTab && (prevTab.id !== "create" || canCreateTask)) {
                    setActiveTab(prevTab.id);
                  }
                }}
                disabled={tabs.findIndex(t => t.id === activeTab) === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  const nextTab = tabs[currentIndex + 1];
                  if (nextTab && (nextTab.id !== "create" || canCreateTask)) {
                    setActiveTab(nextTab.id);
                  }
                }}
                disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Indicator */}
          <div className="flex items-center gap-2">
            {tabs.map((tab, index) => {
              // Skip create tab in indicator for clients
              if (tab.id === "create" && !canCreateTask) {
                return null;
              }
              
              const visibleTabs = tabs.filter(t => t.id !== "create" || canCreateTask);
              const currentIndex = visibleTabs.findIndex(t => t.id === activeTab);
              const tabIndex = visibleTabs.findIndex(t => t.id === tab.id);
              
              return (
                <div key={tab.id} className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? getActiveIndicatorClass(tab.color)
                      : currentIndex > tabIndex
                      ? getInactiveIndicatorClass(tab.color)
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {tabIndex + 1}
                  </div>
                  {tabIndex < visibleTabs.length - 1 && (
                    <div className={`h-0.5 w-6 transition-all duration-200 ${
                      currentIndex > tabIndex
                        ? getIndicatorLineClass(tab.color)
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
            <span className="text-sm text-gray-500 ml-3">
              Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Content Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {tabs.find(t => t.id === activeTab)?.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="p-0">
              <TabContent />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Navigation Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tabs.map((tab) => {
            // Hide create task card for client users
            if (tab.id === "create" && !canCreateTask) {
              return null;
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left hover:shadow-sm ${
                  activeTab === tab.id 
                    ? getActiveCardClass(tab.color)
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    getIconBgClass(tab.color, activeTab === tab.id)
                  }`}>
                    <tab.icon className={`w-5 h-5 ${
                      getIconClass(tab.color, activeTab === tab.id)
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{tab.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tab.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workspace...</p>
          </div>
        </div>
      )}
    </div>
  );
}