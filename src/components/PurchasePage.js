import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PurchasePage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPickupOption, setSelectedPickupOption] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionEmail, setCollectionEmail] = useState("");
  const [collectionPhone, setCollectionPhone] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  const pickupOptions = useMemo(
    () =>
      [
        item?.isPickupAtOxnardFleaMarket
          ? { value: "oxnard-flea-market", label: "Pickup at the Oxnard Flea Market" }
          : null,
        item?.isPickupAtCollection
          ? { value: "collection", label: "Pickup at the Collection" }
          : null,
      ].filter(Boolean),
    [item]
  );

  const isCollectionPickupSelected = selectedPickupOption === "collection";

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
      } catch {
        setError("Failed to fetch item");
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    if (pickupOptions.length > 0) {
      setSelectedPickupOption((current) => {
        if (current && pickupOptions.some((option) => option.value === current)) {
          return current;
        }
        return pickupOptions[0].value;
      });
    }
  }, [pickupOptions]);

  useEffect(() => {
    if (isCollectionPickupSelected) {
      setSelectedPaymentMethod("cash");
    }
  }, [isCollectionPickupSelected]);

  const handleMockPurchase = () => {
    setPurchaseError("");
    setPurchaseStatus("");

    if (!selectedPickupOption) {
      setPurchaseError("This item is currently not available for pickup.");
      return;
    }

    if (isCollectionPickupSelected) {
      if (!collectionName.trim() || !collectionEmail.trim() || !collectionPhone.trim()) {
        setPurchaseError("Please enter your name, email, and phone number for Collection pickup.");
        return;
      }
    }

    if (!selectedPaymentMethod) {
      setPurchaseError("Please select a payment method.");
      return;
    }

    const selectedPickupLabel = pickupOptions.find((option) => option.value === selectedPickupOption)?.label;
    const paymentLabel = selectedPaymentMethod === "cash" ? "Cash - In person" : "Card";

    setPurchaseStatus(
      `Mock purchase selected: ${selectedPickupLabel}. Payment method: ${paymentLabel}.`
    );
  };

  if (loading) {
    return (
      <section className="py-5" style={{ paddingLeft: 160, paddingRight: 160, background: "#0A0A0A" }}>
        <div style={{ color: "#F5F5F5" }}>Loading purchase page...</div>
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
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: 48, color: "#F5F5F5" }}>
              Purchase Item
            </h1>
            <p className="mb-0" style={{ fontSize: 18, color: "rgba(245,245,245,0.7)" }}>
              {item.title} • ${Number(item.price || 0).toFixed(2)}
            </p>
          </div>
          <Link to={`/items/${item.id}`} className="btn btn-outline-light">
            Back to Item
          </Link>
        </div>

        <div className="bg-dark text-light rounded-4 p-4" style={{ border: "1px solid #2A2A2A" }}>
          <div className="mb-4">
            <h3 className="fw-semibold mb-2" style={{ fontSize: 22, color: "#F5F5F5" }}>
              Pickup Option
            </h3>
            {pickupOptions.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {pickupOptions.map((option) => (
                  <label
                    key={option.value}
                    className="d-flex align-items-center gap-2 p-3 rounded-3"
                    style={{ border: "1px solid #2A2A2A", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="pickup-option"
                      checked={selectedPickupOption === option.value}
                      onChange={() => setSelectedPickupOption(option.value)}
                    />
                    <span style={{ fontSize: 16 }}>{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="alert alert-secondary mb-0">
                This item is currently not available for pickup.
              </div>
            )}
          </div>

          {isCollectionPickupSelected && (
            <div className="mb-4">
              <h3 className="fw-semibold mb-2" style={{ fontSize: 22, color: "#F5F5F5" }}>
                Collection Pickup Details
              </h3>
              <div className="d-flex flex-column gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={collectionEmail}
                  onChange={(e) => setCollectionEmail(e.target.value)}
                />
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number"
                  value={collectionPhone}
                  onChange={(e) => setCollectionPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <h3 className="fw-semibold mb-2" style={{ fontSize: 22, color: "#F5F5F5" }}>
              Payment Method
            </h3>
            <div className="d-flex flex-column gap-2">
              <label
                className="d-flex align-items-center gap-2 p-3 rounded-3"
                style={{ border: "1px solid #2A2A2A", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="payment-method"
                  checked={selectedPaymentMethod === "cash"}
                  onChange={() => setSelectedPaymentMethod("cash")}
                />
                <span style={{ fontSize: 16 }}>Cash - In person</span>
              </label>
              {!isCollectionPickupSelected && (
                <label
                  className="d-flex align-items-center gap-2 p-3 rounded-3"
                  style={{ border: "1px solid #2A2A2A", cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedPaymentMethod === "card"}
                    onChange={() => setSelectedPaymentMethod("card")}
                  />
                  <span style={{ fontSize: 16 }}>Card</span>
                </label>
              )}
            </div>
            {isCollectionPickupSelected && (
              <p className="mb-0 mt-2" style={{ fontSize: 14, color: "rgba(245,245,245,0.7)" }}>
                Collection pickup supports Cash - In person only.
              </p>
            )}
          </div>

          {purchaseError && <div className="alert alert-danger mb-3">{purchaseError}</div>}
          {purchaseStatus && <div className="alert alert-success mb-3">{purchaseStatus}</div>}

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light fw-medium px-4 py-2"
              style={{ color: "#0A0A0A" }}
              onClick={handleMockPurchase}
              disabled={pickupOptions.length === 0}
            >
              Confirm Mock Purchase
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchasePage;
