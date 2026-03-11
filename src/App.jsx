import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useMemo } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { memoryDriver } from "./storage/memoryDriver";
import { localStorageDriver } from "./storage/localStorageDriver";
import { sessionDriver, getSession } from "./storage/sessionsStore";

import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import OfflineSessionsPage from "./pages/OfflineSessionsPage";
import AuthPage from "./pages/AuthPage";
import RoomLobbyPage from "./pages/RoomLobbyPage";
import PeoplePage from "./pages/PeoplePage";
import ExpensesPage from "./pages/ExpensesPage";
import SettlePage from "./pages/SettlePage";
import PlanPage from "./pages/PlanPage";

import "./App.css";

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/online" replace />;
  return children;
}

function OfflineLayout() {
  const { sessionId } = useParams();
  const session = getSession(sessionId);
  const driver = useMemo(() => sessionDriver(sessionId), [sessionId]);
  if (!session) return <Navigate to="/offline" replace />;
  return <AppLayout key={sessionId} driver={driver} sessionName={session.name} backTo="/offline" />;
}

function OnlineRoomLayout() {
  const { roomId } = useParams();
  const driver = useMemo(() => localStorageDriver(roomId), [roomId]);
  if (!driver.exists()) return <Navigate to="/online/lobby" replace />;
  return <AppLayout key={roomId} driver={driver} roomCode={roomId} backTo="/online/lobby" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Offline — multiple named sessions */}
          <Route path="/offline" element={<OfflineSessionsPage />} />
          <Route path="/offline/:sessionId" element={<OfflineLayout />}>
            <Route index element={<Navigate to="people" replace />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
          </Route>

          {/* Online — auth-gated rooms */}
          <Route path="/online" element={<AuthPage />} />
          <Route
            path="/online/lobby"
            element={<RequireAuth><RoomLobbyPage /></RequireAuth>}
          />
          <Route
            path="/online/room/:roomId"
            element={<RequireAuth><OnlineRoomLayout /></RequireAuth>}
          >
            <Route index element={<Navigate to="people" replace />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
