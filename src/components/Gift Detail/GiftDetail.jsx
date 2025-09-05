// import React, { useState } from "react";
// import { giftDetail } from "../../lib/giftDetail";
// import { CiDeliveryTruck } from "react-icons/ci";
// import { IoLocationOutline } from "react-icons/io5";
// import { MdOutlineWorkspacePremium } from "react-icons/md";
// import { BsBagCheck } from "react-icons/bs";
// import { TbShoppingCart } from "react-icons/tb";
// import FrequentlyBuyGifts from "./FrequentlyBuyGifts";
// import { useTranslation } from "react-i18next";

// const ProductDetail = () => {
//   const { i18n } = useTranslation();
//   const langClass = i18n.language === "ar";

//   const [activeImgIndex, setActiveImgIndex] = useState(0);

//   return (
//     <section className="py-10">
//       <div className="custom-container">
//         <div className="flex flex-col md:flex-row items-start gap-8">
//           {/* Product Image Section */}
//           <div className="relative md:w-1/2 xl:w-[40%]">
//             <img
//               src={giftDetail.images[activeImgIndex]}
//               alt="Product"
//               className="w-full rounded-xl h-[500px] object-cover"
//             />
//             {/* Additional images carousel */}
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
//               <div className="grid grid-cols-3 gap-3">
//                 {giftDetail.images?.map((image, index) => (
//                   <div className="relative">
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Additional Product ${index + 1}`}
//                       className={`${
//                         activeImgIndex === index
//                           ? "border-2 border-primary"
//                           : ""
//                       } rounded-lg object-cover lg:w-[80px] lg:h-[80px] h-[60px] cursor-pointer w-[60px]`}
//                       onClick={() => setActiveImgIndex(index)}
//                     />
//                     <div className={`absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg ${activeImgIndex === index ? "" : "hidden"}`}></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Product Info Section */}
//           <div className="flex-1 mt-4 md:mt-0 md:w-1/2 xl:w-[60%]">
//             <div className="flex items-center justify-between">
//               <h5 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary">
//                 {langClass ? giftDetail.title.ar : giftDetail.title.en}
//               </h5>
//               <p className="lg:text-md xl:text-3xl font-semibold text-primary">
//                 {langClass ? giftDetail.price.ar : giftDetail.price.en}
//               </p>
//             </div>

//             <div className="grid lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-2">
//               <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
//                 <CiDeliveryTruck size={18} className="text-primary" />
//                 {langClass ? giftDetail.delivery.ar : giftDetail.delivery.en}
//               </span>
//               <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
//                 <IoLocationOutline size={18} className="text-primary" />
//                 {langClass ? giftDetail.address.ar : giftDetail.address.en}
//               </span>
//               <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
//                 <MdOutlineWorkspacePremium size={18} className="text-primary" />
//                 {langClass ? giftDetail.type.ar : giftDetail.type.en}
//               </span>
//             </div>

//             <div className="description-filled-box mt-6">
//               <h5 className="text-white bg-primary inline-block rounded-lg px-4 py-2 text-xs mb-4">
//                 {langClass ? "وصف" : "Description"}
//               </h5>
//               <p className="text-balck text-sm">
//                 {langClass
//                   ? giftDetail.description.ar
//                   : giftDetail.description.en}
//               </p>
//               <p className="text-sm mt-4">
//                 <span className="font-medium text-primary">
//                   {langClass ? "ملاحظة:" : "Note:"}
//                 </span>{" "}
//                 {langClass ? giftDetail.note.ar : giftDetail.note.en}
//               </p>
//             </div>

//             <div className="mt-4 text-gray-600">
//               <h5 className="font-medium text-primary text-xl mb-4">
//                 {langClass ? "يتضمن الترتيب:" : "Arrangement Includes:"}
//               </h5>
//               <ul className="list-disc pl-5">
//                 {giftDetail.arrangements.map((arrangement, index) => (
//                   <li key={index} className="text-black text-sm mb-2">
//                     {langClass ? arrangement.ar : arrangement.en}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="sku mt-6">
//               <h5 className="font-medium text-primary text-xl">
//                 {langClass ? "SKU" : "SKU"} {giftDetail.sku}
//               </h5>
//             </div>

//             <div className="flex xl:w-1/2 items-center justify-center gap-4 mt-4">
//               <button className="bg-primary border border-primary hover:border-primary/80 hover:bg-primary/80 text-center w-1/2 font-medium text-white py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
//                 <BsBagCheck size={20} />
//                 {langClass ? "شراء الآن" : "Buy Now"}
//               </button>
//               <button className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
//                 <TbShoppingCart size={20} />
//                 {langClass ? "إضافة إلى السلة" : "Add to Cart"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Frequently Bought Together Section */}
//         <div className="mt-20">
//           <h3 className="text-3xl text-primary">
//             {langClass
//               ? "المنتجات الأكثر شراءًا معاً"
//               : "Frequently Bought Together"}
//           </h3>
//           <div className="mt-4 border border-primary rounded-3xl">
//             <FrequentlyBuyGifts />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductDetail;


import React, { useState, useRef } from "react";
import { giftDetail } from "../../lib/giftDetail";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { BsBagCheck } from "react-icons/bs";
import { TbShoppingCart } from "react-icons/tb";
import FrequentlyBuyGifts from "./FrequentlyBuyGifts";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // --- Magnifier state ---
  const imgWrapRef = useRef(null);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  // Tweak these to your liking
  const LENS_SIZE = 160; // px (diameter)
  const ZOOM = 2.2; // magnification factor

  const handleMouseEnter = () => setIsMagnifying(true);
  const handleMouseLeave = () => setIsMagnifying(false);

  const handleMouseMove = (e) => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Clamp so the lens stays fully within the image container
    const half = LENS_SIZE / 2;
    const x = Math.max(half, Math.min(relX, rect.width - half));
    const y = Math.max(half, Math.min(relY, rect.height - half));

    setLensPos({ x, y });
  };

  // Background size equals container size * zoom (keeps math simple)
  const backgroundSize = (wrap) =>
    wrap
      ? `${wrap.clientWidth * ZOOM}px ${wrap.clientHeight * ZOOM}px`
      : "auto";

  // Background position centers the magnified area under the lens
  const backgroundPosition = `${-(lensPos.x * ZOOM - LENS_SIZE / 2)}px ${-(lensPos.y * ZOOM - LENS_SIZE / 2)}px`;

  return (
    <section className="py-10">
      <div className="custom-container">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Product Image Section */}
          <div className="relative md:w-1/2 xl:w-[40%]">
            {/* Image wrapper for magnifier math */}
            <div
              ref={imgWrapRef}
              className="relative w-full rounded-xl h-[500px] overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <img
                src={giftDetail.images[activeImgIndex]}
                alt="Product"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />

              {/* Magnifier Lens */}
              {isMagnifying && (
                <div
                  className="pointer-events-none rounded-full border border-white/70 shadow-xl"
                  style={{
                    position: "absolute",
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    top: `${lensPos.y - LENS_SIZE / 2}px`,
                    left: `${lensPos.x - LENS_SIZE / 2}px`,
                    backgroundImage: `url(${giftDetail.images[activeImgIndex]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: backgroundSize(imgWrapRef.current),
                    backgroundPosition,
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.3)",
                    backdropFilter: "blur(0.5px)",
                  }}
                />
              )}
            </div>

            {/* Additional images carousel */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="grid grid-cols-3 gap-3">
                {giftDetail.images?.map((image, index) => (
                  <div className="relative" key={index}>
                    <img
                      src={image}
                      alt={`Additional Product ${index + 1}`}
                      className={`${
                        activeImgIndex === index ? "border-2 border-primary" : ""
                      } rounded-lg object-cover lg:w-[80px] lg:h-[80px] h-[60px] cursor-pointer w-[60px]`}
                      onClick={() => setActiveImgIndex(index)}
                    />
                    <div
                      className={`absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg ${
                        activeImgIndex === index ? "" : "hidden"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex-1 mt-4 md:mt-0 md:w-1/2 xl:w-[60%]">
            <div className="flex items-center justify-between">
              <h5 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary">
                {langClass ? giftDetail.title.ar : giftDetail.title.en}
              </h5>
              <p className="lg:text-md xl:text-3xl font-semibold text-primary">
                {langClass ? giftDetail.price.ar : giftDetail.price.en}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-2">
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <CiDeliveryTruck size={18} className="text-primary" />
                {langClass ? giftDetail.delivery.ar : giftDetail.delivery.en}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <IoLocationOutline size={18} className="text-primary" />
                {langClass ? giftDetail.address.ar : giftDetail.address.en}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <MdOutlineWorkspacePremium size={18} className="text-primary" />
                {langClass ? giftDetail.type.ar : giftDetail.type.en}
              </span>
            </div>

            <div className="description-filled-box mt-6">
              <h5 className="text-white bg-primary inline-block rounded-lg px-4 py-2 text-xs mb-4">
                {langClass ? "وصف" : "Description"}
              </h5>
              <p className="text-black text-sm">
                {langClass ? giftDetail.description.ar : giftDetail.description.en}
              </p>
              <p className="text-sm mt-4">
                <span className="font-medium text-primary">
                  {langClass ? "ملاحظة:" : "Note:"}
                </span>{" "}
                {langClass ? giftDetail.note.ar : giftDetail.note.en}
              </p>
            </div>

            <div className="mt-4 text-gray-600">
              <h5 className="font-medium text-primary text-xl mb-4">
                {langClass ? "يتضمن الترتيب:" : "Arrangement Includes:"}
              </h5>
              <ul className="list-disc pl-5">
                {giftDetail.arrangements.map((arrangement, index) => (
                  <li key={index} className="text-black text-sm mb-2">
                    {langClass ? arrangement.ar : arrangement.en}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sku mt-6">
              <h5 className="font-medium text-primary text-xl">
                {langClass ? "SKU" : "SKU"} {giftDetail.sku}
              </h5>
            </div>

            <div className="flex xl:w-1/2 items-center justify-center gap-4 mt-4">
              <button className="bg-primary border border-primary hover:border-primary/80 hover:bg-primary/80 text-center w-1/2 font-medium text-white py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
                <BsBagCheck size={20} />
                {langClass ? "شراء الآن" : "Buy Now"}
              </button>
              <button className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
                <TbShoppingCart size={20} />
                {langClass ? "إضافة إلى السلة" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Section */}
        <div className="mt-20">
          <h3 className="text-3xl text-primary">
            {langClass ? "المنتجات الأكثر شراءًا معاً" : "Frequently Bought Together"}
          </h3>
          <div className="mt-4 border border-primary rounded-3xl">
            <FrequentlyBuyGifts />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
