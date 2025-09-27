// import { Header } from '../../../components/layout/Header';
import { SearchForm } from '../../../components/ui/SearchForm';
import { ProductCard } from '../../../components/ui/ProductCard';

export default function ExplorePage() {
  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      price: 24.99,
      originalPrice: 29.99,
      image: "/api/placeholder/300/200",
      rating: 4.5,
      reviews: 128,
      category: "Sustainable Living",
      description: "A durable stainless steel water bottle that keeps your drinks cold for 24 hours.",
      co2Saved: 2.5,
      isFavorite: false
    },
    {
      id: 2,
      name: "Solar Power Bank",
      price: 49.99,
      originalPrice: 59.99,
      image: "/api/placeholder/300/200",
      rating: 4.8,
      reviews: 89,
      category: "Renewable Energy",
      description: "Portable solar charger with 20000mAh capacity for all your devices.",
      co2Saved: 5.2,
      isFavorite: false
    },
    {
      id: 3,
      name: "Bamboo Phone Case",
      price: 19.99,
      originalPrice: 24.99,
      image: "/api/placeholder/300/200",
      rating: 4.2,
      reviews: 156,
      category: "Eco-Friendly Accessories",
      description: "Sustainable bamboo phone case with wireless charging compatibility.",
      co2Saved: 1.8,
      isFavorite: false
    }
  ];

  const handleToggleFavorite = (productId) => {
    console.log('Toggle favorite for product:', productId);
  };

  const handleAddToCart = (productId) => {
    console.log('Add to cart:', productId);
  };

  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Sustainable Products</h1>
            <SearchForm />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="bg-eco-600 text-white px-6 py-3 rounded-lg hover:bg-eco-700 transition-colors">
              Load More Products
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
