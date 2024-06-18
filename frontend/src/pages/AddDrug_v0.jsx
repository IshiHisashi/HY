import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SearchDrug from "./SearchDrug.jsx";
import { useAuthContext } from "../authContext.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const currentURL = window.location.pathname;
console.log(window.location.pathname);

function CreateDrug({ setIsAddMedicationOpen }) {
  const userIdObj = useAuthContext();
  const [userId, setUserId] = useState(userIdObj.userId);

  // Steps controll
  // Name
  const [nameRegistration, setNameRegistration] = useState(true);
  const [isNameOpen, setIsNameOpen] = useState(true);
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);
  // Drug info
  const [drugInfoRegistration, setDrugInfoRegistration] = useState(false);
  const [progressDrugInfo, setProgressDrugInfo] = useState(1);
  // Schedule info
  const [scheduleRegistration, setScheduleRegistration] = useState(false);
  const [progressSch, setProgressSch] = useState(1);
  // Reminder
  const [reminderRegistration, setReminderRefistration] = useState(false);
  const [progressReminder, setProgressReminder] = useState(1);

  // State per each input values
  // Name
  const [drugName, setDrugName] = useState("");
  const [nickname, setNickname] = useState("");
  const [companyName, setCompanyName] = useState("");
  // Info
  const [formOfDrug, setFormOfDrug] = useState("pill");
  const [typeOfDrug, setTypeOfDrug] = useState("over-the-counter");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("pill");
  const [strength, setStrength] = useState("");
  const [strengthUnit, setStrengthUnit] = useState("mg");
  // Schedule
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequencyDay, setFrequencyDay] = useState("");
  const [frequencyWithinADay, setFrequencyWithinADay] = useState("");
  const [doze_1, setDoze_1] = useState("");
  const [doze_2, setDoze_2] = useState("");
  const [doze_3, setDoze_3] = useState("");
  // Reminder
  const [remaining, setRemaining] = useState("");
  const [shortageLimit, setShortageLimit] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("taking");

  // For seaching
  const [searchedDrugs, setSearchedDrugs] = useState([]);
  const [searchedDrugId, setSearchedDrugId] = useState();
  const [drugsBigData, setDrugsBigData] = useState([]);

  const navigate = useNavigate();
  let logArr = [];

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer f26d98afbae288b56f0511851b6d3c9757399067",
    },
  };

  // Fetch event
  const { getUser } = useAuthContext();
  useEffect(() => {
    axios.defaults.withCredentials = false;
    axios
      .get(
        `https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json`
      )
      .then((res) => {
        setDrugsBigData(res.data);
      });
  }, []);

  // Searching__detecting the change in state value 'drugName'
  useEffect(() => {
    if (drugName.length > 2) {
      setSearchedDrugs(
        drugsBigData.filter((obj) =>
          Object.values(obj)
            .toString()
            .toLowerCase()
            .includes(drugName.toLowerCase())
        )
      );
    }
  }, [drugName]);

  // Save the data (=register)
  const handleSaveDrug = () => {
    const data = {
      userId,
      drugName,
      nickname,
      companyName,
      formOfDrug,
      typeOfDrug,
      takein: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        frequencyDay: Number(frequencyDay),
        frequencyWithinADay: Number(frequencyWithinADay),
        doze_1,
        doze_2,
        doze_3,
      },
      latestTakenDate: null,
      amount,
      unit,
      strength,
      strengthUnit,
      remaining,
      shortageLimit,
      // description,
      status,
    };
    // Create Drug data
    axios
      .post(`https://server.pillbook-hy.com/drugs`, data)
      .then((res) => {
        console.log("success");
        return res.data.data.drug._id;
      })
      .then((id) => {
        // Then, create Log data
        // set doze hours
        const doze1Time = +doze_1.split(":")[0];
        const doze1Minute = +doze_1.split(":")[1];
        const doze1DateH = new Date(startDate).setHours(
          new Date(startDate).getHours() + doze1Time
        );
        const doze1DateM = new Date(doze1DateH).setMinutes(doze1Minute);

        const doze2Time = +doze_2.split(":")[0];
        const doze2Minute = +doze_2.split(":")[1];
        const doze2Date =
          doze1DateM +
          (doze2Time - doze1Time) * 1000 * 60 * 60 +
          (doze2Minute - doze1Minute) * 1000 * 60;
        const doze3Time = +doze_3.split(":")[0];
        const doze3Minute = +doze_3.split(":")[1];
        const doze3Date =
          doze2Date +
          (doze3Time - doze2Time) * 1000 * 60 * 60 +
          (doze3Minute - doze2Minute) * 1000 * 60;

        const days = (new Date(endDate) - new Date(startDate)) / 86400000;
        console.log(days, new Date(doze1DateM));
        // If frequencyWithinADay<=1
        logArr = [];
        if (+frequencyWithinADay <= 1) {
          for (let i = 0; i < days; i = i + Number(frequencyDay)) {
            const doze1DateFor = new Date(doze1DateM).setDate(
              new Date(doze1DateM).getDate() + i
            );
            logArr.push(doze1DateFor);
          }
          console.log(logArr);
        } else if (frequencyWithinADay === 2) {
          // If frequencyWithinADay=2
          for (let i = 0; i <= days; i++) {
            const doze1DateFor = new Date(doze1DateM).setDate(
              new Date(doze1DateM).getDate() + i
            );
            const doze2DateFor = new Date(doze2Date).setDate(
              new Date(doze2Date).getDate() + i
            );
            logArr.push(doze1DateFor, doze2DateFor);
          }
        } else {
          // If frequencyWithinADay=3
          for (let i = 0; i <= days; i++) {
            const doze1DateFor = new Date(doze1DateM).setDate(
              new Date(doze1DateM).getDate() + i
            );
            const doze2DateFor = new Date(doze2Date).setDate(
              new Date(doze2Date).getDate() + i
            );
            const doze3DateFor = new Date(doze3Date).setDate(
              new Date(doze3Date).getDate() + i
            );
            logArr.push(doze1DateFor, doze2DateFor, doze3DateFor);
          }
          console.log(logArr);
        }

        // Then, create Log as per doze
        logArr.forEach((el) => {
          axios
            .post(
              `https://server.pillbook-hy.com/logs`,
              {
                userId,
                drugId: id,
                plannedDateTime: el,
              },
              config
            )
            .then((res) => {
              return res.data.data.log;
            })
            .then((log) => {
              console.log(log);
              axios.post(`https://server.pillbook-hy.com/schedules`, {
                _id: log._id,
                expireAt: log.plannedDateTime,
              });
            })
            .catch((err) => {
              alert("an error happend. Please chack console");
              console.log(err);
            });
        });
      })
      .catch((err) => {
        alert("an error happend. Please chack console");
        console.log(err);
      });
  };

  return (
    <div className="mb-5">
      {nameRegistration ? (
        <NameRegister
          drugName={drugName}
          setDrugName={setDrugName}
          nickname={nickname}
          setNickname={setNickname}
          companyName={companyName}
          setCompanyName={setCompanyName}
          searchedDrugs={searchedDrugs}
          setSearchedDrugs={setSearchedDrugs}
          searchedDrugId={searchedDrugId}
          setSearchedDrugId={setSearchedDrugId}
          drugsBigData={drugsBigData}
          setDrugsBigData={setDrugsBigData}
          nameRegistration={nameRegistration}
          setNameRegistration={setNameRegistration}
          setDrugInfoRegistration={setDrugInfoRegistration}
          setIsAddMedicationOpen={setIsAddMedicationOpen}
          isNameOpen={isNameOpen}
          setIsNameOpen={setIsNameOpen}
          isNicknameOpen={isNicknameOpen}
          setIsNicknameOpen={setIsNicknameOpen}
        />
      ) : (
        ""
      )}
      {drugInfoRegistration ? (
        <DrugInfoRegister
          nickname={nickname}
          typeOfDrug={typeOfDrug}
          setTypeOfDrug={setTypeOfDrug}
          formOfDrug={formOfDrug}
          setFormOfDrug={setFormOfDrug}
          setAmount={setAmount}
          setUnit={setUnit}
          setStrength={setStrength}
          setStrengthUnit={setStrengthUnit}
          setDrugInfoRegistration={setDrugInfoRegistration}
          setScheduleRegistration={setScheduleRegistration}
          setNameRegistration={setNameRegistration}
          setIsNameOpen={setIsNameOpen}
          setIsNicknameOpen={setIsNicknameOpen}
          progressDrugInfo={progressDrugInfo}
          setProgressDrugInfo={setProgressDrugInfo}
        />
      ) : (
        ""
      )}
      {scheduleRegistration ? (
        <ScheduleRegister
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          frequencyDay={frequencyDay}
          setFrequencyDay={setFrequencyDay}
          frequencyWithinADay={frequencyWithinADay}
          setFrequencyWithinADay={setFrequencyWithinADay}
          doze_1={doze_1}
          setDoze_1={setDoze_1}
          doze_2={doze_2}
          setDoze_2={setDoze_2}
          doze_3={doze_3}
          setDoze_3={setDoze_3}
          setDrugInfoRegistration={setDrugInfoRegistration}
          setProgressDrugInfo={setProgressDrugInfo}
          setScheduleRegistration={setScheduleRegistration}
          progressSch={progressSch}
          setProgressSch={setProgressSch}
          setReminderRefistration={setReminderRefistration}
        />
      ) : (
        ""
      )}

      {reminderRegistration ? (
        <ReminderRegister
          navigate={navigate}
          setRemaining={setRemaining}
          setShortageLimit={setShortageLimit}
          unit={unit}
          frequencyDay={frequencyDay}
          frequencyWithinADay={frequencyWithinADay}
          handleSaveDrug={handleSaveDrug}
          setIsAddMedicationOpen={setIsAddMedicationOpen}
          setScheduleRegistration={setScheduleRegistration}
          setReminderRegistration={setReminderRefistration}
          progressReminder={progressReminder}
          setProgressReminder={setProgressReminder}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default CreateDrug;

function Header({ children }) {
  return (
    <>
      <header className="pt-2.5 relative h-[54px] bg-white">
        <h1 className="font-semibold text-lg text-center">Add Medication</h1>
        {children}
      </header>
    </>
  );
}

function NameRegister({
  drugName,
  setDrugName,
  nickname,
  setNickname,
  companyName,
  setCompanyName,
  searchedDrugs,
  setSearchedDrugs,
  searchedDrugId,
  setSearchedDrugId,
  drugsBigData,
  setDrugsBigData,
  nameRegistration,
  setNameRegistration,
  setDrugInfoRegistration,
  setIsAddMedicationOpen,
  isNameOpen,
  setIsNameOpen,
  isNicknameOpen,
  setIsNicknameOpen,
}) {
  // const [isNameOpen, setIsNameOpen] = useState(true);
  // const [isNicknameOpen, setIsNicknameOpen] = useState(false);
  const [isNameSearchOpen, setIsNameSearchOpen] = useState(false);

  const handleClickNext = () => {
    if (drugName.length > 0) {
      // If data is from db
      if (searchedDrugId) {
        setIsNameOpen(false);
        setIsNicknameOpen(true);
      }
      // If data is not from db
      if (!searchedDrugId) {
        setIsNameOpen(false);
        setNameRegistration(false);
        setDrugInfoRegistration(true);
      }
    }
  };

  const handlePrevious = () => {
    if (isNameOpen) {
      setIsAddMedicationOpen(false);
    }
    if (isNicknameOpen) {
      setIsNicknameOpen(false);
      setIsNameOpen(true);
    }
  };

  const handleClickNickname = () => {
    setIsNicknameOpen(false);
    setNameRegistration(false);
    setDrugInfoRegistration(true);
    console.log(nickname);
  };

  return (
    <>
      <Header>
        <img
          src="/images/arrow_back_ios.png"
          className="absolute w-6 h-6 top-[50%] left-4 translate-y-[-55%] cursor-pointer"
          onClick={() => handlePrevious()}
        />
      </Header>
      {isNameOpen ? (
        <>
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">What is the medication name?</h2>
            <p className="text-base mt-3">
              You can search the medication or name it.
            </p>
          </div>
          <div className="form mx-4 mt-8">
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Medication Name
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5 focus:outline-none focus:border-primary-700 z-0"
                type="text"
                placeholder="e.g Strawnana"
                value={drugName}
                onChange={(e) => {
                  setDrugName(e.target.value);
                  setIsNameSearchOpen(true);
                }}
              />
            </div>
            <div className="search-result">
              {drugName.length > 2 && isNameSearchOpen ? (
                <ul className="border-2 border-primary-700 overflow-auto max-h-[375px] mt-[-5px] z-10">
                  <li
                    className="text-base text-gray-700 pl-3 py-[15px] hover:text-white hover:bg-primary-700"
                    onClick={() => setIsNameSearchOpen(false)}
                  >
                    {drugName}
                  </li>
                  {searchedDrugs.map((drug) => {
                    return (
                      <SearchDrug
                        key={drug.drug_code}
                        drug={drug}
                        setDrugName={setDrugName}
                        setCompanyName={setCompanyName}
                        setSearchedDrugId={setSearchedDrugId}
                        searchedDrugId={searchedDrugId}
                        isNameSearchOpen={isNameSearchOpen}
                        setIsNameSearchOpen={setIsNameSearchOpen}
                      />
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </div>
            <button
              className={`mt-10 text-base text-gray-50 font-semibold	 rounded-3xl w-full h-12 ${
                drugName.length === 0 ? "bg-primary-200" : "bg-primary-700"
              }
        }`}
              onClick={handleClickNext}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        ""
      )}
      {isNicknameOpen ? (
        <>
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">
              Do you change the name of medication?{" "}
            </h2>
            <p className="text-base mt-3">
              To make medication management easier, you can modify the name of
              the medication.
            </p>
          </div>
          <div className="form mx-4 mt-8">
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Medication Name
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5 focus:outline-none focus:border-primary-700 z-0"
                type="text"
                placeholder="e.g Strawnana"
                value={nickname ? nickname : drugName}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </div>
            <div className="search-result"></div>
            <button
              className={`mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12 
        }`}
              onClick={handleClickNickname}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

function DrugInfoRegister({
  nickname,
  typeOfDrug,
  setTypeOfDrug,
  formOfDrug,
  setFormOfDrug,
  setAmount,
  setUnit,
  setStrength,
  setStrengthUnit,
  setDrugInfoRegistration,
  setScheduleRegistration,
  setNameRegistration,
  setIsNameOpen,
  setIsNicknameOpen,
  progressDrugInfo,
  setProgressDrugInfo,
}) {
  const handleProgessAdd = () => {
    setProgressDrugInfo((progressDrugInfo) => progressDrugInfo + 1);
  };

  const handlePrevious = () => {
    // type of med
    if (progressDrugInfo === 1) {
      if (nickname) {
        setDrugInfoRegistration(false);
        setNameRegistration(true);
        setIsNicknameOpen(true);
        setIsNameOpen(false);
      }
      if (!nickname) {
        setDrugInfoRegistration(false);
        setNameRegistration(true);
        setIsNameOpen(true);
      }
    } else {
      // form of med, frequency, strength
      setProgressDrugInfo((progressDrugInfo) => progressDrugInfo - 1);
    }
  };

  const handleCloseDrugInfo = () => {
    setDrugInfoRegistration(false);
    setScheduleRegistration(true);
  };

  return (
    <>
      <Header>
        <img
          src="/images/arrow_back_ios.png"
          className="absolute w-6 h-6 top-[50%] left-4 translate-y-[-55%] cursor-pointer"
          onClick={() => handlePrevious()}
        />
      </Header>
      <div className="druginfo-wrapper">
        {progressDrugInfo === 1 ? (
          <div className="type-of-drug">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">
                What type is the medication?
              </h2>
              <p className="text-base mt-3">Choose type of the medication. </p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <div className="name mt-4">
                <div>
                  <input
                    type="radio"
                    value="prescription"
                    name="type"
                    id="prescription"
                    className="sr-only	peer"
                    onClick={(e) => setTypeOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="prescription"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Prescriptions
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="over-the-counter"
                    name="type"
                    id="over-the-counter"
                    className="sr-only	peer"
                    onClick={(e) => setTypeOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="over-the-counter"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Over-the-counter (OTC) / Non-prescription
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="suppliment"
                    name="type"
                    id="suppliment"
                    className="sr-only	peer"
                    onClick={(e) => setTypeOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="suppliment"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Suppliment
                  </label>
                </div>
              </div>
              <div className="next_name mt-[288px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={(progressDrugInfo) =>
                    handleProgessAdd(progressDrugInfo)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {progressDrugInfo === 2 ? (
          <div className="form-of-drug">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">
                What form is the medication?
              </h2>
              <p className="text-base mt-3">Choose the type of the form. </p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <div className="name mt-4">
                <div>
                  <input
                    type="radio"
                    value="pill"
                    name="form"
                    id="pill"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="pill"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Pill
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="injection"
                    name="form"
                    id="injection"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="injection"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Injection
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="liquid"
                    name="form"
                    id="liquid"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="liquid"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Solution (Liquid)
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="drop"
                    name="form"
                    id="drop"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="drop"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Drops
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="inhaler"
                    name="form"
                    id="inhaler"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="inhaler"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Inhaler
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="powder"
                    name="form"
                    id="powder"
                    className="sr-only	peer"
                    onClick={(e) => setFormOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="powder"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Powder
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="other"
                    name="form"
                    id="other"
                    className="sr-only	peer"
                    onClick={(e) => setTypeOfDrug(e.target.value)}
                  />
                  <label
                    htmlFor="other"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Other
                  </label>
                </div>
              </div>
              <div className="next_name mt-[32px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={(progressDrugInfo) =>
                    handleProgessAdd(progressDrugInfo)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {progressDrugInfo === 3 ? (
          <>
            <div className="type-of-drug">
              <div className="text-wrapper mx-4 mt-10  text-primary-950">
                <h2 className="text-2xl font-bold">
                  How much quantity do you take your medication?{" "}
                </h2>
                <p className="text-base mt-3">Do you schedule it? </p>
              </div>
              <div className="form mx-4 mt-[58px]">
                <div className="name mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium	text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="text"
                      className="border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="fw-full">
                    <label className="block text-xs w-full font-medium	text-gray-700">
                      Unit
                    </label>
                    <select
                      className="border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	 items-center	cursor-pointer"
                      onSelect={(e) => setUnit(e.target.value)}
                    >
                      <option value="pill">pill</option>
                      <option value="piece">piece</option>
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                      <option value="unit">unit</option>
                      <option value="does">does</option>
                      <option value="teaspoon">teaspoon</option>
                    </select>
                  </div>
                </div>
                <div className="next_name mt-[397px]">
                  <button
                    className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                    onClick={(progressDrugInfo) =>
                      handleProgessAdd(progressDrugInfo)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {progressDrugInfo === 4 ? (
          <>
            <div className="type-of-drug">
              <div className="text-wrapper mx-4 mt-10  text-primary-950">
                <h2 className="text-2xl font-bold">
                  How strong per you take your medication?{" "}
                </h2>
                <p className="text-base mt-3">Do you schedule it? </p>
              </div>
              <div className="form mx-4 mt-[58px]">
                <div className="name mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium	text-gray-700">
                      Strength
                    </label>
                    <input
                      type="text"
                      className="border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer"
                      onChange={(e) => setStrength(e.target.value)}
                    />
                  </div>
                  <div className="fw-full">
                    <label className="block text-xs w-full font-medium	text-gray-700">
                      Unit
                    </label>
                    <select
                      className="border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	 items-center	cursor-pointer"
                      onSelect={(e) => setStrengthUnit(e.target.value)}
                    >
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                    </select>
                  </div>
                </div>
                <div className="next_name mt-[397px]">
                  <button
                    className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                    onClick={handleCloseDrugInfo}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function ScheduleRegister({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  frequencyDay,
  setFrequencyDay,
  frequencyWithinADay,
  setFrequencyWithinADay,
  doze_1,
  setDoze_1,
  doze_2,
  setDoze_2,
  doze_3,
  setDoze_3,
  setDrugInfoRegistration,
  setProgressDrugInfo,
  setScheduleRegistration,
  progressSch,
  setProgressSch,
  setReminderRefistration,
}) {
  const [doze1open, setDoze1open] = useState(true);
  const [doze2open, setDoze2open] = useState(false);
  const [doze3open, setDoze3open] = useState(false);
  const [needEndDay, setNeedEndDay] = useState(false);

  const handleClickFrequency = (e) => {
    if (e === 1) {
      setFrequencyDay(1);
      setFrequencyWithinADay(1);
    }
    if (e === 2) {
      setFrequencyDay(1);
      setFrequencyWithinADay(2);
    }
    if (e === 3) {
      setFrequencyDay(1);
      setFrequencyWithinADay(3);
    }
    if (e === 4) {
      setFrequencyDay(2);
      setFrequencyWithinADay(1);
    }
  };

  const handleProgessAdd = () => {
    setProgressSch((progressSch) => progressSch + 1);
  };

  const handlePrevious = () => {
    if (progressSch === 1) {
      setScheduleRegistration(false);
      setDrugInfoRegistration(true);
      setProgressDrugInfo(4);
    }
    if (progressSch === 2) {
      if (doze1open) {
        setProgressSch((progressSch) => progressSch - 1);
      }
      if (doze2open) {
        setDoze1open(true);
        setDoze2open(false);
      }
      if (doze3open) {
        setDoze2open(true);
        setDoze3open(false);
      }
    }
    if (progressSch === 3) {
      if (frequencyWithinADay === 1) {
        setProgressSch((progressSch) => progressSch - 1);
        setDoze1open(true);
      }
      if (frequencyWithinADay === 2) {
        setProgressSch((progressSch) => progressSch - 1);
        setDoze2open(true);
      }
      if (frequencyWithinADay === 3) {
        setProgressSch((progressSch) => progressSch - 1);
        setDoze3open(true);
      }
    }
    if (progressSch === 4) {
      setProgressSch((progressSch) => progressSch - 1);
    }
    if (progressSch === 5) {
      setProgressSch((progressSch) => progressSch - 1);
    }
  };

  const handleClickDoze1 = () => {
    // Set-doze-1 will be here
    if (frequencyWithinADay === 1) {
      setProgressSch((progressSch) => progressSch + 1);
    } else {
      setDoze1open(false);
      setDoze2open(true);
    }
  };

  const handleClickDoze2 = () => {
    // Set-doze-2 will be here
    if (frequencyWithinADay === 2) {
      setProgressSch((progressSch) => progressSch + 1);
    } else {
      setDoze2open(false);
      setDoze3open(true);
    }
  };

  const handleClickDoze3 = () => {
    // Set-doze-3 will be here
    setDoze3open(false);
    setProgressSch((progressSch) => progressSch + 1);
  };

  const handleClickNeedEndDay = () => {
    if (needEndDay) {
      setProgressSch((progressSch) => progressSch + 1);
    }
    if (!needEndDay) {
      //If user answers 'no', set the day 3 yrs later
      setEndDate("2027/12/31");
      // Unmount this component
      setScheduleRegistration(false);
      setReminderRefistration(true);
    }
  };

  const handleClickEndday = () => {
    // Unmount this component
    setScheduleRegistration(false);
    setReminderRefistration(true);
  };

  return (
    <>
      <Header>
        <img
          src="/images/arrow_back_ios.png"
          className="absolute w-6 h-6 top-[50%] left-4 translate-y-[-55%] cursor-pointer"
          onClick={() => handlePrevious()}
        />
      </Header>
      <div className="schedule-wrapper">
        {progressSch === 1 ? (
          <div className="frequency">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">How often do you take it?</h2>
              <p className="text-base mt-3">Do you schedule it?</p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <div className="frequency mt-4">
                <div>
                  <input
                    type="radio"
                    value="1"
                    name="frequency"
                    id="once-a-day"
                    className="sr-only	peer"
                    onClick={(e) =>
                      handleClickFrequency(Number(e.target.value))
                    }
                  />
                  <label
                    htmlFor="once-a-day"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Once a day
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="2"
                    name="frequency"
                    id="twice-a-day"
                    className="sr-only	peer"
                    onClick={(e) =>
                      handleClickFrequency(Number(e.target.value))
                    }
                  />
                  <label
                    htmlFor="twice-a-day"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Twice a day
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="3"
                    name="frequency"
                    id="three-time-a-day"
                    className="sr-only	peer"
                    onClick={(e) =>
                      handleClickFrequency(Number(e.target.value))
                    }
                  />
                  <label
                    htmlFor="three-time-a-day"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    3 times a day
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value="4"
                    name="frequency"
                    id="every-other-day"
                    className="sr-only	peer"
                    onClick={(e) =>
                      handleClickFrequency(Number(e.target.value))
                    }
                  />
                  <label
                    htmlFor="every-other-day"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Every other day
                  </label>
                </div>
              </div>
              <div className="next mt-[224px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={(progressSch) => handleProgessAdd(progressSch)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {progressSch === 2 ? (
          <div className="doze">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">
                What time do you take the medication?
              </h2>
              <p className="text-base mt-3">
                Set the time you take the medication.{" "}
              </p>
            </div>
            {doze1open ? (
              <div id="doze_1" className="form mx-4 mt-[58px]">
                <input
                  type="text"
                  className="border-2 border-gray-400 px-4 py-2 rounded-[10px]"
                  placeholder="e.g.13:00"
                  onChange={(e) => setDoze_1(e.target.value)}
                />
                <div className="next_name mt-[224px]">
                  <button
                    className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                    onClick={handleClickDoze1}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {doze2open ? (
              <div id="doze_2" className="form mx-4 mt-[58px]">
                <input
                  type="text"
                  className="border-2 border-gray-400 px-4 py-2 rounded-[10px]"
                  placeholder="e.g.13:00"
                  onChange={(e) => setDoze_2(e.target.value)}
                />
                <div className="next_name mt-[224px]">
                  <button
                    className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                    onClick={handleClickDoze2}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {doze3open ? (
              <div id="doze_3" className="form mx-4 mt-[58px]">
                <input
                  type="text"
                  className="border-2 border-gray-400 px-4 py-2 rounded-[10px]"
                  placeholder="e.g.13:00"
                  onChange={(e) => setDoze_3(e.target.value)}
                />
                <div className="next_name mt-[224px]">
                  <button
                    className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                    onClick={handleClickDoze3}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {progressSch === 3 ? (
          <div className="startday">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">
                When do you need to take the next does?
              </h2>
              <p className="text-base mt-3">Do you schedule it? </p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <input
                type="date"
                className="border-2 border-gray-400 px-4 py-2 rounded-[10px]"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <div className="next_name mt-[224px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={(progressSch) => handleProgessAdd(progressSch)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {progressSch === 4 ? (
          <div className="endday-need">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">Do you have any end day? </h2>
              <p className="text-base mt-3">
                If you have any day you stop taking the medication.
              </p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <div className="name mt-4">
                <div>
                  <input
                    type="radio"
                    value={false}
                    name="setendday"
                    id="no"
                    className="sr-only	peer"
                    onClick={(e) => setNeedEndDay(false)}
                  />
                  <label
                    htmlFor="no"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    No
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    value={true}
                    name="setendday"
                    id="yes"
                    className="sr-only	peer"
                    onClick={(e) => setNeedEndDay(true)}
                  />
                  <label
                    htmlFor="yes"
                    className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                  >
                    Yes
                  </label>
                </div>
              </div>
              <div className="next_name mt-[224px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={handleClickNeedEndDay}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {progressSch === 5 ? (
          <div className="endday">
            <div className="text-wrapper mx-4 mt-10  text-primary-950">
              <h2 className="text-2xl font-bold">When is the end day?</h2>
              <p className="text-base mt-3">
                Pick the end day you want to stop taking the medication.
              </p>
            </div>
            <div className="form mx-4 mt-[58px]">
              <input
                type="date"
                className="border-2 border-gray-400 px-4 py-2 rounded-[10px]"
                onChange={(e) => setEndDate(e.target.value)}
              />
              <div className="next_name mt-[224px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={handleClickEndday}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function ReminderRegister({
  navigate,
  setRemaining,
  setShortageLimit,
  unit,
  frequencyDay,
  frequencyWithinADay,
  handleSaveDrug,
  setScheduleRegistration,
  setReminderRegistration,
  progressReminder,
  setProgressReminder,
  setIsAddMedicationOpen,
}) {
  console.log(currentURL);
  const [progress, setProgress] = useState(1);
  const [needReminder, setNeedReminder] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProgessAdd = () => {
    setProgressReminder((progressReminder) => progressReminder + 1);
  };

  const handlePrevious = () => {
    if (progressReminder === 1) {
      setScheduleRegistration(true);
      setReminderRegistration(false);
    }
    if (progressReminder === 2 || progressReminder === 3) {
      setProgressReminder((progressReminder) => progressReminder - 1);
    }
  };

  const handleSaveDrugData = () => {
    handleSaveDrug();
    setIsModalOpen(true);
  };

  const handleAddAnotherDrug = async () => {
    await setIsAddMedicationOpen(false);
    await setReminderRegistration(false);
    await setIsAddMedicationOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header>
        <img
          src="/images/arrow_back_ios.png"
          className="absolute w-6 h-6 top-[50%] left-4 translate-y-[-55%] cursor-pointer"
          onClick={() => handlePrevious()}
        />
      </Header>
      {progressReminder === 1 ? (
        <div className="need-reminder">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">
              Do you want refill reminders?{" "}
            </h2>
            <p className="text-base mt-3">
              When the medication quantity falls below the set value, a reminder
              will be sent.
            </p>
          </div>
          <div className="form mx-4 mt-[58px]">
            <div className="name mt-4">
              <div>
                <input
                  type="radio"
                  value={false}
                  name="setendday"
                  id="no"
                  className="sr-only	peer"
                  onClick={() => {
                    handleSaveDrug();
                    setIsModalOpen(true);
                  }}
                />
                <label
                  htmlFor="no"
                  className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                >
                  No
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  value={true}
                  name="setendday"
                  id="yes"
                  className="sr-only	peer"
                  onClick={() => setNeedReminder(true)}
                />
                <label
                  htmlFor="yes"
                  className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                >
                  Yes
                </label>
              </div>
            </div>
            <div className="next_name mt-[224px]">
              {needReminder ? (
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={(progressReminder) =>
                    handleProgessAdd(progressReminder)
                  }
                >
                  Next
                </button>
              ) : (
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  // Saving function here
                  onClick={() => {
                    handleSaveDrugData();
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {progressReminder === 2 ? (
        <div className="stock">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">
              How many {unit} do you have left?{" "}
            </h2>
            <p className="text-base mt-3">
              How many medications do you have left in your stock?
            </p>
          </div>
          <div className="form mx-4 mt-[58px]">
            <div className="name mt-4 flex flex-col gap-2">
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-[120px] h-14 pl-3 mt-2 self-center	"
                onChange={(e) => setRemaining(e.target.value)}
              />
              <label className="self-center">{unit}</label>
            </div>
            <div className="next_name mt-[388px]">
              <button
                className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                onClick={(progressReminder) =>
                  handleProgessAdd(progressReminder)
                }
              >
                {console.log(needReminder)}
                {needReminder ? "Next" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {progressReminder === 3 ? (
        <div className="threshold">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">
              When should we remind you to refill your medications?
            </h2>
            <p className="text-base mt-3">
              You take this medications{" "}
              {frequencyDay > 1
                ? "every 2 days"
                : frequencyWithinADay === 1
                ? "once a day"
                : frequencyWithinADay === 2
                ? "twice a day"
                : "3 times a day"}
              .
            </p>
          </div>
          <div className="form mx-4 mt-[29px]">
            <div className="name mt-4 flex flex-col gap-2">
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-[120px] h-14 pl-3 mt-2 self-center	"
                onChange={(e) => setShortageLimit(e.target.value)}
              />
              <label className="self-center">{unit} left</label>
            </div>
            <div className="next_name mt-[388px]">
              <button
                className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                // Saving function here
                onClick={() => {
                  setIsModalOpen(true);
                  handleSaveDrug();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* modal */}
      <>
        {isModalOpen ? (
          <>
            <div
              className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
              onClick={handleModalClose}
            ></div>
            <div className="px-4 bg-white rounded-t-2xl	 w-[calc(100%-32px)] h-[341px] fixed bottom-0 z-20">
              <img
                className="mt-[35px] w-[189px] mx-auto"
                src="/images/undraw_collecting_re_lp6p 1.png"
              />
              <h2 className="text-[18.98px] mt-6 font-semibold text-center text-gray-950">
                The medication Successfully Added!
              </h2>
              <div className="mt-6">
                <button
                  className="text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={() => handleAddAnotherDrug()}
                >
                  Add another medication
                </button>
                <p
                  className="text-base  w-full h-12 py-[14.5px] mb-[40px] cursor-pointer text-center"
                  onClick={() => {
                    setIsAddMedicationOpen(false);
                    if (currentURL === "/login") {
                      navigate("/");
                    }
                  }}
                >
                  I’m done
                </p>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    </>
  );
}

// function Timeslider() {
//   var settings = {
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 5,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     vertical: true,
//   };

//   var settingsampm = {
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     vertical: true,
//   };

//   const hrs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//   const minutes = [
//     "00",
//     "01",
//     "02",
//     "03",
//     "04",
//     "05",
//     "06",
//     "07",
//     "08",
//     "09",
//     10,
//     11,
//     12,
//     13,
//     14,
//     15,
//     16,
//     17,
//     18,
//     19,
//     20,
//     21,
//     22,
//     23,
//     24,
//     25,
//     26,
//     27,
//     28,
//     29,
//     30,
//     31,
//     32,
//     33,
//     34,
//     35,
//     36,
//     37,
//     38,
//     39,
//     40,
//     41,
//     42,
//     43,
//     44,
//     45,
//     46,
//     47,
//     48,
//     49,
//     50,
//     51,
//     52,
//     53,
//     54,
//     55,
//     56,
//     57,
//     58,
//     59,
//   ];

//   return (
//     <div>
//       {/* <div className="grid grid-cols-[40px_40px_40px]">
//         <Slider {...settings}>
//           {hrs.map((hour) => {
//             return (
//               <div>
//                 <h3>{hour}</h3>
//               </div>
//             );
//           })}
//         </Slider>
//         <Slider {...settings}>
//           {minutes.map((minute) => {
//             return (
//               <div className="bg-primary-700">
//                 <h3>{minute}</h3>
//               </div>
//             );
//           })}
//         </Slider>
//         <Slider {...settingsampm}>
//           <div>
//             <h3>am</h3>
//           </div>
//           <div>
//             <h3>pm</h3>
//           </div>
//         </Slider>
//       </div> */}

//       {/* scroll picker using vanilla css */}
//       <div className="scroll">
//         <div className="scrollable-content hours">
//           {hrs.map((hour) => {
//             return (
//               <div className="el">
//                 <h3>{hour}</h3>
//               </div>
//             );
//           })}
//         </div>
//         <div className="scrollable-content minutes">
//           {minutes.map((minute) => {
//             return (
//               <div className="el">
//                 <h3>{minute}</h3>
//               </div>
//             );
//           })}
//         </div>
//         <div className="ampm">
//           <div className="el">
//             <h3>am</h3>
//           </div>
//           <div className="el">
//             <h3>pm</h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
