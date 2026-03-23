import React from "react";

const CallToAction = () => (
  <section className="d-flex flex-column align-items-center justify-content-center" style={{padding: "128px 0", background: "#0A0A0A"}}>
    <div className="mx-auto d-flex flex-column align-items-center gap-4" style={{maxWidth:1000}}>
      <h2 className="fw-bold text-center" style={{fontSize:60, color: "#F5F5F5", lineHeight: "60px"}}>
        Start Your<br/> Collection Today
      </h2>
      <p className="fw-light text-center" style={{fontSize:20, color: "rgba(245,245,245,0.6)", lineHeight: "28px", maxWidth:672}}>
        Join thousands of collectors who trust our marketplace for premium, <br/>curated items.
      </p>
      <div className="d-flex gap-3 pt-3">
        <a href="#all" className="btn btn-light fw-medium px-4 py-3 rounded-2" style={{width:202, fontSize:16, color: "#0A0A0A"}}>Browse Collection</a>
        <a href="#about" className="btn fw-medium px-4 py-3 rounded-2" style={{width:154, fontSize:16, color: "#F5F5F5", border: "1px #2A2A2A solid"}}>Learn More</a>
      </div>
    </div>
  </section>
);

export default CallToAction;
