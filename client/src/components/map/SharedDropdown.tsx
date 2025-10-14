import React from "react";

interface Props<T> {
  label: string;
  items: T[];
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  disabledCheck: (item: T) => boolean;
}

function naturalSort(a: string, b: string) {
  const regex = /(\d+)|(\D+)/g;
  const aParts = a.match(regex) || [];
  const bParts = b.match(regex) || [];

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];

    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;

    const aNum = parseInt(aPart, 10);
    const bNum = parseInt(bPart, 10);

    const bothNumeric = !isNaN(aNum) && !isNaN(bNum);

    if (bothNumeric) {
      if (aNum !== bNum) return aNum - bNum;
    } else {
      if (aPart !== bPart) return aPart.localeCompare(bPart);
    }
  }

  return 0;
}

function SharedDropdown<T>({
  label,
  items,
  onSelect,
  getLabel,
  disabledCheck,
}: Props<T>) {
  const sortedItems = [...items].sort((a, b) =>
    naturalSort(getLabel(a), getLabel(b))
  );

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
          maxHeight: "21rem",
          overflowY: "auto",
        }}
      >
        {sortedItems.length === 0 ? (
          <li>
            <span className="dropdown-item text-white">
              No {label.toLowerCase()}s found
            </span>
          </li>
        ) : (
          sortedItems.map((item, index) => (
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
