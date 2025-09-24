import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './Card';

export function ProductCard({ 
  product, 
  onToggleFavorite, 
  onAddToCart,
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <img 
          src={imageError ? '/api/placeholder/300/200' : product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart 
            className={`w-4 h-4 ${
              product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
            }`} 
          />
        </button>
        {product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Sale
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-eco-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="text-sm text-green-600 font-medium">
            Saves {product.co2Saved}kg CO₂
          </div>
        </div>
        
        <Button 
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-eco-600 hover:bg-eco-700 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

