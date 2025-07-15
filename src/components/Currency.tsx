import React, { useEffect, useState } from "react";
import { currencies } from "../../public/currency.ts";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import toast from "react-hot-toast";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";

function Currency() {
  const [amount, setAmount] = useState<number>();
  const [from, setFrom] = useState(" ");
  const [to, setTo] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedToName, setSelectedToName] = useState("");
  async function handleConvertCurrency() {
    if (!amount || !from || !to) {
      toast.error("please provide all the info");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
      );
      const data = await res.json();
      setResult(data);
      setShowResult(true);
      setLoading(false);
      console.log("data", data);
      setSelectedToName(currencies.filter((curr) => curr.code === to));
      if (data.message) {
        toast.error(data.message);
      }
    } catch (error) {
      setShowResult(false);
      console.log("error", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    console.log("result", result);
  }, [result]);
  const handleTochange = (e, value) => {
    setSelectedToName("");
    setTo(value);
    setShowResult(false);
  };
  const handleFromChange = (e, value) => {
    console.log(value);
    setSelectedToName("");
    setFrom(value);
    setShowResult(false);
  };
  const handleReverse = () => {
    setTo(from);
    setFrom(to);
    setShowResult(false);
  };

  useEffect(() => {
    console.log("show Result", setShowResult);
  }, [to, from]);

  return (
    <div className="mainContainer">
      <div className="inptmain">
        <div className="inpt">
          <h1>Currency Converter</h1>
          <label htmlFor="">Amount: </label>
          <input
            type="number"
            name="amount"
            id="amount"
            onChange={(e) => setAmount(+e.target.value)}
          />

          <label htmlFor="">From:</label>
          {/* --------------from------------ */}
          <Select
            defaultValue="select"
            onChange={handleFromChange}
            value={from}
            sx={{
              background: "transparent",
              "&:hover": { background: "transparent" },
            }}
          >
            {currencies.map((curr, index) => (
              <Option value={curr.code} key={index}>
                {curr.code}
              </Option>
            ))}
          </Select>

          {/* -----------------to------------- */}
          <label htmlFor="">To:</label>
          <Select
            defaultValue="select"
            onChange={handleTochange}
            value={to}
            sx={{
              background: "transparent",
              "&:hover": { background: "transparent" },
            }}
          >
            {currencies.map((curr, index) => (
              <Option
                value={curr.code}
                key={index}
                disabled={curr.code === from}
                sx={{
                  background: "black",
                  color: "gray",
                }}
              >
                {curr.code}
              </Option>
            ))}
          </Select>
          <button
            onClick={handleConvertCurrency}
            className="btn"
            disabled={loading}
          >
            {loading ? "loading.." : "convert"}
          </button>

          {showResult && (
            <div className="result">
              <h3 style={{ textAlign: "center" }}>
                {/* to is chnaged according to the currency user gonna choose 
              so this is how you can dynamically access the attribute */}
                {result && result.rates[to] && result.rates[to]}{" "}
                <span style={{ color: "#1d6962ff" }}>
                  {result ? selectedToName[0]?.name : ""}
                </span>
              </h3>
              {result && result.rates[to] && (
                <p style={{ textAlign: "center" }}>Amount Converted</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Currency;
