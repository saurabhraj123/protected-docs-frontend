import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./HeaderMenu.module.css";
import axios from "axios";
import { BACKEND_URI } from "../../config";

const HeaderMenu = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirm) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.delete(`${BACKEND_URI}/api/rooms/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          navigate("/");
        }
      } catch (err) {
        console.log("err", err);
      }
    }
  };

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
          <button className={classes.button} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
