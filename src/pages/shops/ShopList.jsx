import { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { shopService } from "../../services/shopService";

export const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });
  const [error, setError] = useState(null);

  // Fetch shops on mount
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await shopService.getAll();
      setShops(data || []);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingShop) {
        await shopService.update(editingShop.id, formData);
      } else {
        await shopService.create(formData);
      }
      fetchShops();
      closeModal();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await shopService.delete(id);
        fetchShops();
      } catch (err) {
        alert(err.message || "Failed to delete shop");
      }
    }
  };

  const openCreateModal = () => {
    setEditingShop(null);
    setFormData({
      name: "",
      location: "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      location: shop.location || "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShop(null);
    setFormData({
      name: "",
      location: "",
    });
  };

  const columns = [
    { header: "Shop Name", accessor: "name" },
    { header: "Location", accessor: "location" },
    {
      header: "Actions",
      render: (shop) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(shop);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(shop.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Shops"
        subtitle="Manage your shop locations"
        actions={
          <Button onClick={openCreateModal}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Shop
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading shops...</div>
        ) : (
          <Table
            columns={columns}
            data={shops}
            emptyMessage="No shops found. Create one to get started."
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingShop ? "Edit Shop" : "Add New Shop"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            label="Shop Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Main Branch, Downtown Store"
            required
          />

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Nairobi CBD, Westlands"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingShop ? "Update Shop" : "Create Shop"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
