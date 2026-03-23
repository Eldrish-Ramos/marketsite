import React from "react";
import FeaturedItems from "./FeaturedItems";
import AllListings from "./AllListings";
import ProductDetail from "./ProductDetail";


const HomePage = () => (
  <main style={{background: "#0A0A0A", minHeight: "100vh", paddingTop: 81}}>
    {/* Hero Section */}
    <section className="d-flex justify-content-center align-items-center" style={{height: 700, padding: "100px 160px"}}>
      <div className="d-flex gap-5" style={{maxWidth: 1600, width: "100%"}}>
        <div className="d-flex flex-column gap-4" style={{width: 776}}>
          <h1 className="fw-bold" style={{fontSize: 72, color: "#F5F5F5", lineHeight: "72px"}}>
            Curated<br/>
            <span style={{color: "rgba(245,245,245,0.6)"}}>Collection</span>
          </h1>
          <p className="fw-light" style={{fontSize: 20, color: "rgba(245,245,245,0.6)", lineHeight: "28px", maxWidth: 512}}>
            Discover premium items handpicked for those who <br/>appreciate quality and design.
          </p>
          <a href="#featured" className="btn btn-light fw-medium px-4 py-3 rounded-2" style={{width: 203, color: "#0A0A0A", fontSize: 16}}>Explore Collection</a>
        </div>
        <div className="overflow-hidden rounded-4" style={{width: 776, height: 500}}>
          <img src="https://placehold.co/776x776" alt="Curated Collection" style={{width: 776, height: 776, objectFit: "cover"}} />
        </div>
      </div>
    </section>
    <FeaturedItems />
    <AllListings />
    <ProductDetail />

  </main>
);

export default HomePage;
