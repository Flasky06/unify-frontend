import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { subscriptionService } from "../../services/subscriptionService";

export const EditPlanModal = ({ isOpen, onClose, onSuccess, plan }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        planName: "",
        maxShops: "",
        maxUsers: "",
        pricePerPeriod: "",
        isActive: true,
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                planName: plan.planName,
                maxShops: plan.maxShops,
                maxUsers: plan.maxUsers !== null ? plan.maxUsers : "", // Handle null for unlimited
                pricePerPeriod: plan.price,
                isActive: plan.isActive,
            });
        }
    }, [plan]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                planName: formData.planName,
                maxShops: parseInt(formData.maxShops),
                maxUsers: formData.maxUsers === "" ? null : parseInt(formData.maxUsers), // Handle empty for infinite
                pricePerPeriod: parseFloat(formData.pricePerPeriod),
                isActive: formData.isActive,
            };

            await subscriptionService.updatePlan(plan.id, payload);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Failed to update plan: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                />

                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Edit Subscription Plan
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                name="planName"
                                value={formData.planName}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop Limit
                                </label>
                                <input
                                    type="number"
                                    name="maxShops"
                                    min="0"
                                    value={formData.maxShops}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User Limit
                                </label>
                                <input
                                    type="number"
                                    name="maxUsers"
                                    min="0"
                                    value={formData.maxUsers}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    placeholder="Leave empty for unlimited"
                                />
                                <p className="text-xs text-gray-500 mt-1">Empty = Unlimited</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (KES)
                            </label>
                            <input
                                type="number"
                                name="pricePerPeriod"
                                min="0"
                                step="0.01"
                                value={formData.pricePerPeriod}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Active (Available for new subscriptions)
                            </label>
                        </div>

                        <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
                            Warning: Changing limits/price here affects only <strong>new</strong> subscriptions. Existing subscriptions remain unchanged unless manually updated.
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
