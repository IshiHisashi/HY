import React from "react";

function StatusFlags({ drug }) {
  const status = drug.status;
  const typeOfDrug = drug.typeOfDrug;
  return (
    <div className="cards flex gap-2 mt-4">
      {/* Status */}
      <p
        className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block ${
          status === "taking"
            ? "text-primary-700 bg-primary-200"
            : status === "stop taking"
            ? "text-gray-700 bg-gray-200"
            : status === "complete"
            ? "text-[#EF6255] bg-[#FEEDEC]"
            : ""
        }`}
      >
        {status === "taking"
          ? "Taking"
          : status === "stop taking"
          ? "Stop Taking"
          : status === "complete"
          ? "Completed"
          : ""}
      </p>
      {/* Form */}
      <p
        className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block ${
          typeOfDrug === "over-the-counter"
            ? "text-[#337B19] bg-[#E9F9E3]"
            : typeOfDrug === "prescription"
            ? "text-[#3875D6] bg-[#E3ECF9]"
            : typeOfDrug === "suppliment"
            ? "text-[#B59A0C] bg-[#FFFAE2]"
            : ""
        }`}
      >
        {typeOfDrug === "over-the-counter"
          ? "OTC"
          : typeOfDrug === "prescription"
          ? "Prescription"
          : typeOfDrug === "suppliment"
          ? "Suppliment"
          : ""}
      </p>
    </div>
  );
}

export default StatusFlags;
