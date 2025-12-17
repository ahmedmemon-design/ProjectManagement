import { useContext, useState, useEffect } from "react";
import { WorkspaceContext } from "./context/WorkspaceContext";
import CreateWorkspace from "./components/CreateWorkspace";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { 
  FiSearch,
  FiGrid,
  FiChevronRight,
  FiUsers,
  FiTrash2,
  FiMoreVertical
} from "react-icons/fi";
import { supabase } from "./lib/supabase";

export default function Workspaces() {
  const { workspaces, loading, removeWorkspace } = useContext(WorkspaceContext);
  const { profile } = useContext(AuthContext); // Get user profile
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [memberCounts, setMemberCounts] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);

  // Check if user is admin
  const isAdmin = profile?.role === "admin";

  // Filter workspaces based on search
  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch real member counts for all workspaces
  useEffect(() => {
    const fetchMemberCounts = async () => {
      if (!workspaces.length) return;

      setMembersLoading(true);
      const counts = {};

      for (const ws of workspaces) {
        try {
          const { count, error } = await supabase
            .from("workspace_members")
            .select("*", { count: 'exact', head: true })
            .eq("workspace_id", ws.id);

          if (error) {
            console.error(`Error fetching members for workspace ${ws.id}:`, error);
            counts[ws.id] = 1;
          } else {
            counts[ws.id] = count || 1;
          }
        } catch (error) {
          console.error(`Error fetching members for workspace ${ws.id}:`, error);
          counts[ws.id] = 1;
        }
      }

      setMemberCounts(counts);
      setMembersLoading(false);
    };

    fetchMemberCounts();
  }, [workspaces]);

  // Handle delete workspace
  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;

    setDeleteLoading(true);
    try {
      // Check if removeWorkspace function exists
      if (removeWorkspace && typeof removeWorkspace === 'function') {
        await removeWorkspace(workspaceToDelete.id);
      } else {
        // Fallback to direct Supabase delete
        const { error } = await supabase
          .from('workspaces')
          .delete()
          .eq('id', workspaceToDelete.id);
        
        if (error) throw error;
      }
      
      // Close modal
      setShowDeleteModal(false);
      setWorkspaceToDelete(null);
      
      // Force reload the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 500); // Small delay to ensure delete is complete
      
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert("Failed to delete workspace. Please try again.");
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
  const date = dateString
  return isNaN(date) ? "Recently" : date.toLocaleDateString();
};

  // Open delete confirmation modal
  const openDeleteModal = (workspace, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspace);
    setShowDeleteModal(true);
    setShowMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.workspace-menu')) {
        setShowMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Loading skeleton
  const WorkspaceSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  const WorkspaceCard = ({ ws, index }) => {
    const memberCount = memberCounts[ws.id] || 1;
    const isMenuOpen = showMenuId === ws.id;
    
    return (
      <motion.div
        key={ws.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: index * 0.05,
          duration: 0.3
        }}
        whileHover={{ 
          y: -4,
          transition: { duration: 0.2 }
        }}
        className="group relative"
      >
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          {/* Card Header with Menu */}
          <div className="flex items-start justify-between mb-4">
            <div 
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-lg">
                  {ws.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {ws.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
  Workspace • Created {formatDate(ws.created_at)}
                </p>
              </div>\
            </div>
            
            {/* Actions Menu - Only show if user is admin */}
            {isAdmin && (
              <div className="relative workspace-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenuId(isMenuOpen ? null : ws.id);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Workspace options"
                >
                  <FiMoreVertical className="w-5 h-5 text-gray-500" />
                </button>
                
                {/* Dropdown Menu - Only 1 option (Delete) */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1"
                    >
                      {/* Option: Delete Workspace - Only for admin */}
                      <button
                        onClick={(e) => openDeleteModal(ws, e)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="font-medium">Delete Workspace</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Card Content */}
          <div 
            className="space-y-3 cursor-pointer"
            onClick={() => navigate(`/workspace/${ws.id}`)}
          >
            <div className="flex items-center text-sm text-gray-600">
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
                <FiUsers className="w-4 h-4" />
                {membersLoading ? (
                  <span className="text-sm">Loading...</span>
                ) : (
                  <>
                    {memberCount} member{memberCount !== 1 ? 's' : ''}
                  </>
                )}
              </span>
            </div>
          </div>
          
          {/* Hover Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Workspaces
              </h1>
              <p className="text-gray-600">
                Manage and access your team workspaces
              </p>
            </div>
            
            <CreateWorkspace />
          </div>
          
          {/* Search Bar */}
          <div className="max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Search workspaces..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Clear search"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Content */}
        <div>
          {/* Content Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your Workspaces
              {filteredWorkspaces.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredWorkspaces.length} total)
                </span>
              )}
            </h2>
          </div>

          {/* Workspace Grid */}
          <AnimatePresence mode="wait">
            {loading || membersLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {[...Array(8)].map((_, i) => (
                  <WorkspaceSkeleton key={i} />
                ))}
              </motion.div>
            ) : filteredWorkspaces.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 md:py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiGrid className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No matching workspaces" : "No workspaces yet"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery ? `No results found for "${searchQuery}"` : "Create your first workspace to get started"}
                </p>
                {!searchQuery && <CreateWorkspace />}
              </motion.div>
            ) : (
              <motion.div
                key="workspaces"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {filteredWorkspaces.map((ws, index) => (
                  <WorkspaceCard key={ws.id} ws={ws} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal - Fixed with HIGHER z-index */}
      <AnimatePresence>
        {showDeleteModal && workspaceToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <FiTrash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Workspace</h3>
                    <p className="text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-1">
                    Are you sure you want to delete this workspace?
                  </p>
                  <p className="text-red-600 text-sm">
                    All data including tasks, members, and settings will be permanently removed.
                  </p>
                </div>
              </div>

              {/* Workspace Info */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {workspaceToDelete.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{workspaceToDelete.name}</h4>
                    <p className="text-sm text-gray-500">
                      Created {new Date(workspaceToDelete.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (!deleteLoading) {
                      setShowDeleteModal(false);
                      setWorkspaceToDelete(null);
                    }
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={deleteLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-5 h-5" />
                      Delete Workspace
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}