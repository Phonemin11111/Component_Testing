import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

const TestTwo = () => {
  const [dropdownType, setDropdownType] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);

  const handleDropdownClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5, // Position below the button
        left: rect.left + window.scrollX + rect.width / 2, // Center horizontally
      });
    }
    setDropdownType((prev) => !prev);
  };

  return (
    <div className=" w-[3000px]">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="border p-2"
      >
        Click here
      </button>

      {dropdownType &&
        createPortal(
          <ul
            className="absolute z-50 border p-2 bg-white shadow-md"
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translateX(-50%)",
            }}
          >
            <li>Dropdown One</li>
            <li>Dropdown Two</li>
            <li>Dropdown Three</li>
          </ul>,
          document.body // Attach dropdown to the body
        )}
    </div>
  );
};

export default TestTwo;
