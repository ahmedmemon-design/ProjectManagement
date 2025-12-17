import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { FiArrowRight, FiCheck, FiUsers, FiFolder, FiZap, FiShield, FiGlobe, FiBarChart } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WorkspaceContext } from "../context/WorkspaceContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { workspaces } = useContext(WorkspaceContext);
  const controls = useAnimation();
  const [stats, setStats] = useState({ workspaces: 0, tasks: 0, members: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Calculate real stats from context
  useEffect(() => {
    if (workspaces) {
      const totalTasks = workspaces.reduce((acc, ws) => acc + (ws.taskCount || 0), 0);
      const totalMembers = workspaces.reduce((acc, ws) => acc + (ws.memberCount || 1), 0);
      setStats({
        workspaces: workspaces.length,
        tasks: totalTasks,
        members: totalMembers
      });
    }
  }, [workspaces]);

  // Animation triggers
  useEffect(() => {
    setIsVisible(true);
    controls.start("visible");
  }, [controls]);

  // Features with real functionality
  const features = [
    {
      icon: FiFolder,
      title: "Workspace Management",
      description: "Organize projects in dedicated workspaces",
      gradient: "from-blue-500 to-cyan-500",
      action: () => navigate("/workspaces")
    },
    {
      icon: FiUsers,
      title: "Team Collaboration",
      description: "Invite members and collaborate in real-time",
      gradient: "from-green-500 to-emerald-500",
      action: () => navigate("/invites")
    },
    {
      icon: FiZap,
      title: "Instant Updates",
      description: "Real-time synchronization across all devices",
      gradient: "from-purple-500 to-pink-500",
      action: () => user ? navigate("/workspaces") : navigate("/signup")
    }
  ];

  // Testimonials (You can replace with real ones later)
  const testimonials = [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200">
                <HiOutlineLightningBolt className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Production Ready • Enterprise Grade
                </span>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="block">Project Management</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              A modern, real-time collaboration platform built for teams that move fast.
              No fake data, no fluff—just powerful tools that work.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/workspaces" : "/signup")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{user ? "Go to Workspaces" : "Start Free Trial"}</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/invites")}
                className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                Check Invites
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          {user && workspaces && workspaces.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Active Workspaces", value: stats.workspaces, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                      {index === 0 && <FiFolder className="w-6 h-6 text-white" />}
                      {index === 1 && <FiCheck className="w-6 h-6 text-white" />}
                      {index === 2 && <FiUsers className="w-6 h-6 text-white" />}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Real Work</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every feature serves a purpose. No clutter, no distractions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={feature.action}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold">
                    <span>Get started</span>
                    <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to transform your workflow?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of teams who trust BigBull CRM for their project management.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/workspaces" : "/signup")}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3"
              >
                <span>{user ? "Continue Working" : "Get Started Now"}</span>
                <FiArrowRight className="w-6 h-6" />
              </motion.button>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <FiShield className="w-5 h-5" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiGlobe className="w-5 h-5" />
                  <span>Global Infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBarChart className="w-5 h-5" />
                  <span>Real-time Analytics</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <HiOutlineSparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BigBull CRM
                </div>
                <div className="text-gray-500 text-sm">Production-Ready Project Management</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <button onClick={() => navigate("/workspaces")} className="text-gray-600 hover:text-gray-900 font-medium">
                Workspaces
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>© {new Date().getFullYear()} BigBull CRM. All rights reserved.</p>
            <p className="mt-2 text-sm">Built with performance and reliability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}