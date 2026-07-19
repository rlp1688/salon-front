import { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingData, setRatingData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState({});
  const [showReviewInput, setShowReviewInput] = useState({});
  const [reviews, setReviews] = useState({});
  const [showAllReviews, setShowAllReviews] = useState({});
  
  // IMPORTANT: Use your deployed backend URL
  const BASE_URL = 'https://salonweb.onrender.com'; // Your deployed backend URL
  // const BASE_URL = 'http://localhost:5000'; // For local testing

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        console.log('Fetching staff from:', `${BASE_URL}/api/staff`);
        const res = await axios.get(`${BASE_URL}/api/staff`);
        console.log('Staff data:', res.data);
        setStaff(res.data);
        
        res.data.forEach(member => {
          fetchReviews(member._id);
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError(`Failed to load staff: ${err.message}`);
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const fetchReviews = async (staffId) => {
    try {
      console.log(`Fetching reviews for staff ${staffId}`);
      const res = await axios.get(`${BASE_URL}/api/staff/${staffId}/reviews`);
      console.log(`Reviews for ${staffId}:`, res.data);
      setReviews(prev => ({ ...prev, [staffId]: res.data }));
    } catch (err) {
      console.error(`Error fetching reviews for ${staffId}:`, err);
    }
  };

  const handleRating = async (staffId, rating) => {
    try {
      setSubmitting(true);
      
      const customerName = prompt("Please enter your name for this rating:");
      if (!customerName || customerName.trim() === '') {
        setSubmitting(false);
        return;
      }

      console.log(`Submitting rating for staff ${staffId}:`, { rating, customerName });

      const response = await axios.post(`${BASE_URL}/api/staff/${staffId}/rate`, {
        rating: rating,
        customerName: customerName.trim()
      });

      console.log('Rating response:', response.data);

      setStaff(prevStaff => 
        prevStaff.map(staff => 
          staff._id === staffId 
            ? { 
                ...staff, 
                rating: response.data.staff.rating,
                totalReviews: response.data.staff.totalReviews 
              }
            : staff
        )
      );

      setRatingData(prev => ({ ...prev, [staffId]: 0 }));
      alert("Thank you for your rating!");
      
    } catch (err) {
      console.error("Error submitting rating:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Failed to submit rating. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (staffId) => {
    const review = reviewText[staffId];
    if (!review || review.trim().length < 5) {
      alert("Please write a review (minimum 5 characters)");
      return;
    }

    try {
      setSubmitting(true);
      
      const customerName = prompt("Please enter your name:");
      if (!customerName || customerName.trim() === '') {
        setSubmitting(false);
        return;
      }

      console.log(`Submitting review for staff ${staffId}:`, { 
        customerName: customerName.trim(), 
        review: review.trim() 
      });

      await axios.post(`${BASE_URL}/api/staff/${staffId}/review`, {
        customerName: customerName.trim(),
        review: review.trim(),
        rating: 5
      });

      setReviewText(prev => ({ ...prev, [staffId]: '' }));
      setShowReviewInput(prev => ({ ...prev, [staffId]: false }));
      
      await fetchReviews(staffId);
      
      // Update staff rating after review
      const staffRes = await axios.get(`${BASE_URL}/api/staff`);
      setStaff(staffRes.data);
      
      alert("Thank you for your review!");
      
    } catch (err) {
      console.error("Error submitting review:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Failed to submit review. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (staffId, rating, showInteractive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    if (showInteractive) {
      const hoverRating = ratingData[staffId] || 0;
      
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span
            key={i}
            onClick={() => handleRating(staffId, i)}
            onMouseEnter={() => setRatingData(prev => ({ ...prev, [staffId]: i }))}
            onMouseLeave={() => setRatingData(prev => ({ ...prev, [staffId]: 0 }))}
            style={{
              cursor: submitting ? 'not-allowed' : 'pointer',
              color: i <= hoverRating ? '#ffc107' : '#444',
              fontSize: '28px',
              marginRight: '4px',
              transition: 'all 0.2s',
              opacity: submitting ? 0.5 : 1,
              display: 'inline-block'
            }}
          >
            ★
          </span>
        );
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          stars.push(
            <span key={i} style={{ color: '#ffc107', fontSize: '18px', marginRight: '2px' }}>
              ★
            </span>
          );
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(
            <span key={i} style={{ color: '#ffc107', fontSize: '18px', marginRight: '2px' }}>
              ★
            </span>
          );
        } else {
          stars.push(
            <span key={i} style={{ color: '#444', fontSize: '18px', marginRight: '2px' }}>
              ☆
            </span>
          );
        }
      }
    }
    
    return stars;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        color: '#aaa', 
        fontSize: '14px', 
        textAlign: 'center', 
        padding: '60px 20px' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #333',
          borderTop: '3px solid #e5c158',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        Loading staff members...
      </div>
    );
  }

  return (
    <div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .staff-card {
            transition: all 0.3s ease;
          }
          .staff-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border-color: rgba(229, 193, 88, 0.3);
          }
          .review-item {
            border-left: 3px solid #e5c158;
            padding-left: 15px;
            margin-bottom: 15px;
            background: rgba(255,255,255,0.02);
            padding: 12px 15px;
            border-radius: 0 8px 8px 0;
          }
          .review-item:last-child {
            margin-bottom: 0;
          }
          .rating-star {
            transition: all 0.2s;
          }
          .rating-star:hover {
            transform: scale(1.2);
          }
          .submit-btn {
            transition: all 0.3s;
          }
          .submit-btn:hover:not(:disabled) {
            background: #f5d75e !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(229, 193, 88, 0.3);
          }
          .cancel-btn:hover {
            background: rgba(255, 255, 255, 0.05) !important;
          }
          .review-toggle-btn:hover {
            background: rgba(229, 193, 88, 0.1) !important;
          }
          textarea:focus {
            outline: none;
          }
        `}
      </style>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '26px', 
            fontWeight: '500', 
            margin: 0, 
            color: '#e5c158',
            letterSpacing: '1px'
          }}>
             Our Expert Team
          </h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            Meet our professional staff and see what our customers say
          </p>
        </div>
        <div style={{ 
          color: '#888', 
          fontSize: '13px',
          background: 'rgba(229, 193, 88, 0.08)',
          padding: '8px 18px',
          borderRadius: '20px',
          border: '1px solid rgba(229, 193, 88, 0.15)'
        }}>
          {staff.filter(m => m.isActive !== false).length} active staff members
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{ 
          color: '#ff6b6b', 
          marginBottom: '20px', 
          padding: '15px 20px', 
          background: 'rgba(255,0,0,0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(255,0,0,0.15)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <div style={{ 
          color: '#666', 
          fontStyle: 'italic', 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
          <p>No staff members available yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '25px',
          paddingBottom: '30px'
        }}>
          {staff.filter(member => member.isActive !== false).map((member) => (
            <div key={member._id} className="staff-card" style={{ 
              padding: '30px', 
              background: '#11100f', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative'
            }}>
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: member.isAvailable ? '#4CAF50' : '#666',
                color: '#fff',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>
                {member.isAvailable ? '● Available' : '○ Unavailable'}
              </div>

              {/* Profile Section */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: member.profileImage ? 'transparent' : 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                  overflow: 'hidden',
                  border: '3px solid #e5c158',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  {member.profileImage ? (
                    <img 
                      src={member.profileImage} 
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '40px', color: '#e5c158' }}>
                      {member.name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  )}
                </div>

                <h3 style={{ 
                  color: '#e5c158', 
                  margin: '0 0 4px 0', 
                  fontSize: '22px',
                  textAlign: 'center'
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  color: '#888', 
                  fontSize: '14px', 
                  textAlign: 'center',
                  marginBottom: '10px'
                }}>
                  {member.position || 'Staff Member'}
                </p>

                {/* Rating Display */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex' }}>
                    {renderStars(member._id, member.rating || 0, false)}
                  </div>
                  <span style={{ 
                    color: '#aaa', 
                    fontSize: '13px', 
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 12px',
                    borderRadius: '12px'
                  }}>
                    {member.totalReviews || 0} {member.totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>

              {/* Staff Details */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '8px',
                margin: '15px 0',
                padding: '15px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px'
              }}>
                <div>
                  <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Serves</span>
                  <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0 0' }}>
                    {member.serves || 'All'}
                  </p>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience</span>
                  <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0 0' }}>
                    {member.experience || '0'} years
                  </p>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</span>
                  <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0 0' }}>
                    {member.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</span>
                  <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0 0' }}>
                    {member.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Services Offered */}
              {member.services && member.services.length > 0 && (
                <div style={{ margin: '15px 0' }}>
                  <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Services Offered</span>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '6px',
                    marginTop: '8px'
                  }}>
                    {member.services.map((service, index) => (
                      <span key={index} style={{
                        background: 'rgba(229, 193, 88, 0.08)',
                        color: '#e5c158',
                        padding: '5px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        border: '1px solid rgba(229, 193, 88, 0.12)'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div style={{ 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    color: '#666', 
                    fontSize: '11px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 'bold'
                  }}>
                    📝 {reviews[member._id] && reviews[member._id].length > 0 ? 'Recent Reviews' : 'Write a Review'}
                  </span>
                  <button
                    onClick={() => setShowReviewInput(prev => ({ ...prev, [member._id]: !prev[member._id] }))}
                    className="review-toggle-btn"
                    style={{
                      background: 'transparent',
                      color: '#e5c158',
                      border: '1px solid rgba(229, 193, 88, 0.2)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      transition: 'all 0.3s'
                    }}
                  >
                    {showReviewInput[member._id] ? '✕ Close' : '✏️ Write Review'}
                  </button>
                </div>
                
                {/* Display Reviews */}
                {reviews[member._id] && reviews[member._id].length > 0 ? (
                  <>
                    {reviews[member._id].slice(0, showAllReviews[member._id] ? reviews[member._id].length : 2).map((review, index) => (
                      <div key={index} className="review-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ color: '#ddd', fontSize: '13px' }}>
                            {review.customerName || 'Anonymous'}
                          </strong>
                          <span style={{ color: '#666', fontSize: '11px' }}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p style={{ 
                          color: '#999', 
                          fontSize: '13px', 
                          margin: '0',
                          lineHeight: '1.6'
                        }}>
                          {review.review}
                        </p>
                      </div>
                    ))}
                    
                    {reviews[member._id].length > 2 && (
                      <button
                        onClick={() => setShowAllReviews(prev => ({ ...prev, [member._id]: !prev[member._id] }))}
                        style={{
                          background: 'transparent',
                          color: '#888',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginTop: '8px',
                          textDecoration: 'underline',
                          padding: '4px 0'
                        }}
                      >
                        {showAllReviews[member._id] ? 'Show less' : `View all ${reviews[member._id].length} reviews →`}
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ 
                    color: '#666', 
                    fontSize: '13px', 
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    fontStyle: 'italic'
                  }}>
                    No reviews yet. Be the first to review {member.name}!
                  </div>
                )}
              </div>

              {/* Write Review Section */}
              {showReviewInput[member._id] && (
                <div style={{ 
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <p style={{ 
                    color: '#888', 
                    fontSize: '13px', 
                    marginBottom: '10px'
                  }}>
                    Share your experience with {member.name}
                  </p>
                  <textarea
                    placeholder="Write your review here... (minimum 5 characters)"
                    value={reviewText[member._id] || ''}
                    onChange={(e) => setReviewText(prev => ({ ...prev, [member._id]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#1a1a1a',
                      color: '#ccc',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      fontSize: '13px',
                      resize: 'vertical',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e5c158'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                  />
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '12px',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => setShowReviewInput(prev => ({ ...prev, [member._id]: false }))}
                      className="cancel-btn"
                      style={{
                        padding: '8px 20px',
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReviewSubmit(member._id)}
                      disabled={submitting}
                      className="submit-btn"
                      style={{
                        padding: '8px 24px',
                        background: '#e5c158',
                        color: '#1a1817',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        opacity: submitting ? 0.5 : 1,
                        transition: 'all 0.3s'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}

              {/* Rating Section */}
              <div style={{ 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: '#666', 
                  fontSize: '12px', 
                  marginBottom: '8px',
                  letterSpacing: '0.5px'
                }}>
                  Rate this staff member
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {renderStars(member._id, 0, true)}
                </div>
                {submitting && (
                  <div style={{ 
                    color: '#aaa', 
                    fontSize: '12px', 
                    marginTop: '10px'
                  }}>
                    Submitting your rating...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;