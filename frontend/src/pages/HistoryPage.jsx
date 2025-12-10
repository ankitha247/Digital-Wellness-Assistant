// src/pages/HistoryPage.jsx
import React from 'react';
import { History, Calendar, Clock, User, Bot } from 'lucide-react';
import { colors } from '../theme/colors';

const HistoryPage = () => {
  const conversations = [
    {
      id: 1,
      date: 'Today',
      time: '10:30 AM',
      messages: [
        { role: 'user', text: 'What should I eat for breakfast?' },
        { role: 'assistant', text: 'Based on your vegetarian diet and weight loss goals, I recommend oatmeal with berries, nuts, and a spoon of honey. This provides fiber, protein, and healthy fats.' }
      ]
    },
    {
      id: 2,
      date: 'Yesterday',
      time: '3:45 PM',
      messages: [
        { role: 'user', text: 'How can I improve my sleep quality?' },
        { role: 'assistant', text: 'Based on your 6.5 hours of sleep, try maintaining a consistent sleep schedule, reducing screen time 1 hour before bed, and keeping your bedroom cool and dark. Also consider meditation before sleep.' }
      ]
    },
    {
      id: 3,
      date: 'Dec 10, 2024',
      time: '11:20 AM',
      messages: [
        { role: 'user', text: 'Suggest a beginner workout routine' },
        { role: 'assistant', text: 'Start with 20-minute brisk walks daily, add 15 minutes of light strength training 3 times a week. Focus on squats, push-ups (modified if needed), and planks. Remember to warm up and cool down.' }
      ]
    }
  ];

  return (
    <div style={{
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem 1rem',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <History size={28} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
          }}>
            Conversation History
          </h1>
        </div>
        <p style={{
          color: colors.neutral[400],
          fontSize: '1.1rem',
        }}>
          Review your past wellness conversations and insights
        </p>
      </div>

      {/* Conversations List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Conversation Header */}
            <div style={{
              padding: '1rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} color={colors.neutral[400]} />
                <span style={{
                  fontWeight: '600',
                  color: 'white',
                }}>
                  {conv.date}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={16} color={colors.neutral[400]} />
                <span style={{ color: colors.neutral[400] }}>
                  {conv.time}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '1.5rem' }}>
              {conv.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: msg.role === 'user' 
                        ? colors.primary[600] 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {msg.role === 'user' ? (
                        <User size={16} color="white" />
                      ) : (
                        <Bot size={16} color="white" />
                      )}
                    </div>
                    <span style={{
                      fontWeight: '600',
                      color: msg.role === 'user' ? colors.primary[400] : colors.secondary[400],
                    }}>
                      {msg.role === 'user' ? 'You' : 'Wellness Assistant'}
                    </span>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: colors.neutral[200],
                    lineHeight: '1.5',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: colors.neutral[500],
          }}>
            <History size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No conversations yet
            </h3>
            <p>Start chatting with your Wellness Assistant to see history here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;