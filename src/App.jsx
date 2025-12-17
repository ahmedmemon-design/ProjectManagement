import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";

import Header from "./components/Header";
import Sidebar from "./components/LandingPage";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import "./App.css";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { ActiveWorkspaceProvider } from "./context/ActiveWorkspaceContext";
import Workspaces from "./Workspaces";
import WorkspaceDetails from "./components/WorkspaceDetails";
import Invites from "./Invites";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/* ================= PRIVATE ROUTE ================= */
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/signin" />;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); // Total animation duration
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ActiveWorkspaceProvider>
          <BrowserRouter>
          <ToastContainer />

            
            {/* VIP Opening Animation */}
            <AnimatePresence>
              {showIntro && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden"
                >
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0">
                    {/* Floating particles */}
                    {[...Array(50)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: Math.random() * 100 + 'vw',
                          y: Math.random() * 100 + 'vh',
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{ 
                          scale: Math.random() * 0.5 + 0.5,
                          opacity: Math.random() * 0.3 + 0.1
                        }}
                        transition={{
                          duration: 2,
                          delay: Math.random() * 0.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      />
                    ))}
                    
                    {/* Glowing orbs */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.2 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl"
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.15 }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-3xl"
                    />
                  </div>

                  {/* Main Content */}
                  <div className="relative h-full flex flex-col items-center justify-center">
                    {/* Logo Animation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.3
                      }}
                      className="mb-8"
                    >
                      <div className="relative">
                        {/* Outer Glow */}
                        <motion.div
                          animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            rotate: {
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            },
                            scale: {
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }
                          }}
                          className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-50"
                        />
                        
                        {/* Logo Circle */}
                        <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 flex items-center justify-center">
                          <motion.div
                            animate={{
                              rotate: 360
                            }}
                            transition={{
                              duration: 40,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            className="absolute inset-4 border border-blue-400/20 rounded-2xl"
                          />
                          <motion.div
                            animate={{
                              rotate: -360
                            }}
                            transition={{
                              duration: 30,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            className="absolute inset-6 border border-purple-400/20 rounded-xl"
                          />
                          <HiOutlineSparkles className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Title Animation */}
                    <div className="text-center mb-12 overflow-hidden">
                      <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 1,
                          delay: 0.5,
                          type: "spring",
                          stiffness: 100
                        }}
                        className="text-5xl md:text-7xl font-bold mb-4"
                      >
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                          Big Bull CAMP
                        </span>
                      </motion.h1>
                      
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "300px" }}
                        transition={{ duration: 1, delay: 1 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"
                      />
                      
                      <motion.p
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="text-xl md:text-2xl text-gray-300 font-light tracking-wider"
                      >
                        ENTERPRISE CAMP PLATFORM
                      </motion.p>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-80 max-w-full">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full overflow-hidden"
                      >
                        <motion.div
                          animate={{
                            x: ["0%", "100%", "0%"]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      </motion.div>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-gray-400 text-sm mt-3"
                      >
                        Initializing Systems...
                      </motion.p>
                    </div>

                    {/* Features Showcase */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                      className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 px-4"
                    >
                      {[
                        { icon: "⚡", text: "Lightning Fast" },
                        { icon: "🔐", text: "Secure" },
                        { icon: "🚀", text: "Production Ready" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm text-gray-300">{item.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Copyright */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 1, delay: 2 }}
                      className="absolute bottom-8 text-center text-gray-500 text-sm"
                    >
                      © {new Date().getFullYear()} BigBullDigital. All Rights Reserved.
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main App Content */}
            <AnimatePresence>
              {!showIntro && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Header />
                  
                  <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* PRIVATE ROUTES */}
                    <Route
                      path="/workspaces"
                      element={
                        <PrivateRoute>
                          <Workspaces />
                        </PrivateRoute>
                      }
                    />
                    
                    <Route
                      path="/invites"
                      element={
                        <PrivateRoute>
                          <Invites />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/workspace/:id"
                      element={
                        <PrivateRoute>
                          <WorkspaceDetails />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/*"
                      element={
                        <PrivateRoute>
                          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                            <Sidebar />
                          </div>
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </BrowserRouter>
        </ActiveWorkspaceProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
