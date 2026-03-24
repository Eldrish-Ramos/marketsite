import React, { useState } from "react";

const conditionOptions = [
  "Used - Poor",
  "Used - Good",
  "Used - Like New",
  "New",
];

const categoryOptions = ["Video Games"];

const defaultFormState = {
  title: "",
  description: "",
  price: "",
  condition: conditionOptions[0],
  category: categoryOptions[0],
};

const AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [title, setTitle] = useState(defaultFormState.title);
  const [description, setDescription] = useState(defaultFormState.description);
  const [price, setPrice] = useState(defaultFormState.price);
  const [condition, setCondition] = useState(defaultFormState.condition);
  const [category, setCategory] = useState(defaultFormState.category);
  const [images, setImages] = useState([]);
  const [addThumbnailIndex, setAddThumbnailIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [savingItemId, setSavingItemId] = useState("");
  const [deletingItemId, setDeletingItemId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetAddForm = () => {
    setTitle(defaultFormState.title);
    setDescription(defaultFormState.description);
    setPrice(defaultFormState.price);
    setCondition(defaultFormState.condition);
    setCategory(defaultFormState.category);
    setImages([]);
    setAddThumbnailIndex(0);
  };

  const fetchItems = async () => {
    setManageLoading(true);
    setError("");
    try {
      const res = await fetch("/api/items");
      if (!res.ok) {
        setError("Failed to fetch items");
        setManageLoading(false);
        return;
      }

      const data = await res.json();
      setItems(data);
    } catch {
      setError("Failed to fetch items");
    }
    setManageLoading(false);
  };

  const toggleManageItems = async () => {
    const next = !showManage;
    setShowManage(next);
    setShowForm(false);
    setSelectedItemId(null);
    setError("");
    setSuccess("");

    if (next) {
      await fetchItems();
    }
  };

  const handleManagedFieldChange = (itemId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleManagedImagesChange = (itemId, files) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              newImages: files,
            }
          : item
      )
    );
  };

  const handleSaveItem = async (itemId) => {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) {
      return;
    }

    setSavingItemId(itemId);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("title", currentItem.title || "");
      formData.append("description", currentItem.description || "");
      formData.append("price", currentItem.price ?? "");
      formData.append("condition", currentItem.condition || conditionOptions[0]);
      formData.append("replaceImages", currentItem.replaceImages ? "true" : "false");
      formData.append("thumbnailIndex", `${currentItem.thumbnailIndex || 0}`);
      (currentItem.newImages || []).forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update item");
        setSavingItemId("");
        return;
      }

      const updatedItem = await res.json();
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setSuccess(`Saved item ${updatedItem.itemId || updatedItem.id}`);
    } catch {
      setError("Server error");
    }
    setSavingItemId("");
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Delete this item permanently? This removes it from Firestore and Cloudinary.");
    if (!confirmDelete) {
      return;
    }

    setDeletingItemId(itemId);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete item");
        setDeletingItemId("");
        return;
      }

      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setSelectedItemId(null);
      setSuccess("Item deleted successfully");
    } catch {
      setError("Server error");
    }
    setDeletingItemId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("condition", condition);
    formData.append("category", category);
    formData.append("thumbnailIndex", `${addThumbnailIndex}`);
    images.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const res = await fetch("/api/items/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(`Item uploaded successfully! ID: ${data.itemId}`);
        resetAddForm();
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
      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-success"
          onClick={() => {
            setShowForm(!showForm);
            setShowManage(false);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "Add New Item"}
        </button>
        <button className="btn btn-outline-light" onClick={toggleManageItems}>
          {showManage ? "Close Manage Items" : "Manage Items"}
        </button>
      </div>
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
            <label className="form-label">Item Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Item Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Item Condition</label>
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              {conditionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Item Images</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                setImages(selected);
                setAddThumbnailIndex(0);
              }}
              required
            />
            <small className="text-secondary">You can select more than one image.</small>
            {images.length > 0 && (
              <div className="mt-2 d-flex flex-column gap-2">
                <label className="form-label mb-0">Select Thumbnail</label>
                {images.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="add-thumbnail"
                      id={`add-thumb-${index}`}
                      checked={addThumbnailIndex === index}
                      onChange={() => setAddThumbnailIndex(index)}
                    />
                    <label className="form-check-label" htmlFor={`add-thumb-${index}`}>
                      {file.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Item"}
          </button>
        </form>
      )}
      {showManage && (
        <div className="mb-4">
          {manageLoading ? (
            <div>Loading items...</div>
          ) : items.length === 0 ? (
            <div className="text-secondary">No items found.</div>
          ) : selectedItemId === null ? (
            /* ── Step 1: title list ── */
            <div className="list-group">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="list-group-item list-group-item-action bg-dark text-light border-secondary"
                  onClick={() => { setSelectedItemId(item.id); setError(""); setSuccess(""); }}
                >
                  <span className="fw-semibold">{item.title || "(no title)"}</span>
                  <span className="text-secondary ms-2 small">{item.itemId || item.id}</span>
                </button>
              ))}
            </div>
          ) : (() => {
            /* ── Step 2: single-item edit ── */
            const item = items.find((i) => i.id === selectedItemId);
            if (!item) return <div className="text-secondary">Item not found.</div>;
            return (
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm mb-3"
                  onClick={() => { setSelectedItemId(null); setError(""); setSuccess(""); }}
                >
                  ← Back to list
                </button>
                <div className="card bg-dark text-light">
                  <div className="card-body d-flex flex-column gap-3">
                    <div className="fw-semibold">{item.itemId || item.id}</div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.title || ""}
                          onChange={(e) => handleManagedFieldChange(item.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={item.price ?? ""}
                          onChange={(e) => handleManagedFieldChange(item.id, "price", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Condition</label>
                        <select
                          className="form-select"
                          value={item.condition || conditionOptions[0]}
                          onChange={(e) => handleManagedFieldChange(item.id, "condition", e.target.value)}
                        >
                          {conditionOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={item.description || ""}
                          onChange={(e) => handleManagedFieldChange(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Current Photos (Select Thumbnail)</label>
                        <div className="d-flex flex-wrap gap-2">
                          {(item.imageUrls || []).map((imageUrl, index) => (
                            <label
                              key={`${item.id}-img-${index}`}
                              className="d-flex flex-column align-items-center gap-1"
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={imageUrl}
                                alt={item.title}
                                style={{
                                  width: 88,
                                  height: 88,
                                  objectFit: "cover",
                                  border: item.thumbnailIndex === index ? "2px solid #0d6efd" : "1px solid #555",
                                  borderRadius: 8,
                                }}
                              />
                              <input
                                type="radio"
                                name={`thumb-${item.id}`}
                                checked={(item.thumbnailIndex || 0) === index}
                                onChange={() => handleManagedFieldChange(item.id, "thumbnailIndex", index)}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Add New Photos</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleManagedImagesChange(item.id, Array.from(e.target.files || []))}
                        />
                        <div className="form-check mt-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`replace-${item.id}`}
                            checked={Boolean(item.replaceImages)}
                            onChange={(e) => handleManagedFieldChange(item.id, "replaceImages", e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`replace-${item.id}`}>
                            Replace existing photos (if unchecked, new photos are added)
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={savingItemId === item.id}
                        onClick={() => handleSaveItem(item.id)}
                      >
                        {savingItemId === item.id ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={deletingItemId === item.id}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        {deletingItemId === item.id ? "Deleting..." : "Delete Item"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default AdminPanel;
