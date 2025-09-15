import { Button } from "../ui/button"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-eco-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-xl font-bold text-eco-800">GreenCoders</h1>
          <span className="text-sm text-eco-600 bg-eco-50 px-2 py-1 rounded-full">
            Sustainability Marketplace
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-eco-600 transition-colors">
            Products
          </a>
          <a href="#" className="text-gray-600 hover:text-eco-600 transition-colors">
            Vendors
          </a>
          <a href="#" className="text-gray-600 hover:text-eco-600 transition-colors">
            Impact
          </a>
          <a href="#" className="text-gray-600 hover:text-eco-600 transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button variant="eco" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
