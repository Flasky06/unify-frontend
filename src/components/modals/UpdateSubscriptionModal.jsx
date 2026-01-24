import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { subscriptionService } from "../../services/subscriptionService";
import Input from "../../components/ui/Input";

export const UpdateSubscriptionModal = ({
  isOpen,
  onClose,
  onSuccess,
  subscription,
}) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    planId: "",
    shopLimit: "",
    userLimit: "",
    monthlyRate: "",
    subscriptionEndDate: "",
    subscriptionStartDate: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getActivePlans();
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  // Helper to extract tier name
  const getTierName = (planName) => planName ? planName.split(' - ')[0] : '';

  useEffect(() => {
    if (subscription) {
      const currentPlan = plans.find(p => p.id === subscription.plan?.id);
      const tier = currentPlan ? getTierName(currentPlan.planName) : "";

      setFormData({
        planId: subscription.plan?.id || "",
        tier: tier,
        billingPeriod: subscription.billingPeriod || "MONTHLY",
        shopLimit: subscription.shopLimit,
        userLimit: subscription.userLimit,
        monthlyRate: subscription.monthlyRate,
        subscriptionEndDate: subscription.subscriptionEndDate ? subscription.subscriptionEndDate.split('T')[0] : "",
        subscriptionStartDate: subscription.subscriptionStartDate ? subscription.subscriptionStartDate.split('T')[0] : "",
        notes: subscription.notes || "",
      });
    }
  }, [subscription, plans]);

  // Derive Tiers from plans, filtering out legacy ones if any slip through
  const whitelistedTiers = ["Starter", "Growth", "Business", "Pro", "Enterprise"];
  const tiers = [...new Set(plans.map(p => getTierName(p.planName)))]
    .filter(t => whitelistedTiers.some(wt => wt.toLowerCase() === t.toLowerCase()));

  // Find plan based on Tier + Period
  useEffect(() => {
    if (formData.tier && formData.billingPeriod) {
      const matchingPlan = plans.find(p =>
        getTierName(p.planName) === formData.tier &&
        p.billingPeriod === formData.billingPeriod
      );

      if (matchingPlan) {
        setFormData(prev => ({
          ...prev,
          planId: matchingPlan.id,
          // Update defaults if switching tiers
          shopLimit: matchingPlan.maxShops,
          userLimit: matchingPlan.maxUsers,
          monthlyRate: matchingPlan.pricePerPeriod // Pre-fill price from plan defaults
        }));
      }
    }
  }, [formData.tier, formData.billingPeriod, plans]);

  const handleTierChange = (e) => {
    setFormData(prev => ({ ...prev, tier: e.target.value }));
  };

  const handlePeriodChange = (e) => {
    setFormData(prev => ({ ...prev, billingPeriod: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Send planId if selected, otherwise fallback to manual (but UI pushes plan)
      await subscriptionService.updateSubscription(subscription.id, {
        planId: formData.planId, // Send planId for backend to auto-set limits
        shopLimit: formData.shopLimit ? parseInt(formData.shopLimit) : null,
        userLimit: formData.userLimit ? parseInt(formData.userLimit) : null,
        pricePerPeriod: formData.monthlyRate ? parseFloat(formData.monthlyRate) : null,
        subscriptionEndDate: formData.subscriptionEndDate,
        subscriptionStartDate: formData.subscriptionStartDate,
        notes: formData.notes
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to update subscription: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const selectedPlan = plans.find(p => p.id == formData.planId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Update Subscription Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier
                </label>
                <select
                  name="tier"
                  value={formData.tier || ""}
                  onChange={handleTierChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                >
                  <option value="">-- Select Tier --</option>
                  {tiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Period
                </label>
                <select
                  name="billingPeriod"
                  value={formData.billingPeriod || "MONTHLY"}
                  onChange={handlePeriodChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="ANNUALLY">Annually</option>
                </select>
              </div>
            </div>

            {selectedPlan && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 border border-gray-200">
                <p><strong>Standard Limits:</strong> {selectedPlan.maxShops} Shops, {selectedPlan.maxUsers || 'Unlimited'} Users</p>
                <p><strong>Standard Price:</strong> {selectedPlan.price} KSH / {selectedPlan.billingPeriod}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Limit (Override)
                </label>
                <input
                  type="number"
                  name="shopLimit"
                  min="1"
                  value={formData.shopLimit || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder={selectedPlan ? selectedPlan.maxShops : "Manual"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Limit (Override)
                </label>
                <input
                  type="number"
                  name="userLimit"
                  min="1"
                  value={formData.userLimit || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder={selectedPlan ? (selectedPlan.maxUsers || "Unlimited") : "Manual"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Reason for update..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Backdate)
                </label>
                <input
                  type="date"
                  name="subscriptionStartDate"
                  value={formData.subscriptionStartDate || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Override)
                </label>
                <input
                  type="date"
                  name="subscriptionEndDate"
                  value={formData.subscriptionEndDate || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 italic">
              Use these fields to align the subscription with the actual payment date.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Update Subscription
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
