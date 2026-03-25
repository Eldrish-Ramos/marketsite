import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) {
          setError("Failed to fetch item");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setItem(data);
        const primaryImage = data.imageUrl || (data.imageUrls && data.imageUrls[0]) || "";
        setActiveImage(primaryImage);
      } catch {
        setError("Failed to fetch item");
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const openContactModal = () => {
    setFormError("");
    setFormSuccess("");
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail) {
      setFormError("Please fill out your name, phone number, and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          message: formData.message.trim(),
          itemTitle: item.title,
          itemId: item._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to send your message.");
        return;
      }

      setFormSuccess("Your message was sent. The seller can follow up using the information you provided.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch {
      setFormError("Failed to send your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-5" style={{ paddingLeft: 160, paddingRight: 160, background: "#0A0A0A" }}>
        <div style={{ color: "#F5F5F5" }}>Loading...</div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="py-5" style={{ paddingLeft: 160, paddingRight: 160, background: "#0A0A0A" }}>
        <div className="alert alert-danger">{error || "Item not found"}</div>
      </section>
    );
  }

  return (
    <section className="py-5" style={{ paddingLeft: 160, paddingRight: 160, background: "#0A0A0A" }}>
      <div className="mx-auto d-flex gap-5" style={{ maxWidth: 1600 }}>
        <div className="d-flex flex-column gap-3" style={{ width: 760 }}>
          <div className="bg-dark rounded-4 overflow-hidden mb-3" style={{ height: 700 }}>
            <img src={activeImage} alt={item.title} style={{ width: 760, height: 760, objectFit: "cover" }} />
          </div>
          {(item.imageUrls || []).length > 1 && (
            <div className="d-flex gap-3 flex-wrap">
              {item.imageUrls.map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  className="bg-dark rounded-3 overflow-hidden border-0 p-0"
                  style={{ width: 178, height: 100, opacity: activeImage === imageUrl ? 1 : 0.6 }}
                  onClick={() => setActiveImage(imageUrl)}
                >
                  <img src={imageUrl} alt={item.title} style={{ width: 178, height: 178, objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="d-flex flex-column gap-4 pt-5" style={{ width: 760 }}>
          <div>
            <h1 className="fw-bold" style={{ fontSize: 60, color: "#F5F5F5", lineHeight: "60px" }}>
              {item.title}
            </h1>
            <div className="fw-bold" style={{ fontSize: 48, color: "#F5F5F5" }}>
              ${Number(item.price || 0).toFixed(2)}
            </div>
            <button
              type="button"
              className="btn btn-light fw-medium px-4 py-3 rounded-2 mt-3"
              style={{ color: "#0A0A0A", fontSize: 16 }}
              onClick={openContactModal}
            >
              Contact Seller
            </button>
          </div>
          <div style={{ height: 1, background: "#2A2A2A", width: "100%" }}></div>
          <div>
            <h3 className="fw-semibold" style={{ fontSize: 20, color: "#F5F5F5" }}>Item Condition</h3>
            <p className="fw-normal" style={{ fontSize: 18, color: "rgba(245,245,245,0.7)", lineHeight: "30px" }}>
              {item.condition}
            </p>
          </div>
          <div>
            <h3 className="fw-semibold" style={{ fontSize: 20, color: "#F5F5F5" }}>Description</h3>
            <p className="fw-normal" style={{ fontSize: 18, color: "rgba(245,245,245,0.7)", lineHeight: "30px" }}>
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {isContactModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(10,10,10,0.78)", zIndex: 1050, padding: 24 }}
          onClick={closeContactModal}
        >
          <div
            className="bg-dark text-light rounded-4 p-4"
            style={{ width: "100%", maxWidth: 520, border: "1px solid #2A2A2A", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h2 className="fw-bold mb-2" style={{ fontSize: 34, color: "#F5F5F5" }}>
                  Contact Seller
                </h2>
                <p className="mb-0" style={{ fontSize: 16, color: "rgba(245,245,245,0.7)" }}>
                  Share your information for {item.title} and the seller can reach out directly.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={closeContactModal}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleContactSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact-name" style={{ color: "#F5F5F5" }}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="contact-phone" style={{ color: "#F5F5F5" }}>
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="contact-email" style={{ color: "#F5F5F5" }}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="contact-message" style={{ color: "#F5F5F5" }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-control"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>

              {formError && <div className="alert alert-danger mb-3">{formError}</div>}
              {formSuccess && <div className="alert alert-success mb-3">{formSuccess}</div>}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={closeContactModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-light fw-medium px-4 py-2"
                  style={{ color: "#0A0A0A" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductDetail;
