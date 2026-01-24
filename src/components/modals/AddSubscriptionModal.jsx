import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { subscriptionService } from "../../services/subscriptionService";

export const AddSubscriptionModal = ({
  isOpen,
  onClose,
  onSuccess,
  businessId,
}) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    planId: "",
    shopLimit: "",
    userLimit: "",
    pricePerPeriod: "",
    billingPeriod: "MONTHLY",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "ACTIVE",
    notes: "Manual subscription grant",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getActivePlans();
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    }
  };

  const calculateEndDate = (period, startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);

    switch (period) {
      case "MONTHLY":
        end.setMonth(end.getMonth() + 1);
        break;
      case "QUARTERLY":
        end.setMonth(end.getMonth() + 3);
        break;
      case "ANNUALLY":
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }

    return end.toISOString().split("T")[0];
  };

  const handlePlanChange = (e) => {
    const planId = e.target.value;
    const selectedPlan = plans.find(p => p.id == planId);

    if (selectedPlan) {
      setFormData(prev => ({
        ...prev,
        planId: planId,
        shopLimit: selectedPlan.maxShops,
        userLimit: selectedPlan.maxUsers,
        pricePerPeriod: selectedPlan.price, // Default price
        // Adjust price based on billing period? logic below
      }));
      // Recalculate price based on billing period
      updatePrice(selectedPlan.price, formData.billingPeriod);
    } else {
      setFormData(prev => ({ ...prev, planId: "" }));
    }
  };

  const updatePrice = (basePrice, period) => {
    // This simple logic assumes basePrice is Monthly.
    // If backend stores Monthly price:
    let multiplier = 1;
    if (period === "QUARTERLY") multiplier = 3;
    if (period === "ANNUALLY") multiplier = 12;

    // However, if the Plan object has pre-calculated prices for periods?
    // For now, let's just use the Input logic or keep it simple.
    // Let's assume the user can override price, but default is helpful.
    // Actually, let's keep it simple: Plan selection sets the "base" standard price.
    // We already passed calculate logic in backend. Here we just set helpful defaults.
  };

  const handleBillingPeriodChange = (e) => {
    const period = e.target.value;
    const endDate = calculateEndDate(period, formData.startDate);

    setFormData({
      ...formData,
      billingPeriod: period,
      endDate: endDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        businessId: parseInt(businessId),
        planId: formData.planId ? parseInt(formData.planId) : null,
        shopLimit: parseInt(formData.shopLimit),
        userLimit: formData.userLimit ? parseInt(formData.userLimit) : null,
        billingPeriod: formData.billingPeriod,
        pricePerPeriod: parseFloat(formData.pricePerPeriod),
        status: formData.status,
        subscriptionStartDate: formData.startDate,
        subscriptionEndDate: formData.endDate,
        notes: formData.notes,
      };

      await subscriptionService.createSubscription(payload);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to create subscription: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id == formData.planId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Grant Subscription
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Plan</label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.planId}
                onChange={handlePlanChange}
              >
                <option value="">-- Manual / Select Plan --</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.planName} (Limits: {plan.maxShops} Shops, {plan.maxUsers || 'Unlimited'} Users)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Billing Period
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.billingPeriod}
                onChange={handleBillingPeriodChange}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUALLY">Yearly</option>
              </select>
            </div>

            {formData.planId ? (
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 border border-gray-200">
                <p className="font-medium text-gray-900">Plan Details Applied:</p>
                <p><strong>Limits:</strong> {selectedPlan?.maxShops} Shops, {selectedPlan?.maxUsers || 'Unlimited'} Users</p>
                <p><strong>Standard Price:</strong> {selectedPlan?.price} KSH / {formData.billingPeriod}</p>
                <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline" onClick={() => setFormData({ ...formData, planId: "" })}>
                  Switch to Custom/Manual Entry
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Shop Limit
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      value={formData.shopLimit}
                      onChange={(e) => setFormData({ ...formData, shopLimit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      value={formData.pricePerPeriod}
                      onChange={(e) => setFormData({ ...formData, pricePerPeriod: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={formData.userLimit || ""}
                    onChange={(e) => setFormData({ ...formData, userLimit: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={formData.startDate}
                  onChange={(e) => {
                    const date = e.target.value;
                    setFormData({
                      ...formData,
                      startDate: date,
                      endDate: calculateEndDate(formData.billingPeriod, date)
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                  value={formData.endDate}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Grant Subscription
              </Button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};
