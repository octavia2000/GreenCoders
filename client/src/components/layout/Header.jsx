import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";

export function Header() {
  return (
     <nav className="flex items-center justify-between px-6 py-3 shadow-sm bg-white">
      
      <div className="flex items-center space-x-2">
        <span className="text-green-600 font-bold text-lg">🌿 GreenCode</span>
      </div>

      
      <div className="flex space-x-6">
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
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border rounded-md focus:outline-none"
        />
        <FaHeart className="text-gray-600 cursor-pointer hover:text-green-600" />
        <FaUser className="text-gray-600 cursor-pointer hover:text-green-600" />
        <FaShoppingCart className="text-gray-600 cursor-pointer hover:text-green-600" />
      </div>
    </nav>
  )
}
