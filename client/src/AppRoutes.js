import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LogIn from './components/PublicRoutes/LogIn';
import AdminLogIn from './components/AdminLogin';
import AppointmentList from './components/AppointmentList';
import Home from './components/PublicRoutes/Home';
import SignUp from './components/PublicRoutes/SignUp';
import Access from './components/Acess';
import NewAppointment from './components/NewAppointment';
import About from './components/About';
import PatientDetails from './components/PatientDetails';

const AppRoutes = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoggedIn(false);
        return;
      }

      try {
        const response = await fetch('/check_session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLoggedIn(data['user is logged in']);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/admin_dashboard', element: <Access /> },
    { path: '/about-us', element: <About /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element: <LogIn setLoggedIn={setLoggedIn} loggedIn={loggedIn} /> },
    { path: '/admin', element: <AdminLogIn setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>},
    { path: '/profile',  element: <PatientDetails/>}
  ];

  const privateRoutes = [
    { path: '/new_appointment', element: <NewAppointment /> },
    { path: '/appointments', element: <AppointmentList /> },
  ];

  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {privateRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={loggedIn ? route.element : <Navigate to="/login" replace />}
          />
        ))}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;