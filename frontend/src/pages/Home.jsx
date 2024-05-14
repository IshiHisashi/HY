import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../authContext.js";
import AddDrug from "./AddDrug.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
  const userIdObj = useAuthContext();
  const userId = userIdObj.userId;
  const location = useLocation();
  const [logs, setLogs] = useState([]);
  const [logsDate, setLogsDate] = useState([]);
  const [defaultToday, setDefaultToday] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shortageDrugs, setShortageDrugs] = useState([]);
  const [isOpenShortageDrugs, setIsOpenShortageDrugs] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const daysDifference =
    (new Date(selectedDate.setHours(0, 0, 0, 0)) - today) / 1000 / 60 / 60 / 24;

  // for modal control
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Date search_+-3days from the basis date
  useEffect(() => {
    let daysArr = [];
    for (let i = 7; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i - 4));
      daysArr.push(date);
    }
    setDates(daysArr);
  }, []);

  const handleGotoToday = (targetDate) => {
    let daysArr = [];
    for (let i = 7; i > 0; i--) {
      const dateStr = targetDate.toDateString();
      const date = new Date(Date.parse(dateStr));
      const calcDate = date.setDate(date.getDate() + 1 - (i - 3));
      daysArr.push(new Date(calcDate));
    }
    setDates(daysArr);
    setSelectedDate(targetDate);
    setDefaultToday(true);
  };

  const handleNextDate = (targetDate) => {
    let daysArr = [];
    for (let i = 7; i > 0; i--) {
      const dateStr = targetDate.toDateString();
      const date = new Date(Date.parse(dateStr));
      const calcDate = date.setDate(date.getDate() + 1 - (i - 4));
      daysArr.push(new Date(calcDate));
    }
    setDates(daysArr);
  };

  const handlePreviousDate = (targetDate) => {
    let daysArr = [];
    for (let i = 7; i > 0; i--) {
      const dateStr = targetDate.toDateString();
      const date = new Date(Date.parse(dateStr));
      const calcDate = date.setDate(date.getDate() - 1 - (i - 4));
      daysArr.push(new Date(calcDate));
    }
    setDates(daysArr);
  };

  // Date search_corresponding logs are contained in the following array
  let logDateArr = [];

  // Read Drug Data
  useEffect(() => {
    console.log(userId);
    if (userId && userId !== "logout")
      axios
        .get(`https://hy-server.vercel.app/users/${userId}/drugs/shortage`)
        .then((res) => {
          setShortageDrugs(res.data.data.shortageDrugs);
        })
        .catch(setShortageDrugs(null));
  }, [userId]);

  // Read Log Data
  useEffect(() => {
    if (userId && userId !== "logout")
      axios
        .get(`https://hy-server.vercel.app/users/${userId}/logs/underuser`)
        .then((res) => {
          setLogs(res.data.data.logs);
        });
  }, [userId]);

  // Click a date card
  const handleClickDate = (date) => {
    setSelectedDate(date);
    logDateArr = [];
    logs.forEach((el) => {
      const planDate = new Date(el.plannedDateTime);
      if (planDate.toDateString() === date.toDateString()) {
        logDateArr.push(el);
      }
    });
    setLogsDate(logDateArr);
    setDefaultToday(false);
  };

  // Showup the modal for add medication
  const handleShowAddMedication = () => {
    setIsAddMedicationOpen(true);
  };

  const handleModalClose = () => {
    setIsAddMedicationOpen(false);
  };

  return (
    <div className="bg-primary-100 min-h-screen relative pb-[100px]">
      <header className="pt-2.5 relative h-[54px] bg-white">
        <h1 className="font-semibold text-lg text-center">Schedule</h1>
        <button
          className="text-[10px] text-gray-500 font-bold border-gray-400 rounded border-2  p-0.5 absolute top-2.5 right-4 "
          onClick={() => {
            handleGotoToday(today);
          }}
        >
          Today
        </button>
      </header>
      <div className="main mx-4">
        {!shortageDrugs?.length > 0 ? (
          ""
        ) : (
          <div className="mx-4 mt-2 bg-red-100 py-2.5 rounded	">
            <div className="grid grid-cols-[auto_1fr_auto]">
              <img
                className="ml-[17.33px] self-center"
                src="./images/Info Circle.svg"
              />
              <p className="text-[13.33px] ml-2">
                The medication supply is running low
              </p>
              {isOpenShortageDrugs ? (
                <img
                  className="mr-[17.33px] self-center cursor-pointer"
                  src="./images/arrow_for_ios.svg"
                  onClick={() => setIsOpenShortageDrugs(!isOpenShortageDrugs)}
                />
              ) : (
                <img
                  className="mr-[17.33px] self-center cursor-pointer"
                  src="./images/arrow_back_ios.svg"
                  onClick={() => setIsOpenShortageDrugs(!isOpenShortageDrugs)}
                />
              )}
            </div>
            {isOpenShortageDrugs ? (
              <ul className="list-disc box-border mt-3 ml-14 text-[13.33px] text-red-700">
                {shortageDrugs.map((shortagedrug) => (
                  <ShortageDrug
                    key={shortagedrug._id}
                    shortagedrug={shortagedrug}
                  />
                ))}
              </ul>
            ) : (
              ""
            )}
          </div>
        )}
        {/* Cards from here */}
        <div className="pt-[19px] pb-2 relative">
          <h2 className="text-gray-950 text-center font-medium	text-[16.88px]">
            {`${selectedDate.toDateString().split(" ")[1]} ${
              selectedDate.toDateString().split(" ")[3]
            }`}
          </h2>
          <div className="btns absolute top-[50%] right-4 flex gap-6">
            <img
              src="/images/arrow_pre_ios.svg"
              className="w-[8px] h-[14px] cursor-pointer"
              onClick={() => handlePreviousDate(dates[3])}
            />

            <img
              src="/images/arrow_next_ios.svg"
              className="w-[8px] h-[14px] cursor-pointer"
              onClick={() => handleNextDate(dates[3])}
            />
          </div>
        </div>
        <ul className="flex justify-between text-center">
          {dates.map((date) => (
            <div key={date.toDateString()}>
              <input
                type="radio"
                name="days"
                value={date.toDateString()}
                id={date.toDateString()}
                className={`sr-only peer `}
                onClick={() => handleClickDate(date)}
              />
              <div
                className={`w-10 h-[63px]   rounded-md pt-[11px]  ${
                  date.toDateString() === today.toDateString() && defaultToday
                    ? "bg-primary-700 text-gray-50"
                    : ""
                } ${
                  date.toDateString() === today.toDateString() && !defaultToday
                    ? "text-primary-700 border-2 border-primary-700  bg-white"
                    : ""
                } 
                ${
                  new Date(date.setHours(0, 0, 0, 0)) < today
                    ? "text-gray-400  bg-white"
                    : ""
                }
                ${
                  new Date(date.setHours(0, 0, 0, 0)) > today ? " bg-white" : ""
                } ${
                  !defaultToday
                    ? "peer-checked:bg-primary-700  peer-checked:text-gray-50"
                    : ""
                }`}
              >
                <label htmlFor={date.toDateString()} className="flex-col">
                  <span className="block font-medium text-[11px]">
                    {date.toDateString().split(" ")[0].toUpperCase()}
                  </span>
                  <span className="block font-semibold text-[18.98px]">
                    {date.getDate()}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </ul>
        <div className="datebox text-center pt-[25px] pb-4">
          <div className="text-gray-950 text-[11px]">
            {daysDifference > 2 || daysDifference < -2 ? (
              <div className="mt-[16.5px]"></div>
            ) : (
              ""
            )}
            {daysDifference === -2 ? "day before yesterday" : ""}
            {daysDifference === -1 ? "yesterday" : ""}
            {daysDifference === 0 ? "today" : ""}
            {daysDifference === 1 ? "tomorrow" : ""}
            {daysDifference === 2 ? "day after tomorrow" : ""}
          </div>
          <p className="text-primary-700 text-[13.33px]">{`${
            selectedDate.toDateString().split(" ")[1]
          } ${selectedDate.getDate()}, ${
            selectedDate.toDateString().split(" ")[3]
          }`}</p>
        </div>

        <ul className="flex flex-col gap-2">
          {logsDate.map((log) => (
            <Log
              log={log}
              key={log._id}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
        </ul>
        {/* <Link to="/signup">!! SignUp from here !!</Link>
        <br></br>
        <Link to="/login">!! Login from here !!</Link>
        <br></br>
        <Link to="/logout">!! Logout from here !!</Link>
        <br></br> */}
      </div>
      {/* </div> */}
      <div
        className="btn-add-med absolute bottom-[100px] right-4 flex w-14 h-14 bg-primary-700 rounded-[1000px] cursor-pointer"
        onClick={handleShowAddMedication}
      >
        <p className="self-center translate-y-[-5%]	 text-white font-semibokd text-[32px] rounded-[1px] mx-auto">
          +
        </p>
      </div>
      <Footer />
      {/* Modal for add medication */}
      {isAddMedicationOpen ? (
        <>
          <div
            className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
            onClick={handleModalClose}
          ></div>
          <div className="px-4 bg-white rounded-t-2xl h-[98vh] overflow-scroll	w-full fixed bottom-0 z-20">
            <AddDrug setIsAddMedicationOpen={setIsAddMedicationOpen} />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;

function Log({ log, isModalOpen, setIsModalOpen }) {
  const [openLog, setOpenLog] = useState("");
  // Click a log card
  const handleClickLog = () => {
    if (!takenTime) {
      setIsModalOpen(() => !isModalOpen);
    }
    if (!openLog) {
      setOpenLog(log.drugId.drugName);
    } else {
      setOpenLog("");
    }
  };

  // Modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setOpenLog(false);
  };

  const takenTime = log.takenDateTime;
  const date = new Date(log.plannedDateTime).toDateString();
  const time = new Date(log.plannedDateTime).toTimeString();
  const dateTaken = new Date(log.takenDateTime).toDateString();
  const hoursPlan = new Date(log.plannedDateTime).getHours();
  const hoursTaken = new Date(log.takenDateTime).getHours();
  const minutesPlan = time.split(":")[1];
  const minutestaken = new Date(log.takenDateTime).toTimeString().split(":")[1];
  const ampmPlan = hoursPlan < 12 ? "am" : "pm";
  const ampmTaken = hoursTaken < 12 ? "am" : "pm";
  const frequencyDay = log.drugId.takein.frequencyDay;
  const frequencyWithinADay = log.drugId.takein.frequencyWithinADay;

  return (
    <>
      <div
        className="w-full mx-4 bg-white p-4 rounded grid grid-cols-[1fr_auto]"
        onClick={handleClickLog}
      >
        <div className="drug-details">
          {takenTime ? (
            <p className="text-[11px] text-primary-700 font-medium">
              Taken at {hoursTaken} : {minutestaken} {ampmTaken},
              {dateTaken.split(" ")[1]} {dateTaken.split(" ")[2]}
            </p>
          ) : (
            <p className="text-[11px] text-gray-950 font-medium">
              {hoursPlan} : {minutesPlan} {ampmPlan}
            </p>
          )}

          <h4 className="text-[18.98px] text-gray-950 font-semibold">
            {log.drugId.drugName}
          </h4>
          {/* frequency */}
          <p className="text-[11px] text-gray-500 font-medium">
            {log.drugId.amount} {log.drugId.unit} /{" "}
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
        </div>
        <div className="check mx-4 flex">
          {takenTime ? (
            <img src="./images/checked.png" className="self-center" />
          ) : (
            <img src="./images/unchecked.png" className="self-center" />
          )}
        </div>
      </div>

      {isModalOpen ? (
        <>
          <div
            className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
            onClick={handleModalClose}
          ></div>
          {openLog === log.drugId.drugName && !takenTime ? (
            <LogDetails
              log={log}
              date={date}
              hoursPlan={hoursPlan}
              minutesPlan={minutesPlan}
              ampmPlan={ampmPlan}
              frequencyDay={frequencyDay}
              frequencyWithinADay={frequencyWithinADay}
              setIsModalOpen={setIsModalOpen}
              setOpenLog={setOpenLog}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
      {/* {openLog === log.drugId.drugName && !takenTime ? (
        <LogDetails
          log={log}
          date={date}
          hoursPlan={hoursPlan}
          minutesPlan={minutesPlan}
          ampmPlan={ampmPlan}
          frequencyDay={frequencyDay}
          frequencyWithinADay={frequencyWithinADay}
          setIsModalOpen={setIsModalOpen}
          setOpenLog={setOpenLog}
        />
      ) : (
        ""
      )} */}
    </>
  );
}

function LogDetails({
  log,
  date,
  hoursPlan,
  minutesPlan,
  ampmPlan,
  frequencyDay,
  frequencyWithinADay,
  setIsModalOpen,
  setOpenLog,
}) {
  const [take, setTake] = useState("");
  const [setTime, setSetTime] = useState("");

  // modal control
  const [isLogDetailsModalOpen, setIsLogDetailsModalOpen] = useState(false);

  const handleClickTake = () => {
    setIsLogDetailsModalOpen(() => !isLogDetailsModalOpen);
    if (!take) {
      setTake("take");
    } else {
      setTake("");
    }
  };

  const handleClickModalClose = () => {
    setIsModalOpen(false);
    setOpenLog(false);
    setIsLogDetailsModalOpen(false);
  };

  return (
    <>
      <div className="logDetailCard bg-white rounded-lg	z-20 fixed w-full top-1/4">
        <header className="relative card-header bg-primary-100 rounded-lg h-[52px]">
          <img
            src="/images/Info Square.png"
            className="absolute top-4 right-8"
          />
        </header>
        <div className="drug-info-wrapper mx-4 mt-8">
          <p className="text-primary-700 text-[11px] font-medium	">
            Scheduled for {hoursPlan} : {minutesPlan} {ampmPlan},{" "}
            {date.split(" ")[1]} {new Date(log.plannedDateTime).getDate()}
          </p>
          <h4 className="text-gray-950 text-[18.98px] font-semibold">
            {log.drugId.nickname ? log.drugId.nickname : log.drugId.drugName}
          </h4>
          <div className="text-gray-950 mt-4 grid grid-cols-[auto_1fr]">
            <p className="text-[11.85px] mr-1.5">Official Name: </p>
            <p className="text-[13.33px]">{log.drugId.drugName}</p>
            <p className="text-[11.85px]">Frequency: </p>
            <p className="text-[13.33px]">
              Take {log.drugId.amount} {log.drugId.unit} /{" "}
              {frequencyDay === 1
                ? "once"
                : frequencyDay === 2
                ? "twice"
                : frequencyDay === 3
                ? "3 times"
                : ""}{" "}
              in every{" "}
              {frequencyWithinADay === 1
                ? " day"
                : frequencyWithinADay > 1
                ? `${frequencyWithinADay} days`
                : ""}
            </p>
          </div>
        </div>
        <div className="btn-wrapper mx-4 mt-6 flex flex-col gap-2">
          <button
            className="w-full text-white font-bold text-[15px] bg-primary-700 rounded-[24px] h-[48px]"
            onClick={handleClickTake}
          >
            Take
          </button>
          <button className="w-full text-primary-700 border-2 border-primary-700 font-bold text-[15px] rounded-[24px] h-[48px]">
            Reschedule
          </button>
          <button className="w-full text-[15px] h-[48px]">Skip</button>
        </div>
      </div>
      {isLogDetailsModalOpen ? (
        <div
          className="modal fixed z-30 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
          onClick={handleClickModalClose}
        ></div>
      ) : (
        ""
      )}
      {take ? (
        <TakeLog
          log={log}
          setTake={setTake}
          setSetTime={setSetTime}
          handleClickTake={handleClickTake}
          isLogDetailsModalOpen={isLogDetailsModalOpen}
          setIsLogDetailsModalOpen={setIsLogDetailsModalOpen}
          setIsModalOpen={setIsModalOpen}
          setOpenLog={setOpenLog}
        />
      ) : (
        ""
      )}
      {setTime ? <SetTimeLog log={log} /> : ""}
    </>
  );
}

function TakeLog({
  log,
  setTake,
  setSetTime,
  handleClickTake,
  isLogDetailsModalOpen,
  setIsLogDetailsModalOpen,
  setIsModalOpen,
  setOpenLog,
}) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    axios
      .get(`https://hy-server.vercel.app/drugs/${log.drugId._id}`)
      .then((res) => {
        setRemaining(res.data.data.aDrug.remaining);
      });
  }, [remaining]);

  const UpdateRemining = () => {
    const newRemaining = Number(remaining) - log.drugId.amount;
    console.log(newRemaining);
    axios
      .patch(`https://hy-server.vercel.app/drugs/${log.drugId._id}`, {
        remaining: newRemaining,
      })
      .then(() => {
        setRemaining(newRemaining);
        console.log("success");
      });
  };

  const handleSubmitTakenTime = (time) => {
    //update takenDate to the log
    axios
      .patch(`https://hy-server.vercel.app/logs/${log._id}`, {
        takenDateTime: time,
      })
      .then(() => {
        axios
          .get(
            `https://hy-server.vercel.app/drugs/${log.drugId._id}/logs/untaken`
          )
          .then((res) => {
            console.log(res.data.data.logs.length);
            // Change the drug status to 'complete' if no log is left further.
            if (res.data.data.logs.length === 0) {
              axios
                .patch(`https://hy-server.vercel.app/drugs/${log.drugId._id}`, {
                  status: "complete",
                })
                .then(() => console.log("completed!"));
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
    //(record this moment as 'latestTakenDate' in the drug document | to be added but is this really needed??)****
    axios
      .patch(`https://hy-server.vercel.app/drugs/${log.drugId._id}`, {
        latestTakenDate: time,
      })
      .then(console.log(time));

    // Calculate remaining
    UpdateRemining();
    // Clear modals
    setIsModalOpen(false);
    setOpenLog(false);
    setIsLogDetailsModalOpen(false);
  };

  // **WIll implement later** //
  const handleSetTakenTime = () => {
    setTake("");
    setSetTime("select");
    // Calculate remaining
    UpdateRemining();
  };

  return (
    <>
      <div className="bg-white mx-[-16px] mt-4  px-4 pb-4 rounded-t-2xl	text-center fixed z-40 w-full bottom-0">
        <h4 className="pt-[28px] text-[18.98px] text-gray-950 font-bold">
          When did you take the med?
        </h4>
        <ul className="flex flex-col mt-6 gap-y-2.5">
          <button
            className="text-[16.88px] text-primary-700 font-semibold h-[52px] w-full border-2 border-gray-400 rounded-md	"
            onClick={() => handleSubmitTakenTime(new Date())}
          >
            Now
          </button>
          <button
            className="text-[16.88px] text-primary-700 font-semibold h-[52px] w-full border-2 border-gray-400 rounded-md	"
            onClick={() => handleSubmitTakenTime(log.plannedDateTime)}
          >
            On time
          </button>
          <button
            className="text-[16.88px] text-primary-700 font-semibold h-[52px] w-full border-2 border-gray-400 rounded-md	"
            onClick={() => handleSetTakenTime()}
          >
            Set Time
          </button>
          <button className="text-[15px]" onClick={handleClickTake}>
            Cancel
          </button>
        </ul>
      </div>
    </>
  );
}

function SetTimeLog({ log }) {
  const [actualTime, setActualTime] = useState("");
  const handleSubmitActualTime = () => {
    console.log(actualTime);
  };
  return (
    <>
      <label>Enter actual time you took the drug</label>
      <input onChange={(e) => setActualTime(e.target.value)} />
      <button onClick={() => handleSubmitActualTime()}>Submit</button>
    </>
  );
}

function ShortageDrug({ shortagedrug }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  {
    console.log(shortagedrug);
  }
  const handleClickDetail = () => {
    navigate(`/drugs/detail/${shortagedrug._id}`);
  };

  const handleClickDelete = () => {
    setIsOpen(false);
  };
  return (
    <>
      {isOpen ? (
        <li>
          {`${shortagedrug.drugName} remains only ${shortagedrug.remaining} ${shortagedrug.unit} `}
          <span
            className="	underline cursor-pointer	"
            onClick={() => handleClickDetail()}
          >
            Refill Now
          </span>
        </li>
      ) : (
        ""
      )}
    </>
  );
}
