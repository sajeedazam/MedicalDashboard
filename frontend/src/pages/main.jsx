import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Header from "../widgets/header";
import axios from 'axios';
import { fetchUserAttributes } from 'aws-amplify/auth';

const mockData = [
  { title: "Optimizing Sedation", creationTime: "Jan 20, 2024" },
  { title: "ACL & MCL Report", creationTime: "Dec 13, 2023" },
  { title: "Diabetic Treatment Dashboard", creationTime: "Nov 26, 2023" },
  { title: "Children Lungs Dashboard", creationTime: "Sep 07, 2023" },
];

const ApplicationList = () => {
  const [projectList, setProjectList] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
      // Async operation
      asyncOp();
  }, []);

  async function asyncOp(){
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("userAttributes: ", userAttributes.sub);
      
      setUserId(userAttributes.sub);

      await fetchData(userAttributes.sub);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async (userID) => {
    const url = `https://bkqwkigeji.execute-api.ca-central-1.amazonaws.com/prod/appData?user_id=${userID}`;

    try {
      const response = await axios.get(url);
      setProjectList(response.data);
      console.log("::: ", url, response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error
    }
  };

  const handleDelete = async (projectID, userID) => {
    // Delete project
    const url = `https://bkqwkigeji.execute-api.ca-central-1.amazonaws.com/prod/appData?user_id=${userID}&project_id=${projectID}`;

    try {
      const response = await axios.delete(url);
      console.log("deleted");

      fetchData(projectID);
      // Handle the response data as needed
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error
    }

    console.log("Hello World");
  };
  const handleEdit = (projectID) => {
    // Redirect new page
    console.log("Hello World");
  };

  const handleEditDelete = () => {
    // Redirect new page
    window.location.href = '/list-config';
  };


  let username = "mockEmail";
  return (
    <div className="container mx-auto px-4">
      <Header />
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold">Applications List</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleEditDelete}
        >
          New App +
        </button>
      </div>
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Title
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-right">
                  Creation Time
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((app, index) => (
                <tr key={index} className="hover:bg-grey-lighter">
                  <td className="py-4 px-6 border-b border-grey-light">
                    {app.project_name}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light text-right">
                    {app.created_date}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light text-right">
                    
                    <button
                      className="text-sm text-red-500 hover:text-red-800"
                      onClick={() => handleDelete(app.project_id, userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
    </div>
  );
};

export default ApplicationList;
