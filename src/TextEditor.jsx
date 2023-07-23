import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState();

  const containerRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(q);

    return () => {
      wrapper.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return <div className="container" ref={containerRef}></div>;
};

export default TextEditor;
