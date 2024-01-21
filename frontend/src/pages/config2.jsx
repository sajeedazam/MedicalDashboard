import FHIR from "fhirclient";
import React, { useState, useEffect } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import processDiagnosticReportData from "./processDiagnostics";
import { fetchUserAttributes } from "aws-amplify/auth";
import processConditionData from "./conditionProcessiong";
import SideBar from "./sideBar";

export default function Config() {
  const [clientReady, setClientReady] = useState(false);
  const [client, setClient] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  const [contactNumber, setContactNumber] = useState("Loading...");
  const [patientId, setPatientId] = useState("Loading...");
  const [immunizations, setImmunizations] = useState("Loading...");
  const [medications, setMedications] = useState("Loading...");
  const [DiagnosticReportData, setDiagnosticReportData] = useState(null);
  const [popupTitle, setPopupTitle] = useState(null);
  const [ConditionData, setConditionData] = useState(null);
  const [medDiagData, setMedDiagData] = useState([]);
  const [statusList, setStatusList] = useState(null);
  const [loadPopup, setLoadPopup] = useState(false);
  const [showPatientId, setShowPatientId] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showImmunization, setShowImmunization] = useState(false);
  const [showMedical, setShowMedical] = useState(false);
  const [title, setTitle] = useState("");

  function getStatusList(tableData) {
    if (tableData) {
      const uniqueList = new Set(tableData.map((obj) => obj.col1));
      return Array.from(uniqueList);
    } else {
      return [];
    }
  }
  const loadMoreDiagnoseHandler = () => {
    setPopupTitle("Diagnostic Data");
    let counter = 0;
    const dataCleaned = ConditionData.map((row) => {
      counter++;
      const modified =
        row.ConditionType.charAt(0).toUpperCase() + row.ConditionType.slice(1);
      return {
        id: counter,
        title: modified,
        col1: row.ConditionStatus,
        col2: row.ConditionTime && row.ConditionTime.split("T")[0],
      };
    });

    const statusList_ = getStatusList(dataCleaned);
    setMedDiagData(dataCleaned);
    setStatusList(statusList_);
    setLoadPopup(true);
  };
  useEffect(() => {
    // Wait for authrization status
    FHIR.oauth2
      .ready()
      .then(onResolve)
      .catch((err) => {
        console.log(err);
      });
    // Async operation
    asyncOp();
    const storedCategories =
      JSON.parse(localStorage.getItem("selectedCategories")) || [];

    // Set states based on stored categories
    setShowPatientId(storedCategories.includes("Patient Contact"));
    setShowContact(storedCategories.includes("Patient Contact"));
    setShowImmunization(storedCategories.includes("Immun."));
    setShowMedical(storedCategories.includes("Medical"));
    const storedTitle = localStorage.getItem("title");

    setTitle(storedTitle || "Default Title");
  }, []);

  // Async operation
  async function asyncOp() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("userAttributes: ", userAttributes);
    } catch (error) {
      console.log(error);
    }
  }

  // Resolver funcitons
  async function onResolve(client) {
    // Server succefully connected
    setClientReady(true);
    setClient(client);
    const fetchedPatientId = client.patient.id;
    setPatientId(fetchedPatientId);
    fetchData(
      `DiagnosticReport/?patient=${client.patient.id}`,
      processDiagnosticReportData,
      setDiagnosticReportData
    );
    fetchData(
      `Condition/?patient=${client.patient.id}`,
      processConditionData,
      setConditionData
    );
    function fetchData(url, processData, setData, accumulatedResults = []) {
      client
        .request(url)
        .then((Bundle) => {
          const results = processData(Bundle);
          accumulatedResults.push(...results); // Append current results to accumulatedResults

          const nextLink = Bundle.link.find((link) => link.relation === "next");
          if (nextLink) {
            fetchData(nextLink.url, processData, setData, accumulatedResults); // Recursive call with accumulatedResults
          } else {
            setData(accumulatedResults);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Immunization
    await client
      .request(`Immunization/?patient=${client.patient.id}`)
      .then((response) => {
        const immunizationList = response.entry
          ? response.entry
              .map((entry) => entry.resource.vaccineCode.text)
              .join(", ")
          : "No immunizations available";
        setImmunizations(immunizationList);
      })
      .catch((err) => {
        console.log(err);
        setImmunizations("Error fetching immunizations");
      });

    await client
      .request(`MedicationRequest/?patient=${client.patient.id}`)
      .then((response) => {
        const medicationList = response.entry
          ? response.entry
              .map((entry) => entry.resource.medicationCodeableConcept.text)
              .join(", ")
          : "No medications available";
        setMedications(medicationList);
      })
      .catch((err) => {
        console.log(err);
        setMedications("Error fetching medications");
      });

    // patient Request Operations
    await client
      .request(`Patient/${client.patient.id}`)
      .then((Patient) => {
        const getFirstContactNumber = (patientData) => {
          const telecom = patientData.telecom;
          const firstPhoneContact = telecom.find(
            (contact) => contact.system === "phone"
          );
          return firstPhoneContact
            ? firstPhoneContact.value
            : "No phone contact available";
        };

        const firstContactNumber = getFirstContactNumber(Patient);
        setContactNumber(firstContactNumber); // Update state with contact number
      })
      .catch((err) => {
        console.log(err);
        setContactNumber("Error fetching contact");
      });
  }

  return (
    <React.Fragment>
      <div className="card">
        <br></br>
        {/* Patient ID Table */}
        <div className="patient-id-table">
          <table>
            <tbody>
              <tr>
                <td>Patient ID:</td>
                <td>{patientId}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Contact Number Table */}
        <div className="contact-table">
          <table>
            <tbody>
              <tr>
                <td>Contact:</td>
                <td>{contactNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br></br>
      {/*Immunization*/}
      {showImmunization && (
        <div className="immunization-section">
          <table>
            <tbody>
              <tr>
                <td>Immunizations:</td>
                <td>{immunizations}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <br></br>
      {/* Medications List */}
      {showMedical && (
        <div className="medical-section">
          <table>
            <tbody>
              <tr>
                <td>Medications:</td>
                <td>{medications}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* Diagnositics */}
      <div
        style={{
          marginTop: "4vh",
        }}
      >
        <SideBar
          DiagnosticReportData={ConditionData}
          loadMoreDiagnoseHandler={loadMoreDiagnoseHandler}
        />
      </div>
    </React.Fragment>
  );
}
