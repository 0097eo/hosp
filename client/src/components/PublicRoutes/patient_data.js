import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';

const SinglePatient = () => {
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/patient/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
          console.log(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('An error occurred while fetching the data');
      }
    };

    fetchPatientData();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PatientNavbar />
      <h1>Patient Data</h1>
      <div>
        
      </div>
    </div>
  );
};

export default SinglePatient;
