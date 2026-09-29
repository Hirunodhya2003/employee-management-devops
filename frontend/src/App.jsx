import { useEffect, useState } from "react";
import "./App.css";


function App() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState("dashboard");
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        salary: "",
    });

    const API_URL = "/api/employees";

    // Get employees from Spring Boot
    const fetchEmployees = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Add employee
    const addEmployee = async (e) => {
        e.preventDefault();

        try {
            const employeeData = {
                ...form,
                salary: Number(form.salary),
            };

            if (editingEmployee) {
                // UPDATE employee
                await fetch(`${API_URL}/${editingEmployee.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(employeeData),
                });
            } else {
                // CREATE employee
                await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(employeeData),
                });
            }

            setForm({
                name: "",
                email: "",
                department: "",
                salary: "",
            });

            setEditingEmployee(null);
            setShowModal(false);

            fetchEmployees();

        } catch (error) {
            console.error("Error:", error);
        }
    };
    // Delete employee
    const deleteEmployee = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            fetchEmployees();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const editEmployee = (employee) => {
        setEditingEmployee(employee);

        setForm({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            salary: employee.salary,
        });

        setShowModal(true);
    };

    return (
        <div className="app">

            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Employee<span>X</span></h2>

                <nav>
                    <a
                        className={page === "dashboard" ? "active" : ""}
                        onClick={() => setPage("dashboard")}
                    >
                        Dashboard
                    </a>

                    <a
                        className={page === "employees" ? "active" : ""}
                        onClick={() => setPage("employees")}
                    >
                        Employees
                    </a>

                    <a
                        className={page === "departments" ? "active" : ""}
                        onClick={() => setPage("departments")}
                    >
                        Departments
                    </a>
                </nav>

                <div className="sidebar-bottom">
                    <p>Employee Management</p>
                    <small>v1.0.0</small>
                </div>
            </aside>

            {/* Main */}
            <main className="main">

                {page === "dashboard" && (
                    <>
                        <header className="header">
                            <div>
                                <h1>Dashboard</h1>
                                <p>Welcome to Employee Management.</p>
                            </div>

                            <button
                                className="add-btn"
                                onClick={() => setShowModal(true)}
                            >
                                + Add Employee
                            </button>
                        </header>

                        <section className="stats">

                            <div className="stat-card">
                                <div>
                                    <p>Total Employees</p>
                                    <h2>{employees.length}</h2>
                                </div>
                                <div className="icon">👥</div>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <p>IT Department</p>
                                    <h2>
                                        {employees.filter(
                                            (employee) => employee.department === "IT"
                                        ).length}
                                    </h2>
                                </div>
                                <div className="icon">💻</div>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <p>HR Department</p>
                                    <h2>
                                        {employees.filter(
                                            (employee) => employee.department === "HR"
                                        ).length}
                                    </h2>
                                </div>
                                <div className="icon">🏢</div>
                            </div>

                        </section>
                    </>
                )}


                {page === "employees" && (
                    <>
                        <header className="header">
                            <div>
                                <h1>Employees</h1>
                                <p>Manage all registered employees.</p>
                            </div>

                            <button
                                className="add-btn"
                                onClick={() => setShowModal(true)}
                            >
                                + Add Employee
                            </button>
                        </header>

                        <section className="employee-section">

                            <div className="section-header">
                                <div>
                                    <h2>Employee List</h2>
                                    <p>All registered employees</p>
                                </div>
                            </div>

                            <div className="table-container">

                                <table>

                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Salary</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {employees.map((employee) => (
                                        <tr key={employee.id}>

                                            <td>#{employee.id}</td>

                                            <td>
                                                <strong>{employee.name}</strong>
                                            </td>

                                            <td>{employee.email}</td>

                                            <td>
                    <span className="badge">
                      {employee.department}
                    </span>
                                            </td>

                                            <td>
                                                ${employee.salary}
                                            </td>

                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => editEmployee(employee)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteEmployee(employee.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>
                                    ))}

                                    </tbody>

                                </table>

                            </div>

                        </section>
                    </>
                )}


                {page === "departments" && (
                    <>
                        <header className="header">
                            <div>
                                <h1>Departments</h1>
                                <p>View employees by department.</p>
                            </div>
                        </header>

                        <section className="stats">

                            <div className="stat-card">
                                <div>
                                    <p>IT</p>
                                    <h2>
                                        {employees.filter(
                                            (employee) => employee.department === "IT"
                                        ).length}
                                    </h2>
                                </div>
                                <div className="icon">💻</div>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <p>HR</p>
                                    <h2>
                                        {employees.filter(
                                            (employee) => employee.department === "HR"
                                        ).length}
                                    </h2>
                                </div>
                                <div className="icon">👥</div>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <p>DevOps</p>
                                    <h2>
                                        {employees.filter(
                                            (employee) => employee.department === "DevOps"
                                        ).length}
                                    </h2>
                                </div>
                                <div className="icon">⚙️</div>
                            </div>

                        </section>

                        <section className="employee-section">

                            <div className="section-header">
                                <h2>Department Summary</h2>
                                <p>Employee distribution across departments</p>
                            </div>

                            <div className="table-container">

                                <table>

                                    <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Employees</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    <tr>
                                        <td><strong>IT</strong></td>
                                        <td>
                                            {employees.filter(
                                                (employee) => employee.department === "IT"
                                            ).length}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><strong>HR</strong></td>
                                        <td>
                                            {employees.filter(
                                                (employee) => employee.department === "HR"
                                            ).length}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><strong>DevOps</strong></td>
                                        <td>
                                            {employees.filter(
                                                (employee) => employee.department === "DevOps"
                                            ).length}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><strong>Finance</strong></td>
                                        <td>
                                            {employees.filter(
                                                (employee) => employee.department === "Finance"
                                            ).length}
                                        </td>
                                    </tr>
                                    </tbody>

                                </table>

                            </div>

                        </section>
                    </>
                )}

            </main>
            {/* Add Employee Modal */}
            {showModal && (
                <div className="modal">

                    <div className="modal-content">

                        <div className="modal-header">
                            <h2>
                                {editingEmployee ? "Edit Employee" : "Add Employee"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={addEmployee}>

                            <label>Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Department</label>
                            <select
                                value={form.department}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        department: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select department</option>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Finance">Finance</option>
                            </select>

                            <label>Salary</label>
                            <input
                                type="number"
                                value={form.salary}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        salary: e.target.value,
                                    })
                                }
                                required
                            />

                            <button className="submit-btn" type="submit">
                                {editingEmployee ? "Save Changes" : "Add Employee"}
                            </button>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default App;
