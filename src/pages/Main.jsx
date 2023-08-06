import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URI } from "../config";
import NewUserForm from "../components/NewUserForm";
import LoginForm from "../components/LoginForm/LoginForm";
import HeaderMenu from "../components/HeaderMenu/HeaderMenu";
import TextEditor from "../components/TextEditor/TextEditor";
import classes from "./Main.module.css";

const Main = () => {
  const [roomId, setRoomId] = useState(null);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [editableTabId, setEditableTabId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabs, setTabs] = useState([]);

  const { roomName } = useParams();

  useEffect(() => {
    const getRoomId = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URI}/api/rooms/${roomName}`
        );

        setRoomId(data.id);
      } catch (err) {
        setIsNewUser(true);
      }
    };

    getRoomId();

    return () => {
      if (sessionStorage.getItem("token")) sessionStorage.removeItem("token");
    };
  }, []);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !isLoggedIn) return;

      const getTabs = async () => {
        try {
          const { data } = await axios.get(`${BACKEND_URI}/api/documents`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setTabs(data.documents);
          setActiveDocumentId(data.documents[0].id);
          console.log(data.documents);
        } catch (err) {
          console.log(err);
        }
      };

      getTabs();
    } catch (err) {
      console.log(err);
    }
  }, [isLoggedIn]);

  const handleUserCreate = async (password) => {
    try {
      if (password === "") return;
      const { data } = await axios.post(`${BACKEND_URI}/api/rooms/create`, {
        roomName,
        password,
      });

      setIsNewUser(false);
      setIsLoggedIn(true);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserLogin = async (password) => {
    try {
      if (password === "") return;
      const { data } = await axios.post(
        `${BACKEND_URI}/api/rooms/auth/${roomName}`,
        {
          password,
        }
      );

      const { token } = data;
      sessionStorage.setItem("token", token);

      setIsLoggedIn(true);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleActiveDocumentChange = (id) => {
    console.log("change id", id);
    setActiveDocumentId(id);
  };

  const handleCreateClicked = (id) => {
    setEditableTabId(id);
  };

  const handleTitleEdit = async (id, isEditTrue, newTitle) => {
    if (isEditTrue) setEditableTabId(id);
    else {
      setEditableTabId(null);
      console.log("newTitle", newTitle);
      try {
        const token = sessionStorage.getItem("token");

        const { data } = await axios.put(
          `${BACKEND_URI}/api/documents/update/title/${id}`,
          {
            title: newTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={classes.container}>
      {isNewUser && (
        <NewUserForm roomName={roomName} onCreate={handleUserCreate} />
      )}

      {!isNewUser && !isLoggedIn && <LoginForm onSubmit={handleUserLogin} />}

      {!isNewUser && isLoggedIn && (
        <>
          <HeaderMenu
            tabs={tabs}
            activeTabId={activeDocumentId}
            editableTabId={editableTabId}
            onTabChange={handleActiveDocumentChange}
            onCreateTab={handleCreateClicked}
            onTabEdit={handleTitleEdit}
          />

          <TextEditor roomId={roomId} documentId={activeDocumentId} />
        </>
      )}
    </div>
  );
};

export default Main;
