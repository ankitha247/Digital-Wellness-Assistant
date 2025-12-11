// src/pages/DashboardPage.jsx - FINAL VERSION (Auto BMI Status + Chat UI)
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, Activity, Heart, Zap, Droplets, Footprints } from 'lucide-react';
import { colors, gradients } from '../theme/colors';
import { API_BASE_URL } from '../api/client';

const DashboardPage = () => {
  const messagesEndRef = useRef(null);

  // Get user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? (() => {
    try { return JSON.parse(storedUser); } catch { return null; }
  })() : null;

  const userId = user ? user.id : null;

  // PROFILE STATE
  const [userProfile, setUserProfile] = useState(null);

  // Fetch profile from backend
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/get?user_id=${userId}`);
        const data = await res.json();

        if (data.profile) {
          setUserProfile(data.profile);

          // Optional: store locally
          localStorage.setItem("user_profile", JSON.stringify(data.profile));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [userId]);

  // ---------------------------------------
  // CHAT SYSTEM STATES
  // ---------------------------------------
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: user?.name
        ? `Hello ${user.name}! I'm your Wellness Assistant. I've analyzed your health profile and I'm ready to provide personalized advice. How can I help you today?`
        : "Hello! I'm your Wellness Assistant. I've analyzed your health profile and I'm ready to provide personalized advice. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentsUsed, setAgentsUsed] = useState([]);

  // -------- HEALTH CALCULATIONS --------
  const calculateBMI = () => {
    if (!userProfile?.weight_kg || !userProfile?.height_cm) return null;
    const heightM = userProfile.height_cm / 100;
    const bmi = (userProfile.weight_kg / (heightM * heightM)).toFixed(1);
    return parseFloat(bmi);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#f59e0b' };
    if (bmi < 25) return { category: 'Normal', color: '#10b981' };
    if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
    return { category: 'Obese', color: '#ef4444' };
  };

  const calculateWaterGoal = () => {
    if (!userProfile?.weight_kg) return '2.5L';
    let baseWater = userProfile.weight_kg * 0.033;
    if (userProfile.activity_level === 'medium') baseWater *= 1.2;
    if (userProfile.activity_level === 'high') baseWater *= 1.5;
    return `${baseWater.toFixed(1)}L`;
  };

  const calculateStepsGoal = () => {
    if (!userProfile?.activity_level) return '8,000 steps';
    switch (userProfile.activity_level) {
      case 'low': return '5,000 steps';
      case 'medium': return '8,000 steps';
      case 'high': return '12,000 steps';
      default: return '8,000 steps';
    }
  };

  const calculateSleepTarget = () => {
    if (!userProfile?.age) return '7-8 hours';
    const age = userProfile.age;
    if (age < 18) return '8-10 hours';
    if (age < 65) return '7-9 hours';
    return '7-8 hours';
  };

  // CALCULATED VALUES
  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : { category: '--', color: colors.neutral[400] };
  const waterGoal = calculateWaterGoal();
  const stepsGoal = calculateStepsGoal();
  const sleepTarget = calculateSleepTarget();

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Safe JSON
  const readJsonSafe = async (res) => {
    try { return await res.json(); } catch { return null; }
  };

  // Chat sending
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError('');

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const jwt = localStorage.getItem("token") || null;

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({
          ...(userId ? { user_id: userId } : {}),
          message: trimmed,
        }),
      });

      if (!res.ok) {
        const errData = await readJsonSafe(res) || {};
        throw new Error(errData.detail || errData.error || "Failed to connect");
      }

      const data = await readJsonSafe(res) || {};

      const assistantText =
        data.response || data.answer || data.text || "I'm here to help!";

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (Array.isArray(data.agents_used)) setAgentsUsed(data.agents_used);

    } catch (err) {
      setError(err.message || "Network error");
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => setAgentsUsed([]), 3000);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    }}>

      {/* HEADER */}
      <div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, #ffffff, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Wellness Dashboard
        </h1>

        <p style={{ color: colors.neutral[400] }}>
          {user?.name ? `Welcome back, ${user.name}` : 'Welcome to your wellness dashboard'}
        </p>
      </div>

      {/* HEALTH SUMMARY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>

        {/* BMI STATUS */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Heart size={24} color="white" />
          </div>

          <div>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>BMI Status</p>
            <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: '600' }}>
              {bmi ? `${bmiCategory.category} (${bmi})` : '--'}
            </p>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Based on your profile</p>
          </div>
        </div>

        {/* WATER */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Droplets size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Daily Water Goal</p>
            <p style={{ fontSize: '1.25rem', color: 'white' }}>{waterGoal}</p>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Based on weight</p>
          </div>
        </div>

        {/* STEPS */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f7971e, #ffd200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Footprints size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Daily Steps Goal</p>
            <p style={{ fontSize: '1.25rem', color: 'white' }}>{stepsGoal}</p>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Based on activity</p>
          </div>
        </div>

        {/* SLEEP */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Sleep Target</p>
            <p style={{ fontSize: '1.25rem', color: 'white' }}>{sleepTarget}</p>
            <p style={{ fontSize: '0.875rem', color: colors.neutral[400] }}>Based on age</p>
          </div>
        </div>

      </div>

      {/* CHAT SYSTEM (UNCHANGED) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={24} color="white" />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '1.25rem' }}>Wellness Assistant</h2>
          </div>
        </div>

        {/* CHAT BOX */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          padding: '1.5rem',
          overflowY: 'auto',
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              marginBottom: '1rem',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '1rem',
                borderRadius: '12px',
                background: msg.role === 'user'
                  ? 'rgba(59,130,246,0.25)'
                  : 'rgba(255,255,255,0.05)',
                color: 'white',
                maxWidth: '80%',
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your health..."
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              background: gradients.primary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Send size={20} /> Send
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '1rem',
        textAlign: 'center',
        background: 'rgba(59,130,246,0.05)',
        borderRadius: '8px',
      }}>
        <p style={{ color: colors.neutral[400], fontSize: '0.8rem' }}>
          FitAura AI provides wellness suggestions. Always consult a medical professional.
        </p>
      </div>

    </div>
  );
};

export default DashboardPage;
