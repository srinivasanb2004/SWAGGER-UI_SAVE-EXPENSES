import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const SaveExpenseForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    ExpenseID: '',
    OrganizationID: '',
    ExpenseCategoryID: '',
    ExpenseDate: '',
    ExpenseDesc: '',
    ExpenseBy: '',
    ExpenseImagePath: '',
    ExpenseStatusID: '',
    RecordStatusID: '',
    CreatedBy: '',
    CreatedOn: '',
    ModifiedBy: '',
    ModifiedOn: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://91.203.132.32:8068/api/Expenses/SaveExpense', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Expense saved successfully!');
      onSave(response.data); // Pass the saved expense back to the parent
    } catch (error) {
      console.error('Error posting data:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f0f9f0',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#28a745' }}>Save Expense</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => {
          if (field === 'file') {
            return (
              <div key={field} style={{ marginBottom: '15px' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  {field}:
                </label>
                <input
                  type="file"
                  id={field}
                  name={field}
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                />
              </div>
            );
          } else if (
            field === 'ExpenseCategoryID' ||
            field === 'ExpenseStatusID' ||
            field === 'RecordStatusID'
          ) {
            return (
              <div key={field} style={{ marginBottom: '15px' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  {field}:
                </label>
                <select
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  <option value="">Select {field}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            );
          } else {
            return (
              <div key={field} style={{ marginBottom: '15px' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  {field}:
                </label>
                <input
                  type={field.includes('Date') ? 'date' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                />
              </div>
            );
          }
        })}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};

const ExpenseList = ({ expenses }) => {
   
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f0f9f0',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#28a745' }}>Saved Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Expense ID</th>
              <th style={tableHeaderStyle}>Organization ID</th>
              <th style={tableHeaderStyle}>Expense Category ID</th>
              <th style={tableHeaderStyle}>Expense Description</th>
              <th style={tableHeaderStyle}>Expense Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense?.data?.ExpenseID || index}>
                <td style={tableCellStyle}>{expense?.data.expenseID}</td>
                <td style={tableCellStyle}>{expense?.data?.organizationID}</td>
                <td style={tableCellStyle}>{expense?.data?.expenseCategoryID}</td>
                <td style={tableCellStyle}>{expense?.data?.expenseDesc}</td>
                <td style={tableCellStyle}>{expense?.data?.expenseDate}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  padding: '10px',
  backgroundColor: '#28a745',
  color: '#fff',
  textAlign: 'left',
  border: '1px solid #ccc',
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
};

const App = () => {
  const [expenses, setExpenses] = useState([]);

  const handleSaveExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <Router>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#28a745',
        }}
      >
        <Link
          to="/save-expense"
          style={{
            margin: '0 10px',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Save Expense
        </Link>
        <Link
          to="/expenses-list"
          style={{
            margin: '0 10px',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Expenses List
        </Link>
      </nav>
      <Routes>
        <Route path="/save-expense" element={<SaveExpenseForm onSave={handleSaveExpense} />} />
        <Route path="/expenses-list" element={<ExpenseList expenses={expenses} />} />
      </Routes>
    </Router>
  );
};

export default App;
