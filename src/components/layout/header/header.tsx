"use client";

import {
  ChevronDown,
  ShoppingBag,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  BookOpen,
  User,
  GraduationCap,
  Briefcase,
  Home,
  Palette,
  Database,
  Code,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "@/public/assets/images/logo2.png";
import LogoDarkImg from "@/public/assets/images/logo2.png";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Sample data
  const categories = [
    { name: "Computer Science", icon: <Code className="w-4 h-4" /> },
    { name: "Business", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Design", icon: <Palette className="w-4 h-4" /> },
    { name: "Data Science", icon: <Database className="w-4 h-4" /> },
  ];

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Instructors",
      href: "/instructors",
      icon: <GraduationCap className="w-5 h-5" />,
    },
  ];

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Parallax Effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/">
              <Image
                src={theme === "light" ? LogoImg : LogoDarkImg}
                alt="EduNest"
                width={160}
                height={60}
                className="h-12 w-auto dark:invert"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                <BookOpen className="w-5 h-5" />
                Categories
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 mt-2 w-56 origin-top-right rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden"
              >
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href="#"
                    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="mr-3 text-blue-500">{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop (Glass Morphism) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full" ref={searchRef}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="Find courses, instructors..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-300/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Search className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle (Animated) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </motion.button>

            {/* Cart with Bubble Notification */}
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/cart"
                className="relative p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                >
                  3
                </motion.span>
              </Link>
            </motion.div>

            {/* User Profile Dropdown */}
            {session?.user ? (
              <div className="relative" ref={userDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src={session.user.image || "/default-avatar.jpg"}
                        alt={session.user.name || "User"}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          href="/courses/learning"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 mr-3" />
                          My Learning
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-200/50 dark:border-gray-700/50">
                          <Link
                            href="/api/auth/signout"
                            className="flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-full hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </motion.button>

            {session?.user ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-md"
              >
                <Image
                  src={session.user.image || "/default-avatar.jpg"}
                  alt={session.user.name || "User"}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay (Fullscreen) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 pt-24 px-4"
          >
            <div className="container mx-auto">
              <div className="relative" ref={searchRef}>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search courses, instructors..."
                    className="w-full pl-4 pr-12 py-4 text-lg rounded-xl border border-gray-300/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>

                {/* Search suggestions would go here */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="lg:hidden fixed inset-x-0 top-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl rounded-b-2xl z-40 overflow-hidden"
          >
            {/* Mobile menu content would go here */}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
