import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Wstecz" }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
      {label}
    </button>
  );
}
