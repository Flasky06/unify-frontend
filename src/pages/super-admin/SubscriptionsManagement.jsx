import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/subscriptionService";
import { Toast } from "../../components/ui/ConfirmDialog";
import { RecordPaymentModal } from "../../components/modals/RecordPaymentModal";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [toastState, setToastState] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToastState({ isOpen: true, message, type });
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [subsData, plansData] = await Promise.all([
        filterStatus === "ALL"
          ? subscriptionService.getAllSubscriptions()
          : subscriptionService.getSubscriptionsByStatus(filterStatus),
        subscriptionService.getActivePlans(),
      ]);
      setSubscriptions(subsData);
      setPlans(plansData);
    } catch (error) {
      showToast("Failed to fetch data", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    showToast("Payment recorded successfully!", "success");
    setShowPaymentModal(false);
    fetchData();
  };

  const handleCreateTrial = async (businessId) => {
    try {
      await subscriptionService.createTrialSubscription(businessId, 1);
      showToast("Trial subscription created!", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to create trial", "error");
      console.error(error);
    }
  };

  const handleSuspend = async (subscriptionId) => {
    if (!confirm("Are you sure you want to suspend this subscription?")) return;
    try {
      await subscriptionService.suspendSubscription(subscriptionId);
      showToast("Subscription suspended", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to suspend subscription", "error");
    }
  };

  const handleReactivate = async (subscriptionId) => {
    try {
      await subscriptionService.reactivateSubscription(subscriptionId);
      showToast("Subscription reactivated", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to reactivate subscription", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Subscription Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage business subscriptions and payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Total Subscriptions"
          value={subscriptions.length}
          color="blue"
        />
        <StatCard
          title="Active"
          value={subscriptions.filter((s) => s.status === "ACTIVE").length}
          color="green"
        />
        <StatCard
          title="Trial"
          value={subscriptions.filter((s) => s.status === "TRIAL").length}
          color="yellow"
        />
        <StatCard
          title="Expired"
          value={subscriptions.filter((s) => s.status === "EXPIRED").length}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["ALL", "ACTIVE", "TRIAL", "EXPIRED", "SUSPENDED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      {/* Subscriptions Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50 p-1 rounded-lg">
        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No subscriptions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() =>
                        navigate(`/super-admin/business/${sub.businessId}`)
                      }
                    >
                      {sub.businessName}
                    </h3>
                    <p className="text-sm text-gray-500">{sub.planName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-gray-400">
                      {sub.billingPeriod}
                    </span>
                  </div>
                </div>

                {/* Card Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-t border-b border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shops
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {sub.currentShopCount}{" "}
                      <span className="text-gray-400 font-normal">
                        / {sub.shopLimit}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      KSH {sub.pricePerPeriod.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Expiry Info */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-500">Expires:</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 block">
                      {new Date(sub.subscriptionEndDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs ${
                        sub.daysUntilExpiry < 7
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {sub.daysUntilExpiry} days left
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => {
                      setSelectedSubscription(sub);
                      setShowPaymentModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    Pay
                  </button>
                  {sub.status === "ACTIVE" || sub.status === "TRIAL" ? (
                    <button
                      onClick={() => handleSuspend(sub.id)}
                      className="flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(sub.id)}
                      className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && selectedSubscription && (
        <RecordPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          subscriptionId={selectedSubscription.id}
          currentEndDate={selectedSubscription.subscriptionEndDate}
        />
      )}

      {/* Toast Notification */}
      <Toast
        isOpen={toastState.isOpen}
        onClose={() => setToastState({ ...toastState, isOpen: false })}
        message={toastState.message}
        type={toastState.type}
      />
    </div>
  );
};

export default SubscriptionsManagement;
