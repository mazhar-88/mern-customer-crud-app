import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EditStudentModal({ student, onClose, onUpdated }) {
  const [formData, setFormData] = useState(student);

  useEffect(() => {
    setFormData(student); // jab student change ho to update karo
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/students/${formData._id}`, formData);
      toast.success("Student updated successfully ✅");
      onUpdated(); // parent ko notify karo (list refresh ke liye)
      onClose();   // modal close karo
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student ❌");
    }
  };

  if (!student) return null; // agar koi edit select nahi hua to modal hide

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Student</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="fullName"
                className="form-control mb-2"
                value={formData.fullName || ""}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <input
                type="number"
                name="age"
                className="form-control mb-2"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="Age"
              />
              <input
                type="text"
                name="className"
                className="form-control mb-2"
                value={formData.className || ""}
                onChange={handleChange}
                placeholder="Class"
              />
              <input
                type="email"
                name="email"
                className="form-control mb-2"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />
              <textarea
                name="address"
                className="form-control mb-2"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStudentModal;
