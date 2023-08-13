import React from "react";
import classes from "./HeaderMenu.module.css";
import TabItem from "./TabItem";

const HeaderMenu = ({
  tabs,
  activeTabId,
  editableTabId,
  onTabChange,
  onCreateTab,
  onTabEdit,
}) => {
  return (
    <div className={classes.container}>
      {tabs.map((tab) => {
        return (
          <TabItem
            key={tab.id}
            id={tab.id}
            title={tab.title}
            isEditable={tab.id === editableTabId}
            activeTabId={activeTabId}
            onClick={onTabChange}
            onEdit={onTabEdit}
          />
        );
      })}

      <button
        className={classes.button}
        onClick={() => onCreateTab("Untitled")}
      >
        +
      </button>
    </div>
  );
};

export default HeaderMenu;
