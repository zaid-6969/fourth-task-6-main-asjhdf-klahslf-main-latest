import { useState } from "react";

const TABS = ["All", "Comments", "History", "Work log"];

const ActivityTabs = ({ activeTab, onTabChange, onToggle }) => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen((p) => !p);
    onToggle?.(!open);
  };

  return (
    <div className="activity-wrapper">
      <div className="activity-header" onClick={handleToggle}>
        <span>Activity</span>
        <span className={`activity-arrow ${open ? "open" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="activity-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`activity-tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTabs;
