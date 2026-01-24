import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { subscriptionService } from "../../services/subscriptionService";
import { EditPlanModal } from "../../components/modals/EditPlanModal";
import Toast from "../../components/ui/Toast";

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [toast, setToast] = useState({
        isOpen: false,
        message: "",
        type: "success"
    });

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setIsLoading(true);
        try {
            const data = await subscriptionService.getAllPlans();
            // Sort by price for better readability
            setPlans(data.sort((a, b) => a.price - b.price));
        } catch (error) {
            console.error("Failed to load plans", error);
            setToast({ isOpen: true, message: "Failed to load plans", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (plan) => {
        setSelectedPlan(plan);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setToast({ isOpen: true, message: "Plan updated successfully", type: "success" });
        loadPlans();
    };

    const columns = [
        {
            header: "Plan Name",
            accessor: "planName",
            render: (plan) => (
                <div className="font-medium text-gray-900">{plan.planName}</div>
            )
        },
        {
            header: "Price",
            accessor: "price",
            render: (plan) => `KES ${plan.price.toLocaleString()} / ${plan.billingPeriod}`
        },
        {
            header: "Shop Limit",
            accessor: "maxShops",
            render: (plan) => plan.maxShops || "Unlimited"
        },
        {
            header: "User Limit",
            accessor: "maxUsers",
            render: (plan) => plan.maxUsers || "Unlimited"
        },
        {
            header: "Status",
            accessor: "isActive",
            render: (plan) => (
                <span className={`px-2 py-1 text-xs rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: "Actions",
            render: (plan) => (
                <Button size="sm" variant="outline" onClick={() => handleEditClick(plan)}>
                    Edit
                </Button>
            )
        }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
                    <p className="text-gray-500 mt-1">Manage pricing tiers and limits</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading plans...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={plans}
                        searchable={true} // Simple client-side search
                        emptyMessage="No subscription plans found."
                    />
                )}
            </div>

            <EditPlanModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                plan={selectedPlan}
            />

            <Toast
                isOpen={toast.isOpen}
                onClose={() => setToast({ ...toast, isOpen: false })}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
};

export default SubscriptionPlans;
