import React, { useState } from "react";

// FhirClient Library
import FHIR from "fhirclient";

export default function SmartAuth() {
  FHIR.oauth2
    .authorize({
      redirectUri: "/config",
      clientSecret: "",
      client_id: "",
      scope:
        "patient/Patient.read patient/Observation.read patient/Immunization.read patient/MedicationRequest.read patient/DiagnosticReport.read launch online_access openid profile",
    })
    .catch((err) => {
      console.log("/smartAuth error");
    });

  return (
    <React.Fragment>
      <h1>Hello world from smartAuth!!</h1>
    </React.Fragment>
  );
}
