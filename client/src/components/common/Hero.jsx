import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-eco-50 to-eco-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Shop Sustainably,
          <span className="text-eco-600"> Impact Positively</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover eco-certified products, track your CO₂ savings, and join a marketplace 
          where every purchase tells a sustainability story. Transparent impact, verified claims.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="eco" size="lg" className="px-8 bg-green-500">
            Start Shopping Green
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Become a Vendor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-eco-600 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Eco-Products</h3>
            <p className="text-gray-600">
              Every product comes with verified eco-certifications and sustainability data
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-eco-600 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Impact</h3>
            <p className="text-gray-600">
              See your CO₂ savings and environmental impact with every purchase
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-eco-600 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Vendor Dashboard</h3>
            <p className="text-gray-600">
              Vendors get detailed analytics linking sales to sustainability metrics
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
