import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditDrug() {
  const [drugName, setDrugName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [formOfDrug, setFormOfDrug] = useState("");
  const [typeOfDrug, setTypeOfDrug] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequencyDay, setFrequencyDay] = useState("");
  const [frequencyWithinADay, setFrequencyWithinADay] = useState("");
  const [doze_1, setDoze_1] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [remaining, setRemaining] = useState("");
  const [shortageLimit, setShortageLimit] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("taking");

  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    axios.get(`https://server.pillbook-hy.com/drugs/${id}`).then((res) => {
      const drugData = res.data.data.aDrug;
      console.log(drugData);
      setDrugName(drugData.drugName);
      setCompanyName(drugData.companyName);
      setFormOfDrug(drugData.formOfDrug);
      setTypeOfDrug(drugData.typeOfDrug);
      setStartDate(drugData.takein.startDate);
      setEndDate(drugData.takein.endDate);
      setFrequencyDay(drugData.takein.frequencyDay);
      setFrequencyWithinADay(drugData.takein?.frequencyWithinADay);
      setDoze_1(drugData.takein?.doze_1);
      setAmount(drugData.amount);
      setUnit(drugData.unit);
      setRemaining(drugData.remaining);
      setShortageLimit(drugData.shortageLimit);
      setDescription(drugData.description);
      setStatus(drugData.status);
    });
  }, []);

  const handleEditDrug = () => {
    const data = {
      userId: "66245b3e7457e717dc5a8294",
      drugName,
      companyName,
      formOfDrug,
      typeOfDrug,
      takein: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        frequencyDay: Number(frequencyDay),
        frequencyWithinADay: Number(frequencyWithinADay),
        doze_1,
      },
      amount,
      unit,
      remaining,
      shortageLimit,
      description,
      status,
    };
    axios
      .patch(`https://server.pillbook-hy.com/drugs/${id}`, data)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert("an error happend. Please chack console");
        console.log(err);
      });
  };

  return (
    <div>
      <h2>This is Edit Drug</h2>
      <Link to="/">Back to Home</Link>
      <div>
        <label htmlFor="">Name of Drug</label>
        <input
          type="text"
          value={drugName}
          onChange={(e) => setDrugName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Name of production company</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Form of Drug</label>
        <select
          name=""
          id=""
          value={formOfDrug}
          onChange={(e) => setFormOfDrug(e.target.value)}
        >
          <option value="pill">pill</option>
          <option value="liquid">liquid</option>
          <option value="powder">powder</option>
        </select>
      </div>
      <div>
        <label htmlFor="">Type of Drug</label>
        <select
          name=""
          id=""
          value={typeOfDrug}
          onChange={(e) => setTypeOfDrug(e.target.value)}
        >
          <option value="over-the-counter">over-the-counter</option>
          <option value="prescription">prescription</option>
          <option value="suppliment">suppliment</option>
        </select>
      </div>
      <div>
        <label htmlFor="">Start Date</label>
        <input
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">End Date</label>
        <input
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Frequency / Day</label>
        <input
          type="text"
          value={frequencyDay}
          onChange={(e) => setFrequencyDay(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Frequency / In a day</label>
        <input
          type="text"
          value={frequencyWithinADay}
          onChange={(e) => setFrequencyWithinADay(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Timing of 1st doze</label>
        <input
          type="text"
          value={doze_1}
          onChange={(e) => setDoze_1(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Amount per doze</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Unit of drug</label>
        <select
          name=""
          id=""
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="pills">pills</option>
          <option value="mg">mg</option>
          <option value="ml">ml</option>
        </select>
      </div>
      <div>
        <label htmlFor="">Remaining amount</label>
        <input
          type="text"
          value={remaining}
          onChange={(e) => setRemaining(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Remaining alert threshold</label>
        <input
          type="text"
          value={shortageLimit}
          onChange={(e) => setShortageLimit(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Any remark??</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button onClick={handleEditDrug}>Submit</button>
    </div>
  );
}

export default EditDrug;
