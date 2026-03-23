import React from "react";

const ProductDetail = () => (
  <section className="py-5" style={{paddingLeft:160, paddingRight:160, background: "#0A0A0A"}}>
    <div className="mx-auto d-flex gap-5" style={{maxWidth:1600}}>
      <div className="d-flex flex-column gap-3" style={{width:760}}>
        <div className="bg-dark rounded-4 overflow-hidden mb-3" style={{height:700}}>
          <img src="https://placehold.co/760x760" alt="Premium Wireless Headphones" style={{width:760, height:760, objectFit:"cover"}} />
        </div>
        <div className="d-flex gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-dark rounded-3 overflow-hidden opacity-50" style={{width:178, height:100}}>
              <img src="https://placehold.co/178x178" alt="thumb" style={{width:178, height:178, objectFit:"cover"}} />
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex flex-column gap-4 pt-5" style={{width:760}}>
        <div>
          <h1 className="fw-bold" style={{fontSize:60, color: "#F5F5F5", lineHeight: "60px"}}>
            Premium Wireless <br/>Headphones
          </h1>
          <div className="fw-bold" style={{fontSize:48, color: "#F5F5F5"}}>$349</div>
        </div>
        <div style={{height:1, background: "#2A2A2A", width: "100%"}}></div>
        <div>
          <h3 className="fw-semibold" style={{fontSize:20, color: "#F5F5F5"}}>Description</h3>
          <p className="fw-normal" style={{fontSize:18, color: "rgba(245,245,245,0.7)", lineHeight: "30px"}}>
            Experience audio excellence with our premium wireless headphones. Featuring <br/>advanced noise cancellation, 40-hour battery life, and premium materials for all-day <br/>comfort. Designed for those who demand the best in sound quality and craftsmanship.
          </p>
        </div>
        <div>
          <h3 className="fw-semibold" style={{fontSize:20, color: "#F5F5F5"}}>Features</h3>
          <ul className="list-unstyled d-flex flex-column gap-2">
            <li className="d-flex align-items-center gap-2" style={{color: "rgba(245,245,245,0.7)", fontSize:16}}>
              <span>✔</span> Active noise cancellation technology
            </li>
            <li className="d-flex align-items-center gap-2" style={{color: "rgba(245,245,245,0.7)", fontSize:16}}>
              <span>✔</span> 40-hour battery life on a single charge
            </li>
            <li className="d-flex align-items-center gap-2" style={{color: "rgba(245,245,245,0.7)", fontSize:16}}>
              <span>✔</span> Premium leather ear cushions
            </li>
            <li className="d-flex align-items-center gap-2" style={{color: "rgba(245,245,245,0.7)", fontSize:16}}>
              <span>✔</span> Bluetooth 5.0 connectivity
            </li>
          </ul>
        </div>
        <div className="pt-3">
          <button className="btn btn-light w-100 fw-semibold py-3 rounded-3" style={{fontSize:18, color: "#0A0A0A"}}>Contact Seller</button>
        </div>
        <div className="d-flex gap-4 pt-3">
          <span className="d-flex align-items-center gap-2 text-secondary" style={{fontSize:14}}>
            <span>🚚</span> Free Shipping
          </span>
          <span className="d-flex align-items-center gap-2 text-secondary" style={{fontSize:14}}>
            <span>🛡️</span> Buyer Protection
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default ProductDetail;
