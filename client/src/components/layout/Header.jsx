import { Link } from "react-router-dom";
import { Heart, User, ShoppingCart, Search, Menu } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-28 py-3 shadow-sm bg-white">
      
      <div className="flex items-center space-x-2">
        <img src={logo} alt="GreenCode Logo" className="h-8 w-auto" />
        <span className="text-black font-bold text-xl">GreenCode</span>
      </div>

      
      <div className="hidden md:flex space-x-6">
        <Link to="/shop" className="hover:text-green-600">
          Shop
        </Link>
        <Link to="/categories" className="hover:text-green-600">
          Categories
        </Link>
        <Link to="/about" className="hover:text-green-600">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-green-600">
          Contact Us
        </Link>
      </div>

      
      <div className="flex items-center space-x-4">
        
        <div className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-40 md:w-64 pl-10 pr-4 py-2 bg-gray-100 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        
        <div className="flex space-x-4">
          <Heart className="w-5 h-5 text-gray-600 hover:text-green-600" />
          <User className="w-5 h-5 text-gray-600 hover:text-green-600" />
          <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-green-600" />
        </div>

        
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link to="/shop" className="hover:text-green-600" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link to="/categories" className="hover:text-green-600" onClick={() => setIsOpen(false)}>
            Categories
          </Link>
          <Link to="/about" className="hover:text-green-600" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="hover:text-green-600" onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
