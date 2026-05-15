import { BrowserRouter, Routes, Route } from "react-router-dom";

// PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BGRequest from "./pages/BGRequest";
import Approval from "./pages/Approval";
import Reports from "./pages/Reports";

function App() {
  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* REGISTER PAGE */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* BG REQUEST */}
        <Route
          path="/bg-request"
          element={<BGRequest />}
        />

        {/* APPROVAL */}
        <Route
          path="/approval"
          element={<Approval />}
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={<Reports />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;