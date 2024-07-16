import React, { useState, useEffect } from 'react';
import './PatientDetails.css';
import Navbar from './navbar';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';

function PatientDetails() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch('/patient/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setLoggedIn(false);
    navigate('/login'); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patientData) return <div>No patient data available</div>;

  return (
    <>
      <Navbar />
      <Logout onLogout={handleLogout} />
      <div className="patient-details">
        <h2>My Details</h2>
        <div className="personal-info">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {patientData.first_name} {patientData.last_name}</p>
          <p><strong>Username:</strong> {patientData.username}</p>
          <p><strong>Email:</strong> {patientData.email}</p>
          <p><strong>Contact Number:</strong> {patientData.contact_number}</p>
          <p><strong>Date of Birth:</strong> {new Date(patientData.date_of_birth).toLocaleDateString()}</p>
        </div>

        <div className="appointments">
          <h3>Appointments</h3>
          {patientData.appointments.length > 0 ? (
            <ul>
              {patientData.appointments.map(appointment => (
                <li key={appointment.id}>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments scheduled</p>
          )}
        </div>

        <div className="bills">
          <h3>Bills</h3>
          {patientData.bills.length > 0 ? (
            <ul>
              {patientData.bills.map(bill => (
                <li key={bill.id}>
                  {/* Add bill details here when available */}
                  <p>Bill ID: {bill.id}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bills available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PatientDetails;