import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CustomerFormModal({ mode = "add", initialData, onSuccess, onClose }) {
    console.log("initialData", initialData)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        photo: null,
    });

    const [preview, setPreview] = useState(null); // 🔹 preview ke liye state

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                address: initialData.address || "",
                photo: null,
            });

            // 🔹 Edit mode me agar already photo hai to uska URL show karo
            if (initialData.photo) {
                setPreview(initialData.photo);
                // apne backend/uploads ka path adjust karo
            }
        }
    }, [mode, initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            const file = files[0];
            setFormData({ ...formData, photo: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const payload = new FormData();
    //         payload.append("fullName", formData.fullName);
    //         payload.append("email", formData.email);
    //         payload.append("phone", formData.phone);
    //         payload.append("address", formData.address);
    //         if (formData.photo) payload.append("photo", formData.photo);

    //         if (mode === "add") {
    //             const res = await axios.post("http://localhost:5000/students", payload, {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             });
    //             toast.success(res.data.message || "Customer added successfully!");
    //         } else {
    //             const res = await axios.put(
    //                 `http://localhost:5000/students/${initialData._id}`,
    //                 payload,
    //                 { headers: { "Content-Type": "multipart/form-data" } }
    //             );
    //             toast.success(res.data.message || "Customer updated successfully!");
    //         }

    //         if (onSuccess) onSuccess();
    //         if (onClose) onClose();
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Something went wrong!");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = new FormData();
            payload.append("fullName", formData.fullName);
            payload.append("email", formData.email);
            payload.append("phone", formData.phone);
            payload.append("address", formData.address);

            if (formData.photo) {
                // nayi file
                payload.append("photo", formData.photo);
            } else if (preview) {
                // purana path
                payload.append("photo", preview);
            }

            if (mode === "add") {
                const res = await axios.post("http://localhost:5000/students", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success(res.data.message || "Customer added successfully!");
            } else {
                const res = await axios.put(
                    `http://localhost:5000/students/${initialData._id}`,
                    payload,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                toast.success(res.data.message || "Customer updated successfully!");
            }

            onSuccess?.();
            onClose?.();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="container py-4">
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
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
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

                        {/* 🔹 Photo Preview */}
                        {preview && (
                            <div className="mt-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-end">
                    <button type="button" className="btn btn-danger m-2" onClick={onClose}>
                        Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {mode === "add" ? "Save" : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
}