// src/pages/ProfileSetupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Scale, Ruler, Moon, Activity, Heart, Target } from "lucide-react";
import { colors, gradients } from "../theme/colors";
import { API_BASE_URL } from "../api/client";

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  // Get user ID from localStorage
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const userId = userData ? userData.id : 1;

  const [formData, setFormData] = useState({
    age: "",
    gender: "female",
    weight_kg: "",
    height_cm: "",
    diet_type: "veg",
    activity_level: "medium",
    sleep_hours: "7",
    health_conditions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👉 Remember current step so it doesn’t jump back
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem("profile_current_step");
    const stepNum = saved ? Number(saved) : 1;
    if (stepNum < 1 || stepNum > 3 || Number.isNaN(stepNum)) return 1;
    return stepNum;
    const [currentStep, setCurrentStep] = useState(() => {
      const saved = sessionStorage.getItem("profile_current_step");
      const stepNum = saved ? Number(saved) : 1;
      // safety: only allow 1–3
      if (stepNum < 1 || stepNum > 3 || Number.isNaN(stepNum)) return 1;
      return stepNum;
    });

    // Save step to sessionStorage whenever it changes
    useEffect(() => {
      sessionStorage.setItem("profile_current_step", currentStep);
    }, [currentStep]);

    const totalSteps = 3;

    useEffect(() => {
      sessionStorage.setItem("profile_current_step", String(currentStep));
    }, [currentStep]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      // Validate required fields
      const requiredFields = ["age", "weight_kg", "height_cm", "sleep_hours"];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in ${field.replace("_", " ")}`);
          setLoading(false);
          return;
        }
      }

      try {
        const profileData = {
          age: Number(formData.age),
          gender: formData.gender,
          weight_kg: Number(formData.weight_kg),
          height_cm: Number(formData.height_cm),
          diet_type: formData.diet_type,
          activity_level: formData.activity_level,
          sleep_hours: Number(formData.sleep_hours),
          health_conditions: formData.health_conditions,
          fitness_goal: "general_health",
        };

        const response = await fetch(
          `${API_BASE_URL}/profile/setup?user_id=${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail || "Failed to save profile");
        }

        const result = await response.json().catch(() => ({}));
        console.log("Profile setup result:", result);

        // Mark profile complete & go to dashboard
        if (userData) {
          userData.profile_complete = true;
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // clear step progress once finished
        sessionStorage.removeItem("profile_current_step");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (err) {
        setError(err.message || "Failed to save profile");
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    };

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return (
            <>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                Personal Information
              </h2>
              <p
                style={{
                  color: colors.neutral[400],
                  marginBottom: "1.5rem",
                }}
              >
                Let's start with your basic details
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Age
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: colors.neutral[500],
                      }}
                    >
                      <User size={20} />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem 0.875rem 3rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${colors.neutral[700]}`,
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(15, 23, 42, 0.9)",
                      border: `1px solid ${colors.neutral[700]}`,
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Weight (kg)
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: colors.neutral[500],
                      }}
                    >
                      <Scale size={20} />
                    </div>
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleChange}
                      placeholder="e.g., 65"
                      min="20"
                      max="300"
                      step="0.1"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem 0.875rem 3rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${colors.neutral[700]}`,
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Height (cm)
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: colors.neutral[500],
                      }}
                    >
                      <Ruler size={20} />
                    </div>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleChange}
                      placeholder="e.g., 175"
                      min="50"
                      max="250"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem 0.875rem 3rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${colors.neutral[700]}`,
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          );

        case 2:
          return (
            <>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                Lifestyle & Diet
              </h2>
              <p
                style={{
                  color: colors.neutral[400],
                  marginBottom: "1.5rem",
                }}
              >
                Tell us about your daily habits
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Diet Type
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      { value: "veg", label: "Vegetarian", icon: "🥦" },
                      { value: "non_veg", label: "Non-Vegetarian", icon: "🍗" },
                      { value: "vegan", label: "Vegan", icon: "🌱" },
                      { value: "eggetarian", label: "Eggetarian", icon: "🥚" },
                    ].map((diet) => (
                      <button
                        key={diet.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, diet_type: diet.value })
                        }
                        style={{
                          padding: "1rem",
                          background:
                            formData.diet_type === diet.value
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(15, 23, 42, 0.9)",
                          border: `1px solid ${formData.diet_type === diet.value
                            ? colors.primary[500]
                            : colors.neutral[700]
                            }`,
                          borderRadius: "10px",
                          color: "white",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>{diet.icon}</span>
                        {diet.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Activity Level
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      { value: "low", label: "Low", icon: <Activity size={20} /> },
                      {
                        value: "medium",
                        label: "Medium",
                        icon: <Heart size={20} />,
                      },
                      { value: "high", label: "High", icon: <Target size={20} /> },
                    ].map((activity) => (
                      <button
                        key={activity.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            activity_level: activity.value,
                          })
                        }
                        style={{
                          padding: "1rem",
                          background:
                            formData.activity_level === activity.value
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(15, 23, 42, 0.9)",
                          border: `1px solid ${formData.activity_level === activity.value
                            ? colors.primary[500]
                            : colors.neutral[700]
                            }`,
                          borderRadius: "10px",
                          color: "white",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            color:
                              formData.activity_level === activity.value
                                ? colors.primary[400]
                                : colors.neutral[500],
                          }}
                        >
                          {activity.icon}
                        </div>
                        {activity.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      color: colors.neutral[300],
                    }}
                  >
                    Sleep Hours (per day)
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: colors.neutral[500],
                      }}
                    >
                      <Moon size={20} />
                    </div>
                    <input
                      type="number"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      placeholder="e.g., 7.5"
                      min="3"
                      max="16"
                      step="0.5"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem 0.875rem 3rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${colors.neutral[700]}`,
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          );

        case 3:
          return (
            <>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                Health Information
              </h2>
              <p
                style={{
                  color: colors.neutral[400],
                  marginBottom: "1.5rem",
                }}
              >
                Help us understand your health better
              </p>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    color: colors.neutral[300],
                  }}
                >
                  Health Conditions (Optional)
                </label>
                <textarea
                  name="health_conditions"
                  value={formData.health_conditions}
                  onChange={handleChange}
                  placeholder="E.g., Migraine, PCOS, Diabetes, Anxiety, Allergies..."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: `1px solid ${colors.neutral[700]}`,
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.95rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: colors.neutral[500],
                    marginTop: "0.5rem",
                  }}
                >
                  This information helps us provide more personalized
                  recommendations.
                </p>
              </div>

              <div
                style={{
                  background: "rgba(37, 99, 235, 0.12)",
                  border: `1px solid ${colors.primary[500]}`,
                  borderRadius: "10px",
                  padding: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: colors.primary[300],
                    marginBottom: "0.5rem",
                  }}
                >
                  Your data is secure and confidential
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: colors.neutral[400],
                  }}
                >
                  We use end-to-end encryption and comply with healthcare privacy
                  regulations. Your information is only used to personalize your
                  wellness experience.
                </p>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #1f2937 0, #020617 45%, #000 100%)",
          color: "#e5e7eb",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "2rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              Complete Your Profile
            </h1>
            <p
              style={{
                color: colors.neutral[400],
                marginBottom: "1.5rem",
              }}
            >
              {userData?.name ? `Welcome, ${userData.name}! ` : ""}
              Let's personalize your wellness journey
            </p>

            {/* Progress Steps */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {Array.from({ length: totalSteps }).map((_, index) => (
                <React.Fragment key={index}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        currentStep > index + 1
                          ? gradients.primary
                          : currentStep === index + 1
                            ? colors.primary[500]
                            : colors.neutral[700],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {currentStep > index + 1 ? "✓" : index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      style={{
                        width: "60px",
                        height: "2px",
                        background:
                          currentStep > index + 1
                            ? gradients.primary
                            : colors.neutral[700],
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              borderRadius: "20px",
              padding: "2.5rem",
            }}
          >
            {renderStep()}

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${colors.error}`,
                  borderRadius: "8px",
                  color: colors.error,
                  fontSize: "0.875rem",
                  marginTop: "1.5rem",
                }}
              >
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
              }}
            >
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    padding: "0.875rem 2rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: colors.neutral[300],
                    border: `1px solid ${colors.neutral[700]}`,
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    padding: "0.875rem 2rem",
                    background: gradients.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.875rem 2rem",
                    background: gradients.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.3s",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </button>
              )}
            </div>
          </form>

          {/* Privacy Note */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              color: colors.neutral[500],
              fontSize: "0.75rem",
            }}
          >
            Your information is securely stored and used only for providing
            personalized wellness recommendations.
          </p>
        </div>
      </div>
    </div >
  );
};

export default ProfileSetupPage;
