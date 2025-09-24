import { Link } from "react-router-dom";

export function PopularOnDemand() {
  const products = [
    {
      id: 1,
      name: "Macbook Pro",
      description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
      image: "/src/assets/images/macbook.svg"
    },
    {
      id: 2,
      name: "Samsung Galaxy",
      description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
      image: "/src/assets/images/samsung.svg"
    },
    {
      id: 3,
      name: "Popular Products",
      description: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
      image: "/src/assets/images/iwatch.svg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28">
        <h2 className="text-3xl lg:text-4xl font-bold text-left text-gray-900 mb-12">
          Popular on demand
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const cardBgClass = 'bg-gray-800';
            const cardStyle = index === 1 ? { backgroundColor: '#303430' } : { backgroundColor: '#4A4C4A' };
            
            return (
              <div key={product.id} className={`${cardBgClass} rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`} style={cardStyle}>
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-contain mx-auto"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <Link to="/explore">
                    <button className="w-1/2 mx-auto border border-white text-white py-4 px-6 rounded-md font-medium hover:bg-white hover:text-black transition-all duration-200">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
