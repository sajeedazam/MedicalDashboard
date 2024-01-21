import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import '../index.css';

import { fetchUserAttributes } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';


const Header = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Async operation
      asyncOp();
    }, []);

    // Async operation
    async function asyncOp(){
        try {
        const userAttributes = await fetchUserAttributes();
        console.log("userAttributes: ", userAttributes);

        setUserEmail(userAttributes.email);
        } catch (error) {
        console.log(error);
        }
    }
    
    // async function handleSignOut() {
    //     try {
    //       await signOut();
    //     } catch (error) {
    //       console.log('error signing out: ', error);
    //     }
    //   }

    return (
        <React.Fragment>        
            {/* Header */}
            <header className="flex justify-between items-center py-4 px-6 bg-black">
            {/* Logo and Username */}
            <div className="flex items-center">
                <img src={logo} alt="FocusFHIR Logo" className="h-14" />
                <span className="ml-4 text-white font-semibold text-xl tracking-tight">
                    {(userEmail) ? userEmail : "User"}
                </span>
            </div>

            {/* Logout Button */}
            <div>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={async () =>{
                    try {
                        await signOut();
                    } catch (error) {
                        console.log('error signing out: ', error);
                    }
                }}>
                Logout
                </button>
            </div>
            </header>
        </React.Fragment>
    );
}

export default Header;