import { Smartphone, Watch, Camera, Headphones, Monitor, Gamepad2 } from "lucide-react";

export function ShopByCategory() {
  const categories = [
    { name: "Phones", icon: Smartphone },
    { name: "Smart Watches", icon: Watch },
    { name: "Cameras", icon: Camera },
    { name: "Headphones", icon: Headphones },
    { name: "Computers", icon: Monitor },
    { name: "Gaming", icon: Gamepad2 }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28">
        <h2 className="text-3xl lg:text-4xl font-bold text-left text-gray-900 mb-12">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={index}
                className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
