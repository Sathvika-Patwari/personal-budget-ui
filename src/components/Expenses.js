import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the budget?</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};
const Expenses = () => {
  const { id } = useParams();
  const [budgetData, setBudgetData] = useState([]);
  const [budgetId, getBudgetId] = useState();
  const token = localStorage.getItem("jwt");
  const [newBudget, setNewBudget] = useState({
    month: "",
    year: "",
    title: "",
    budget: 0,
    color: "",
  });
  const [editBudgetId, setEditBudgetId] = useState(null); // To store the ID of the budget being edited
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // To store the budget being deleted
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState("");
  
  useEffect(() => {
    // Fetch budget data on component mount
    fetchBudgetData();
  }, [id]);
  useEffect(() => {
    
    const notificationTimeout = setTimeout(() => {
      setNotification("Change of Data.");
    }, 3000); 
    return () => clearTimeout(notificationTimeout);
  }, [editBudgetId, deleteConfirmation]);
  const fetchBudgetData = () => {
    axios
      .get(`http://143.244.178.101:3001/api/budget/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBudgetData(response.data);
        console.log(response.data);
        // Note: It seems like you want to get the budgetId here, not sure if it's intended
        // getBudgetId(response.data.budgetId); 
      })
      .catch((error) => {
        console.error("Error fetching budget data:", error);
      });
  };

  const handleAddBudget = () => {
    axios
      .post(
        `http://143.244.178.101:3001/api/budget/${id}`,
        newBudget,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        fetchBudgetData();
        setNewBudget({
          month: "",
          year: "",
          title: "",
          budget: 0,
          color: "",
        });
      })
      .catch((error) => {
        console.error("Error adding budget:", error);
      });
  };

  const handleEditBudget = (budgetId) => {
    setEditBudgetId(budgetId);
    // Find the budget being edited and set the values in the form
    const budgetToEdit = budgetData.find((item) => item.budgetId === budgetId);
    if (budgetToEdit) {
      setNewBudget({
        month: budgetToEdit.month,
        year: budgetToEdit.year,
        title: budgetToEdit.title,
        budget: budgetToEdit.budget,
        color: budgetToEdit.color,
      });
    }
  };

  const handleUpdateBudget = (budgetId) => {
    // Make a PUT request to update the budget
    axios
      .put(
        `http://143.244.178.101:3001/api/budget/${budgetId}`,
        {
          title: newBudget.title,
          budget: newBudget.budget,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        setEditBudgetId(null); // Clear the editBudgetId state
        fetchBudgetData(); // Refresh budget data after updating
      })
      .catch((error) => {
        console.error("Error updating budget:", error);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };


  const handleDeleteBudget = (budget) => {
    setDeleteConfirmation(budget);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://143.244.178.101:3001/api/budget/${deleteConfirmation.budgetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setDeleteConfirmation(null);
        setDeleteModalOpen(false);
        fetchBudgetData();
      })
      .catch((error) => {
        console.error("Error deleting budget:", error);
      });
  };
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`/dash/${id}`}>Home</Link>
          </li>
          <li>
            <Link to={`/expenses/${id}`}>Configure Expenses</Link>
          </li>
          <li>
          <span onClick={handleSignOut} className="sign-out-button">SignOut</span>
          </li>
        </ul>
      </nav>
      <center>
      <h1>Your Expenses</h1>
      <div>
        <h2>Budget Data</h2>
        <center>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Title</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.map((item) => (
                <tr key={item.budgetId}>
                  <td>{item.month}</td>
                  <td>{item.year}</td>
                  <td>
                    {editBudgetId === item.budgetId ? (
                      <input
                        type="text"
                        value={newBudget.title}
                        onChange={(e) =>
                          setNewBudget({ ...newBudget, title: e.target.value })
                        }
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td>
                    {editBudgetId === item.budgetId ? (
                      <input
                        type="number"
                        value={newBudget.budget}
                        onChange={(e) =>
                          setNewBudget({
                            ...newBudget,
                            budget: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `$${item.budget}`
                    )}
                  </td>
                  <td>
                    {editBudgetId === item.budgetId ? (
                      <>
                        <button onClick={() => handleUpdateBudget(item.budgetId)}>Update</button>
                        <button onClick={() => setEditBudgetId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditBudget(item.budgetId)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBudget(item)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
        {/* Add new budget form */}
<h2>Add New Budget</h2>
<form>
  <label>
    Month:
    <select
      value={newBudget.month}
      onChange={(e) =>
        setNewBudget((prev) => ({
          ...prev,
          month: e.target.value,
        }))
      }
    >
      <option value="">Select Month</option>
      <option value="January">January</option>
      <option value="February">February</option>
      <option value="March">March</option>
      <option value="April">April</option>
      <option value="May">May</option>
      <option value="June">June</option>
      <option value="July">July</option>
      <option value="August">August</option>
      <option value="September">September</option>
      <option value="October">October</option>
      <option value="November">November</option>
      <option value="December">December</option>
    </select>
  </label>
  <br />
  <label>
    Year:
    <input
      type="text"
      value={newBudget.year}
      onChange={(e) =>
        setNewBudget((prev) => ({
          ...prev,
          year: e.target.value,
        }))
      }
    />
  </label>
  <br />
  <label>
    Title:
    <input
      type="text"
      value={newBudget.title}
      onChange={(e) =>
        setNewBudget((prev) => ({
          ...prev,
          title: e.target.value,
        }))
      }
    />
  </label>
  <br />
  <label>
    Budget:
    <input
      type="number"
      value={newBudget.budget}
      onChange={(e) =>
        setNewBudget((prev) => ({
          ...prev,
          budget: e.target.value,
        }))
      }
    />
  </label>
  <br />
  <label>
    Color:
    <input
      type="text"
      value={newBudget.color}
      onChange={(e) =>
        setNewBudget((prev) => ({
          ...prev,
          color: e.target.value,
        }))
      }
    />
  </label>
  <br />
  <button type="button" onClick={handleAddBudget}>
    Add Budget
  </button>
  <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{color:"gray", position: "absolute", top: 0, left: 0, zIndex: 100 }}
      >
        {notification && <div>{notification}</div>}
      </div>
</form>
   </div>
      {deleteConfirmation && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
      </center>
    </div>
  );
};

export default Expenses;
