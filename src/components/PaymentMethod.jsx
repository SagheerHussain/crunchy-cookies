import React, { useState } from "react";
import paypalLogo from "/images/gateway/1.png";
import applePayLogo from "/images/gateway/2.webp";
import mastercardLogo from "/images/gateway/3.webp";
import visaLogo from "/images/gateway/4.png";
import { useTranslation } from "react-i18next";

export default function PaymentMethod() {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";
  const [selected, setSelected] = useState("");

  const methods = [
    { id: "paypal", label: "PayPal", logo: paypalLogo },
    { id: "applepay", label: "Apple Pay", logo: applePayLogo },
    { id: "mastercard", label: "MasterCard", logo: mastercardLogo },
    { id: "visa", label: "Visa", logo: visaLogo },
  ];

  return (
    <div className="payment_methods py-4">
      <h5 className="text-xl text-primary mb-4 font-semibold">
        {langClass ? "طرق الدفع" : "Select Payment Method"}
      </h5>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-2 cursor-pointer
              ${selected === method.id ? "opacity-100" : "opacity-70"}`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => setSelected(method.id)}
              className="hidden"
            />
            <span
              className={`relative w-4 h-4 rounded-full border-2 ${
                selected === method.id
                  ? "border-primary"
                  : "border-primary"
              }`}
            >
                {
                    selected === method.id && (
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></span>
                    )
                }
            </span>
            <img
              src={method.logo}
              alt={method.label}
              className="h-10 w-16 object-contain border rounded-lg shadow-sm bg-white p-2"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
