import React, { useEffect, useState } from "react";

const AllListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        } else {
          setError("Failed to fetch items");
        }
      } catch {
        setError("Failed to fetch items");
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <section id="all" className="py-5" style={{paddingLeft:160, paddingRight:160, background: "rgba(10,10,10,0.5)"}}>
      <div className="mx-auto" style={{maxWidth:1600}}>
        <h2 className="fw-bold mb-5" style={{fontSize:48, color: "#F5F5F5"}}>All Listings</h2>
        {loading ? (
          <div style={{color: '#F5F5F5'}}>Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {items.map((item, i) => (
              <div key={item.id || i} className="bg-dark rounded-3 overflow-hidden d-flex flex-column" style={{width:382, height:436}}>
                <div className="overflow-hidden" style={{height:320}}>
                  <img src={item.imageUrl} alt={item.title} style={{width:382, height:382, objectFit:"cover"}} />
                </div>
                <div className="p-3 d-flex flex-column gap-2" style={{height:116}}>
                  <h3 className="fw-semibold" style={{fontSize:18, color: "#F5F5F5"}}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllListings;
