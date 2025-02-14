import React, { useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../static/css/ReportPage.css";
import { jsPDF } from "jspdf";
import apiClient from "../../utils/ApiClient";

const ReportPage = ({ user, setUser }) => {
  const [period, setPeriod] = useState(1); // Default to 1 month
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualExpenses, setManualExpenses] = useState([]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");
    console.log(period);
    try {
      const response = await apiClient.post("/reports", { period });
      setReportData(response.data);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new manual expense field
  const handleAddExpense = () => {
    setManualExpenses([...manualExpenses, { name: "", value: "" }]);
  };

  // Remove an expense field
  const handleRemoveExpense = (index) => {
    const updatedExpenses = manualExpenses.filter((_, i) => i !== index);
    setManualExpenses(updatedExpenses);
  };

  // Update the name or value of an expense
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = manualExpenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setManualExpenses(updatedExpenses);
  };

  // Calculate the total expenses
  const calculateTotalExpenses = () => {
    const manualTotal = manualExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.value || 0),
      0
    );
    return (manualTotal).toFixed(2);
  };

  const handleExportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    //Title
    doc.setFontSize(18);
    doc.text("Financial Report", 14, 20);

    //Period
    doc.setFontSize(12);
    let y = 30;
    doc.text(`Report Period: ${reportData.period}`, 10, y);

    y += 10;
    doc.text(`Completed Trucks: ${reportData.completedTrucks}`, 10, y);
    y += 10;
    // Total Revenue
    doc.setFontSize(14);
    doc.text(`Total Revenue: ${reportData.totalRevenue}`, 14, y);

    y += 10;

    // Manual Expenses
    doc.text("Manual Expenses:", 14, y);
    manualExpenses.forEach((expense, index) => {
      doc.text(`${index + 1}. ${expense.name || "Unnamed"} - $${expense.value || 0}`, 14, 70 + index * 10);
    });

    // Total Expenses
    doc.setFontSize(14);
    doc.text(`Total Expenses: $${calculateTotalExpenses()}`, 14, 80 + manualExpenses.length * 10);

    doc.setFontSize(14);
    doc.text(`Total Profit/Loss: $${parseFloat(reportData.totalRevenue).toFixed(2) - calculateTotalExpenses()}`, 14, 110);

    doc.save(`report_${reportData.period}.pdf`);
  };

  return (
    <div className="report-page">
      <Header user={user} setUser={setUser} />
      <main>
        <h1>Generate Report</h1>
        <div className="report-controls">
          <label htmlFor="period">Select Period:</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
          <button onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {reportData && (
          <div className="report-results">
            <h2>Report</h2>
            <p><strong>Period:</strong> {reportData.period}</p>
            <p><strong>Completed Trucks:</strong> {reportData.completedTrucks}</p>
            <p><strong>Total Revenue:</strong> ${parseFloat(reportData.totalRevenue).toFixed(2)}</p>
          </div>
        )}

        <h3>Manual Expenses</h3>
        {manualExpenses.map((expense, index) => (
            <div key={index} className="expense-item">
            <input
                type="text"
                placeholder="Expense Name"
                value={expense.name}
                onChange={(e) => handleExpenseChange(index, "name", e.target.value)}
            />
            <input
                type="number"
                placeholder="Expense Value"
                value={expense.value}
                onChange={(e) => handleExpenseChange(index, "value", e.target.value)}
            />
            <button onClick={() => handleRemoveExpense(index)}>Remove</button>
            </div>
        ))}
        <button button onClick={handleAddExpense}>Add Expense</button>

        <h3>Total Expenses: ${calculateTotalExpenses()}</h3>
        {reportData && (
          <div>
            <h3>Total Profit/Loss: ${parseFloat(reportData.totalRevenue) - calculateTotalExpenses()}</h3>
          </div>
        )}
        <button onClick={handleExportToPDF}>Export to PDF</button>
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;