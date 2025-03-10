import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import emailjs from "emailjs-com";
import "jspdf-autotable";
import { fetchTransactions } from "../store/slices/Transaction";
import { fetchBrokers } from "../store/slices/BrokerSlice";
import { fetchDiamonds } from "../store/slices/DiamondSlice";
import Button from "../components/common/button";
import Table from "../components/common/Table";
import BrokerDetails from "../components/BrokerDetails";
import Summary from "../components/Summary";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

const TransactionDetails = () => {
  const dispatch = useDispatch();
  const brokers = useSelector((state) => state.brokers.items);
  const diamonds = useSelector((state) => state.diamonds.items);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedDiamonds, setSelectedDiamonds] = useState([]);
  const targetRef = useRef();

  useEffect(() => {
    dispatch(fetchBrokers());
    dispatch(fetchDiamonds());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleBrokerChange = (e) => {
    setSelectedBroker(e.target.value);
  };

  const handleDiamondSelect = (diamond) => {
    setSelectedDiamonds((prevSelected) =>
      prevSelected.includes(diamond)
        ? prevSelected.filter((d) => d !== diamond)
        : [...prevSelected, diamond]
    );
  };

  const calculateSummary = () => {
    const totalQty = diamonds.length;
    const totalCts = diamonds.reduce((sum, diamond) => sum + diamond.carat, 0);
    const totalAmount = diamonds.reduce(
      (sum, diamond) => sum + diamond.totalAmount,
      0
    );
    const selectedQty = selectedDiamonds.length;
    const selectedCts = selectedDiamonds.reduce(
      (sum, diamond) => sum + diamond.carat,
      0
    );
    const selectedAmount = selectedDiamonds.reduce(
      (sum, diamond) => sum + diamond.totalAmount,
      0
    );
    const avgDis = totalAmount / totalCts;
    const selectedAvgDis = selectedAmount / selectedCts;
    return {
      totalQty,
      totalCts,
      totalAmount,
      selectedQty,
      selectedCts,
      selectedAmount,
      avgDis,
      selectedAvgDis,
    };
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      // Generate PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const dataUrl = await domtoimage.toPng(targetRef.current, {
        quality: 0.7,
        scale: 1,
      });
      const imgWidth = 190; // Keep within A4 width
      const imgHeight =
        (targetRef.current.offsetHeight * imgWidth) /
        targetRef.current.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
      const pdfBlob = pdf.output("blob");

      // Convert PDF to base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];

        const templateParams = {
          to_email: "talent@sarvadhi.com",
          from_name: "Diamond Transaction System",
          message: "Please find attached the transaction report.",
          attachment: base64data,
          filename: "summary.pdf",
        };

        await emailjs.send(
          import.meta.env.REACT_APP_EMAILJS_SERVICE_ID,
          import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.REACT_APP_EMAILJS_USER_ID
        );

        alert("Email sent successfully! on talent@sarvadhi.com");
      };
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const generatePDF = () => {
    if (!targetRef.current) {
      console.error("Target reference not found!");
      alert("Failed to generate PDF: Target reference not found.");
      return;
    }

    domtoimage
      .toPng(targetRef.current, { quality: 0.7, scale: 1 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190; // Keep within A4 width
        const imgHeight =
          (targetRef.current.offsetHeight * imgWidth) /
          targetRef.current.offsetWidth;

        pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("summary.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      });
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

  const summary = calculateSummary();

  return (
    <>
      <BrokerDetails
        brokers={brokers}
        selectedBroker={selectedBroker}
        handleBrokerChange={handleBrokerChange}
      />
      {selectedBroker && (
        <>
          <Summary summary={summary} targetRef={targetRef} />
          <div className="mt-5 flex space-x-4">
            <input
              type="submit"
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              value="Send Invoice"
              onClick={sendEmail}
            />
            <input
              type="submit"
              value="Generate PDF"
              onClick={generatePDF}
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            />
          </div>
          <div>
            <Table
              columns={columns}
              data={diamonds}
              actions={(row) => (
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleDiamondSelect(row)}
                  >
                    {selectedDiamonds.includes(row) ? "Deselect" : "Select"}
                  </Button>
                </div>
              )}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TransactionDetails;
