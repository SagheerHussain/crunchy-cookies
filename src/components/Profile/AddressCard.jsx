import React from "react";

const AddressCard = ({ title, address, onEdit, onDelete }) => {
  return (
    <div className="address-card flex justify-between items-center p-4 mb-4 bg-primary_light_mode border border-primary/30 rounded-lg">
      <div>
        <div className="font-semibold text-lg text-primary">{title}</div>
        <div className="text-black">{address}</div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="bg-primary hover:bg-primary/70 text-white font-medium px-4 py-2 rounded-lg text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-500/70 text-white font-medium px-4 py-2 rounded-lg text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
