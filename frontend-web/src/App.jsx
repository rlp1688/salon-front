import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './dashboard';
import ServiceCatalog from './components/ServiceCatalog';


function App() {
  const [userSession, setUserSession] = useState(() => {
    const savedSession = localStorage.getItem('userSession');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const handleLogout = () => {
    setUserSession(null);
    localStorage.removeItem('userSession');
  };

  return (
    <div>
      {userSession ? (
        <Dashboard userSession={userSession} handleLogout={handleLogout} />
      ) : (
        <Login setUserSession={setUserSession} />
      )}
    </div>
  );
}

export default App;