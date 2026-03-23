import React from "react";

const Footer = () => (
  <footer className="w-100" style={{background: "none", borderTop: "1px #2A2A2A solid", color: "#F5F5F5", padding: "65px 0 64px 0"}}>
    <div className="container" style={{maxWidth:1600}}>
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="fw-bold" style={{fontSize:24}}>MARKET</div>
          <div className="text-secondary" style={{fontSize:14}}>Premium marketplace for curated collections.</div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="fw-semibold" style={{fontSize:16}}>Shop</div>
          <ul className="list-unstyled">
            <li className="text-secondary" style={{fontSize:14}}>Featured</li>
            <li className="text-secondary" style={{fontSize:14}}>All Items</li>
            <li className="text-secondary" style={{fontSize:14}}>Categories</li>
          </ul>
        </div>
        <div className="col-md-3 mb-3">
          <div className="fw-semibold" style={{fontSize:16}}>Support</div>
          <ul className="list-unstyled">
            <li className="text-secondary" style={{fontSize:14}}>Contact</li>
            <li className="text-secondary" style={{fontSize:14}}>FAQ</li>
            <li className="text-secondary" style={{fontSize:14}}>Shipping</li>
          </ul>
        </div>
        <div className="col-md-3 mb-3">
          <div className="fw-semibold" style={{fontSize:16}}>Follow</div>
          <div className="d-flex gap-2">
            <span className="bg-dark rounded p-2"><i className="bi bi-facebook text-white"></i></span>
            <span className="bg-dark rounded p-2"><i className="bi bi-twitter text-white"></i></span>
            <span className="bg-dark rounded p-2"><i className="bi bi-instagram text-white"></i></span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{borderColor: "#2A2A2A"}}>
        <div className="text-secondary" style={{fontSize:14}}>© 2024 Market. All rights reserved.</div>
        <div className="d-flex gap-4">
          <span className="text-secondary" style={{fontSize:14}}>Privacy Policy</span>
          <span className="text-secondary" style={{fontSize:14}}>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
