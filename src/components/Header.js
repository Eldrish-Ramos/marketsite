import React from "react";

const Header = () => (
  <header style={{background: "rgba(10,10,10,0.8)", borderBottom: "1px #2A2A2A solid"}} className="w-100 position-fixed top-0 start-0" >
    <nav className="container d-flex justify-content-between align-items-center py-3" style={{maxWidth:1600}}>
      <div className="fw-bold text-white" style={{fontSize:24}}>MARKET</div>
      <div className="d-flex align-items-center gap-4">
        <a href="#featured" className="text-white-50 fw-medium text-decoration-none" style={{fontSize:14}}>Featured</a>
        <a href="#all" className="text-white-50 fw-medium text-decoration-none" style={{fontSize:14}}>All Items</a>
        <a href="#about" className="text-white-50 fw-medium text-decoration-none" style={{fontSize:14}}>About</a>
        <a href="#contact" className="text-white-50 fw-medium text-decoration-none" style={{fontSize:14}}>Contact</a>
      </div>
    </nav>
  </header>
);

export default Header;
