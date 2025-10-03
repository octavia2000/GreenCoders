import { productsData } from "../components/data/product";

export function ProductsPage() {
  const categories = ["sponsored", "featured", "smartphones"];

  return (
    <div className="p-6 my-10 space-y-8">
      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="bg-green-700 text-white px-4 py-5 rounded">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {productsData
              .filter((p) => p.category === cat)
              .map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-contain"
                  />
                  <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 font-bold">${product.price}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-green-700 text-white px-3 py-1 rounded">
                      Buy Now
                    </button>
                    <button className="bg-gray-200 px-3 py-1 rounded">
                      Wishlist
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
