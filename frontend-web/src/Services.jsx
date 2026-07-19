import { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        
        const res = await axios.get('https://salonweb.onrender.com/api/services');
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please check if the backend is running.");
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <div style={{ color: '#aaa', fontSize: '14px' }}>Loading available treatments...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '25px', color: '#e5c158' }}>Available Treatments</h2>
      
      {error && <div style={{ color: '#ff6b6b', marginBottom: '20px' }}>{error}</div>}

      {services.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No services available yet. Check back soon!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {services.map((service) => (
            <div key={service._id} style={{ 
              padding: '25px', 
              background: '#11100f', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'transform 0.2s'
            }}>
              <h3 style={{ color: '#e5c158', margin: '0 0 10px 0', fontSize: '18px' }}>{service.name}</h3>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>{service.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{service.price} LKR</span>
                <span style={{ fontSize: '12px', color: '#666', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>{service.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;