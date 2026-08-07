import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useMemo } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyRatesProvider } from "./context/CurrencyRatesContext";
import { getRoomIdentity, localStorageDriver } from "./storage/localStorageDriver";
import { supabaseRoomDriver } from "./storage/supabaseDriver";
import { sessionDriver, getSession } from "./storage/sessionsStore";

import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import OfflineSessionsPage from "./pages/OfflineSessionsPage";
import AuthPage from "./pages/AuthPage";
import RoomLobbyPage from "./pages/RoomLobbyPage";
import GuestLobbyPage from "./pages/GuestLobbyPage";
import PeoplePage from "./pages/PeoplePage";
import ExpensesPage from "./pages/ExpensesPage";
import ScanPage from "./pages/ScanPage";
import RestaurantPage from "./pages/RestaurantPage";
import SettlePage from "./pages/SettlePage";
import PlanPage from "./pages/PlanPage";
import ChatPage from "./pages/ChatPage";

import "./App.css";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><span />Checking your sessionâ€¦</div>;
  if (!user) return <Navigate to="/online" replace />;
  return children;
}

function OfflineLayout() {
  const { sessionId } = useParams();
  const session = getSession(sessionId);
  const driver = useMemo(() => sessionDriver(sessionId), [sessionId]);
  if (!session) return <Navigate to="/offline" replace />;
  return <AppLayout key={sessionId} driver={driver} sessionName={session.name} backTo="/offline" ownerMode />;
}

function OnlineRoomLayout() {
  const { roomId } = useParams();
  const driver = useMemo(() => supabaseRoomDriver(roomId), [roomId]);
  return <AppLayout key={roomId} driver={driver} roomCode={roomId} backTo="/online/lobby" />;
}

function GuestRoomLayout() {
  const { roomId } = useParams();
  const driver = useMemo(() => localStorageDriver(roomId), [roomId]);
  if (!driver.exists()) return <Navigate to="/guest" replace />;
  const room = driver.read();
  return <AppLayout key={roomId} driver={driver} currentMemberId={getRoomIdentity(roomId)} roomCode={roomId} sessionName={room?.tripName} backTo="/guest" guest />;
}

export default function App() {
  return (
    <CurrencyRatesProvider>
      <LanguageProvider>
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
            <Route path="scan" element={<ScanPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>

          {/* Guest rooms — no account required. Uses the same driver contract Supabase can replace. */}
          <Route path="/guest" element={<GuestLobbyPage />} />
          <Route path="/guest/room/:roomId" element={<GuestRoomLayout />}>
            <Route index element={<Navigate to="people" replace />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="chat" element={<ChatPage />} />
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
            <Route path="scan" element={<ScanPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </CurrencyRatesProvider>
  );
}
