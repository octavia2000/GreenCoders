import { Leaf, Shield, Truck } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly Products",
      description: "We prioritise eco-friendly, high-quality items that support a greener planet"
    },
    {
      icon: Shield,
      title: "Fast and Secure Payments",
      description: "Enjoy Fast and seamless payments with different payment options"
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Fast, Safe and convinient shipping which takes about 7-14 days to your doorsteps"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 xl:px-28">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-green-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
