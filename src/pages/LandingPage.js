import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./LandingPage.module.css";

const LandingPage = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  return (
    <div className={classes.page}>
      <img src="logo.png" alt="logo" className={classes.logo} />
      <div className={classes.container}>
        <h1 className={classes.heading}>Welcome to Protected Docs</h1>
        <p className={classes.subText}>
          Access your secure documents in real-time.
        </p>
        <div className={classes.form}>
          <input
            type="text"
            name="roomName"
            placeholder="Enter room name"
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
          <button
            type="submit"
            className={classes.submitBtn}
            onClick={() => navigate(`/${roomName}`)}
          >
            Create / Access Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
