import React, { useState, useRef } from "react";
import "../styles/ai.form.scss";
import { useNavigate, Link } from "react-router-dom"; 
import { useInterview } from "../hooks/useInterview";
import { useSubscription } from '../../subscription/hooks/useSubscription.js'
import {useAuth} from "../../auth/hooks/useAuth";

const Home = () => {
  const { loading, generateReport, reports } = useInterview(); 
  const {handleLogout} = useAuth();
  
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const resumeFile = resumeInputRef.current.files[0];

      if (!resumeFile) {
        setErrorMsg("Please upload your resume.");
        return;
      }

      const data = await generateReport({
        selfDescription,
        jobDescription,
        companyName,
        resumeFile 
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
      
    } catch (error) {
      console.error("Failed to generate report:", error);
      setErrorMsg(error.message || "Failed to generate the report. Please try again.");
    }
  };

  if (loading) {
    return (
        <main className='loading-screen'>
            <h1>Loading your interview plan...</h1>
        </main>
    )
  }

  return (
    // We force a column layout here to prevent side-by-side overlap
    <div className="page-wrapper" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: "3rem", 
      padding: "3rem 1rem 4rem 1rem", // Added padding top and sides
      minHeight: "100vh",             // Forces full window height
      width: "100%", 
      boxSizing: "border-box" 
    }}>
    
  <div 
  style={{
    width: "100%",
    maxWidth: "1350px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem", 
    marginBottom: "2rem",
    backgroundColor: "rgba(31, 150, 180, 0.36)", 
    border: "1px solid rgba(255, 255, 255, 0.08)", 
    borderRadius: "16px", 
    backdropFilter: "blur(10px)", 
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    {/* Optional: Adds a cool tech icon next to the title */}
    <span style={{ fontSize: "2.2rem" }}>🤖</span> 
    
    <h1 style={{ 
      margin: 0,
      fontFamily: "'Algerian', 'Trebuchet MS', sans-serif",
      fontSize: "2.2rem",
      background: "linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)", // Vibrant orange-to-pink gradient
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0px 2px 10px rgba(255, 138, 0, 0.2)",
      letterSpacing: "1px"
    }}>
      AI Interview Coach
    </h1>
  </div>

  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
    
    <button
      type="button"
      onClick={() => navigate("/subscription")}
      style={{
        background: "linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)",
        color: "white",
        border: "none",
        padding: "0.6rem 1.5rem",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "0.95rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 10px rgba(229, 46, 113, 0.3)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(229, 46, 113, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(229, 46, 113, 0.3)";
      }}
    >
      <span>💎</span> Subscriptions
    </button>

    <button
      type="button"
      onClick={async () => {
        await handleLogout();
        navigate("/login");
      }}
      className="button secondary-class-button"
      style={{
        backgroundColor: "#e53e3e", 
        color: "white",
        border: "none",
        padding: "0.6rem 1.5rem",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "0.95rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 10px rgba(229, 62, 62, 0.3)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(229, 62, 62, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(229, 62, 62, 0.3)";
      }}
    >
      Logout
    </button>
    
  </div>

</div>
      
      {/* ------------------------------- */}
      {/* 1. REPORT GENERATION FORM       */}
      {/* ------------------------------- */}
      <form className="home" onSubmit={handleGenerateReport} style={{ width: "100%", maxWidth: "1150px" }}>
        
        <div className="left">
          <header className="form-header">
            <h1>Generate Your<br /><span className="gradient-text">Interview Report</span></h1>
            <p className="subtitle">powered by Gen AI.</p>
          </header>

          {errorMsg && (
            <div className="error-message" style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "10px", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {errorMsg}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="companyName">Company Name</label>
            <div className="input-with-icon">
              <span className="icon">🏢</span>
              <input
                type="text"
                id="companyName"
                placeholder="Enter the Company Name"
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName} 
                required
                disabled={loading} 
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              placeholder="Enter Job Description...&#10;Paste the full text or key responsibilities here."
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription} 
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="right">
          <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="resume"
                accept=".pdf,.docx"
                ref={resumeInputRef}
                required
                disabled={loading}
              />
              <span className="file-hint">Supports .pdf, .docx (Max 3MB).</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <div className="textarea-container">
              <textarea
                id="selfDescription"
                placeholder="Tell us about yourself (strengths, skills, projects)..."
                onChange={(e) => setSelfDescription(e.target.value)}
                value={selfDescription} 
                maxLength={500}
                required
                disabled={loading}
              />
              <span className="char-counter">{selfDescription.length}/500</span>
            </div>
          </div>
        </div>

        <div className="bottom-actions">
          <div className="info-badge">
            Our AI analyzes data from 200+ industries for tailored reports.
          </div>
          
          <button 
            type="submit" 
            className="button secondary-class-button"
            disabled={loading} 
          >
            {loading ? "Generating Report..." : "Generate Interview Report"}
          </button>
        </div>

      </form>

      {/* ------------------------------- */}
      {/* 2. PREVIOUS REPORTS SECTION     */}
      {/* ------------------------------- */}
      <div className="previous-reports-container" style={{ width: "100%", maxWidth: "1100px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#e0e0e0" }}>Your Recent Reports</h2>
          <span style={{ fontSize: "0.9rem", color: "#888" }}>{reports ? reports.length : 0} Reports Found</span>
        </div>
        
        {!reports || reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", color: "#888" }}>
            <p className="no-reports-msg">No previous reports found. Generate one above!</p>
          </div>
        ) : (
          <div className="reports-grid" style={{ 
            display: "grid", 
            gap: "1.5rem", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" 
          }}>
            {reports.map((report) => (
              <div 
                key={report._id} 
                className="report-card" 
                style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "#ffffff", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#2d3748", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {report.jobTitle || "Role Undefined"}
                  </h3>
                  <p style={{ margin: 0, color: "#4a5568", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    🏢 {report.companyName}
                  </p>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                  <span style={{ color: "#a0aec0", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    📅 {new Date(report.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </span>
                  
                  {report.matchScore && (
                    <span style={{ 
                      fontWeight: "700", 
                      color: report.matchScore > 75 ? "#38a169" : report.matchScore > 50 ? "#dd6b20" : "#e53e3e",
                      backgroundColor: report.matchScore > 75 ? "#f0fff4" : report.matchScore > 50 ? "#fffaf0" : "#fff5f5",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem"
                    }}>
                      {report.matchScore}% Match
                    </span>
                  )}
                </div>

                <Link 
                  to={`/interview/${report._id}`} 
                  style={{ 
                    marginTop: "0.75rem", 
                    textAlign: "center", 
                    display: "block",
                    padding: "0.6rem 1rem",
                    textDecoration: "none",
                    borderRadius: "6px",
                    backgroundColor: "#f7fafc",
                    color: "#2b6cb0",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    border: "1px solid #e2e8f0",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#edf2f7"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f7fafc"}
                >
                  View Full Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;