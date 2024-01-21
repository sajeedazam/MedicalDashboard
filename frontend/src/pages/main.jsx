import React from "react";
import logo from "../assets/logo.png";

const mockData = [
  { title: "Optimizing Sedation", creationTime: "Jan 20, 2024" },
  { title: "ACL & MCL Report", creationTime: "Dec 13, 2023" },
  { title: "Diabetic Treatment Dashboard", creationTime: "Nov 26, 2023" },
  { title: "Children Lungs Dashboard", creationTime: "Sep 07, 2023" },
];

const handleEditDelete = () => {
  console.log("Hello World");
};

const ApplicationList = () => {
  let username = "mockEmail";
  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 bg-black">
        {/* Logo and Username */}
        <div className="flex items-center">
          <img src={logo} alt="FocusFHIR Logo" className="h-14" />
          <span className="ml-4 text-white font-semibold text-xl tracking-tight">
            {username}
          </span>
        </div>

        {/* Logout Button */}
        <div>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </header>

      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold">Applications List</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleEditDelete}
        >
          New App+
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
            {mockData.map((app, index) => (
              <tr key={index} className="hover:bg-grey-lighter">
                <td className="py-4 px-6 border-b border-grey-light">
                  {app.title}
                </td>
                <td className="py-4 px-6 border-b border-grey-light text-right">
                  {app.creationTime}
                </td>
                <td className="py-4 px-6 border-b border-grey-light text-right">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-800 mr-3"
                    onClick={handleEditDelete}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-800"
                    onClick={handleEditDelete}
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
