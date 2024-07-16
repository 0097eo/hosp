import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PatientList.css'

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDropdownPatient, setSelectedDropdownPatient] = useState("");

  useEffect(() => {
    fetch("/patients")
      .then((r) => r.json())
      .then(setPatients);
  }, []);

  function handleDelete(id) {
    fetch(`/patient/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setPatients((patients) =>
          patients.filter((patient) => patient.id !== id)
        );
        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(null);
          setSelectedDropdownPatient("");
        }
      }
    });
  }

  async function handleUpdate(id) {
    const updatedFields = {};
    updatedFields.first_name = prompt("Enter updated first name:", selectedPatient.first_name);
    updatedFields.last_name = prompt("Enter updated last name:", selectedPatient.last_name);
    updatedFields.contact_number = prompt("Enter updated contacts:", selectedPatient.contact_number);
    updatedFields.email = prompt("Enter updated email:", selectedPatient.email);

    if (!updatedFields.first_name && !updatedFields.last_name && !updatedFields.contact_number && !updatedFields.email) {
      return;
    }

    try {
      const response = await fetch(`/patient/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        alert("Patient updated successfully")
        fetch(`/patient/${id}`)
          .then((r) => r.json())
          .then((updatedPatient) => {
            setSelectedPatient(updatedPatient);
            fetch("/patients")
              .then((r) => r.json())
              .then(setPatients);
          });
      } else {
        throw new Error("Failed to update patient");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  }

  function handleDropdownChange(event) {
    const selectedId = event.target.value;
    const selected = patients.find(patient => patient.id === parseInt(selectedId));
    setSelectedDropdownPatient(selectedId);
    setSelectedPatient(selected);
  }

  return (
    <div className="patients-container">
      <div className="dropdown">
        <h2>Patients List</h2>
        <select value={selectedDropdownPatient} onChange={handleDropdownChange}>
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </option>
          ))}
        </select>
      </div>
      {selectedPatient && (
        <div className="details">
          <h3>{selectedPatient.first_name} {selectedPatient.last_name}</h3>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Phone Number:</strong> {selectedPatient.contact_number}</p>
          <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
          <div className="button-group">
            <button onClick={() => handleUpdate(selectedPatient.id)}>Update</button>
            <button onClick={() => handleDelete(selectedPatient.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;