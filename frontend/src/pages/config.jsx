import React, { useState, useEffect } from 'react';
import FHIR from 'fhirclient';


export default function Config(){
    const [clientReady, setClientReady] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        // Wait for authrization status
        FHIR.oauth2.ready().then(onResolve).catch((err) => {
            console.log(err);
        });
    }, []);


    // Resolver funcitons
    async function onResolve(client) {
        // Server succefully connected
        setClientReady(true);
        setClient(client);

        // FHIR Request Operations
        await client.request(`Patient/${client.patient.id}`).then((patient) => {
            console.log("patient: ", patient);
        }).catch((err =>{
            console.log(err);
        }));
    }

    return(<React.Fragment>
        <h1>Hello world from config!!</h1>
    </React.Fragment>);
}