import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import CustomerFormModal from "./CustomerFormModal";

function CustomerManagement() {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setShow(true);
    };

    const fetchStudents = async (pageValue = page, searchValue = search) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/students?page=${pageValue}&limit=${limit}&search=${searchValue}`);
            const formatted = res.data.data.map((student) => ({
                ...student,
                photo: `http://localhost:5000/images/${student.image}`, // agar tum image ko uploads folder me serve kar rahe ho
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
        setPage(1);
        fetchStudents();
    };

const clearSearch = () => {
  const newSearch = "";
  const newPage = 1;

  setSearch(newSearch);
  setPage(newPage);

  fetchStudents(newPage, newSearch);
};




    return (
        <div className="container mt-4">
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <button className="btn btn-primary" onClick={handleShow}>
                    Add Customer
                </button>
                <div className="d-flex align-items-center">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control h-50"
                            placeholder="Search with name or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                className="btn-close position-absolute top-50 end-0 translate-middle-y me-2"
                                aria-label="Clear"
                                onClick={clearSearch}
                                style={{ fontSize: "0.8rem" }}
                            ></button>
                        )}
                    </div>
                    <button className="btn btn-primary m-2" onClick={handleSearch}>
                        Search
                    </button>
                </div>

            </div>

            {loading ? (
                <div className="text-center mt-5">
                    <ClipLoader color="#0d6efd" loading={loading} size={50} />
                    <p>Loading students...</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th style={{ whiteSpace: "nowrap" }}>#</th>
                                    <th style={{ minWidth: "150px" }}>Full Name</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Email</th>
                                    <th style={{ whiteSpace: "nowrap" }}>Phone</th>
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
                                        <td style={{ wordBreak: "break-word" }}>{student.email}</td>
                                        <td className="text-center">{student.phone}</td>
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

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{editingStudent ? "Edit Customer" : "Add Customer"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerFormModal
                        mode={editingStudent ? "edit" : "add"}
                        initialData={editingStudent}
                        onSuccess={fetchStudents}
                        onClose={() => {
                            setEditingStudent(null);
                            handleClose();
                        }}
                    />
                </Modal.Body>
            </Modal>

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

export default CustomerManagement;
