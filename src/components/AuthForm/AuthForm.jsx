import React, { useState } from "react";
import classes from "./AuthForm.module.css";

const AuthForm = ({ mode, roomName, onSubmit }) => {
  const [password, setPassword] = useState("");

  return (
    <div className={classes.container}>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <div className={classes.headerOverlay}></div>
          <div className={classes.headerTitle}>
            {mode === "login" ? "Exisiting user!" : "Create a new site?"}
          </div>
        </div>

        <div className={classes.message}>
          {mode === "signup"
            ? "Great! This site doesn't exist, it can be yours! Would you like to create:"
            : "Enter the password to get access to:"}
        </div>

        <div className={classes.roomName}>{roomName}</div>

        <div className={classes.inputFieldContainer}>
          <label htmlFor="password">Enter your password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={classes.passwordField}
          />
          <div className={classes.btnContainer}>
            <button onClick={() => onSubmit(password)}>
              {mode === "signup" ? "Create site" : "Decrypt this site"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
