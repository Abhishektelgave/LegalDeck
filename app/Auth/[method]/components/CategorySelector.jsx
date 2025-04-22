'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Categories List to Update
const categoriesList = {
  Murder: { name: 'Murder', fee: 1500 },
  Accident: { name: 'Accident', fee: 1800 },
  Divorce: { name: 'Divorce', fee: 2000 },
  Land_Issues: { name: 'Land Issues', fee: 1200 },
  Legal_Issues: { name: 'Legal Issues', fee: 1000 },
};

// Catagory Selector Component
export default function CategorySelector({ value = {}, onChange }) {
  const [selected, setSelected] = useState(value || {});

  // Get and set values from parent components
  useEffect(() => {
    const valueKeys = Object.keys(value || {});
    const selectedKeys = Object.keys(selected);
    const hasDifferentKeys =
      valueKeys.length !== selectedKeys.length ||
      valueKeys.some((key) => !selected[key]);

    if (hasDifferentKeys) {
      setSelected(value || {});
    }
  }, [value]);

  // onChange selected
  useEffect(() => {
    onChange(selected);
  }, [selected]);

  // Toogle state
  const toggleCategory = (key) => {
    const updated = { ...selected };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = categoriesList[key];
    }
    setSelected(updated);
  };

  return (
    <div className="space-y-4 w-[25vw]">
      <label className="block font-medium">Categories</label>

      {/* Selected Categories */}
      <div className="flex flex-wrap gap-2 mt-2 border border-gray-300 rounded-lg p-2 min-h-[40px]">
        {Object.keys(selected).map((key) => (
          <div
            key={key}
            className="flex items-center gap-1 text-black bg-gray-100 px-3 py-1 rounded-full text-sm"
          >
            <span>{selected[key].name}</span>
            <button onClick={() => toggleCategory(key)}>
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Unselected Categories */}
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.keys(categoriesList)
          .filter((key) => !selected[key])
          .map((key) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className="border border-gray-300 px-2 py-1 rounded-lg text-sm hover:text-black hover:bg-gray-100 transition"
            >
              {categoriesList[key].name}
            </button>
          ))}
      </div>
    </div>
  );
}
