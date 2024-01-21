import FHIR from "fhirclient";
import React, { useState, useEffect } from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Config() {
  const [clientReady, setClientReady] = useState(false);
  const [client, setClient] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);

  useEffect(() => {
    // Wait for authrization status
    FHIR.oauth2
      .ready()
      .then(onResolve)
      .catch((err) => {
        console.log(err);
      });

  }, []);


  // Resolver funcitons
  async function onResolve(client) {
    // Server succefully connected
    setClientReady(true);
    setClient(client);

    // FHIR Request Operations
    // await client
    //   .request(`Patient/${client.patient.id}`)
    //   .then((patient) => {
    //     console.log("patient: ", patient);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // FHIR Request Operations
    await client.request(`Immunization/?patient=${client.patient.id}`).then((Immunization) => {
  const mapConditionsToTreeNodes = (data) => {
    const root = {
      key: "0",
      label: "Conditions",
      children: data.entry.map((entry) => {
        const condition = entry.resource;
        return {
          key: condition.id,
          label: condition.vaccineCode.text,
        };
      }),
    };
    console.log(Immunization)
    return [root]; // The TreeSelect expects an array of nodes
  };

  // Convert JSON data to tree nodes and update state
  const treeNodes = mapConditionsToTreeNodes(Immunization);
  setNodes(treeNodes);
    }).catch((err =>{
        console.log(err);
    }));
  }

  return (
    <React.Fragment>
      <h1>Hello world from config!!</h1>
      <div className="card">
        <TreeSelect
          value={selectedNodeKeys}
          onChange={(e) => setSelectedNodeKeys(e.value)}
          options={nodes}
          metaKeySelection={false}
          className="w-full"
          selectionMode="checkbox"
          placeholder="Select Items"
        />
      </div>
    </React.Fragment>
  );
}
