import React, { useState } from "react";

const TestTwo = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [position, setPosition] = useState({
    vertical: "bottom",
    horizontal: "left-1/2",
  });

  const handleDropdownClick = (e) => {
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const container = button.offsetParent?.parentElement?.parentElement;

    if (!container) {
      console.error("Container element not found!");
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const leftSpace = buttonRect.left - containerRect.left;
    const rightSpace = containerRect.right - buttonRect.right;
    const marginThreshold = 50;
    const minSpaceBelow = 130;

    let horizontalPosition;
    if (leftSpace <= marginThreshold) {
      horizontalPosition = "left-0";
    } else if (rightSpace <= marginThreshold) {
      horizontalPosition = "right-0";
    } else {
      horizontalPosition = "left-1/2";
    }

    const verticalPosition = spaceBelow >= minSpaceBelow ? "bottom" : "top";
    setPosition({
      vertical: verticalPosition,
      horizontal: horizontalPosition,
    });
    setIsDropdownOpen((prev) => !prev);
  };

  const horizontalClass =
    position.horizontal === "left-1/2"
      ? `${position.horizontal} transform -translate-x-1/2`
      : position.horizontal;
  const verticalClass =
    position.vertical === "bottom" ? "top-full" : "bottom-full";

  return (
    <div className="">
      <div className="relative w-max bg-cyan-500">
        <button onClick={handleDropdownClick} className="border p-2">
          Click here
        </button>

        {isDropdownOpen && (
          <ul
            className={`w-max absolute z-50 border p-2 ${verticalClass} ${horizontalClass} mt-1 bg-cyan-500`}
          >
            <li>Dropdown One</li>
            <li>Dropdown Two</li>
            <li>Dropdown Three</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestTwo;
