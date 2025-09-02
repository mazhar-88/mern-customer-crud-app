import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";


function AddStudent() {
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        className: null,
        email: "",
        address: "",
        photo: null,
    });

    const [loading, setLoading] = useState(false);

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
    );

}

export default AddStudent;
