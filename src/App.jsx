import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyRatesProvider } from "./context/CurrencyRatesContext";
import { supabaseRoomDriver } from "./storage/supabaseDriver";
import { sessionDriver, getSession } from "./storage/sessionsStore";

import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import OfflineSessionsPage from "./pages/OfflineSessionsPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import RoomLobbyPage from "./pages/RoomLobbyPage";
import PeoplePage from "./pages/PeoplePage";
import MemberProfilePage from "./pages/MemberProfilePage";
import ExpensesPage from "./pages/ExpensesPage";
import ScanPage from "./pages/ScanPage";
import RestaurantPage from "./pages/RestaurantPage";
import SettlePage from "./pages/SettlePage";
import PlanPage from "./pages/PlanPage";
import DecisionsPage from "./pages/DecisionsPage";
import ChatPage from "./pages/ChatPage";
import { normalizeRoomCode, sharedRoomAuthPath } from "./utils/roomAccess";
import NativeAppBridge from "./components/NativeAppBridge";

import "./App.css";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="app-loading"><span />Checking your sessionâ€¦</div>;
  if (!user) {
    const roomCode = normalizeRoomCode(location.pathname.match(/^\/online\/room\/([^/]+)/i)?.[1]);
    const destination = roomCode ? sharedRoomAuthPath(roomCode) : "/online";
    return <Navigate to={destination} replace />;
  }
  return children;
}

function LegacyGuestRedirect() {
  const { roomId = "" } = useParams();
  return <Navigate to={sharedRoomAuthPath(roomId)} replace />;
}

function OfflineLayout() {
  const { sessionId } = useParams();
  const session = getSession(sessionId);
  const driver = useMemo(() => sessionDriver(sessionId), [sessionId]);
  if (!session) return <Navigate to="/offline" replace />;
  return <AppLayout key={sessionId} driver={driver} sessionName={session.name} notificationKey={`offline:${sessionId}`} backTo="/offline" ownerMode />;
}

function OnlineRoomLayout() {
  const { roomId } = useParams();
  const driver = useMemo(() => supabaseRoomDriver(roomId), [roomId]);
  return <AppLayout key={roomId} driver={driver} roomCode={roomId} notificationKey={`online:${roomId}`} backTo="/online/lobby" />;
}

export default function App() {
  return (
    <CurrencyRatesProvider>
      <LanguageProvider>
        <AuthProvider>
        <BrowserRouter>
        <NativeAppBridge />
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Offline — multiple named sessions */}
          <Route path="/offline" element={<OfflineSessionsPage />} />
          <Route path="/offline/:sessionId" element={<OfflineLayout />}>
            <Route index element={<Navigate to="people" replace />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="people/:personId" element={<MemberProfilePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="decisions" element={<DecisionsPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>

          {/* Old guest links now continue through authenticated shared rooms. */}
          <Route path="/guest/room/:roomId/*" element={<LegacyGuestRedirect />} />
          <Route path="/guest/*" element={<LegacyGuestRedirect />} />

          {/* Online — auth-gated rooms */}
          <Route path="/online" element={<AuthPage />} />
          <Route
            path="/profile"
            element={<RequireAuth><ProfilePage /></RequireAuth>}
          />
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
            <Route path="people/:personId" element={<MemberProfilePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="settle" element={<SettlePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="decisions" element={<DecisionsPage />} />
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
