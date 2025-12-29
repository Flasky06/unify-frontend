import { useState, useEffect } from "react";
import { stockService } from "../../services/stockService";
import { saleService } from "../../services/saleService";
import { paymentMethodService } from "../../services/paymentMethodService";
import useAuthStore from "../../store/authStore";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

export const POS = () => {
  const { user } = useAuthStore();

  // State
  const [products, setProducts] = useState([]); // Stock items actually
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Checkout State
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // UI State
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    fetchProducts();
    fetchPaymentMethods();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let data = [];
      if (user.shopId) {
        data = await stockService.getStocksByShop(user.shopId);
      } else if (user.role === "SHOP_MANAGER" && user.shop?.id) {
        data = await stockService.getStocksByShop(user.shop.id);
      } else {
        // Fallback or handle business owner (needs to select shop?)
        // For now assume user has shopId (Sales Rep) or Shop Manager
        // If Business Owner, POS might need Shop Selection.
        // Let's default to empty or handle later.
        setToast({
          isOpen: true,
          message: "Please select a shop to use POS",
          type: "warning",
        });
        return;
      }
      setProducts(data);
    } catch (err) {
      console.error(err);
      setToast({
        isOpen: true,
        message: "Failed to load products",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const data = await paymentMethodService.getAll();
      const activeMethods = (data || []).filter((pm) => pm.isActive);
      setPaymentMethods(activeMethods);
      if (activeMethods.length > 0) {
        setPaymentMethod(activeMethods[0].id);
      }
    } catch (err) {
      console.error("Failed to load payment methods", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.quantity > 0 // Only show in-stock
  );

  const addToCart = (stockItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.stockId === stockItem.id);
      if (existing) {
        if (existing.quantity >= stockItem.quantity) {
          setToast({
            isOpen: true,
            message: "Insufficient stock!",
            type: "error",
          });
          return prev;
        }
        return prev.map((item) =>
          item.stockId === stockItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            stockId: stockItem.id,
            productId: stockItem.productId,
            name: stockItem.productName,
            price: stockItem.sellingPrice,
            quantity: 1,
            maxStock: stockItem.quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (stockId, newQty) => {
    if (newQty < 1) {
      removeFromCart(stockId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.stockId === stockId) {
          if (newQty > item.maxStock) {
            setToast({
              isOpen: true,
              message: "Max stock reached",
              type: "warning",
            });
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (stockId) => {
    setCart((prev) => prev.filter((item) => item.stockId !== stockId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const saleData = {
        shopId: user.shopId || user.shop?.id,
        paymentMethodId: paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await saleService.createSale(saleData);

      setToast({
        isOpen: true,
        message: "Sale completed successfully!",
        type: "success",
      });
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (err) {
      console.error(err);
      setToast({
        isOpen: true,
        message: err.message || "Checkout failed",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] gap-4 p-4">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.productName}
                </h3>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <span className="font-bold text-lg text-blue-600">
                  ${item.sellingPrice}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-lg shadow flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-lg">Current Sale</h2>
          <p className="text-sm text-gray-500">{cart.length} Items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map((item) => (
            <div
              key={item.stockId}
              className="flex justify-between items-center gap-2"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-blue-600">${item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.stockId, item.quantity - 1)
                  }
                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.stockId, item.quantity + 1)
                  }
                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
                >
                  +
                </button>
              </div>
              <div className="text-right min-w-[3rem]">
                <p className="font-bold text-sm text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.stockId)}
                className="text-red-400 hover:text-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No items added
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`py-2 px-3 text-sm font-medium rounded ${
                    paymentMethod === method.id
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            <Button
              className="w-full h-12 text-lg"
              onClick={handleCheckout}
              isLoading={isProcessing}
              disabled={cart.length === 0}
            >
              {isProcessing
                ? "Processing..."
                : `Process Sale - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>

      {toast.isOpen && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}
    </div>
  );
};
