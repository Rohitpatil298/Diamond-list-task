import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrokers,
  createBrokers,
  updateBrokers,
  deleteBrokers,
} from "../store/slices/BrokerSlice";
import Input from "../components/common/input";
import Button from "../components/common/button";
import Table from "../components/common/Table";

function BrokerManagement() {
  const dispatch = useDispatch();
  const brokers = useSelector((state) => state.brokers.items);
  const status = useSelector((state) => state.brokers.status);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    brokerRate: "",
    active: false,
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBrokers());
    }
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.brokerRate) newErrors.brokerRate = "Broker Rate is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editingId) {
      await dispatch(updateBrokers({ id: editingId, ...formData }));
      setEditingId(null);
    } else {
      await dispatch(createBrokers(formData));
    }
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      brokerRate: "",
      active: false,
    });
    setErrors({});
  };

  const handleEdit = (broker) => {
    setFormData(broker);
    setEditingId(broker.id);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBrokers(id));
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "address", header: "Address" },
    { key: "brokerRate", header: "Broker Rate (%)" },
    { key: "active", header: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <Input
              label="Broker Rate (%)"
              type="number"
              name="brokerRate"
              value={formData.brokerRate}
              onChange={handleInputChange}
              error={errors.brokerRate}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded border border-black focus:ring-indigo-500"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Active
              </label>
            </div>
          </div>
          <div className="mt-5">
            <Button type="submit" variant="primary">
              {editingId ? "Update Broker" : "Add Broker"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <Table
          columns={columns}
          data={brokers}
          actions={(row) => (
            <div className="space-x-2">
              <Button variant="secondary" onClick={() => handleEdit(row)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(row.id)}>
                Delete
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default BrokerManagement;
