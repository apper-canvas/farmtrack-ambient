import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cropService } from "@/services/api/cropService";
import ApperIcon from "@/components/ApperIcon";
import CropCard from "@/components/molecules/CropCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CropForm from "@/components/organisms/CropForm";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, statusFilter]);

  const loadCrops = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cropService.getAll();
      setCrops(data);
    } catch (error) {
      setError(error.message || "Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = [...crops];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
crop.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.field_location_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

// Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(crop => crop.status_c === statusFilter);
    }

    setFilteredCrops(filtered);
  };

  const handleAddCrop = () => {
    setEditingCrop(null);
    setShowForm(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(cropId);
        toast.success("Crop deleted successfully!");
        loadCrops();
      } catch (error) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingCrop(null);
    loadCrops();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCrop(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingCrop ? "Edit Crop" : "Add New Crop"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingCrop ? "Update crop information" : "Add a new crop to your farm"}
            </p>
          </div>
        </div>
        <CropForm
          crop={editingCrop}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Crop Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your crops in one place
          </p>
        </div>
        <Button
          onClick={handleAddCrop}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          Add New Crop
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search crops by name, variety, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="lg:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {crops.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-800">
{crops.filter(c => c.status_c === "planted").length}
            </div>
            <div className="text-sm text-green-600 font-medium">Planted</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-800">
              {crops.filter(c => c.status_c === "growing").length}
            </div>
            <div className="text-sm text-blue-600 font-medium">Growing</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">
              {crops.filter(c => c.status_c === "ready").length}
            </div>
            <div className="text-sm text-yellow-600 font-medium">Ready</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="text-2xl font-bold text-gray-800">
              {crops.filter(c => c.status_c === "harvested").length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Harvested</div>
          </Card>
        </div>
      )}

      {/* Crops Grid */}
      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.Id}
              crop={crop}
              onEdit={handleEditCrop}
              onDelete={handleDeleteCrop}
            />
          ))}
        </div>
      ) : crops.length === 0 ? (
        <Empty
          title="No crops found"
          description="Start by adding your first crop to begin tracking your farm operations"
          icon="Sprout"
          actionLabel="Add First Crop"
          onAction={handleAddCrop}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops match your filters</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Crops;