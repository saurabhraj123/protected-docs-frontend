import { Routes, Navigate, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { v4 as uuidV4 } from "uuid";
import Main from "./pages/Main";

const App = () => {
  return (
    <Routes>
      <Route path="/:roomName" element={<Main />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to={`/document/${uuidV4()}`} />} />
    </Routes>
  );
};

export default App;
