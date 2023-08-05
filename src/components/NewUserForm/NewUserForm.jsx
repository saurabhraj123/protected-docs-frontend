import React, { useState } from "react";
import classes from "./NewUserForm.module.css";

const NewUserForm = ({ roomName, onCreate }) => {
  const [password, setPassword] = useState("");

  return (
    <div className={classes.container}>
      <div className={classes.modalContainer}>
        <div className={classes.header}>
          <div className={classes.headerOverlay}></div>
          <div className={classes.headerTitle}>Create a new site?</div>
        </div>

        <div className={classes.message}>
          Great! This site doesn't exist, it can be yours! Would you like to
          create:
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
            <button onClick={() => onCreate(password)}>Create site</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;
