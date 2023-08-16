import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./HeaderMenu.module.css";

const HeaderMenu = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <div className={classes.headContainer}>
        <img
          src="logo.png"
          alt="logo"
          className={classes.logo}
          onClick={() => navigate("/")}
        />
        <div className={classes.headBtncontainer}>
          <button className={classes.button}>Change Password</button>
          <button className={classes.button}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
