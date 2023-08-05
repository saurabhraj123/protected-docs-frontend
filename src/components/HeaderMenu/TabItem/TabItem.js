import React from "react";
import classes from "./TabItem.module.css";

const TabItem = ({ id, title, activeDocumentId, onClick }) => {
  const styles = {
    backgroundColor: activeDocumentId === id ? "#fff" : "#f2f2f2",
    color: activeDocumentId === id ? "#000" : "#a6a6a6",
  };

  // console.log("doc is in tabItem is", id);

  return (
    <div
      className={classes.container}
      style={styles}
      onClick={() => onClick(id)}
    >
      {title}
    </div>
  );
};

export default TabItem;
