import React, { useState } from "react";

const AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    try {
      const res = await fetch("/api/items/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess("Item uploaded successfully!");
        setTitle("");
        setImage(null);
        setShowForm(false);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Server error");
    }
    setUploading(false);
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <button className="btn btn-success mb-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Item"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Item Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Item Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Item"}
          </button>
        </form>
      )}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default AdminPanel;
