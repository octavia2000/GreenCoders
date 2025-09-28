import { Heart } from "lucide-react";
import { useState } from "react";

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState(new Set());

  const products = [
    {
      id: 1,
      name: "Birkin Bag",
      description: "Brown durable eco-friendly made from quality leather",
      price: "$600",
      image: "/src/assets/images/feat-1.svg",
      originalPrice: "$800"
    },
    {
      id: 2,
      name: "Wireless Headphones",
      description: "Beige over-ear headphones with noise cancellation",
      price: "$299",
      image: "/src/assets/images/feat-2.svg",
      originalPrice: "$399"
    },
    {
      id: 3,
      name: "Leather Wallet",
      description: "Brown eco-friendly leather wallet with RFID protection",
      price: "$89",
      image: "/src/assets/images/feat-3.svg",
      originalPrice: "$120"
    },
    {
      id: 4,
      name: "Eco Sneakers",
      description: "Light green and white sneakers made from recycled materials",
      price: "$149",
      image: "/src/assets/images/feat-4.svg",
      originalPrice: "$199"
    }
  ];

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const addToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement cart functionality
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28">
        <h2 className="text-3xl lg:text-4xl font-bold text-left text-gray-900 mb-12">
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.has(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-green-600">
                    {product.price}
                  </span>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
