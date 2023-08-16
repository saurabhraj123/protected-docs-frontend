import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import "./TextEditor.css";
import Tabs from "../Tabs";
import { SOCKET_URI } from "../../config";
import ReactDOM from "react-dom/client";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

const TextEditor = ({
  roomId,
  documentId,
  tabs,
  editableTabId,
  activeTabId,
  onTabChange,
  onTabEdit,
  onTabDelete,
  onCreateTab,
}) => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState();

  const textChangeRef = useRef(false);

  const containerRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });

    q.disable();
    setQuill(q);
  }, []);

  useEffect(() => {
    const editorDiv = document.querySelector(".ql-toolbar");
    const tabsContainer = document.createElement("div");
    ReactDOM.createRoot(tabsContainer).render(
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        editableTabId={editableTabId}
        onTabChange={onTabChange}
        onCreateTab={onCreateTab}
        onTabEdit={onTabEdit}
        onTabDelete={onTabDelete}
      />
    );
    editorDiv.after(tabsContainer);

    return () => {
      tabsContainer.remove();
    };
  }, [
    tabs,
    activeTabId,
    editableTabId,
    onTabChange,
    onCreateTab,
    onTabEdit,
    onTabDelete,
  ]);

  useEffect(() => {
    const beforeUnloadListener = (e) => {
      console.log("yaha aahi gaya");
      if (textChangeRef.current) {
        e.preventDefault();
        e.returnValue = "Please save your document first.";
      }
    };

    window.addEventListener("beforeunload", beforeUnloadListener);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, []);

  useEffect(() => {
    const s = io(SOCKET_URI, {
      auth: { token: sessionStorage.getItem("token") },
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [documentId]);

  useEffect(() => {
    if (socket == null || quill == null || documentId == null || roomId == null)
      return;

    socket.once("load-document", (document) => {
      document && quill.setContents(JSON.parse(document));
      quill.enable();
    });

    console.log("roomId", roomId, "documentId", documentId);
    socket.emit("get-document", documentId);
  }, [socket, quill, roomId, documentId]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      console.log("isTextChange", textChangeRef.current);
      if (textChangeRef.current) {
        socket.emit("save-document", quill.getContents(), documentId);
        console.log("it is called");
      }
    }, 2000);

    socket.on("changes-saved", () => {
      console.log("changes-saved");
      textChangeRef.current = false;
    });

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta, oldDelta, source) => {
      if (socket === null || quill === null) return;
      if (source !== "user") return;

      console.log("documentId", documentId);
      console.log("changes", delta, documentId);
      socket.emit("send-changes", delta);
      textChangeRef.current = true;
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("recieve-changes", handler);
    };
  }, [socket, quill]);

  return <div className="container" ref={containerRef}></div>;
};

export default TextEditor;
