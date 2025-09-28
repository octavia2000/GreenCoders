import { Link } from "react-router-dom";
import { Heart, User, ShoppingCart, Menu, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "../../actions/auth.action";
import { Logo } from "../ui/Logo";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, token, logout } = useAuthActions();
  const isAuthenticated = !!token;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-28 py-4 bg-white">
      {/* Logo */}
      <Logo size="default" showText={true} linkTo="/" />

      {/* Desktop Navigation - Centered */}
      <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
        <Link
          to="/explore"
          className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
        >
          Shop
        </Link>
        <Link
          to="/categories"
          className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
        >
          Categories
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
        >
          About Us
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
        >
          Contact Us
        </Link>
      </div>

      {/* Right Side - Search Bar + Icons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Heart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 font-medium">
                Hi, {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth/login">
              <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600 transition-colors" />
            </Link>
          )}
          <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600 transition-colors" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-md transition-colors ${
            isOpen ? "border border-green-500" : "hover:bg-gray-100"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-t flex flex-col items-center space-y-4 py-6 md:hidden z-50">
          <Link
            to="/explore"
            className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/categories"
            className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-eco-600 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>

          {/* Mobile Search */}
          <div className="w-full px-4 pt-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          <div className="border-t border-gray-200 w-full pt-4 mt-4">
            {isAuthenticated ? (
              <div className="space-y-2 text-center">
                <span className="block text-sm text-gray-700 font-medium">
                  Hi, {user?.name || "User"}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <Link
                  to="/auth/login"
                  className="block text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Become a Vendor Button */}
            <div className="pt-4">
              <button className="w-full px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 font-medium rounded-md transition-all duration-200">
                Become a Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
