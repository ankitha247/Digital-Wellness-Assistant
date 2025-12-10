// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="card">
      <h2>Page not found</h2>
      <p className="text-muted">The page you are looking for doesn&apos;t exist.</p>
      <Link to="/">
        <button className="btn btn-primary" style={{ marginTop: "12px" }}>
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
