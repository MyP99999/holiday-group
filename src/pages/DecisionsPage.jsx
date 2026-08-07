import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DecisionBoard from "../components/DecisionBoard";

export default function DecisionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [startRequest] = useState(() => location.state?.decisionRequest || null);

  useEffect(() => {
    if (location.state?.decisionRequest) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="page-stack decisions-page">
      <DecisionBoard startRequest={startRequest} />
    </div>
  );
}

