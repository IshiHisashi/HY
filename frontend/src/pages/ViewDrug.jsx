import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import PdfCard from "../PdfCard.js";
import { useAuthContext } from "../authContext.js";
import AddDrug from "./AddDrug.jsx";
import Footer from "../components/Footer.jsx";
import StatusFlags from "../components/StatusFlags.jsx";

function ViewDrug() {
  const userIdObj = useAuthContext();
  const userId = userIdObj.userId;
  const [drugs, setDrugs] = useState([]);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  // Read Drug Data
  useEffect(() => {
    if (userId && userId !== "logout")
      axios
        .get(`https://server.pillbook-hy.com/users/${userId}/drugs`)
        .then((res) => {
          setDrugs(res.data.data.drugs);
        });
  }, [userId]);

  const handleShowAddMedication = () => {
    setIsAddMedicationOpen(true);
  };

  const handleModalClose = () => {
    setIsAddMedicationOpen(false);
  };

  return (
    <>
      <div className="bg-primary-100 min-h-screen pb-[200px] relative">
        <header className="pt-2.5 relative h-[54px] bg-white">
          <h1 className="ont-semibold text-lg text-center font-bold">
            Medication List
          </h1>
          {userId && userId !== "logout" ? <PdfCard drugs={drugs} /> : ""}
        </header>

        <nav>
          <div className="cards flex gap-2 mt-4">
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-primary-700  bg-primary-200`}
            >
              Taking
            </p>
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-gray-700 bg-gray-200`}
            >
              Stop Taking
            </p>
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-[#EF6255] bg-[#FEEDEC]`}
            >
              Completed
            </p>
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-[#337B19] bg-[#E9F9E3]`}
            >
              OTC
            </p>
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-[#3875D6] bg-[#E3ECF9]`}
            >
              Prescription
            </p>
            <p
              className={`text-[11px] font-medium py-1.5 px-3 rounded-[18px] inline-block text-[#B59A0C] bg-[#FFFAE2]`}
            >
              Suppliment
            </p>
          </div>
        </nav>

        <ul className="flex flex-col gap-y-2 mt-4">
          {drugs.map((drug) => (
            <Drug drug={drug} key={drug._id} />
          ))}
        </ul>
        <div
          className="btn-add-med fixed bottom-[100px] right-4 flex w-14 h-14 bg-primary-700 rounded-[1000px] cursor-pointer"
          onClick={handleShowAddMedication}
        >
          <p className="self-center translate-y-[-5%]	 text-white font-semibokd text-[32px] rounded-[1px] mx-auto">
            +
          </p>
        </div>
      </div>
      <Footer />
      {/* Modal for add medication */}
      {isAddMedicationOpen ? (
        <>
          <div
            className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[100%]"
            onClick={handleModalClose}
          ></div>
          <div className="px-4 bg-white rounded-t-2xl h-[98vh] overflow-scroll w-full fixed bottom-0 z-20">
            <AddDrug />
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

function Drug({ drug }) {
  const navigate = useNavigate();
  const frequencyDay = drug.takein.frequencyDay;
  const frequencyWithinADay = drug.takein.frequencyWithinADay;
  const status = drug.status;
  const typeOfDrug = drug.typeOfDrug;
  function handleClick(drug) {
    navigate(`/drugs/detail/${drug._id}`);
  }
  return (
    <>
      <div
        className="bg-white mx-4 rounded p-4"
        onClick={() => handleClick(drug)}
      >
        {/* <Navigate to={`/drugs/edit/${drug._id}`} /> */}
        <h3 className="text-gray-950 text-[19.98px] font-bold">
          {drug.nickname ? drug.nickname : drug.drugName}
        </h3>
        <p className="text-[11px] text-gray-950 mt-1">{drug.drugName}</p>
        <p className="text-[11px] text-gray-500 font-medium mt-1">
          {drug.amount} {drug.unit} /{" "}
          {frequencyDay === 1
            ? "once"
            : frequencyDay === 2
            ? "twice"
            : frequencyDay === 3
            ? "3 times"
            : ""}{" "}
          in every
          {frequencyWithinADay === 1
            ? " day"
            : frequencyWithinADay > 1
            ? `${frequencyWithinADay} days`
            : ""}
        </p>
        <StatusFlags drug={drug} />
      </div>
    </>
  );
}

export default ViewDrug;
