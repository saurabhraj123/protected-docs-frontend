import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URI } from "../config";
import AuthForm from "../components/AuthForm";
import HeaderMenu from "../components/HeaderMenu/HeaderMenu";
import TextEditor from "../components/TextEditor/TextEditor";
import classes from "./Main.module.css";

const Main = () => {
  const [roomId, setRoomId] = useState(null);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [editableTabId, setEditableTabId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabs, setTabs] = useState([{ id: -1, title: "Untitled" }]);

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

      const { roomId, token } = data;
      sessionStorage.setItem("token", token);

      await handleCreateTab();

      setIsNewUser(false);
      setRoomId(roomId);
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

        const updatedTabs = [...tabs];
        updatedTabs.forEach((tab) => {
          if (tab.id === id) {
            tab.title = newTitle;
          }
        });
        setTabs(updatedTabs);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCreateTab = async (title = "Untitled", content = {}) => {
    const token = sessionStorage.getItem("token");

    const newTab = {
      id: -1,
      roomId: roomId,
      title: "Untitled",
      content: {},
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);

    const { data } = await axios.post(
      `${BACKEND_URI}/api/documents/create`,
      {
        title,
        content: JSON.stringify(content),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("prev", tabs);
    const updatedTabs = tabs.filter((tab) => tab.id !== -1);
    console.log("data\n", data, updatedTabs);

    setTabs((prevTabs) => [...updatedTabs, data]);

    setActiveDocumentId(data.id);
    setEditableTabId(data.id);
    handleTitleEdit(data.id, true, data.title);
  };

  const handleDocumentDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!shouldDelete) return;

    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(
        `${BACKEND_URI}/api/documents/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTabs = tabs.filter((tab) => tab.id !== id);
      console.log("delete:", data.id);
      console.log("updatedTabs:", updatedTabs[0].id);
      setTabs(updatedTabs);
      if (data.id == activeDocumentId) setActiveDocumentId(updatedTabs[0].id);
    } catch (err) {}
  };

  return (
    <div className={classes.container}>
      {isNewUser && (
        <AuthForm
          mode={"signup"}
          roomName={roomName}
          onSubmit={handleUserCreate}
        />
      )}

      {!isNewUser && !isLoggedIn && (
        <AuthForm
          mode={"login"}
          roomName={roomName}
          onSubmit={handleUserLogin}
        />
      )}

      {/* {!isNewUser && isLoggedIn && ( */}
      <div className={classes.bodyContainer}>
        <HeaderMenu
          tabs={tabs}
          activeTabId={activeDocumentId}
          editableTabId={editableTabId}
          onTabChange={handleActiveDocumentChange}
          onCreateTab={handleCreateTab}
          onTabEdit={handleTitleEdit}
          onTabDelete={handleDocumentDelete}
        />

        <TextEditor
          roomId={roomId}
          documentId={activeDocumentId}
          tabs={tabs}
          activeTabId={activeDocumentId}
          editableTabId={editableTabId}
          onTabChange={handleActiveDocumentChange}
          onCreateTab={handleCreateTab}
          onTabEdit={handleTitleEdit}
          onTabDelete={handleDocumentDelete}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default Main;
