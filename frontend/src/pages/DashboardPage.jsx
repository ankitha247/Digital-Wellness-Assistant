// src/pages/DashboardPage.jsx - UPDATED NEAT VERSION
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, Activity, Heart, Zap, Droplets, Footprints } from 'lucide-react';
import { colors, gradients } from '../theme/colors';
import { API_BASE_URL } from '../api/client';

const DashboardPage = () => {
  const messagesEndRef = useRef(null);
  
  // Get user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : 1;
  
  // Get user profile from localStorage
  const storedProfile = localStorage.getItem('user_profile');
  const userProfile = storedProfile ? JSON.parse(storedProfile) : null;

  // State for messages
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

  // Health calculation functions
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
    let baseWater = userProfile.weight_kg * 0.033; // 33ml per kg
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

  // Calculate health metrics
  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : { category: '--', color: colors.neutral[400] };
  const waterGoal = calculateWaterGoal();
  const stepsGoal = calculateStepsGoal();
  const sleepTarget = calculateSleepTarget();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show agent status with delay
  const showAgentStatus = (agents) => {
    setAgentsUsed(agents);
    setTimeout(() => {
      setAgentsUsed([]);
    }, 3000);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError('');
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Show agent thinking status
    const thinkingAgents = [
      'Analyzing your health profile...',
      'Checking symptoms...',
      'Consulting nutrition database...',
      'Generating personalized response...'
    ];
    
    // Cycle through agent statuses
    let agentIndex = 0;
    const agentInterval = setInterval(() => {
      setAgentsUsed([thinkingAgents[agentIndex]]);
      agentIndex = (agentIndex + 1) % thinkingAgents.length;
    }, 800);

    try {
      // FIXED: Using "message" not "query"
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: trimmed, // ← IMPORTANT: This matches backend
        }),
      });

      clearInterval(agentInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to get response');
      }

      const data = await res.json();
      
      // Show final agents used
      if (data.agents_used) {
        showAgentStatus(data.agents_used);
      } else {
        showAgentStatus(['Analysis complete']);
      }
      
      // Add assistant message
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.response || "I'm here to help with your wellness journey!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      clearInterval(agentInterval);
      setError(err.message);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "Sorry, I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      {/* Header */}
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
        <p style={{
          color: colors.neutral[400],
        }}>
          {user?.name ? `Welcome back, ${user.name}` : 'Welcome to your wellness dashboard'}
        </p>
      </div>

      {/* Health Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1rem',
      }}>
        {/* BMI Card */}
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Activity size={24} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
              marginBottom: '0.25rem',
            }}>
              BMI Status
            </p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
            }}>
              {bmi || '--'}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: bmiCategory.color,
            }}>
              {bmiCategory.category}
            </p>
          </div>
        </div>

        {/* Water Goal Card */}
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
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Droplets size={24} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
              marginBottom: '0.25rem',
            }}>
              Daily Water Goal
            </p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
            }}>
              {waterGoal}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
            }}>
              Based on your weight
            </p>
          </div>
        </div>

        {/* Steps Goal Card */}
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
            background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Footprints size={24} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
              marginBottom: '0.25rem',
            }}>
              Daily Steps Goal
            </p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
            }}>
              {stepsGoal}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
            }}>
              Based on activity level
            </p>
          </div>
        </div>

        {/* Sleep Target Card */}
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={24} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
              marginBottom: '0.25rem',
            }}>
              Sleep Target
            </p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
            }}>
              {sleepTarget}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: colors.neutral[400],
            }}>
              Based on your age
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'white',
              }}>
                Wellness Assistant
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: colors.neutral[400],
                }}>
                  AI is analyzing your profile
                </span>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
          }}>
            <Sparkles size={16} color={colors.primary[400]} />
            <span style={{
              fontSize: '0.875rem',
              color: colors.primary[400],
              fontWeight: '500',
            }}>
              AI-Powered
            </span>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
          maxHeight: '600px',
        }}>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.5rem',
                }}
              >
                {/* Sender Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.25rem',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {message.role === 'user' ? (
                      <User size={16} color="white" />
                    ) : (
                      <Bot size={16} color="white" />
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: message.role === 'user' ? colors.primary[400] : colors.secondary[400],
                  }}>
                    {message.role === 'user' ? 'You' : 'Wellness Assistant'}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: colors.neutral[500],
                  }}>
                    {message.timestamp}
                  </span>
                </div>

                {/* Message Bubble */}
                <div style={{
                  maxWidth: '80%',
                  padding: '1rem 1.25rem',
                  background: message.role === 'user'
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.25))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${message.role === 'user' 
                    ? 'rgba(59,130,246,0.3)' 
                    : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: message.role === 'user' 
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  color: 'white',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}>
                  {message.text}
                </div>
              </div>
            ))}

            {/* Agent Status Display */}
            {agentsUsed.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '1rem',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                {agentsUsed.map((agent, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: `1px solid ${colors.primary[500]}30`,
                      borderRadius: '12px',
                      color: colors.primary[300],
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: colors.primary[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'spin 1s linear infinite',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'white',
                      }} />
                    </div>
                    {agent}
                  </div>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && agentsUsed.length === 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '18px 18px 18px 4px',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: colors.neutral[400],
                    animation: 'bounce 1.4s infinite',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: colors.neutral[400],
                    animation: 'bounce 1.4s infinite 0.2s',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: colors.neutral[400],
                    animation: 'bounce 1.4s infinite 0.4s',
                  }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}>
            {error && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${colors.error}`,
                borderRadius: '8px',
                color: colors.error,
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about nutrition, exercise, sleep, or any wellness topic..."
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${colors.neutral[700]}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.neutral[500],
                }}>
                  <Brain size={20} />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  padding: '1rem 1.5rem',
                  background: gradients.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s',
                }}
              >
                <Send size={20} />
                Send
              </button>
            </div>

            {/* Conversation Tips */}
            <div style={{ marginTop: '1rem' }}>
              <p style={{
                fontSize: '0.875rem',
                color: colors.neutral[500],
                marginBottom: '0.75rem',
              }}>
                Try asking about:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  "What should I eat for breakfast?",
                  "How can I improve my sleep quality?",
                  "Suggest a beginner workout",
                  "Tips for managing stress"
                ].map((tip, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(tip)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${colors.neutral[700]}`,
                      borderRadius: '50px',
                      color: colors.neutral[300],
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={{
        padding: '1rem',
        background: 'rgba(59, 130, 246, 0.05)',
        border: `1px solid ${colors.primary[500]}30`,
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <p style={{
          color: colors.neutral[400],
          fontSize: '0.8rem',
        }}>
          Wellness.AI provides AI-powered wellness suggestions. Always consult healthcare professionals for medical advice.
        </p>
      </div>

      {/* Add CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          }
          
          input:focus {
            border-color: ${colors.primary[500]};
            box-shadow: 0 0 0 3px ${colors.primary[500]}20;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;