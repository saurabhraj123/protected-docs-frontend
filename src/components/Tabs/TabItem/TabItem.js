import React, { useEffect, useRef, useState } from "react";
import classes from "./TabItem.module.css";
import { AiOutlineClose } from "react-icons/ai";

const TabItem = ({
  id,
  title,
  onDelete,
  activeTabId,
  onClick,
  onEdit,
  isEditable,
}) => {
  const [editableTitle, setEditableTitle] = useState(title);
  const [prevTitle, setPrevTitle] = useState(title);

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
  }, []);

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
    if (editableTitle.trim() === "") {
      tabRef.current.innerText = prevTitle;
      setEditableTitle(prevTitle);
      return;
    }

    onEdit(id, false, editableTitle);
    setPrevTitle(editableTitle);
  };

  const tabClasses = [
    classes.container,
    activeTabId === id ? classes.active : "",
  ].join(" ");

  return (
    <div
      className={tabClasses}
      onClick={handleClick}
      contentEditable={isEditable}
      onInput={handleChange}
      onBlur={saveTitle}
      ref={tabRef}
    >
      {title}

      <AiOutlineClose
        style={{ fontSize: "14px" }}
        onClick={() => onDelete(id)}
      />
    </div>
  );
};

export default TabItem;
