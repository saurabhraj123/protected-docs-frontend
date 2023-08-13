import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import "./TextEditor.css";

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

const TextEditor = ({ roomId, documentId }) => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState();
  const [isTextChange, setIsTextChange] = useState(false);

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
    const beforeUnloadListener = (e) => {
      e.preventDefault();
      e.returnValue = "Please save your document first."; // For Chrome
    };

    window.addEventListener("beforeunload", beforeUnloadListener);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, []);

  useEffect(() => {
    const s = io("http://localhost:3001", {
      auth: { token: sessionStorage.getItem("token") },
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [documentId]);

  useEffect(() => {
    console.log("\n\nDocument Id changed to:", documentId);
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
      if (isTextChange) {
        socket.emit("save-document", quill.getContents(), documentId);
        console.log("it is called");
        setIsTextChange(false);
      }
    }, 2000);

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
      setIsTextChange(true);
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
