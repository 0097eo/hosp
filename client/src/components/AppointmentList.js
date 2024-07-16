import React, { useEffect, useState } from "react";
import './AppointmentList.css';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  function fetchAppointments() {
    fetch("/appointments")
      .then((r) => r.json())
      .then(setAppointments)
      .catch((error) => console.error("Error fetching appointments:", error));
  }

  function handleDropdownChange(event) {
    const selectedId = event.target.value;
    const selected = appointments.find(appointment => appointment.id === parseInt(selectedId));
    setSelectedAppointment(selected);
  }

  function handleDelete() {
    if (selectedAppointment) {
      fetch(`/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
            setSelectedAppointment(null);
            alert("Appointment deleted successfully");
          } else {
            throw new Error('Failed to delete appointment');
          }
        })
        .catch((error) => {
          console.error("Error deleting appointment:", error);
          alert("Failed to delete appointment");
        });
    }
  }

  return (
    <div className="appointment-list">
      <div className="dropdown">
        <h2>Appointments</h2>
        <select onChange={handleDropdownChange}>
          <option value="">Select an appointment</option>
          {appointments.map((appointment) => (
            <option key={appointment.id} value={appointment.id}>
              Appointment - {appointment.id}
            </option>
          ))}
        </select>
      </div>
      {selectedAppointment && (
        <section className="a-details">
          <h3>Appointment - {selectedAppointment.id}</h3>
          <p><strong>Patient ID:</strong> {selectedAppointment.patient_id}</p>
          <p><strong>Doctor ID:</strong> {selectedAppointment.doctor_id}</p>
          <p><strong>Status:</strong> {selectedAppointment.status}</p>
          <p><strong>Date:</strong> {new Date(selectedAppointment.appointment_date).toLocaleString()}</p>
          <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
          <button onClick={handleDelete}>Delete Appointment</button>
        </section>
      )}
    </div>
  );
}

export default AppointmentList;