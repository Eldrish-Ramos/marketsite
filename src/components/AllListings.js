import React from "react";

const listings = [
  { title: "Modern Desk Lamp", price: "$129", img: "https://placehold.co/382x382" },
  { title: "Leather Messenger Bag", price: "$279", img: "https://placehold.co/382x382" },
  { title: "Ceramic Coffee Mug Set", price: "$89", img: "https://placehold.co/382x382" },
  { title: "Wireless Keyboard", price: "$159", img: "https://placehold.co/382x382" },
  { title: "Slim Leather Wallet", price: "$79", img: "https://placehold.co/382x382" },
  { title: "Portable Speaker", price: "$199", img: "https://placehold.co/382x382" },
  { title: "Designer Sunglasses", price: "$249", img: "https://placehold.co/382x382" },
  { title: "Leather Phone Case", price: "$59", img: "https://placehold.co/382x382" }
];

const AllListings = () => (
  <section id="all" className="py-5" style={{paddingLeft:160, paddingRight:160, background: "rgba(10,10,10,0.5)"}}>
    <div className="mx-auto" style={{maxWidth:1600}}>
      <h2 className="fw-bold mb-5" style={{fontSize:48, color: "#F5F5F5"}}>All Listings</h2>
      <div className="d-flex flex-wrap gap-3">
        {listings.map((item, i) => (
          <div key={i} className="bg-dark rounded-3 overflow-hidden d-flex flex-column" style={{width:382, height:436}}>
            <div className="overflow-hidden" style={{height:320}}>
              <img src={item.img} alt={item.title} style={{width:382, height:382, objectFit:"cover"}} />
            </div>
            <div className="p-3 d-flex flex-column gap-2" style={{height:116}}>
              <h3 className="fw-semibold" style={{fontSize:18, color: "#F5F5F5"}}>{item.title}</h3>
              <div className="fw-bold" style={{fontSize:24, color: "#F5F5F5"}}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AllListings;
