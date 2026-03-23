import React from "react";

const featured = [
  {
    title: "Premium Wireless Headphones",
    price: "$349",
    img: "https://placehold.co/784x784"
  },
  {
    title: "Minimalist Timepiece",
    price: "$599",
    img: "https://placehold.co/784x784"
  }
];

const FeaturedItems = () => (
  <section id="featured" className="py-5" style={{paddingLeft:160, paddingRight:160, background: "#0A0A0A"}}>
    <div className="mx-auto" style={{maxWidth:1600}}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold" style={{fontSize:48, color: "#F5F5F5"}}>Featured Items</h2>
        <a href="#all" className="text-secondary fw-medium text-decoration-none" style={{fontSize:14}}>View All</a>
      </div>
      <div className="d-flex gap-4">
        {featured.map((item, i) => (
          <div key={i} className="bg-dark rounded-4 overflow-hidden d-flex flex-column" style={{width:784, height:640}}>
            <div className="overflow-hidden" style={{height:500}}>
              <img src={item.img} alt={item.title} style={{width:784, height:784, objectFit:"cover"}} />
            </div>
            <div className="p-4 d-flex flex-column gap-2" style={{height:140}}>
              <h3 className="fw-semibold" style={{fontSize:24, color: "#F5F5F5"}}>{item.title}</h3>
              <div className="fw-bold" style={{fontSize:30, color: "#F5F5F5"}}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedItems;
