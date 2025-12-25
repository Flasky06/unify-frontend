import { useState, useEffect } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import { stockService } from "../services/stockService";
import { productService } from "../services/productService";
import { shopService } from "../services/shopService";

const AddStock = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchShops();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const data = await shopService.getAll();
      setShops(data);
      // Initialize quantities for all shops
      const initialQuantities = {};
      data.forEach((shop) => {
        initialQuantities[shop.id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSuccess(null);
    setError(null);
    // Reset quantities
    const resetQuantities = {};
    shops.forEach((shop) => {
      resetQuantities[shop.id] = 0;
    });
    setQuantities(resetQuantities);
  };

  const handleQuantityChange = (shopId, value) => {
    setQuantities({
      ...quantities,
      [shopId]: parseInt(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError("Please select a product first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const stockPromises = [];

      // Create stock entries for shops with quantity > 0
      Object.entries(quantities).forEach(([shopId, quantity]) => {
        if (quantity > 0) {
          stockPromises.push(
            stockService.createStock({
              shopId: parseInt(shopId),
              productId: selectedProduct.id,
              quantity: quantity,
            })
          );
        }
      });

      if (stockPromises.length === 0) {
        setError("Please enter at least one quantity");
        setLoading(false);
        return;
      }

      await Promise.all(stockPromises);

      setSuccess(
        `Successfully added ${selectedProduct.name} to ${stockPromises.length} shop(s)!`
      );

      // Reset form
      setSelectedProduct(null);
      const resetQuantities = {};
      shops.forEach((shop) => {
        resetQuantities[shop.id] = 0;
      });
      setQuantities(resetQuantities);
    } catch (err) {
      console.error("Failed to add stock:", err);
      setError(
        err.message || "Failed to add stock. Some entries may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Add Stock" subtitle="Add products to your shops" />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Product
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedProduct?.id === product.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    KSH {product.price?.toLocaleString()}
                  </div>
                </button>
              ))}
              {products.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No products available. Create products first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Shop Quantities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedProduct
                ? `Add "${selectedProduct.name}" to Shops`
                : "Select a product to continue"}
            </h3>

            {selectedProduct ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  {shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {shop.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {shop.location}, {shop.county}
                        </p>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          value={quantities[shop.id] || 0}
                          onChange={(e) =>
                            handleQuantityChange(shop.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Qty"
                        />
                      </div>
                    </div>
                  ))}
                  {shops.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No shops available. Create shops first.
                    </p>
                  )}
                </div>

                {shops.length > 0 && (
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null);
                        const resetQuantities = {};
                        shops.forEach((shop) => {
                          resetQuantities[shop.id] = 0;
                        });
                        setQuantities(resetQuantities);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add to Shops"}
                    </Button>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p>Select a product from the left to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
