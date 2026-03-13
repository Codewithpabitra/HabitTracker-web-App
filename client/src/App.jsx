import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";
import Dashboard from "./Pages/Dashboard";
import DashLayout from "./layouts/DashLayout";
import Habits from "./Pages/Habits";
import Journals from "./Pages/Journals";
import YourJournals from "./Pages/YourJournals";
import EmotionalDashboard from "./Pages/EmotionalDashboard";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="journals" element={<Journals />} />
          <Route path="your-journals" element={<YourJournals />} />
          <Route path="emotional-dashboard" element={<EmotionalDashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
