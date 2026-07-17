import { useEffect, useState } from "react";
import "./App.css";
import Data from "./data/data";
import { MAIN_DATA_PASSWORD, NOTA_DATA_PASSWORD } from "./data/passwords";

function App() {
  const [votes, setVotes] = useState(5);
  const [voterVotes, setVoterVotes] = useState([]);
  const [message, setMessage] = useState({ label: "", status: "" });
  const [isNotaClicked, setIsNotaClicked] = useState(false);
  const [parties, setParties] = useState([]);
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isShowingCount, setIsShowingCount] = useState(false);
  const [placeholder, setPlaceholder] = useState("Password");
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [notaCount, setNotaCount] = useState(0);
  const [isResettingStorageData, setIsResettingStorageData] = useState(false);
  useEffect(() => {
    const storedData = localStorage.getItem("mdrs-voting-app-48ge98ighe");
    if (storedData) {
      setNotaCount(storedData);
    } else {
      localStorage.setItem("mdrs-voting-app-48ge98ighe", 0);
      setNotaCount(0);
    }
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem("mdrs-voting-app-er09herv9hwrj");
    if (storedData) {
      setParties(JSON.parse(storedData));
    } else {
      localStorage.setItem(
        "mdrs-voting-app-er09herv9hwrj",
        JSON.stringify(Data),
      );
      setParties(Data);
    }
  }, []);
  const AddThisParty = (party) => {
    if (votes > 0) {
      const isAlreadyAdded = voterVotes.some((p) => p.name === party.name);
      if (!isAlreadyAdded) {
        setVoterVotes((prev) => [...prev, { ...party, voteCount: 1 }]);
        setVotes((prev) => prev - 1);
      } else {
        setMessage({
          label: "Already voted for them!👍🏻",
          status: "warning",
        });
        setTimeout(() => {
          setMessage({
            label: "",
            status: "",
          });
        }, 2000);
        return;
      }
    } else {
      setMessage({
        label: "Voting done... next please!😌",
        status: "success",
      });
    }
  };
  useEffect(() => {
    if (votes === 0 && voterVotes.length > 0) {
      const storedData =
        JSON.parse(localStorage.getItem("mdrs-voting-app-er09herv9hwrj")) ||
        Data;
      const updatedMainData = storedData.map((mainParty) => {
        const match = voterVotes.find((v) => v.name === mainParty.name);
        return match
          ? {
              ...mainParty,
              votes: Number(mainParty.votes || 0) + match.voteCount,
            }
          : mainParty;
      });
      localStorage.setItem(
        "mdrs-voting-app-er09herv9hwrj",
        JSON.stringify(updatedMainData),
      );
      setParties(updatedMainData);
      setMessage({
        label: "Voting done... next please!😌",
        status: "success",
      });
    }
  }, [votes]);
  const onNotaSelect = () => {
    setVotes(0);
    setMessage({
      label: "Nota selected, your votes won't be counted... next please!😌",
      status: "warning",
    });
    setVoterVotes([]);
    setIsNotaClicked(true);
    const storedCount = localStorage.getItem("mdrs-voting-app-48ge98ighe");
    if (storedCount) {
      localStorage.setItem(
        "mdrs-voting-app-48ge98ighe",
        Number(storedCount) + 1,
      );
      setNotaCount(Number(storedCount) + 1);
    } else {
      localStorage.setItem("mdrs-voting-app-48ge98ighe", 1);
      setNotaCount(1);
    }
  };
  const reset = () => {
    setVotes(5);
    setMessage({
      label: "New data generated! start voting😌",
      status: "success",
    });
    setPassword("");
    setTimeout(() => {
      setMessage({
        label: "",
        status: "",
      });
    }, 3000);
    setVoterVotes([]);
    setIsNotaClicked(false);
    setIsResetting(false);
  };
  useEffect(() => {
    if (password === MAIN_DATA_PASSWORD && isResetting) {
      reset();
    }
    if (password === MAIN_DATA_PASSWORD && isShowingCount) {
      setIsShowingResults(true);
    }
    if (password === NOTA_DATA_PASSWORD && isResettingStorageData) {
      localStorage.removeItem("mdrs-voting-app-er09herv9hwrj");
      localStorage.removeItem("mdrs-voting-app-48ge98ighe");
      const havingMainData = localStorage.removeItem(
        "mdrs-voting-app-er09herv9hwrj",
      );
      const havingNotaData = localStorage.removeItem(
        "mdrs-voting-app-48ge98ighe",
      );
      if (!havingMainData && !havingNotaData) {
        setPassword("");
        setIsResettingStorageData(false);
        setMessage({
          label: "Votes Data Reset done!🥳",
          status: "success",
        });
        setTimeout(() => {
          setMessage({
            label: "",
            status: "",
          });
        }, 3000);
      } else {
        setPassword("");
        setIsResettingStorageData(false);
        setMessage({
          label: "Votes Data Reset failed!😭",
          status: "error",
        });
        setTimeout(() => {
          setMessage({
            label: "",
            status: "",
          });
        }, 3000);
      }
    }
  }, [password]);
  return (
    <main className="app relative flex min-h-screen w-full flex-col items-center justify-start bg-gray-200 px-4 pb-4 select-none">
      <h3 className="pt-10 pb-5 text-center font-bold text-gray-700 uppercase">
        Morarji Desai Residential School
      </h3>
      <h4 className="text-center">Adakamaranahalli, Bangalore</h4>
      <p className="mb-4 text-center uppercase">
        School Parliament Election: 2026-27
      </p>
      <div className="sticky top-24 z-50 mb-4 flex h-fit w-fit flex-col items-center justify-start gap-4">
        <div className="flex h-fit w-fit items-center justify-center gap-4">
          {isShowingResults ? (
            <p className="rounded-xl bg-orange-200/90 px-4 py-3 font-bold text-orange-600 backdrop-blur-xl">
              Results
            </p>
          ) : (
            <p
              className={`bg-linear-to-br from-gray-200/90 to-gray-400/90 px-4 py-3 backdrop-blur-xl ${votes === 0 ? "text-green-600" : "text-gray-800"} rounded-xl font-bold`}
            >
              Votes: {votes}
            </p>
          )}
          {votes === 0 && (
            <>
              {!isShowingResults && (
                <button
                  onClick={() => {
                    setIsResetting((prev) => !prev);
                    setIsShowingCount(false);
                    setIsResettingStorageData(false);
                  }}
                  className="primary-btn red h-full!"
                >
                  Reset
                </button>
              )}
            </>
          )}
          <button
            onClick={() => {
              setIsShowingCount((prev) => !prev);
              setIsResetting(false);
              setIsResettingStorageData(false);
            }}
            className="primary-btn orange h-full!"
          >
            Counts
          </button>
          {!isShowingResults && <button
            onClick={() => {
              setIsResettingStorageData((prev) => !prev);
              setIsResetting(false);
              setIsShowingCount(false);
            }}
            className="primary-btn red h-full!"
          >
            Reset Storage
          </button>}
          {isShowingResults && (
            <button
              onClick={() => {
                setIsShowingCount(false);
                setIsShowingResults(false);
                setPassword("");
              }}
              className="primary-btn red"
            >
              Close
            </button>
          )}
        </div>
        {(isResetting || isShowingCount || isResettingStorageData) &&
          !isShowingResults && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={placeholder}
            />
          )}
      </div>

      {isShowingResults ? (
        <ul className="flex h-fit w-full flex-col items-center justify-start gap-4 rounded-3xl bg-gray-300 p-4">
          {parties.map((party, idx) => (
            <li
              key={idx}
              className="flex h-fit w-full items-center justify-start gap-4 rounded-2xl"
            >
              <p className="font-bold">{idx + 1}.</p>
              <div className="flex flex-col items-center justify-start">
                <div className="flex max-h-18 min-h-18 max-w-18 min-w-18 bg-green-500">
                  <img
                    src="/logo.jpg"
                    alt={party.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="">{party.name}</p>
              </div>
              <div className="flex h-full w-full flex-col items-start justify-center">
                <p>
                  <b>{party.sudent_name}</b>
                </p>
                <p>Class: {party.class}th</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-purple-300 p-4">
                <p>Votes</p>
                <p>{party.votes}</p>
              </div>
            </li>
          ))}
          <li className="flex h-fit w-full items-center justify-start gap-4 rounded-2xl">
            <p className="font-bold">21.</p>
            <div className="flex flex-col items-center justify-start">
              <div className="flex max-h-18 min-h-18 max-w-18 min-w-18 bg-green-500">
                <img
                  src="/logo.jpg"
                  alt="Nota"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="">Nota</p>
            </div>
            <div className="flex h-full w-full flex-col items-start justify-center">
              <p>
                <b>none</b>
              </p>
              <p>Class: none</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-purple-300 p-4">
              <p>Count</p>
              <p>{notaCount}</p>
            </div>
          </li>
        </ul>
      ) : (
        <ul className="flex h-fit w-full flex-col items-center justify-start gap-4 rounded-3xl bg-gray-300 p-4">
          {parties.map((party, idx) => (
            <li
              key={idx}
              className="flex h-fit w-full items-center justify-start gap-4 rounded-2xl"
            >
              <p className="font-bold">{idx + 1}.</p>
              <div className="flex flex-col items-center justify-start">
                <div className="flex max-h-18 min-h-18 max-w-18 min-w-18 items-center justify-center">
                  <img
                    src={`/candidate_symbols/${party.name.toLowerCase()}.jpg`}
                    alt={party.name}
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </div>
                <p className="">{party.name}</p>
              </div>
              <div className="flex h-full w-full flex-col items-start justify-center">
                <p>
                  <b>{party.sudent_name}</b>
                </p>
                <p>Class: {party.class}th</p>
              </div>
              <button
                className="primary-btn blue"
                onClick={() => AddThisParty(party)}
              >
                Vote
              </button>
            </li>
          ))}
          {!isShowingResults && (
            <li className="flex h-fit w-full items-center justify-start gap-4 rounded-2xl">
              <p className="font-bold">21.</p>
              <div className="flex flex-col items-center justify-start">
                <div className="flex max-h-18 min-h-18 max-w-18 min-w-18 items-center justify-center">
                  <img
                    src="/candidate_symbols/nota.jpg"
                    alt="Nota"
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </div>
                <p className="">Nota</p>
              </div>
              <div className="flex h-full w-full flex-col items-start justify-center">
                <p>
                  <b>none</b>
                </p>
                <p>Class: none</p>
              </div>
              <button
                className={`primary-btn blue`}
                onClick={onNotaSelect}
                disabled={votes === 0}
              >
                Vote
              </button>
            </li>
          )}
        </ul>
      )}

      <div
        className={`fixed top-0 left-1/2 z-50 h-fit w-full -translate-x-1/2 p-4 ${message.label !== "" ? "" : "-translate-20"} transition-transform`}
      >
        <div
          className={`z-10 rounded-xl bg-gray-200/50 px-4 py-2 shadow-xl backdrop-blur-2xl ${message.status === "success" ? "text-green-600" : message.status === "warning" ? "text-yellow-600" : message.status === "error" ? "text-red-600" : "text-gray-800"}`}
        >
          {message.label}
        </div>
      </div>
    </main>
  );
}

export default App;
