import React, { useState } from "react";
import "../styles/subscription.styles.scss";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate, Link } from "react-router-dom"; 
import { useInterview } from "../../ai/hooks/useInterview";
import {useAuth} from "../../auth/hooks/useAuth"

// --- Reusable SVG Icons ---
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- FAQ Sub-component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <h4>{question}</h4>
        <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
};

// --- Main Component ---
const SubscriptionPage = () => {
  const navigate = useNavigate();
  // ✅ FIX: Moved this line inside the component body!
  const { handleLogout } = useAuth();

  const {
    subscription,
    checkoutSubscription,
    verifySub,
    refreshSubscription,
    cancelSub,
    loading
  } = useSubscription();

  const isPro = subscription?.plan === "PRO";

  const handleUpgrade = async () => {
    try {

        const sub = await checkoutSubscription();

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,

            subscription_id: sub.id,

            name: "AI Interview Platform",

            description: "PRO Subscription",

            theme: {
                color: "#6366f1"
            },

            handler: async function (response) {

                await verifySub({
                    razorpay_payment_id:
                        response.razorpay_payment_id,

                    razorpay_subscription_id:
                        response.razorpay_subscription_id,

                    razorpay_signature:
                        response.razorpay_signature
                });

                await refreshSubscription();

                alert(
                    "Subscription activated successfully!"
                );
            }
        };

        const razorpay =
            new window.Razorpay(options);

        razorpay.open();

    } catch (error) {
        console.error(error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "white" }}>
        <h2>Loading Subscription Data...</h2>
      </div>
    );
  }

  return (
    // 1. The Main Wrapper: This holds the whole page, centers content, and provides padding.
    <div className="subscription-page-wrapper" style={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0b0f19",
      alignItems: "center",
      minHeight: "100vh",
      width: "100%",
      padding: "2rem 1rem", // Gives some breathing room at the top and sides
      boxSizing: "border-box"
    }}>

      {/* 2. THE HEADER */}
      <div 
        className="subscription-header glass-card"
        style={{
          width: "100%",
          maxWidth: "1350px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem", 
          marginTop: "1rem",
          marginBottom: "3rem", // Pushes the content down below the header
          // Reverted to your original dark glassmorphism background:
          backgroundColor: "rgba(31, 150, 180, 0.36)", 
          border: "1px solid rgba(255, 255, 255, 0.08)", 
          borderRadius: "16px", 
          backdropFilter: "blur(10px)", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Header Left: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2.2rem" }}>🤖</span> 
          <h1 style={{ 
            margin: 0,
            fontFamily: "'Algerian', 'Trebuchet MS', sans-serif",
            fontSize: "2.2rem",
            background: "linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)", 
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 2px 10px rgba(255, 138, 0, 0.2)",
            letterSpacing: "1px"
          }}>
            AI Interview Coach
          </h1>
        </div>

        {/* Header Right: Actions */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
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
          >
            {/* Changed from 💎 to an SVG Home Icon for a cleaner look */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </button>

          <button
            type="button"
            onClick={async () => {
              await handleLogout();
              navigate("/login");
            }}
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
          >
            Logout
          </button>
        </div>
      </div>

      {/* 3. MAIN PAGE CONTENT */}
      {/* Notice we set maxWidth to match the header, so they align perfectly on large screens */}
      <div className="subscription-page" style={{ width: "100%", maxWidth: "1350px" }}>
        
        {/* 1. Hero Section */}
        <section className="hero-section">
          <h1>Choose Your <span className="gradient-text">Plan</span></h1>
          <p className="subtitle">Unlock unlimited AI-powered interview preparation and resume generation.</p>
        </section>

        {/* 2. Current Subscription Card */}
        <section className="current-plan-section">
          <div className="glass-card current-plan-card">
            <div className="plan-header">
              <div>
                <h3>Current Plan: <strong>{isPro ? "PRO" : "FREE"}</strong></h3>
                {isPro && <span className="badge pro-badge">PRO Member</span>}
              </div>
              <div className="status">
                Status:
                <span className={subscription?.status === "active" ? "active" : "inactive"} style={{ marginLeft: "0.5rem" }}>
                  {subscription?.status || "Free Tier"}
                </span>
              </div>
            </div>
            
            <div className="plan-details">
              <div className="detail-item">
                <span className="label">Reports Used:</span>
                <span className="value">
                  {isPro ? "Unlimited" : `${subscription?.reportsGenerated || 0} / 3`}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Next Reset Date:</span>
                <span className="value">
                  {subscription?.usageResetDate ? new Date(subscription.usageResetDate).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
            
            {/* Progress Bar for Free Users */}
            {!isPro && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${((subscription?.reportsGenerated || 0) / 3) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Pricing Section */}
        <section className="pricing-section">
          <div className="pricing-grid">
            
            {/* FREE PLAN */}
            <div className="pricing-card glass-card">
              <h2 className="plan-name">Free Plan</h2>
              <div className="price">
                <span className="amount">₹0</span>
                <span className="duration">/month</span>
              </div>
              <ul className="features-list">
                <li><CheckIcon /> 3 AI Interview Reports / month</li>
                <li><CheckIcon /> Basic interview preparation</li>
                <li><CheckIcon /> Community support</li>
                <li className="disabled"><CrossIcon /> Resume PDF Generation</li>
                <li className="disabled"><CrossIcon /> Priority support</li>
              </ul>
              {!isPro ? (
                <button className="btn btn-outline" disabled>Current Plan</button>
              ) : null}
            </div>

            {/* PRO PLAN */}
            <div className="pricing-card glass-card pro-card">
              <div className="popular-badge">Most Popular</div>
              <h2 className="plan-name gradient-text">Pro Plan</h2>
              <div className="price">
                <span className="amount">₹300</span>
                <span className="duration">/month</span>
              </div>
              <ul className="features-list">
                <li><CheckIcon /> <strong>Unlimited</strong> AI Reports</li>
                <li><CheckIcon /> <strong>Resume PDF Generation</strong></li>
                <li><CheckIcon /> Priority email & chat support</li>
                <li><CheckIcon /> Advanced behavioral analysis</li>
                <li><CheckIcon /> Future premium features</li>
              </ul>
              {!isPro ? (
                <button
                  className="btn btn-primary glow-btn"
                  onClick={() => handleUpgrade()}
                  >
                  Upgrade to Pro
                  </button>
              ) : (
                <div className="pro-actions">
                  <button className="btn btn-primary">Current Plan</button>
                  <button className="btn btn-danger" onClick={cancelSub}>Cancel Subscription</button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 4. Feature Comparison Table */}
        <section className="comparison-section">
          <h2>Compare Features</h2>
          <div className="table-container glass-card">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>FREE</th>
                  <th>PRO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Reports</td>
                  <td>3</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Resume Generation</td>
                  <td><CrossIcon /></td>
                  <td><CheckIcon /></td>
                </tr>
                <tr>
                  <td>Support Level</td>
                  <td>Community</td>
                  <td>Priority</td>
                </tr>
                <tr>
                  <td>Premium Features</td>
                  <td><CrossIcon /></td>
                  <td><CheckIcon /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <FAQItem 
              question="What happens after I upgrade?" 
              answer="Your account is instantly upgraded to PRO. The report limit is removed immediately, and you gain access to Resume PDF generation." 
            />
            <FAQItem 
              question="Can I cancel anytime?" 
              answer="Yes, you can cancel your subscription at any time from your account dashboard. You will retain PRO features until the end of your billing cycle." 
            />
            <FAQItem 
              question="When does my report limit reset?" 
              answer="FREE users receive 3 report generations per month. If you have not used the platform for a while, your quota will automatically refresh the next time you generate a report after the reset date."
            />
            <FAQItem 
              question="How are payments processed?" 
              answer="All payments are securely processed through Razorpay. We do not store your credit card information on our servers." 
            />
          </div>
        </section>

        {/* 6. Footer Note */}
        <footer className="footer-note">
          <p>🔒 Secure payments powered by <strong>Razorpay</strong>.</p>
        </footer>

      </div>
    </div>
  );
};

export default SubscriptionPage;