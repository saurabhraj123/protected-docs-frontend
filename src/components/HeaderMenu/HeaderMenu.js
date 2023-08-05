import React from "react";
import classes from "./HeaderMenu.module.css";
import TabItem from "./TabItem";

const HeaderMenu = ({ tabs, activeDocumentId, onActiveDocumentChange }) => {
  return (
    <div className={classes.container}>
      {tabs.map((tab) => {
        return (
          <TabItem
            key={tab.id}
            id={tab.id}
            title={tab.title}
            activeDocumentId={activeDocumentId}
            onClick={onActiveDocumentChange}
          />
        );
      })}
    </div>
  );
};

export default HeaderMenu;
