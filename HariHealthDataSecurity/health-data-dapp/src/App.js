import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_healthFacilityName", "type": "string" },
      { "internalType": "string", "name": "_patientName", "type": "string" },
      { "internalType": "string", "name": "_patientNumber", "type": "string" },
      { "internalType": "string", "name": "_dob", "type": "string" },
      { "internalType": "string", "name": "_diagnosis", "type": "string" },
      { "internalType": "string", "name": "_treatment", "type": "string" },
      { "internalType": "string", "name": "_nextVisit", "type": "string" },
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [records, setRecords] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [facilityAuth, setFacilityAuth] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [viewedRecords, setViewedRecords] = useState([]);
  const [formData, setFormData] = useState({
    healthFacilityName: "",
    patientName: "",
    patientNumber: "",
    dob: "",
    diagnosis: "",
    treatment: "",
    nextVisit: "",
  });

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);

        setProvider(newProvider);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    }
    init();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const addHealthRecord = async () => {
    const {
      healthFacilityName,
      patientName,
      patientNumber,
      dob,
      diagnosis,
      treatment,
      nextVisit,
    } = formData;

    if (!contract) return;
    try {
      const tx = await contract.addRecord(
        healthFacilityName,
        patientName,
        patientNumber,
        dob,
        diagnosis,
        treatment,
        nextVisit
      );
      await tx.wait();

      alert(`Record added for patient: ${patientName}`);

      // Add new record to local state
      setRecords([
        ...records,
        { id: records.length + 1, ...formData },
      ]);
      setFormData({
        healthFacilityName: "",
        patientName: "",
        patientNumber: "",
        dob: "",
        diagnosis: "",
        treatment: "",
        nextVisit: "",
      });
    } catch (error) {
      console.error("Error adding health record:", error);
    }
  };

  const handleLogin = () => {
    const matchedRecord = records.find(
      (record) =>
        record.patientName === loginUsername &&
        record.patientNumber === loginPassword
    );
    if (matchedRecord) {
      setAuthenticated(true);
      alert("Login successful!");
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setLoginUsername("");
    setLoginPassword("");
  };

  const handleFacilityAuth = () => {
    const facilityRecords = records.filter(
      (record) => record.healthFacilityName === facilityName
    );
    if (facilityRecords.length > 0) {
      setFacilityAuth(true);
      setViewedRecords(facilityRecords);
      alert("Facility authenticated successfully!");
    } else {
      alert("Invalid facility name.");
    }
  };

  const handleFacilityLogout = () => {
    setFacilityAuth(false);
    setFacilityName("");
    setViewedRecords([]);
  };

  return (
    <div>
      <h1>Health Data DApp</h1>
      {!account && <button onClick={connectWallet}>Connect Wallet</button>}
      {account && (
        <>
          <p>Connected as: {account}</p>

          {/* Organization Section */}
          <h3>Organization: Add Health Record</h3>
          <input
            type="text"
            placeholder="Health Facility Name"
            value={formData.healthFacilityName}
            onChange={(e) =>
              setFormData({ ...formData, healthFacilityName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={(e) =>
              setFormData({ ...formData, patientName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Patient Number"
            value={formData.patientNumber}
            onChange={(e) =>
              setFormData({ ...formData, patientNumber: e.target.value })
            }
          />
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) =>
              setFormData({ ...formData, dob: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Treatment Recommended"
            value={formData.treatment}
            onChange={(e) =>
              setFormData({ ...formData, treatment: e.target.value })
            }
          />
          <label>Next Visit Date:</label>
          <input
            type="date"
            value={formData.nextVisit}
            onChange={(e) =>
              setFormData({ ...formData, nextVisit: e.target.value })
            }
          />
          <button onClick={addHealthRecord}>Add Record</button>

          <h3>Organization: View Records</h3>
          <input
            type="text"
            placeholder="Enter Facility Name (Password)"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
          />
          <button onClick={handleFacilityAuth}>Authenticate Facility</button>
          {facilityAuth && (
            <div>
              <h4>Records for {facilityName}:</h4>
              {viewedRecords.map((record, index) => (
                <p key={index}>
                  Patient: {record.patientName}, Diagnosis: {record.diagnosis},
                  Next Visit: {record.nextVisit}
                </p>
              ))}
              {/* Facility Logout Button */}
              <button onClick={handleFacilityLogout}>Logout Facility</button>
            </div>
          )}

          {/* User Section */}
          <h3>User: Login</h3>
          {!authenticated ? (
            <>
              <input
                type="text"
                placeholder="Username (Patient Name)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Password (Patient Number)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </>
          ) : (
            <>
              <h3>Welcome, {loginUsername}</h3>
              <button onClick={handleLogout}>Logout</button>
              <h4>Your Records:</h4>
              {records
                .filter(
                  (record) =>
                    record.patientName === loginUsername &&
                    record.patientNumber === loginPassword
                )
                .map((record, index) => (
                  <p key={index}>
                    Diagnosis: {record.diagnosis}, Treatment: {record.treatment},
                    Next Visit: {record.nextVisit}
                  </p>
                ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
