import React from "react";
import AddressCard from "./AddressCard";

const MyAddresses = ({ tab, setTab }) => {

  const editAddress = () => {
    setTab("editAddress");
  }

  return (
    <div className="my-addresses">
      <h2 className="text-2xl mb-4 text-primary">My Addresses</h2>
      <AddressCard
        title="Office"
        address="Ava Johnson – Suite 402, Willow Tower, 15 Market Street, Downtown, Toronto, ON"
        onEdit={editAddress}
        onDelete={() => console.log("Delete office address")}
      />
      <AddressCard
        title="Home"
        address="Liam Carter – #78, Pinecrest Avenue, Sector 12, Sydney, NSW 2000"
        onEdit={editAddress}
        onDelete={() => console.log("Delete home address")}
      />
    </div>
  );
};

export default MyAddresses;
