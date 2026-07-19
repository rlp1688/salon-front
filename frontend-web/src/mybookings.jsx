import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://salonweb.onrender.com';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // Styles
  const colors = {
    gold: '#d4af37',
    dark: '#050505',
    darkGray: '#1a1a1a',
    lightGray: '#333',
    white: '#fff',
    red: '#ff4444',
    green: '#4CAF50',
    orange: '#ff9800'
  };

  const styles = {
    container: {
      background: colors.dark,
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      color: colors.gold
    },
    scrollableContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '40px 20px',
      paddingBottom: '40px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '5px',
      color: colors.gold,
      letterSpacing: '2px'
    },
    subtitle: {
      color: '#888',
      fontSize: '0.9rem'
    },
    mainCard: {
      maxWidth: '1100px',
      margin: '0 auto',
      background: 'rgba(26, 26, 26, 0.9)',
      padding: '30px',
      borderRadius: '12px',
      border: `1px solid ${colors.gold}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    bookingCard: {
      background: colors.darkGray,
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '15px',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    },
    bookingInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    bookingDetails: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#aaa',
      fontSize: '0.9rem'
    },
    detailLabel: {
      color: '#666',
      fontSize: '0.8rem',
      textTransform: 'uppercase'
    },
    detailValue: {
      color: colors.white,
      fontWeight: '500'
    },
    statusBadge: (status) => ({
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      background: status === 'Confirmed' ? 'rgba(76, 175, 80, 0.2)' : 
                 status === 'Cancelled' ? 'rgba(255, 68, 68, 0.2)' : 
                 'rgba(255, 152, 0, 0.2)',
      color: status === 'Confirmed' ? colors.green : 
             status === 'Cancelled' ? colors.red : 
             colors.orange
    }),
    cancelButton: {
      padding: '8px 20px',
      background: 'transparent',
      color: colors.red,
      border: `1px solid ${colors.red}44`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease'
    },
    cancelButtonHover: {
      background: 'rgba(255, 68, 68, 0.1)',
      borderColor: colors.red
    },
    cancelButtonDisabled: {
      padding: '8px 20px',
      background: '#222',
      color: '#666',
      border: '1px solid #333',
      borderRadius: '6px',
      cursor: 'not-allowed',
      fontSize: '0.8rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '20px'
    },
    loadingOverlay: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: colors.dark,
      color: colors.gold,
      fontSize: '1.2rem'
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid #333',
      borderTop: `3px solid ${colors.gold}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    bookingActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        }
        setLoading(false);
      } catch (err) {
        console.log('Error fetching user:', err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch user's bookings
  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Get all appointments
      const res = await axios.get(`${BASE_URL}/api/appointments/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("All appointments:", res.data);
console.log("Current user:", user);

      // Filter appointments for the logged-in user
      const userEmail = user?.email;
      const userBookings = res.data.filter(
        appointment => appointment.email === userEmail && appointment.status !== 'Cancelled'
      );

      // Sort by date (most recent first)
      userBookings.sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      });

      setBookings(userBookings);
      setLoading(false);
    } catch (err) {
      console.log('Error fetching bookings:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  // Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setCancelling(id);
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/appointments/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh bookings
      await fetchMyBookings();
      alert('Appointment cancelled successfully!');
    } catch (err) {
      console.log('Error cancelling:', err);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingOverlay}>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '20px' }}>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .booking-card:hover {
            transform: translateX(5px);
            border-color: ${colors.gold}44;
          }
          .cancel-btn:hover {
            background: rgba(255, 68, 68, 0.1) !important;
            border-color: ${colors.red} !important;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #d4af37;
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #f5d75e;
          }
        `}
      </style>

      <div style={styles.scrollableContent} className="custom-scroll">
        <div style={styles.header}>
          <h1 style={styles.title}> My Bookings</h1>
         
        </div>

        <div style={styles.mainCard}>
          {bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📅</div>
              <h3 style={{ color: colors.white, marginBottom: '10px' }}>No Appointments Yet</h3>
              <p style={{ color: '#666' }}>
                You haven't booked any appointments yet.<br />
                Visit the appointments page to schedule your next visit.
              </p>
              <button
                onClick={() => window.location.href = '/appointments'}
                style={{
                  marginTop: '20px',
                  padding: '12px 30px',
                  background: colors.gold,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                Book an Appointment →
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                Showing {bookings.length} appointment{bookings.length > 1 ? 's' : ''}
              </div>
              {bookings.map((booking) => (
                <div key={booking._id} style={styles.bookingCard} className="booking-card">
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Service:</span>
                        <span style={styles.detailValue}>{booking.service}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Barber:</span>
                        <span style={styles.detailValue}>{booking.barber || 'Not assigned'}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Date:</span>
                        <span style={styles.detailValue}>{formatDate(booking.date)}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Time:</span>
                        <span style={styles.detailValue}>{booking.time}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={styles.statusBadge(booking.status)}>
                        {booking.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  <div style={styles.bookingActions}>
                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancelling === booking._id}
                        style={cancelling === booking._id ? styles.cancelButtonDisabled : styles.cancelButton}
                        className="cancel-btn"
                      >
                        {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}