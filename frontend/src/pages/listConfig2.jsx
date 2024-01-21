import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Header from "../widgets/header";

const categories = [
  { id: 1, name: "Immun.", description: "Immunization services" },
  { id: 2, name: "Medical", description: "General medical services" },
  { id: 3, name: "Diagnostic", description: "Diagnostic services" },
  {
    id: 4,
    name: "Patient Contact",
    description: "Direct patient interactions",
  },
];

const Checklist = () => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheck = (id) => {
    setCheckedItems((prev) => {
      const newChecked = new Set(prev);
      newChecked.has(id) ? newChecked.delete(id) : newChecked.add(id);
      return newChecked;
    });
    setError(""); // Clear error when a checkbox is clicked
  };

  const handleSubmit = () => {
    if (title.trim() === "") {
      setError("Title can't be empty.");
    } else if (checkedItems.size === 0) {
      setError("At least one category must be selected.");
    } else {
      // Create an array to store the title and selected categories
      let submissionArray = [title];
      categories.forEach((category) => {
        if (checkedItems.has(category.id)) {
          submissionArray.push(category.name); // Add category name
        }
      });

      // Here you can handle the submissionArray as needed
      console.log("Submitted Array:", submissionArray);

      let selectedCategories = Array.from(checkedItems).map(
        (id) => categories.find((category) => category.id === id).name
      );

      // Store selected categories in local storage
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(selectedCategories)
      );
      localStorage.setItem("title", title);
      setSubmitted(true);
      setError("");
      navigate("/config");
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div className="flex flex-col items-center h-full bg-blue-100">

        <div className="flex flex-col bg-white shadow-md rounded p-8 w-full max-w-4xl my-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className={`border p-2 mb-4 w-full ${
                error.includes("Title") ? "border-red-500" : ""
              }`}
            />
            <p className="text-xs italic text-red-500">Title can't be empty.</p>
          </div>

          <div className="mb-6">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={checkedItems.has(category.id)}
                  onChange={() => handleCheck(category.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700 text-lg">
                  {category.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 italic">
                  {category.description}
                </span>
              </label>
            ))}
            <p className="text-xs italic text-red-500">
              Pick at least one checkbox and fill up title before submit.
            </p>
          </div>

          <div className="text-sm text-gray-600 italic mb-4">
            Selected Resources. Store in DB with unique ID.
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
          {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Checklist;
