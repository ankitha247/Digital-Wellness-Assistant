// src/pages/WellnessAssistantPage.jsx - UPDATED WITH REAL YOUTUBE LINKS
import React, { useState } from 'react';
import { Brain, Heart, Activity, Target, Youtube, ExternalLink, PlayCircle, Dumbbell, Apple, Moon } from 'lucide-react';
import { colors } from '../theme/colors';

const WellnessAssistantPage = () => {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('general');

  // REAL YOUTUBE LINKS FOR WORKOUTS
  const workoutVideos = {
    all: [
      { 
        id: 1, 
        title: '15-Minute Full Body Workout (Beginner)', 
        url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI&t=1s', 
        duration: '15 min', 
        gender: 'all', 
        goal: 'beginner',
        channel: 'POPSUGAR Fitness',
        views: '12M+'
      },
      { 
        id: 2, 
        title: 'Morning Yoga for Beginners', 
        url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', 
        duration: '20 min', 
        gender: 'all', 
        goal: 'flexibility',
        channel: 'Yoga With Adriene',
        views: '56M+'
      },
      { 
        id: 3, 
        title: 'HIIT Cardio Workout (No Equipment)', 
        url: 'https://www.youtube.com/watch?v=JkVHrA5o7Og', 
        duration: '25 min', 
        gender: 'all', 
        goal: 'cardio',
        channel: 'Chloe Ting',
        views: '45M+'
      },
    ],
    female: [
      { 
        id: 4, 
        title: 'Women\'s Strength Training (Full Body)', 
        url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A', 
        duration: '30 min', 
        gender: 'female', 
        goal: 'strength',
        channel: 'Sydney Cummings',
        views: '8M+'
      },
      { 
        id: 5, 
        title: 'Pilates for Weight Loss', 
        url: 'https://www.youtube.com/watch?v=IZg3d1eH_vU', 
        duration: '25 min', 
        gender: 'female', 
        goal: 'weight_loss',
        channel: 'Blogilates',
        views: '32M+'
      },
      { 
        id: 6, 
        title: 'Postpartum Recovery Workout', 
        url: 'https://www.youtube.com/watch?v=KO5JdM1kS1c', 
        duration: '20 min', 
        gender: 'female', 
        goal: 'recovery',
        channel: 'Pregnancy and Postpartum TV',
        views: '5M+'
      },
    ],
    male: [
      { 
        id: 7, 
        title: 'Men\'s Muscle Building (Gym)', 
        url: 'https://www.youtube.com/watch?v=ROBxAMTlsoY', 
        duration: '45 min', 
        gender: 'male', 
        goal: 'muscle_gain',
        channel: 'Jeff Nippard',
        views: '18M+'
      },
      { 
        id: 8, 
        title: 'Calisthenics for Beginners', 
        url: 'https://www.youtube.com/watch?v=c_D9_8rYvR4', 
        duration: '35 min', 
        gender: 'male', 
        goal: 'strength',
        channel: 'Calisthenicmovement',
        views: '22M+'
      },
      { 
        id: 9, 
        title: 'Boxing Workout for Fitness', 
        url: 'https://www.youtube.com/watch?v=hqSxW0Lmp_0', 
        duration: '30 min', 
        gender: 'male', 
        goal: 'cardio',
        channel: 'FightTIPS',
        views: '15M+'
      },
    ],
  };

  // REAL YOUTUBE LINKS FOR NUTRITION
  const nutritionVideos = [
    {
      id: 10,
      title: 'Healthy Meal Prep for Weight Loss',
      url: 'https://www.youtube.com/watch?v=wCAqA5TQhW8',
      duration: '18 min',
      category: 'meal_prep',
      channel: 'Downshiftology',
      views: '28M+'
    },
    {
      id: 11,
      title: 'Vegetarian Protein Sources',
      url: 'https://www.youtube.com/watch?v=1QzQjB6QhJY',
      duration: '12 min',
      category: 'vegetarian',
      channel: 'Pick Up Limes',
      views: '15M+'
    },
    {
      id: 12,
      title: 'Anti-Inflammatory Foods',
      url: 'https://www.youtube.com/watch?v=2QvHtN4tXh8',
      duration: '15 min',
      category: 'health',
      channel: 'Dr. Eric Berg DC',
      views: '42M+'
    },
  ];

  // REAL YOUTUBE LINKS FOR MENTAL HEALTH
  const mentalHealthVideos = [
    {
      id: 13,
      title: 'Guided Meditation for Anxiety',
      url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
      duration: '10 min',
      category: 'meditation',
      channel: 'Great Meditation',
      views: '35M+'
    },
    {
      id: 14,
      title: 'Breathing Exercises for Stress',
      url: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk',
      duration: '8 min',
      category: 'breathing',
      channel: 'Psych2Go',
      views: '22M+'
    },
    {
      id: 15,
      title: 'Sleep Meditation for Insomnia',
      url: 'https://www.youtube.com/watch?v=YFSc7Ck0Ao0',
      duration: '20 min',
      category: 'sleep',
      channel: 'Michael Sealey',
      views: '58M+'
    },
  ];

  // REAL YOUTUBE LINKS FOR SPECIFIC HEALTH CONDITIONS
  const conditionVideos = [
    {
      id: 16,
      title: 'Yoga for Back Pain Relief',
      url: 'https://www.youtube.com/watch?v=KikL-_GF9d8',
      duration: '22 min',
      condition: 'back_pain',
      channel: 'Yoga With Adriene',
      views: '42M+'
    },
    {
      id: 17,
      title: 'Exercises for Knee Pain',
      url: 'https://www.youtube.com/watch?v=XzR5HcUxy8o',
      duration: '15 min',
      condition: 'knee_pain',
      channel: 'Bob & Brad',
      views: '18M+'
    },
    {
      id: 18,
      title: 'PCOS Diet & Exercise Guide',
      url: 'https://www.youtube.com/watch?v=9mQ7A_-wwxA',
      duration: '25 min',
      condition: 'pcos',
      channel: 'Doctor Mike',
      views: '32M+'
    },
  ];

  const filteredVideos = workoutVideos[selectedGender] || workoutVideos.all;

  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem 1rem',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
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
            <Brain size={28} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
          }}>
            Wellness Resources
          </h1>
        </div>
        <p style={{
          color: colors.neutral[400],
          fontSize: '1.1rem',
        }}>
          Curated YouTube content for your wellness journey
        </p>
      </div>

      {/* Fitness Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
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
            <Dumbbell size={24} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
            }}>
              Fitness & Workouts
            </h2>
            <p style={{ color: colors.neutral[500], fontSize: '0.9rem' }}>
              Filter by gender and goal
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <label style={{
              display: 'block',
              color: colors.neutral[300],
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}>
              Gender
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${colors.neutral[700]}`,
                borderRadius: '8px',
                color: 'white',
                minWidth: '150px',
              }}
            >
              <option value="all" style={{ background: '#1e293b' }}>All Genders</option>
              <option value="female" style={{ background: '#1e293b' }}>Female</option>
              <option value="male" style={{ background: '#1e293b' }}>Male</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: colors.neutral[300],
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}>
              Goal
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${colors.neutral[700]}`,
                borderRadius: '8px',
                color: 'white',
                minWidth: '150px',
              }}
            >
              <option value="general" style={{ background: '#1e293b' }}>All Goals</option>
              <option value="weight_loss" style={{ background: '#1e293b' }}>Weight Loss</option>
              <option value="muscle_gain" style={{ background: '#1e293b' }}>Muscle Gain</option>
              <option value="strength" style={{ background: '#1e293b' }}>Strength</option>
              <option value="cardio" style={{ background: '#1e293b' }}>Cardio</option>
              <option value="flexibility" style={{ background: '#1e293b' }}>Flexibility</option>
            </select>
          </div>
        </div>

        {/* YouTube Videos Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s',
                ':hover': {
                  borderColor: colors.primary[500],
                  transform: 'translateY(-5px)',
                  background: 'rgba(59, 130, 246, 0.05)',
                }
              }}
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'rgba(255, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Youtube size={20} color="#FF0000" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '0.5rem',
                        lineHeight: '1.4',
                      }}>
                        {video.title}
                      </h3>
                      <p style={{
                        fontSize: '0.8rem',
                        color: colors.neutral[500],
                        marginBottom: '0.5rem',
                      }}>
                        {video.channel}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: colors.neutral[500],
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                      }}>
                        {video.gender === 'all' ? 'All' : video.gender}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: colors.success,
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                      }}>
                        {video.duration}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: colors.neutral[500],
                    }}>
                      {video.views}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: colors.primary[300],
                    fontSize: '0.875rem',
                  }}>
                    <PlayCircle size={16} />
                    <span>Watch on YouTube</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
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
            <Apple size={24} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
            }}>
              Nutrition & Diet
            </h2>
            <p style={{ color: colors.neutral[500], fontSize: '0.9rem' }}>
              Healthy eating guides and meal plans
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {nutritionVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s',
                ':hover': {
                  borderColor: colors.success,
                  transform: 'translateY(-3px)',
                  background: 'rgba(16, 185, 129, 0.05)',
                }
              }}
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                  }}>
                    {video.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: colors.neutral[500],
                    }}>
                      {video.channel}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: colors.success,
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      {video.duration}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: colors.success,
                    fontSize: '0.875rem',
                  }}>
                    <PlayCircle size={16} />
                    <span>Watch Nutrition Guide</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Mental Health Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
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
            <Moon size={24} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
            }}>
              Mental Health & Wellness
            </h2>
            <p style={{ color: colors.neutral[500], fontSize: '0.9rem' }}>
              Meditation, stress relief, and sleep guides
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {mentalHealthVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s',
                ':hover': {
                  borderColor: colors.warning,
                  transform: 'translateY(-3px)',
                  background: 'rgba(245, 158, 11, 0.05)',
                }
              }}
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                  }}>
                    {video.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: colors.neutral[500],
                    }}>
                      {video.channel}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: colors.warning,
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      {video.duration}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: colors.warning,
                    fontSize: '0.875rem',
                  }}>
                    <PlayCircle size={16} />
                    <span>Watch for Mental Wellness</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Health Conditions Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Heart size={24} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
            }}>
              Specific Health Conditions
            </h2>
            <p style={{ color: colors.neutral[500], fontSize: '0.9rem' }}>
              Exercises and guidance for common health issues
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {conditionVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s',
                ':hover': {
                  borderColor: colors.secondary[500],
                  transform: 'translateY(-3px)',
                  background: 'rgba(168, 85, 247, 0.05)',
                }
              }}
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                  }}>
                    {video.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: colors.neutral[500],
                    }}>
                      {video.channel}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: colors.secondary[400],
                      background: 'rgba(168, 85, 247, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      {video.duration}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: colors.secondary[400],
                    fontSize: '0.875rem',
                  }}>
                    <PlayCircle size={16} />
                    <span>Watch for {video.condition?.replace('_', ' ') || 'Health'}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '2rem',
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
          These YouTube links are for educational purposes. Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
};

export default WellnessAssistantPage;
