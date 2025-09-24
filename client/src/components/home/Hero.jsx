import { Button } from "../ui/button"
import { Link } from "react-router-dom";
import shoeImage from "../../assets/images/shoe-header.svg";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-green-25 py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-12 lg:block hidden">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Shop Sustainable
                <br />
                <span className="text-green-600">Live Better</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg">
                Discover Ecofriendly products that help you live sustainably while protecting the planet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/explore" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-48 h-12 text-white rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                  Shop Now
                </button>
              </Link>
              <button className="w-full sm:w-48 h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 font-medium font-poppins text-base rounded-md transition-all duration-200 flex items-center justify-center">
                Become a Vendor
              </button>
            </div>
          </div>

          {/* Right Side - Shoe Image with Mobile Overlay */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <img 
                src={shoeImage} 
                alt="Sustainable Eco-Friendly Shoes" 
                className="w-full h-auto object-contain"
              />
              
              {/* Mobile Overlay - Text and Buttons over Image */}
              <div className="lg:hidden absolute inset-0 flex flex-col justify-end p-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      Shop Sustainable
                      <br />
                      <span className="text-green-600">Live Better</span>
                    </h1>
                    
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Discover Ecofriendly products that help you live sustainably while protecting the planet.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link to="/explore">
                      <button className="w-full h-10 text-white rounded-md font-medium font-poppins text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                        Shop Now
                      </button>
                    </Link>
                    <button className="w-full h-10 bg-white border-2 border-gray-300 text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 font-medium font-poppins text-sm rounded-md transition-all duration-200 flex items-center justify-center">
                      Become a Vendor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
