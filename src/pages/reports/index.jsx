import React, { useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../static/css/ReportPage.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import apiClient from "../../utils/ApiClient";

const ReportPage = ({ user, setUser }) => {
  const [period, setPeriod] = useState(1); // Default: 1 month
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualExpenses, setManualExpenses] = useState({}); // Object { month: expense }

  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");

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

  const handleExpenseChange = (month, value) => {
    setManualExpenses(prev => ({ ...prev, [month]: parseFloat(value) || 0 }));
  };

  const calculateTotalExpenses = () => {
    return Object.values(manualExpenses).reduce((sum, val) => sum + val, 0).toFixed(2);
  };

  const handleExportToPDF = () => {
    if (!reportData.length) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Financial Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Report Period: Last ${period} months`, 10, 30);

    const tableData = reportData.map(row => [
      row.month,
      `$${row.revenue.toFixed(2)}`,
      `$${manualExpenses[row.month] || 0}`,
      `$${(row.revenue - (manualExpenses[row.month] || 0)).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Month", "Revenue", "Expenses", "Profit/Loss"]],
      body: tableData
    });

    doc.save(`report_${period}_months.pdf`);
  };

  return (
    <div className="report-page">
      <Header user={user} setUser={setUser} />
      <main>
        <h1>Generate Report</h1>
        <div className="report-controls">
          <label>Select Period:</label>
          <select value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
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

        {reportData.length > 0 && (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                  <th>Expenses</th>
                  <th>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(({ month, revenue }) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>${revenue.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={manualExpenses[month] || ""}
                        onChange={(e) => handleExpenseChange(month, e.target.value)}
                        placeholder="Enter expense"
                      />
                    </td>
                    <td>
                      ${ (revenue - (manualExpenses[month] || 0)).toFixed(2) }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Total Expenses: ${calculateTotalExpenses()}</h3>
            <h3>
              Total Profit/Loss: ${reportData.reduce((sum, row) => sum + row.revenue, 0) - calculateTotalExpenses()}
            </h3>
            <button onClick={handleExportToPDF}>Export to PDF</button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;
