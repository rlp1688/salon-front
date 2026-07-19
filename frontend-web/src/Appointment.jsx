import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://salonweb.onrender.com';

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30"
];

const SERVICES = ["Haircut", "Facial", "Massage", "Hair Color", "Manicure", "Pedicure", "Other"];

export default function Appointments() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dateError, setDateError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    barber: '',
    date: '',
    time: ''
  });

  // Styles
  const colors = {
    gold: '#d4af37',
    dark: '#050505',
    darkGray: '#1a1a1a',
    lightGray: '#333',
    white: '#fff',
    red: '#ff4444',
    green: '#4CAF50'
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
    formSection: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: `2px solid ${colors.gold}`,
      color: colors.gold
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '12px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    label: {
      fontSize: '0.8rem',
      color: colors.gold,
      fontWeight: '500'
    },
    input: {
      padding: '8px 12px',
      background: colors.darkGray,
      color: colors.white,
      border: `1px solid ${colors.lightGray}`,
      borderRadius: '6px',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease'
    },
    inputFilled: {
      padding: '8px 12px',
      background: '#1a2a1a',
      color: colors.white,
      border: `1px solid ${colors.green}`,
      borderRadius: '6px',
      fontSize: '0.9rem'
    },
    select: {
      padding: '8px 12px',
      background: colors.darkGray,
      color: colors.white,
      border: `1px solid ${colors.lightGray}`,
      borderRadius: '6px',
      fontSize: '0.9rem',
      cursor: 'pointer'
    },
    autoBadge: {
      fontSize: '0.65rem',
      color: colors.green,
      marginTop: '2px'
    },
    timeSlotSection: {
      marginTop: '20px'
    },
    timeSlotHint: {
      color: '#888',
      fontSize: '0.85rem',
      marginBottom: '12px',
      fontStyle: 'italic'
    },
    timeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '8px',
      marginBottom: '15px',
      maxHeight: '300px',
      overflowY: 'auto',
      padding: '5px'
    },
    slotButton: (isTaken, isAvailable, isSelected) => ({
      padding: '10px 6px',
      background: isSelected ? '#2a2a2a' : (isTaken ? colors.lightGray : (isAvailable ? colors.darkGray : '#111')),
      color: isSelected ? colors.gold : (isTaken ? '#666' : (isAvailable ? colors.white : '#333')),
      border: `2px solid ${isSelected ? colors.gold : (isTaken ? '#222' : colors.gold)}`,
      borderRadius: '6px',
      cursor: isAvailable ? 'pointer' : 'not-allowed',
      opacity: isAvailable ? 1 : 0.3,
      transition: 'all 0.3s ease',
      fontSize: '0.85rem',
      fontWeight: isSelected ? 'bold' : (isAvailable ? '500' : '300'),
      position: 'relative'
    }),
    slotStatus: {
      fontSize: '0.5rem',
      color: colors.red,
      textTransform: 'uppercase',
      marginTop: '2px'
    },
    bookingStatus: {
      padding: '12px',
      background: colors.darkGray,
      border: `1px solid ${colors.gold}`,
      borderRadius: '6px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '12px'
    },
    bookButton: {
      width: '100%',
      padding: '14px',
      background: colors.gold,
      color: colors.dark,
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '15px',
      letterSpacing: '1px'
    },
    bookButtonDisabled: {
      width: '100%',
      padding: '14px',
      background: '#333',
      color: '#666',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'not-allowed',
      marginTop: '15px',
      letterSpacing: '1px'
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid #333',
      borderTop: `3px solid ${colors.gold}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
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
    selectedInfo: {
      background: 'rgba(212, 175, 55, 0.1)',
      padding: '10px',
      borderRadius: '6px',
      marginTop: '10px',
      textAlign: 'center',
      color: colors.gold,
      fontSize: '0.9rem',
      border: `1px solid ${colors.gold}33`
    },
    errorMessage: {
      color: colors.red,
      fontSize: '0.8rem',
      marginTop: '5px'
    }
  };

  // Fetch user data and auto-fill form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = res.data;
          setUser(userData);
          
          setFormData(prev => ({
            ...prev,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone_number || ''
          }));
        }
        setLoading(false);
      } catch (err) {
        console.log('Error fetching user:', err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch all appointments
  const fetchAll = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/appointments/all`);
      const activeAppointments = res.data.filter(a => a.status !== "Cancelled");
      setAllAppointments(activeAppointments);
      return activeAppointments;
    } catch (err) {
      console.log('Error fetching appointments:', err);
      return [];
    }
  };

  // Fetch barbers
  const fetchBarbers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/staff/all`);
      setBarbers(res.data);
    } catch (err) {
      console.log('Error fetching barbers:', err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchBarbers();
  }, [user]);

  // Normalize date to YYYY-MM-DD format
  const normalizeDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if slot is taken
  const isSlotTaken = (date, time, barber) => {
    if (!date || !time || !barber) return false;
    
    const normalizedDate = normalizeDate(date);
    
    return allAppointments.some(a => {
      const appointmentDate = normalizeDate(a.date);
      
      if (!a.barber) {
        return appointmentDate === normalizedDate && a.time === time;
      }
      
      return appointmentDate === normalizedDate && a.time === time && a.barber === barber;
    });
  };

  // Validate date (prevent past dates)
  const isDateValid = (date) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Handle slot selection
  const handleSlotSelect = async (slot) => {
    if (!formData.date || !formData.barber) {
      alert("Please select a date and barber first");
      return;
    }

    if (!isDateValid(formData.date)) {
      setDateError("Please select a valid date (today or future date)");
      alert("Please select a valid date (today or future date)");
      return;
    }
    setDateError('');
    
    const freshAppointments = await fetchAll();
    const normalizedDate = normalizeDate(formData.date);
    
    const isTaken = freshAppointments.some(a => {
      const appointmentDate = normalizeDate(a.date);
      
      if (!a.barber) {
        return appointmentDate === normalizedDate && a.time === slot;
      }
      
      return appointmentDate === normalizedDate && a.time === slot && a.barber === formData.barber;
    });
    
    if (isTaken) {
      alert("This slot is already booked");
      return;
    }
    
    setSelectedSlot(slot);
    setFormData(prev => ({ ...prev, time: slot }));
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, date: selectedDate });
    setSelectedSlot(null);
    
    if (selectedDate && !isDateValid(selectedDate)) {
      setDateError("⚠️ Past dates are not allowed. Please select today or a future date.");
    } else {
      setDateError('');
    }
  };

  // Handle booking
  const handleBook = async () => {
    if (isBooking) return;
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }

    if (!isDateValid(formData.date)) {
      alert("Cannot book for past dates. Please select a valid date.");
      return;
    }

    if (!formData.name) return alert("Please enter your name");
    if (!formData.email) return alert("Please enter your email");
    if (!formData.phone) return alert("Please enter your phone number");
    if (!formData.service) return alert("Please select a service");
    if (!formData.barber) return alert("Please select a barber");
    if (!formData.date) return alert("Please select a date");

    try {
      setIsBooking(true);
      
      const currentAppointments = await fetchAll();
      const normalizedDate = normalizeDate(formData.date);
      
      const isStillAvailable = !currentAppointments.some(a => {
        const appointmentDate = normalizeDate(a.date);
        
        if (!a.barber) {
          return appointmentDate === normalizedDate && a.time === selectedSlot;
        }
        
        return appointmentDate === normalizedDate && a.time === selectedSlot && a.barber === formData.barber;
      });
      
      if (!isStillAvailable) {
        alert("This slot has been booked by someone else. Please select another time.");
        setSelectedSlot(null);
        setIsBooking(false);
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/appointments/create`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        barber: formData.barber,
        date: formData.date,
        time: selectedSlot
      });

      alert(res.data.message || "Appointment booked successfully!");
      
      setFormData(prev => ({
        ...prev,
        service: '',
        barber: '',
        date: '',
        time: ''
      }));
      setSelectedSlot(null);
      setDateError('');
      
      await fetchAll();

    } catch (err) {
      console.log('Booking error:', err.response?.data);
      alert(err.response?.data?.message || "Failed to book appointment");
      await fetchAll();
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingOverlay}>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '20px' }}>Loading...</p>
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
          input:focus, select:focus {
            border-color: ${colors.gold} !important;
            outline: none !important;
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.15) !important;
          }
          .slot-hover:hover {
            background: #2a2a2a !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2) !important;
          }
          .book-button-hover:hover {
            background: #f5d75e !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3) !important;
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
          .main-card-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .main-card-scroll::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 10px;
          }
          .main-card-scroll::-webkit-scrollbar-thumb {
            background: #d4af37;
            border-radius: 10px;
          }
          .main-card-scroll::-webkit-scrollbar-thumb:hover {
            background: #f5d75e;
          }
          @media (max-width: 768px) {
            .form-row-responsive {
              grid-template-columns: 1fr !important;
            }
            .title-responsive {
              font-size: 2rem !important;
            }
            .time-grid-responsive {
              grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)) !important;
            }
            .main-card-responsive {
              padding: 15px !important;
              max-height: 75vh !important;
            }
            .scrollable-content-responsive {
              padding: 20px 15px !important;
              padding-bottom: 30px !important;
            }
          }
        `}
      </style>

      <div style={styles.scrollableContent} className="scrollable-content-responsive">
        <div style={styles.header}>
          <h1 style={styles.title} className="title-responsive">Book Your Appointment</h1>
        </div>

        <div style={styles.mainCard} className="main-card-responsive main-card-scroll">
          
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Personal Details</h3>
            
            <div style={styles.formRow} className="form-row-responsive">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!!user}
                  style={user ? styles.inputFilled : styles.input}
                />
                {user && <span style={styles.autoBadge}>✓ Auto-filled from profile</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!user}
                  style={user ? styles.inputFilled : styles.input}
                />
                {user && <span style={styles.autoBadge}>✓ Auto-filled from profile</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!!user}
                  style={user ? styles.inputFilled : styles.input}
                />
                {user && <span style={styles.autoBadge}>✓ Auto-filled from profile</span>}
              </div>
            </div>

            <div style={styles.formRow} className="form-row-responsive">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Service *</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={styles.select}
                >
                  <option value="">Choose a service</option>
                  {SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Barber *</label>
                <select
                  value={formData.barber}
                  onChange={(e) => {
                    setFormData({ ...formData, barber: e.target.value });
                    setSelectedSlot(null);
                  }}
                  style={styles.select}
                >
                  <option value="">Choose a barber</option>
                  {barbers.map(barber => (
                    <option key={barber._id} value={barber.name}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={styles.input}
                />
                {dateError && <span style={styles.errorMessage}>{dateError}</span>}
              </div>
            </div>
          </div>

          <div style={styles.timeSlotSection}>
            <h3 style={styles.sectionTitle}>Available Time Slots</h3>
            
            <p style={styles.timeSlotHint}>
              {formData.date && formData.barber ? 
                `📅 Click a time slot to select it for ${formData.barber} on ${formData.date}` :
                '👈 Please select a date and barber to see available slots'}
            </p>
            
            <div style={styles.timeGrid} className="custom-scroll time-grid-responsive">
              {TIME_SLOTS.map(slot => {
                const isTaken = formData.date && formData.barber && 
                  (() => {
                    const normalizedDate = normalizeDate(formData.date);
                    return allAppointments.some(a => {
                      const appointmentDate = normalizeDate(a.date);
                      if (!a.barber) {
                        return appointmentDate === normalizedDate && a.time === slot;
                      }
                      return appointmentDate === normalizedDate && a.time === slot && a.barber === formData.barber;
                    });
                  })();
                
                const isAvailable = formData.date && formData.barber && !isTaken && isDateValid(formData.date);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    disabled={!isAvailable || isBooking}
                    onClick={() => handleSlotSelect(slot)}
                    style={styles.slotButton(isTaken, isAvailable, isSelected)}
                    className={isAvailable ? 'slot-hover' : ''}
                  >
                    {slot}
                    {isTaken && <div style={styles.slotStatus}>Booked</div>}
                    {isSelected && <div style={{...styles.slotStatus, color: colors.gold}}>Selected</div>}
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div style={styles.selectedInfo}>
                ✓ Selected: {selectedSlot} with {formData.barber} on {formData.date}
              </div>
            )}

            {isBooking ? (
              <div style={styles.bookingStatus}>
                <div style={styles.spinner}></div>
                <span>Booking in progress...</span>
              </div>
            ) : (
              <button
                onClick={handleBook}
                disabled={!selectedSlot || !formData.name || !formData.email || !formData.phone || !formData.service || !isDateValid(formData.date)}
                style={(!selectedSlot || !formData.name || !formData.email || !formData.phone || !formData.service || !isDateValid(formData.date)) 
                  ? styles.bookButtonDisabled 
                  : styles.bookButton}
                className={(!selectedSlot || !formData.name || !formData.email || !formData.phone || !formData.service || !isDateValid(formData.date)) 
                  ? '' 
                  : 'book-button-hover'}
              >
                {!selectedSlot ? 'Select a Time Slot First' : 
                 !isDateValid(formData.date) ? 'Invalid Date Selected' : 
                 'Book Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}