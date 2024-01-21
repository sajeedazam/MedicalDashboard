import React, { useState } from "react";

const categories = [
  { id: 1, name: "Immun." },
  { id: 2, name: "Medical" },
  { id: 3, name: "Diagnostic" },
  { id: 4, name: "Patient Contact" },
  { id: 5, name: "LAB." },
  { id: 6, name: "Dentistry" },
];

const Checklist = () => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = (id) => {
    setCheckedItems((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
  };

  const handleSubmit = () => {
    if (checkedItems.size > 0 && title.trim() !== "") {
      // Success case
      console.log("Hello World");
      setSubmitted(true);
    } else {
      // Failure case
      setSubmitted(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full bg-blue-100">
      <div className="flex flex-col bg-white shadow-md rounded p-8 w-96 mb-6">
        <div className="mb-6">
          {/* Title box */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mb-4"
          />

          {/* Checkboxes */}
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-14 mb-4"
            >
              <input
                type="checkbox"
                checked={checkedItems.has(category.id)}
                onChange={() => handleCheck(category.id)}
                className="form-checkbox h-6 w-6 text-blue-600"
              />
              <span className="text-gray-700 text-lg">{category.name}</span>
            </label>
          ))}
        </div>
        <div className="text-sm text-gray-600 italic">
          Selected Resources. <br />
          Store in DB with unique ID.
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>

      {/* Submission Result */}
      {submitted ? (
        <div className="text-green-600 mt-2">Hello World</div>
      ) : (
        <div className="text-red-600 mt-2">Try again</div>
      )}
    </div>
  );
};

export default Checklist;
