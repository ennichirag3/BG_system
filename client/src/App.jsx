import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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

  element={

    <ProtectedRoute>

      <Dashboard />

    </ProtectedRoute>

  }

/>

        {/* BG REQUEST */}
        <Route

  path="/bg-request"

  element={

    <ProtectedRoute>

      <BGRequest />

    </ProtectedRoute>

  }

/>

        {/* APPROVAL */}
        <Route

path="/approval"

element={

  <ProtectedRoute>

    <Approval />

  </ProtectedRoute>

}

/>

        {/* REPORTS */}
        <Route

  path="/reports"

  element={

    <ProtectedRoute>

      <Reports />

    </ProtectedRoute>

  }

/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;