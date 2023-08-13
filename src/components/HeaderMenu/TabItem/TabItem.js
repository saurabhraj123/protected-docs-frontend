import React, { useEffect, useRef, useState } from "react";
import classes from "./TabItem.module.css";

const TabItem = ({ id, title, activeTabId, onClick, onEdit, isEditable }) => {
  const [editableTitle, setEditableTitle] = useState(title);

  const tabRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "Escape") {
        tabRef.current?.blur();
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
    };
  });

  const styles = {
    backgroundColor: activeTabId === id ? "#fff" : "#f2f2f2",
    color: activeTabId === id ? "#000" : "#a6a6a6",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    switch (e.detail) {
      case 1:
        onClick(id);
        break;
      case 2:
        onEdit(id, true);
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    setEditableTitle(tabRef.current.innerText);
  };

  const saveTitle = () => {
    onEdit(id, false, editableTitle);
  };

  return (
    <div
      className={classes.container}
      style={styles}
      onClick={handleClick}
      contentEditable={isEditable}
      onInput={handleChange}
      onBlur={saveTitle}
      ref={tabRef}
    >
      {title}
    </div>
  );
};

export default TabItem;
