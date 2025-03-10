import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiamonds } from "../store/slices/DiamondSlice";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../store/slices/Transaction";
import { fetchBrokers } from "../store/slices/BrokerSlice";
import Table from "../components/common/Table";
import Input from "../components/common/input";
import Button from "../components/common/button";

const generateStockNo = () => {
  const number = Math.floor(1000000 + Math.random() * 9000000);
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${number}${letters}`;
};

const DiamondManagement = () => {
  const transactions = useSelector((state) => state.transactions.items);
  const status = useSelector((state) => state.diamonds.status);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    stockNo: generateStockNo(),
    carat: "",
    shape: "",
    color: "",
    clarity: "",
    rapPrice: "",
    discount: "",
    ppc: "",
    totalAmount: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBrokers());
      dispatch(fetchDiamonds());
      dispatch(fetchTransactions());
    }
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.carat) newErrors.carat = "Carat is required";
    if (!formData.shape) newErrors.shape = "Shape is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.clarity) newErrors.clarity = "Clarity is required";
    if (!formData.rapPrice) newErrors.rapPrice = "RAP Price is required";
    if (!formData.discount) newErrors.discount = "Discount is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const ppc = calculatePPC(formData.rapPrice, formData.discount);
    const totalAmount = calculateTotalAmount(ppc, formData.carat);
    const diamondData = {
      ...formData,
      ppc,
      totalAmount,
    };
    if (editingId) {
      await dispatch(updateTransaction({ id: editingId, ...diamondData }));
      setEditingId(null);
    } else {
      await dispatch(createTransaction(diamondData));
    }
    setFormData({
      stockNo: generateStockNo(),
      carat: "",
      shape: "",
      color: "",
      clarity: "",
      rapPrice: "",
      discount: "",
      ppc: "",
      totalAmount: "",
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTransaction(id));
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditingId(row.id);
  };

  const calculatePPC = (rapPrice, discount) => {
    return rapPrice + (rapPrice * discount) / 100;
  };

  const calculateTotalAmount = (ppc, carat) => {
    return ppc * carat;
  };

  const columns = [
    { key: "stockNo", header: "Stock No" },
    { key: "carat", header: "Carat" },
    { key: "shape", header: "Shape" },
    { key: "color", header: "Color" },
    { key: "clarity", header: "Clarity" },
    { key: "rapPrice", header: "RAP Price" },
    { key: "discount", header: "Discount (%)" },
    { key: "ppc", header: "PPC" },
    { key: "totalAmount", header: "Total Amount" },
  ];

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new Diamond
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <Input
                label="Stock No"
                name="stockNo"
                value={formData.stockNo}
                onChange={handleInputChange}
                error={errors.stockNo}
                readOnly
              />
              <Input
                label="Carat"
                name="carat"
                type="number"
                value={formData.carat}
                onChange={handleInputChange}
                error={errors.carat}
              />
              <Input
                label="Shape"
                name="shape"
                value={formData.shape}
                onChange={handleInputChange}
                error={errors.shape}
              />
              <Input
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                error={errors.color}
              />
              <Input
                label="Clarity"
                name="clarity"
                value={formData.clarity}
                onChange={handleInputChange}
                error={errors.clarity}
              />
              <Input
                label="RAP Price"
                name="rapPrice"
                type="number"
                value={formData.rapPrice}
                onChange={handleInputChange}
                error={errors.rapPrice}
              />
              <Input
                label="Discount (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
                error={errors.discount}
              />
              <Input
                label="PPC"
                name="ppc"
                type="number"
                value={calculatePPC(formData.rapPrice, formData.discount)}
                readOnly
              />
              <Input
                label="Total Amount"
                name="totalAmount"
                type="number"
                value={calculateTotalAmount(
                  calculatePPC(formData.rapPrice, formData.discount),
                  formData.carat
                )}
                readOnly
              />
            </div>
            <div className="mt-5">
              <Button type="submit" variant="primary">
                {editingId ? "Update Diamond" : "Add Diamond"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div>
        <Table
          columns={columns}
          data={transactions}
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
    </>
  );
};

export default DiamondManagement;
