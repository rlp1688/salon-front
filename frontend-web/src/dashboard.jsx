import { useState } from 'react';
import Appointments from './Appointment.jsx';
import MyBookings from './mybookings.jsx';
import ServiceCatalog from './components/ServiceCatalog.jsx';

function Dashboard({ userSession, handleLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userSession?.name || 'Fort',
    email: userSession?.email || 'fortcode@gmail.com',
    phone_number: userSession?.phone_number || '0123456789',
    role: userSession?.role || 'user'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userSession?.name || 'Fort',
      email: userSession?.email || 'fortcode@gmail.com',
      phone_number: userSession?.phone_number || '0123456789',
      role: userSession?.role || 'user'
    });
    setIsEditing(false);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      
      {/* Sidebar - Fixed */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        backgroundColor: '#11100f',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '35px 24px',
        boxSizing: 'border-box',
        height: '100vh',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <div>
          <div style={{ marginBottom: '45px' }}>
            <span style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '3px', color: '#fff', display: 'block' }}>VELORA</span>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#e5c158', textTransform: 'uppercase', fontWeight: 'bold' }}>Workspace Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'overview', label: 'Dashboard Overview' },
              { id: 'appointments', label: 'Bookings' },
              { id: 'mybookings', label: 'My Bookings' },
              { id: 'treatments', label: 'Staff' },
              { id: 'profile', label: 'Account Profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 30px',
                  background: activeTab === tab.id ? 'rgba(229, 193, 88, 0.1)' : 'transparent',
                  border: 'none', borderRadius: '8px', color: activeTab === tab.id ? '#e5c158' : '#aaa',
                  fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '400', textAlign: 'left', cursor: 'pointer', transition: '0.2s'
                }}
              >
                <span style={{ fontSize: '16px', marginRight: '4px' }}>
                  {tab.id === 'overview' && '◇'}
                  {tab.id === 'appointments' && '◈'}
                  {tab.id === 'mybookings' && '□'}
                  {tab.id === 'treatments' && '✦'}
                  {tab.id === 'profile' && '○'}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5c158', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1817', fontWeight: 'bold', fontSize: '16px' }}>
              {userSession?.name ? userSession.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', color: '#fff' }}>{userSession?.name || 'Fort'}</span>
              <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{userSession?.role || 'User'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.2)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            Sign Out Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        minWidth: 0
      }}>
        <div style={{
          padding: '20px 50px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0
        }}>
          {/* Header content - empty */}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 50px',
          boxSizing: 'border-box',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4af37 #1a1a1a'
        }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Hero Section with Background Image */}
              <div style={{ 
                padding: '50px', 
                borderRadius: '16px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 1
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '6px',
                  height: '100%',
                  background: '#e5c158',
                  zIndex: 2
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 20px',
                    border: '1px solid rgba(229, 193, 88, 0.3)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: '#e5c158',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(229, 193, 88, 0.05)'
                  }}>
                    Welcome to Velora
                  </div>
                  <h2 style={{ 
                    fontSize: '38px', 
                    margin: '0 0 12px 0', 
                    fontWeight: '300',
                    color: '#fff',
                    lineHeight: '1.2'
                  }}>
                    Hello, {userSession?.name || 'Fort'}
                  </h2>
                  <p style={{ 
                    margin: 0, 
                    color: 'rgba(255,255,255,0.85)', 
                    fontSize: '16px', 
                    lineHeight: '1.8',
                    maxWidth: '600px'
                  }}>
                    Welcome to your luxury salon management dashboard. 
                    Experience the perfect blend of elegance and efficiency.
                  </p>
                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '25px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#e5c158', letterSpacing: '0.5px' }}>
                      ● System Online
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>
                      ● {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div style={{
                  padding: '35px',
                  background: '#11100f',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(229, 193, 88, 0.03) 0%, transparent 70%)'
                  }}></div>
                  <h4 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: '#e5c158',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    The Art of Beauty
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#aaa', 
                    fontSize: '14px', 
                    lineHeight: '1.8',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    The salon industry represents a dynamic fusion of artistry, science, and 
                    personalized care. From precision haircuts to transformative skincare, 
                    modern salons have evolved into comprehensive wellness destinations that 
                    cater to the diverse needs of today's discerning clientele.
                  </p>
                  <p style={{ 
                    margin: '15px 0 0 0', 
                    color: '#888', 
                    fontSize: '14px', 
                    lineHeight: '1.8',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    With a focus on innovation and client experience, the industry continues 
                    to embrace new technologies and sustainable practices, setting new standards 
                    for excellence in beauty and wellness services.
                  </p>
                </div>

                <div style={{
                  padding: '35px',
                  background: '#11100f',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(229, 193, 88, 0.03) 0%, transparent 70%)'
                  }}></div>
                  <h4 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: '#e5c158',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    Our Philosophy
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>Excellence in Service</div>
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                        Delivering exceptional experiences through meticulous attention to detail and client satisfaction.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>Innovation & Creativity</div>
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                        Embracing new techniques and trends to offer cutting-edge services that inspire and transform.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>Wellness & Sustainability</div>
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                        Committed to eco-friendly practices and holistic approaches that promote beauty and well-being.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '30px',
                background: '#11100f',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.03)',
                textAlign: 'center'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#666', 
                  fontSize: '13px', 
                  lineHeight: '1.8',
                  letterSpacing: '0.3px'
                }}>
                  "At Velora, we believe that beauty is an art form. Our commitment to excellence 
                  drives us to create spaces where elegance meets innovation, and every client 
                  leaves feeling transformed and inspired."
                </p>
                <div style={{
                  marginTop: '12px',
                  color: '#e5c158',
                  fontSize: '12px',
                  letterSpacing: '1px'
                }}>
                  — Velora Team
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && <Appointments />}
          
          {activeTab === 'mybookings' && <MyBookings />}

          {activeTab === 'treatments' && <ServiceCatalog />}

          {activeTab === 'profile' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Profile Hero with Background Image */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '30px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '280px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 1
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '6px',
                  height: '100%',
                  background: '#e5c158',
                  zIndex: 2
                }}></div>
                
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px'
                }}>
                  {/* Profile Image */}
                  <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    backgroundColor: '#e5c158',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '52px',
                    color: '#1a1817',
                    fontWeight: 'bold',
                    border: '4px solid rgba(229, 193, 88, 0.4)',
                    flexShrink: 0,
                    boxShadow: '0 0 40px rgba(229, 193, 88, 0.1)'
                  }}>
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 16px',
                      border: '1px solid rgba(229, 193, 88, 0.3)',
                      borderRadius: '20px',
                      fontSize: '10px',
                      color: '#e5c158',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      backgroundColor: 'rgba(229, 193, 88, 0.05)'
                    }}>
                      Account Profile
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '30px', fontWeight: '300', color: '#fff' }}>
                      {formData.name}
                    </h2>
                    <p style={{ margin: 0, color: '#e5c158', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {formData.role}
                    </p>
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      gap: '20px'
                    }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        ● Member since {new Date().getFullYear()}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        ● ID: 6a5b9b9069d85485257ece1d
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div style={{
                background: '#11100f',
                borderRadius: '12px',
                padding: '35px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#e5c158' }}>Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '8px 24px',
                        backgroundColor: '#e5c158',
                        color: '#1a1817',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          padding: '8px 24px',
                          backgroundColor: 'transparent',
                          color: '#888',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        style={{
                          padding: '8px 24px',
                          backgroundColor: '#e5c158',
                          color: '#1a1817',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      fontWeight: 'bold'
                    }}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#1a1a1a',
                          color: '#fff',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '15px', color: '#ddd' }}>{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      fontWeight: 'bold'
                    }}>
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#1a1a1a',
                          color: '#fff',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '15px', color: '#ddd' }}>{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      fontWeight: 'bold'
                    }}>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#1a1a1a',
                          color: '#fff',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '15px', color: '#ddd' }}>{formData.phone_number}</p>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      fontWeight: 'bold'
                    }}>
                      Account Type
                    </label>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '15px', 
                      color: '#e5c158',
                      textTransform: 'capitalize'
                    }}>
                      {formData.role}
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      fontWeight: 'bold'
                    }}>
                      Member Since
                    </label>
                    <p style={{ margin: 0, fontSize: '15px', color: '#ddd' }}>
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
