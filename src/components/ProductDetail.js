import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            <Link
              to={`/items/${item.id}/purchase`}
              className="btn btn-light fw-medium px-4 py-3 rounded-2 mt-3"
              style={{ color: "#0A0A0A", fontSize: 16 }}
            >
              Purchase Options
            </Link>
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
          <div>
            <h3 className="fw-semibold" style={{ fontSize: 20, color: "#F5F5F5" }}>Pickup Availability</h3>
            <p className="fw-normal mb-1" style={{ fontSize: 18, color: "rgba(245,245,245,0.7)", lineHeight: "30px" }}>
              Oxnard Flea Market: {item.isPickupAtOxnardFleaMarket ? "Available" : "Not available"}
            </p>
            <p className="fw-normal" style={{ fontSize: 18, color: "rgba(245,245,245,0.7)", lineHeight: "30px" }}>
              Collection: {item.isPickupAtCollection ? "Available" : "Not available"}
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductDetail;
