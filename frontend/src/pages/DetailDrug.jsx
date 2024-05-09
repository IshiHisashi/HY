import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusFlags from "../components/StatusFlags.jsx";

function ShowDrug() {
  const [drug, setDrug] = useState({});
  const [updateOpen, setUpdateOpen] = useState(false);
  const [addedAmount, setAddedAmount] = useState("");
  const [updateSignal, setUpdateSignal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // For revision drug data
  const [isDetailRevisionOpen, setIsDetailRevisionOpen] = useState(false);
  const [isRemainingRevisionOpen, setIsRemainingRevisionOpen] = useState(false);
  // for modal control (revision page)
  const [anyChange, setAnyChange] = useState(false);
  const [alertNonSave, setAlertNonSave] = useState(false);

  // for modal control (delete)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const status = drug.status;
  const typeOfDrug = drug.typeOfDrug;
  const frequencyDay = drug.takein?.frequencyDay;
  const frequencyWithinADay = drug.takein?.frequencyWithinADay;
  const [closestUntaken, setClosestUntaken] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5555/drugs/${id}`)
      .then((res) => {
        setDrug(res.data.data.aDrug);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateSignal]);

  const handleClickUpdate = () => {
    const newRemaining = Number(drug.remaining) + Number(addedAmount);
    console.log(newRemaining);
    setUpdateOpen(false);
    axios
      .patch(`http://localhost:5555/drugs/${id}`, {
        remaining: newRemaining,
      })
      .then((res) => {
        console.log("success update remining amount");
        setAddedAmount(0);
        setUpdateSignal(!updateSignal);
      })
      .catch((err) => console.log(err));
  };

  const getuntakenLog = () => {
    axios.get(`http://localhost:5555/drugs/${id}/logs/untaken`).then((res) => {
      const planedTimeArr = [];
      res.data.data.logs.forEach((el) => {
        if (new Date(el.plannedDateTime) > new Date())
          planedTimeArr.push(el.plannedDateTime);
      });
      if (planedTimeArr.length > 0) {
        const closestOne = planedTimeArr.reduce((acc, val) => {
          return acc < val ? acc : val;
        });
        console.log(closestOne);
        setClosestUntaken(closestOne);
      }
    });
  };

  getuntakenLog();

  const handleStopTakingDrug = () => {
    // Change drug status to 'completed'
    let deleteLogsArr = [];
    axios
      .patch(`http://localhost:5555/drugs/${id}`, {
        status: "stop taking",
      })
      .then((res) => console.log("success"));
    // Delete untaken Logs (*Wish to be replaced by simpler 'deleteMany function in mongoose')
    axios
      .get(`http://localhost:5555/drugs/${id}/logs/untaken`)
      .then((res) => {
        console.log(res.data.data.logs);
        res.data.data.logs.forEach((log) => {
          const logId = log._id;
          deleteLogsArr.push(logId);
        });
        return deleteLogsArr;
      })
      .then((deleteId) => {
        console.log(deleteId);
        deleteId.forEach((logId) => {
          axios
            .delete(`http://localhost:5555/logs/${logId}`)
            .then(() => console.log("success"));
        });
      });
  };

  const handleDeleteDrug = () => {
    let deleteLogsArr = [];
    // Delete All the Logs (*Wish to be replaced by simpler 'deleteMany function in mongoose')
    axios
      .get(`http://localhost:5555/drugs/${id}/logs`)
      .then((res) => {
        console.log(res.data.data.logs);
        res.data.data.logs.forEach((log) => {
          const logId = log._id;
          deleteLogsArr.push(logId);
        });
        return deleteLogsArr;
      })
      .then((deleteId) => {
        console.log(deleteId);
        deleteId.forEach((logId) => {
          axios.delete(`http://localhost:5555/logs/${logId}`).then(() => {
            console.log("success");
          });
        });
      });
    // Delete the drug
    axios
      .delete(`http://localhost:5555/drugs/${id}`)
      .then(() => console.log("deleted sccessfully"))
      .then(navigate("/drugs/view"));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handelSaveChanges = (data) => {
    axios
      .patch(`http://localhost:5555/drugs/${drug._id}`, data)
      .then(() => console.log("success!!"));
  };

  const handleAlartNonSave = () => {
    setAlertNonSave(true);
  };
  const handleAlertClose = () => {
    setAlertNonSave(false);
  };

  return (
    <div>
      {!isDetailRevisionOpen && !isRemainingRevisionOpen ? (
        <div className="detail-wrapper">
          <header className=" mx-4 pt-2.5 relative h-[54px] bg-white">
            {/* <img src="./images/arrow_back_ios .png" /> */}
            <Link to="/drugs/view">
              <img src="/images/arrow_back_ios.png" className="w-6" />
            </Link>
          </header>
          <div className="mx-4 ">
            <p className="text-[21.36px] text-gray-950 font-semibold">
              {drug.nickname ? drug.nickname : drug.drugName}
            </p>
            <StatusFlags drug={drug} />
            <div className="medication-details mt-4">
              <div className="flex justify-between">
                <h2 className="text-[16.88px] text-primary-700 font-medium	">
                  Medication Details
                </h2>
                <img
                  className="cursor-pointer"
                  src="/images/Edit.svg"
                  onClick={() => setIsDetailRevisionOpen(true)}
                />
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-y-2 gap-x-3 text-gray-950 mt-2">
                <p className="text-[13.33px]">Official Name</p>
                <p className="text-base">
                  {drug.companyName ? drug.drugName : "-"}
                </p>
                <p className="text-[13.33px]">Company</p>
                <p className="text-base">{drug.companyName || "-"}</p>
                <p className="text-[13.33px]">Form</p>
                <p className="text-base">{drug.formOfDrug || "-"}</p>
                <p className="text-[13.33px]"> Strength</p>
                <p className="text-base">
                  {drug.strength || "-"} {drug.strengthUnit || ""}
                </p>
                <p className="text-[13.33px]">Volume</p>
                <p className="text-base">
                  {drug.amount || "-"} {drug.unit || ""}/ per time
                </p>
              </div>
            </div>
            <div className="schedule mt-4">
              <h2 className="text-[16.88px] text-primary-700 font-medium	">
                Schedule
              </h2>
              <div className="grid grid-cols-[90px_1fr] gap-y-2 gap-x-3 text-gray-950 mt-2">
                <p className="text-[13.33px]">Frequency</p>
                <p className="text-base">
                  {frequencyDay === 1
                    ? "Once"
                    : frequencyDay === 2
                    ? "Twice"
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
                <p className="text-[13.33px]">Doze 1</p>
                <p className="text-base">{drug.takein?.doze_1}</p>
                <p className="text-[13.33px]">Doze 2</p>
                <p className="text-base">{drug.takein?.doze_2 || "-"}</p>
                <p className="text-[13.33px]">Doze 3</p>
                <p className="text-base">{drug.takein?.doze_3 || "-"}</p>
                <p className="text-[13.33px]"> Last Took</p>
                <p className="text-base">
                  {drug.lastTakenDate || "Untaken yet"}
                </p>
                <p className="text-[13.33px]">Next Take</p>
                <p className="text-base">
                  {closestUntaken
                    ? new Date(closestUntaken).toLocaleString()
                    : "No upcoming take"}
                </p>
                <p className="text-[13.33px]">Start Day</p>
                <p className="text-base">
                  {new Date(drug.takein?.startDate).toLocaleString()}
                </p>
                <p className="text-[13.33px]">End Day</p>
                <p className="text-base">
                  {new Date(drug.takein?.endDate).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="remaining-medication mt-4">
              <div className="flex justify-between">
                <h2 className="text-[16.88px] text-primary-700 font-medium	">
                  Remaining Medication
                </h2>
                <img
                  className="cursor-pointer"
                  src="/images/Edit.svg"
                  onClick={() => setIsRemainingRevisionOpen(true)}
                />
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-y-2 gap-x-3 text-gray-950 mt-2">
                <p className="text-[13.33px]">Remaining</p>
                <p className="text-base">
                  {drug.remaining ? `${drug.remaining} ${drug.unit} left` : "-"}
                </p>
                <p className="text-[13.33px]">Reminder</p>
                <p className="text-base">
                  {drug.shortageLimit
                    ? ` When it remains less than ${drug.shortageLimit} ${drug.unit}`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="btn mt-12">
              <button
                className="w-full h-[48px] border-2 border-red-700 rounded-[24px] text-red-700 text-base font-semibold"
                onClick={() => handleStopTakingDrug()}
              >
                Stop Taking
              </button>
              <p
                className="text-base text-gray-800 text-center cursor-pointer my-4"
                // onClick={() => handleDeleteDrug()}
                onClick={() => setIsModalOpen(true)}
              >
                Delete
              </p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* For Medication Details | Revision */}
      {isDetailRevisionOpen ? (
        <DetailRevise
          drug={drug}
          setIsDetailRevisionOpen={setIsDetailRevisionOpen}
          handelSaveChanges={handelSaveChanges}
          anyChange={anyChange}
          setAnyChange={setAnyChange}
          alertNonSave={alertNonSave}
          setAlertNonSave={setAlertNonSave}
          handleAlartNonSave={handleAlartNonSave}
          handleAlertClose={handleAlertClose}
        />
      ) : (
        ""
      )}
      {/* For Remaining | Revision */}
      {isRemainingRevisionOpen ? (
        <RemainingRevise
          drug={drug}
          setIsRemainingRevisionOpen={setIsRemainingRevisionOpen}
          handelSaveChanges={handelSaveChanges}
          anyChange={anyChange}
          setAnyChange={setAnyChange}
          alertNonSave={alertNonSave}
          setAlertNonSave={setAlertNonSave}
          handleAlartNonSave={handleAlartNonSave}
          handleAlertClose={handleAlertClose}
        />
      ) : (
        ""
      )}
      {/* Modal for delete confirmation */}
      {isModalOpen ? (
        <>
          <div
            className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
            onClick={handleModalClose}
          ></div>
          {/* pop-up box */}
          <div className="delete-confirmation mx-4  px-4 bg-white rounded-[10px] w-[calc(100%-2rem)] h-[341px] fixed top-[50%] translate-y-[-50%] z-20">
            <div className="text text-primary-950 text-center  mt-[38px] mb-[32px] flex flex-col gap-2">
              <h2 className="text-[18.98px] font-semibold">
                Delete Extra Strength Tylenol at Night?{" "}
              </h2>
              <p className="text-base mt-3">
                Deleting this medication will stop any future notifications.
              </p>
            </div>
            <div className="btn-container flex flex-col gap-2">
              <button
                className="w-full h-[52px] text-[16.88px] border-2 border-gray-400 rounded-[6px] font-medium text-primary-700"
                onClick={handleStopTakingDrug}
              >
                Save History
              </button>
              <button
                className="w-full h-[52px] text-[16.88px] border-2 border-gray-400 rounded-[6px] font-medium text-primary-700"
                onClick={handleDeleteDrug}
              >
                Delete History
              </button>
            </div>
            <p
              className="text-base text-center text-gray-800 py-[14.5px] cursor-pointer"
              onClick={handleModalClose}
            >
              Cancel
            </p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ShowDrug;

function DetailRevise({
  drug,
  setIsDetailRevisionOpen,
  handelSaveChanges,
  anyChange,
  setAnyChange,
  alertNonSave,
  setAlertNonSave,
  handleAlartNonSave,
  handleAlertClose,
}) {
  const [nickname, setnickName] = useState(drug.nickname);
  const [type, setType] = useState(drug.typeOfDrug);
  const [form, setForm] = useState(drug.formOfDrug);
  const [str, setStr] = useState(drug.strength);
  const [strUnit, setStrUnit] = useState(drug.strengthUnit);
  const [amt, setAmt] = useState(drug.amount);
  const [amtUnit, setAmtUnit] = useState(drug.unit);

  const handleQuitAnyway = () => {
    // reset input values
    setnickName(drug.nickname);
    setType(drug.typeOfDrug);
    setForm(drug.formOfDrug);
    setStr(drug.strength);
    setStrUnit(drug.strengthUnit);
    setAmt(drug.amount);
    setAmtUnit(drug.unit);
    // reset anychange flug
    setAnyChange(false);
    // close the screen for change
    setAlertNonSave(false);
    setIsDetailRevisionOpen(false);
  };

  return (
    <>
      <div className=" min-h-screen">
        <header className="pt-2.5 relative h-[54px] bg-white">
          <h1 className="ont-semibold text-lg text-center font-bold">
            Edit Medication Details
          </h1>
          <img
            src="/images/arrow_back_ios.png"
            className="w-6 absolute top-3 left-4 cursor-pointer"
            onClick={() => {
              !anyChange
                ? setIsDetailRevisionOpen(false)
                : setAlertNonSave(true);
            }}
          />
        </header>
        <div className="form mx-4 mt-[58px]">
          <div className="drugName mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Medication Name</label>
            <input
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={nickname}
              onChange={(e) => {
                setnickName(e.target.nickname);
                setAnyChange(true);
              }}
            />
          </div>
          <div className="drugType mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Type</label>
            <select
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setAnyChange(true);
              }}
            >
              <option value="prescription">Prescription</option>
              <option value="over-the-counter">
                Over-the-counter (OTC) / Non-prescription
              </option>
              <option value="suppliment">Suppliment</option>
            </select>
          </div>
          <div className="drugForm mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Form</label>
            <select
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
              value={form}
              onChange={(e) => {
                setForm(e.target.value);
                setAnyChange(true);
              }}
            >
              <option value="pill">Pill</option>
              <option value="injection">Injection</option>
              <option value="solution">Solution (Liquid)</option>
              <option value="drops">Drops</option>
              <option value="inhaler">Inhaler</option>
              <option value="powder">Powder</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="strength-container flex gap-4">
            <div className="strength mt-4 flex flex-col gap-2 w-full">
              <label className="text-[11px] text-gray-700">Strength</label>
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
                value={str}
                onChange={(e) => {
                  setStr(e.target.value);
                  setAnyChange(true);
                }}
              />
            </div>
            <div className="strengthUnit mt-4 flex flex-col gap-2 w-full">
              <label className="text-[11px] text-gray-700">Unit</label>
              <select
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
                value={strUnit}
                onChange={(e) => {
                  setStrUnit(e.target.value);
                  setAnyChange(true);
                }}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="IU">IU</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
          <div className="amount-container flex gap-4">
            <div className="amount mt-4 flex flex-col gap-2 w-full ">
              <label className="text-[11px] text-gray-700">Quantity</label>
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
                value={amt}
                onChange={(e) => {
                  setAmt(e.target.value);
                  setAnyChange(true);
                }}
              />
            </div>
            <div className="unit mt-4 flex flex-col gap-2 w-full">
              <label className="text-[11px] text-gray-700">Unit</label>
              <select
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center  text-gray-700 text-base"
                value={amtUnit}
                onChange={(e) => {
                  setAmtUnit(e.target.value);
                  setAnyChange(true);
                }}
              >
                <option value="pill">Pill</option>
                <option value="piece">Piece</option>
                <option value="ml">ml</option>
                <option value="mg">mg</option>
                <option value="unit">unit</option>
                <option value="does">does</option>
                <option value="teaspoon">teaspoon</option>
              </select>
            </div>
          </div>

          <div className="next_name mt-[162px]">
            {anyChange ? (
              <button
                className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                onClick={() => {
                  handelSaveChanges({
                    nickname: nickname,
                    typeOfDrug: type,
                    formOfDrug: form,
                    strength: str,
                    strengthUnit: strUnit,
                    amount: amt,
                    unit: amtUnit,
                  });
                  setIsDetailRevisionOpen();
                }}
              >
                Save
              </button>
            ) : (
              <button className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12 opacity-40">
                Save
              </button>
            )}
          </div>
        </div>
        {alertNonSave ? (
          <>
            <div
              className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
              onClick={handleAlertClose}
            ></div>
            <div className="delete-confirmation mx-4  px-4 bg-white rounded-[10px] w-[calc(100%-2rem)] h-[370px] fixed top-[50%] translate-y-[-50%] z-20">
              <img
                src="/images/undraw_windy_day_x-63-l 1.png"
                className="mx-auto mt-10 w-[143px] h-[107px]"
              />
              <div className="text text-primary-950 text-center  mt-[28px] mb-[26px] flex flex-col">
                <h2 className="text-[18.98px] font-semibold">
                  The medication wasn’t saved.
                </h2>
                <p className="text-base mt-3">Are you sure you want to quit?</p>
              </div>

              <button
                className="w-full h-[48px] text-base font-semibold rounded-[24px] text-white bg-primary-700"
                onClick={() => setAlertNonSave(false)}
              >
                Continue Editing{" "}
              </button>
              <p
                className="text-base text-center text-gray-800 py-[14.5px] cursor-pointer"
                onClick={() => handleQuitAnyway()}
              >
                Quit anyway
              </p>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function RemainingRevise({
  drug,
  setIsRemainingRevisionOpen,
  handelSaveChanges,
  anyChange,
  setAnyChange,
  alertNonSave,
  setAlertNonSave,
  handleAlartNonSave,
  handleAlertClose,
}) {
  const [rem, setRem] = useState("");
  const [shortagelim, setShortagelim] = useState(drug.shortageLimit);

  const handleQuitAnyway = () => {
    // reset input values
    setRem("");
    setShortagelim(drug.shortageLimit);
    // reset anychange flug
    setAnyChange(false);
    // close the screen for change
    setAlertNonSave(false);
    setIsRemainingRevisionOpen(false);
  };

  return (
    <>
      <div className="min-h-screen">
        <header className="pt-2.5 relative h-[54px] bg-white">
          <h1 className="ont-semibold text-lg text-center font-bold">
            Medication List
          </h1>
          {
            <img
              src="/images/arrow_back_ios.png"
              className="w-6 absolute top-3 left-4 cursor-pointer"
              onClick={() => {
                !anyChange
                  ? setIsRemainingRevisionOpen(false)
                  : setAlertNonSave(true);
              }}
            />
          }
        </header>
        <div className="form mx-4 mt-[58px]">
          <div className="remaining mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700 font-medium">
              Add up medication{" "}
              <span className="text-[11px] text-primary-700 font-medium">
                {" "}
                (Currently {drug.remaining} {drug.unit} remain)
              </span>
            </label>
            <div className="input-wrapper grid grid-cols-[1fr_76px]">
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base "
                value={rem}
                onChange={(e) => {
                  setRem(e.target.value);
                  setAnyChange(true);
                }}
              />
              <p className="self-end ml-2 text-base text-gray-950">
                {drug.unit}
              </p>
            </div>
          </div>
          <div className="shortageLimit mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700 font-medium">
              Remind once medication remian
            </label>
            <div className="input-wrapper grid grid-cols-[1fr_76px]">
              <input
                type="text"
                className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
                value={shortagelim}
                onChange={(e) => {
                  setShortagelim(e.target.value);
                  setAnyChange(true);
                }}
              />
              <p className="self-end ml-2 text-base text-gray-950">
                {drug.unit} left
              </p>
            </div>
          </div>

          <div className="next_name mt-[430px]">
            {anyChange ? (
              <button
                className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                onClick={() => {
                  handelSaveChanges({
                    remaining: rem,
                    shortageLimit: shortagelim,
                  });
                  setIsRemainingRevisionOpen(false);
                }}
              >
                Save
              </button>
            ) : (
              <button className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12 opacity-40">
                Save
              </button>
            )}
          </div>
          {/* modal for non-save alert */}
        </div>
        {alertNonSave ? (
          <>
            <div
              className="modal fixed z-10 top-0 left-0 bg-gray-800 opacity-80 w-full h-[120%]"
              onClick={handleAlertClose}
            ></div>
            <div className="delete-confirmation mx-4  px-4 bg-white rounded-[10px] w-[calc(100%-2rem)] h-[370px] fixed top-[50%] translate-y-[-50%] z-20">
              <img
                src="/images/undraw_windy_day_x-63-l 1.png"
                className="mx-auto mt-10 w-[143px] h-[107px]"
              />
              <div className="text text-primary-950 text-center  mt-[28px] mb-[26px] flex flex-col">
                <h2 className="text-[18.98px] font-semibold">
                  The medication wasn’t saved.
                </h2>
                <p className="text-base mt-3">Are you sure you want to quit?</p>
              </div>

              <button
                className="w-full h-[48px] text-base font-semibold rounded-[24px] text-white bg-primary-700"
                onClick={() => setAlertNonSave(false)}
              >
                Continue Editing{" "}
              </button>
              <p
                className="text-base text-center text-gray-800 py-[14.5px] cursor-pointer"
                onClick={() => handleQuitAnyway()}
              >
                Quit anyway
              </p>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
