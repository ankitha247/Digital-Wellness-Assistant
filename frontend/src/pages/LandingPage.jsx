// src/pages/LandingPage.jsx - UPDATED
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight, Heart, Activity } from 'lucide-react';
import { colors, gradients } from '../theme/colors';

const LandingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navigation */}
      <header style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: gradients.primary,
            borderRadius: '12px',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={28} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              FitAura
            </h1>
            <p style={{
              fontSize: '0.75rem',
              color: colors.neutral[400],
            }}>
              Digital Wellness Assistant
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login">
            <button style={{
              padding: '0.5rem 1.5rem',
              background: 'transparent',
              border: `1px solid ${colors.neutral[600]}`,
              borderRadius: '8px',
              color: colors.neutral[300],
              cursor: 'pointer',
            }}>
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button style={{
              padding: '0.5rem 1.5rem',
              background: gradients.primary,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}>
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 2rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #ffffff, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Your Personal AI Wellness Assistant
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: colors.neutral[300],
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}>
          Get personalized health and wellness recommendations powered by artificial intelligence.
          Nutrition, fitness, sleep, and mental wellness - all in one place.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Heart size={20} color={colors.success} />
            <span style={{ color: colors.neutral[300] }}>Health Tracking</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Activity size={20} color={colors.primary[400]} />
            <span style={{ color: colors.neutral[300] }}>AI Insights</span>
          </div>
        </div>

        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '1rem 3rem',
            background: gradients.primary,
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s',
            ':hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            }
          }}>
            Get Started Free
            <ArrowRight size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;