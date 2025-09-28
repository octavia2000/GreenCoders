import { Heart } from "lucide-react";
import { useState } from "react";

export function PresentlyOnSales() {
  const [favorites, setFavorites] = useState(new Set());

  const products = [
    {
      id: 1,
      name: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
      price: "$1437",
      image: "/src/assets/images/iphone.svg",
      originalPrice: "$1599"
    },
    {
      id: 2,
      name: "AirPods Max Silver",
      price: "$549",
      image: "/src/assets/images/headset.svg",
      originalPrice: "$599"
    },
    {
      id: 3,
      name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium Case",
      price: "$399",
      image: "/src/assets/images/watch.svg",
      originalPrice: "$449"
    },
    {
      id: 4,
      name: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
      price: "$1499",
      image: "/src/assets/images/iphone2.svg",
      originalPrice: "$1699"
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
          Presently on sales
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-contain p-4"
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
              
              <div className="p-4 flex flex-col h-full">
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 flex-grow text-center">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-center mb-3">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg font-bold text-green-600">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
