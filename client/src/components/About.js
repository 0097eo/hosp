import React from "react";
import "./About.css";
import Navbar from "./navbar";
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <>
        <Navbar/>
        <div className="about-container">
            <h1 className="about-title">About CareConnect</h1>
            <button className="b"><Link to="/new_appointment" >Book Appointment</Link></button>
            <div className="about-content">
                <p>
                    CareConnect is a comprehensive healthcare facility dedicated to providing high-quality medical services to our patients. Our mission is to modernize healthcare operations and improve patient care through innovative solutions.
                </p>
                <p>
                    We offer a wide range of services designed to meet the diverse needs of our community. Our team of experienced healthcare professionals is committed to delivering personalized care and ensuring that every patient has a positive experience.
                </p>
                <h2 className="about-title">Services Offered</h2>
                <ul className="services-list">
                    <li className="service-item">General Medicine</li>
                    <li className="service-item">Pediatrics</li>
                    <li className="service-item">Gynecology</li>
                    <li className="service-item">Cardiology</li>
                    <li className="service-item">Orthopedics</li>
                    <li className="service-item">Dermatology</li>
                    <li className="service-item">Radiology</li>
                    <li className="service-item">Surgical Services</li>
                    <li className="service-item">Laboratory Services</li>
                    <li className="service-item">Pharmacy</li>
                </ul>
            </div>
        </div>
        </>
    );
};

export default About;