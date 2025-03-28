import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import { jsPDF } from "jspdf";
import "../../static/css/ExpensePage.css";
import Footer from "../../components/footer";
import Header from "../../components/header";

const ExpensePage = ({ user, setUser }) => {
    const [expenses, setExpenses] = useState({});
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await apiClient.get("/expenses");
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("value", value);
        formData.append("date", date);
        if (receipt) formData.append("receipt", receipt);

        try {
            if (editingExpense) {
                await apiClient.put(`/expenses/${editingExpense.id}`, formData);
            } else {
                await apiClient.post("/expenses", formData);
            }
            fetchExpenses();
            resetForm();
        } catch (error) {
            console.error("Error saving expense:", error);
        }
    };

    const resetForm = () => {
        setName("");
        setValue("");
        setDate("");
        setReceipt(null);
        setEditingExpense(null);
    };

    const handleEdit = (expense) => {
        const dateStr = expense.date.split("T")[0];
        setName(expense.name);
        setValue(expense.value);
        setDate(dateStr);
        setEditingExpense({
            ...expense,
            date: dateStr,
        });
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const handlePrint = async () => {
        const doc = new jsPDF();
        let y = 20;

        const selectedReceipts = Object.values(expenses)
            .flat()
            .filter((expense) => selectedExpenses.includes(expense.id) && expense.receipt);

        if (selectedReceipts.length === 0) {
            alert("No receipts selected for printing.");
            return;
        }

        for (const expense of selectedReceipts) {
            if (y + 60 > doc.internal.pageSize.height) {
                doc.addPage();
                y = 20;
            }

            doc.text(`Receipt for ${expense.name}`, 10, y);

            // Convert image to Base64
            try {
                const imageUrl = `https://www.roadshineexpress.com/uploads/receipts/${expense.receipt}`;
                const base64Image = await convertImageToBase64(imageUrl);

                doc.addImage(base64Image, "JPEG", 10, y + 10, 100, 60);
            } catch (error) {
                console.error(`Error loading image for ${expense.name}:`, error);
                doc.text("Image not available", 10, y + 20);
            }
            y += 80;
        }

        doc.save("Selected_Receipts.pdf");
    };

    const toggleSelectAll = () => {
        const allExpenseIds = Object.values(expenses).flat().map((expense) => expense.id);
        if (selectedExpenses.length === allExpenseIds.length) {
            setSelectedExpenses([]); // Deselect all
        } else {
            setSelectedExpenses(allExpenseIds); // Select all
        }
    };

    const convertImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Important to avoid CORS issues
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/jpeg"));
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };

    return (
        <div className="expense-page">
            <Header user={user} setUser={setUser} />
            <h2>Expense Management</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} required />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input type="file" accept="image/jpeg, image/png" onChange={(e) => setReceipt(e.target.files[0])} />
                <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
                {editingExpense && <button onClick={resetForm}>Cancel</button>}
            </form>

            <h3>Expenses</h3>
            <table className="expense-table">
                <thead>
                    <tr>
                        <th><input
                            type="checkbox"
                            onChange={toggleSelectAll}
                            checked={selectedExpenses.length > 0 &&
                                selectedExpenses.length === Object.values(expenses).flat().length}
                        /></th>
                        <th>Name</th>
                        <th>Value ($)</th>
                        <th>Date</th>
                        <th>Receipt</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(expenses).map((month) => (
                        <React.Fragment key={month}>
                            <tr className="expense-month">
                                <td colSpan="6"><strong>{month}</strong></td>
                            </tr>
                            {expenses[month].map((expense) => (
                                <tr key={expense.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedExpenses.includes(expense.id)}
                                            onChange={() =>
                                                setSelectedExpenses((prev) =>
                                                    prev.includes(expense.id)
                                                        ? prev.filter((id) => id !== expense.id)
                                                        : [...prev, expense.id]
                                                )
                                            }
                                        />
                                    </td>
                                    <td>{expense.name}</td>
                                    <td>${expense.value}</td>
                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                    <td>
                                        {expense.receipt ? (
                                            <img
                                                src={`/uploads/receipts/${expense.receipt}`}
                                                alt="Receipt"
                                                className="receipt-thumbnail"
                                            />
                                        ) : "N/A"}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(expense)}>Edit</button>
                                        <button onClick={() => handleDelete(expense.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <button onClick={handlePrint} disabled={selectedExpenses.length === 0}>Print Receipts</button>
            <Footer/>
        </div>
    );
};

export default ExpensePage;
