import React, { useState } from 'react';

// FhirClient Library
import FHIR from 'fhirclient';

export default function SmartAuth(){
    FHIR.oauth2.authorize({
        'redirectUri': '/config',
        'clientSecret': "eiH3IQD4fTp7PeNGWkJcVv75o8FHqkCW",
        'client_id': "339e40ff-0ef8-47f5-98ea-a5f34631f336",
        'scope':  'patient/Patient.read patient/Observation.read patient/Immunization.read  launch online_access openid profile',
    }).catch(err => {
        console.log("/smartAuth error");
    });

    return (
        <React.Fragment>
            <h1>Hello world from smartAuth!!</h1>
        </React.Fragment>
    );
}
