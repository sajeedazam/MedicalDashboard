import FHIR from "fhirclient";
import React, { useState, useEffect } from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { fetchUserAttributes } from 'aws-amplify/auth';

export default function Config() {
  const [clientReady, setClientReady] = useState(false);
  const [client, setClient] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  const [contactNumber, setContactNumber] = useState("Loading...");
  const [patientId, setPatientId] = useState("Loading...");
  const [immunizations, setImmunizations] = useState("Loading...");
  const [medications, setMedications] = useState("Loading...");
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
  }, []);

  // Async operation
  async function asyncOp(){
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

    // Immunization
    await client
      .request(`Immunization/?patient=${client.patient.id}`)
      .then((response) => {
        const immunizationList = response.entry
          ? response.entry.map((entry) => entry.resource.vaccineCode.text).join(", ")
          : "No immunizations available";
        setImmunizations(immunizationList);
      })
      .catch((err) => {
        console.log(err);
        setImmunizations("Error fetching immunizations");
      });

    // MedicationRequest
    await client
      .request(`MedicationRequest/?patient=${client.patient.id}`)
      .then((response) => {
        const medicationList = response.entry
          ? response.entry.map((entry) => entry.resource.medicationCodeableConcept.text).join(", ")
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

      // diagnostics
      await client
        .request(`DiagnosticReport/?patient=${client.patient.id}`)
        .then((response) => {
        //   const medicationList = response.entry
        //     ? response.entry
        //         .map((entry) => entry.resource.medicationCodeableConcept.text)
        //         .join(", ")
        //     : "No medications available";
        //   setMedications(medicationList);
        console.log(response.entry)
        })
        .catch((err) => {
          console.log(err);
          setMedications("Error fetching medications");
        });
  }

  return (
    <React.Fragment>
      <h1>Hello world from config!!</h1>
      <div className="card">
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
      {/*Immunization*/}
              <div className="immunizations-list">
          <table>
            <tbody>
              <tr>
                <td>Immunizations:</td>
                <td>{immunizations}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Medications List */}
        <div className="medications-list">
          <table>
            <tbody>
              <tr>
                <td>Medications:</td>
                <td>{medications}</td>
              </tr>
            </tbody>
          </table>
        </div>
      
    </React.Fragment>
  );
}
