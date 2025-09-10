import React from "react";

interface Props<T> {
  label: string;
  items: T[];
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  disabledCheck: (item: T) => boolean;
}

function SharedDropdown<T>({ label, items, onSelect, getLabel, disabledCheck }: Props<T>) {
  return (
    <div className="dropdown me-2 mb-2 rounded bg-primary">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        {label}
      </button>
      <ul
        className="dropdown-menu"
        style={{
          backgroundColor: "#0d6efd",
          color: "e",
        }}
      >
        {items.length === 0 ? (
          <li>
            <span className="dropdown-item text-white">No {label.toLowerCase()}s found</span>
          </li>
        ) : (
          items.map((item, index) => (
            <li key={index}>
              <button
                className="dropdown-item custom-dropdown-item"
                onClick={() => onSelect(item)}
                disabled={disabledCheck(item)}
                style={{ color: "white" }}
              >
                {getLabel(item)}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SharedDropdown;
