import React, { useState } from "react";
import classes from "./LoginForm.module.css";

const LoginForm = ({ onSubmit }) => {
  const [password, setPassword] = useState("");

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.passwordFieldContainer}>
          <label name="password" className={classes.passwordLabel}>
            Enter your password
          </label>
          <input
            type="password"
            id="password"
            className={classes.passwordField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => onSubmit(password)}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
