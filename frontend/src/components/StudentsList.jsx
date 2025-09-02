import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import EditStudentModal from "./EditStudentModal";
// import CustomerModal from "./CustomerModal";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function StudentsList() {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    // const [customerModal, setCustomerModal] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // pagination states
    const [page, setPage] = useState(1);
    const [limit] = useState(5); // fixed 5 per page
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");

    const handleEditClick = (student) => {
        setEditingStudent(student); // jis student ko edit karna hai uski detail set kardo
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/students?page=${page}&limit=${limit}&search=${search}`);
            const formatted = res.data.data.map((student) => ({
                ...student,
                photo: `http://localhost:5000/uploads/${student.image}`, // agar tum image ko uploads folder me serve kar rahe ho
            }));
            setStudents(formatted);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/students/${id}`, {
                method: "DELETE",
            });
            setLoading(false);
            debugger
            if (response.status == 200) {
                toast.success("Student deleted successfully ✅");
                fetchStudents();
                // list refresh
                // setStudents((prev) => prev.filter((s) => s._id !== id));
            } else {
                toast.error("Failed to delete student ❌");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    const handleSearch = () => {
        setPage(1); // 🔹 jab search ho to pehla page load karo
        fetchStudents();
    };

    // const openModal = () => {
    //     setCustomerModal(true);
    // }

        const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        className: null,
        email: "",
        address: "",
        photo: null,
    });

 

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const namePattern = /^[A-Za-z\s]+$/; // alphabets & space only
        const agePattern = /^(?:[3-9]|1[0-5])$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ✅ Validation check
        if (
            !formData.fullName.trim() ||
            !formData.age ||
            !formData.className.trim() ||
            !formData.email ||
            !formData.address.trim() ||
            !formData.photo
        ) {
            toast.warning("All fields are required!");
            return;
        }

        if (!namePattern.test(formData.fullName)) {
            toast.error("Full Name should only contain alphabets and spaces.");
            return;
        }

        if (!agePattern.test(formData.age)) {
            toast.error("Age must be between 3 and 15 years.");
            return;
        }

        if (!emailPattern.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const payload = new FormData();
            payload.append("fullName", formData.fullName);
            payload.append("age", formData.age);
            payload.append("email", formData.email);
            payload.append("className", formData.className);
            payload.append("address", formData.address);
            if (formData.photo) payload.append("photo", formData.photo);
            console.log("payload", payload)

            const res = await axios.post("http://localhost:5000/students", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(res.data.message || "Student added successfully!");

            // ✅ Reset form after success
            setFormData({
                fullName: "",
                age: "",
                className: "",
                email: "",
                address: "",
                photo: null,
            });

            // ✅ Reset file input (DOM ka reference use karke)
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-3">All Students</h2>

            {/* Search Bar */}
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary m-2" onClick={handleSearch}>Search</button>
            </div>
            <button className="btn btn-primary m-2" onClick={handleShow}>Add Customer</button>


            {/* Loader */}
            {loading ? (
                <div className="text-center mt-5">
                    <ClipLoader color="#0d6efd" loading={loading} size={50} />
                    <p>Loading students...</p>
                </div>
            ) : (
                <>
                    {editingStudent && (
                        <EditStudentModal
                            student={editingStudent}
                            onClose={() => setEditingStudent(null)}
                            onUpdated={fetchStudents}
                        />
                    )}

                    {/* {customerModal && (
                        <CustomerModal
                            customerModal={customerModal}
                        />
                    )} */}


                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th style={{ whiteSpace: "nowrap" }}>#</th>
                                    <th style={{ minWidth: "150px" }}>Full Name</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Age</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Class</th>
                                    <th style={{ minWidth: "200px" }}>Email</th>
                                    <th style={{ minWidth: "200px" }}>Address</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Photo</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td style={{ wordBreak: "break-word" }}>{student.fullName}</td>
                                        <td className="text-center">{student.age}</td>
                                        <td className="text-center">{student.className}</td>
                                        <td style={{ wordBreak: "break-word" }}>{student.email}</td>
                                        <td style={{ wordBreak: "break-word" }}>{student.address}</td>
                                        <td className="text-center">
                                            <img
                                                src={`http://localhost:5000/images/${student.image}`}
                                                alt="profile"
                                                width="50"
                                                height="50"
                                                style={{ objectFit: "cover", borderRadius: "5px" }}
                                            />
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button className="btn btn-sm btn-warning"
                                                    onClick={() => handleEditClick(student)}

                                                >Edit</button>
                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(student._id)}
                                                >Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </>

            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                      <div className="container py-4">
            <h2 className="text-center mb-4">Add New Student</h2>

            {loading && (
                <div className="text-center mb-3">
                    <ClipLoader color="#0d6efd" loading={loading} size={40} />
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            className="form-control"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Class</label>
                        <select
                            className="form-select"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                        >
                            <option value="">Select Class</option>
                            {[...Array(5)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="1"
                            placeholder="Enter address"
                        ></textarea>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            name="photo"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Pagination UI */}
            {!loading && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <p>
                        Showing 1 to {students.length} of {students.length} entries
                    </p>
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default StudentsList;
