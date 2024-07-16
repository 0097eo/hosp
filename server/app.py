#app.py
#!/usr/bin/env python3
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask import Flask, make_response,jsonify,session,request, current_app
from flask_restful import Resource, Api
from functools import wraps
import bcrypt
from datetime import datetime, timedelta

from config import app,db,api
from models import Admin, Patient

# Views go here!
class checkSession(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt_identity()
        if claims:
            return {"user is logged in": "True"},200
        else:
            return {"message": "Invalid token user not logged in"}, 401


from models import db,Patient, Appointment,Service, Bill, BillService, Doctor


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] != 'admin':
                return jsonify(msg='Admins only!'), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

def patient_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] != 'patient':
                return jsonify(msg='Patients only!'), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_or_patient_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] not in ['admin', 'patient']:
                return jsonify(msg='Unauthorized'), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

from datetime import timedelta

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username and password are required'}, 400

        patient = Patient.query.filter_by(username=username).first()
        admin = Admin.query.filter_by(username=username).first()

        if patient:
            if patient.authenticate(password):
                access_token = create_access_token(
                    identity={'id': patient.id, 'role': 'patient'},
                    expires_delta=timedelta(days=4)
                )
                session['id'] = patient.id
                return {'access_token': access_token}, 200
            else:
                return {'message': 'Invalid password for patient'}, 401
        elif admin:
            if admin._password_hash is None:
                return {'message': 'Admin password not set'}, 500
            if admin.authenticate(password):
                access_token = create_access_token(
                    identity={'id': admin.id, 'role': 'admin'},
                    expires_delta=timedelta(days=4)
                )
                return {'access_token': access_token, 'role': 'admin'}, 200
            else:
                return {'message': 'Invalid password for admin'}, 401
        else:
            return {'message': 'User not found'}, 404

class PatientResource(Resource):
    #@admin_required()
    def get(self):
        patients = Patient.query.all()
        return [patient.to_dict() for patient in patients], 200

    
    def post(self):
        data = request.get_json()
        
        # Check if username already exists
        existing_patient = Patient.query.filter_by(username=data.get('username')).first()
        if existing_patient:
            return {'message': 'Username already exists'}, 400
        
        try:
            new_patient = Patient(
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                username=data.get('username'),
                date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d') if data.get('date_of_birth') else None,
                contact_number=data.get('contact_number'),
                email=data.get('email'),
                role='patient'
            )
            
            new_patient.password_hash = data.get('password')

            db.session.add(new_patient)
            db.session.commit()
            return new_patient.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'An error occurred while creating the patient'}, 500
    

class SinglePatientResource(Resource):
    @admin_or_patient_required()
    def get(self):
        claims = get_jwt_identity()
        if claims['role'] == 'admin':
            patient_id = request.args.get('patient_id')
            patient = Patient.query.get_or_404(patient_id)
        else:
            patient = Patient.query.get(claims['id'])
        
        if patient:
            return patient.to_dict(), 200        
        else:
            return {'message': 'Patient not found'}, 404
        
    def get_by_id(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        return patient.to_dict(), 200
    
class PatientByID(Resource):
    #@admin_required()
    def get(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        
        if patient:
            return {
                'id': patient.id,
                'first_name': patient.first_name,
                'last_name': patient.last_name,
                'username': patient.username,
                'date_of_birth': patient.date_of_birth,
                'contact_number': patient.contact_number,
                'email': patient.email,
                'role': patient.role
            }, 200
        else:
            return {'message': 'Patient not found'}, 404
        
    def patch(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        data = request.get_json()

        for key, value in data.items():
            if key != 'id' and hasattr(patient, key):
                setattr(patient, key, value)

        try:
            db.session.commit()
            return patient.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'An error occurred while updating the patient', 'error': str(e)}, 500
        
    #@admin_required()
    def delete(self, patient_id):
        patient = Patient.query.get_or_404(patient_id)
        try:
            db.session.delete(patient)
            db.session.commit()
            return {'message': f'Patient with id {patient_id} has been deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'An error occurred while deleting the patient', 'error': str(e)}, 500


class AppointmentResource(Resource):
    @admin_or_patient_required()
    def post(self):
        claims = get_jwt_identity()
        data = request.get_json()

        # Always use the patient ID from the JWT claims
        patient_id = claims['id']

        # Remove patient_id from data if it exists, as we're setting it from claims
        data.pop('patient_id', None)

        if 'appointment_date' in data:
            data['appointment_date'] = datetime.strptime(data['appointment_date'], '%Y-%m-%d %H:%M:%S')

        appointment = Appointment(patient_id=patient_id, **data)

        db.session.add(appointment)
        db.session.commit()
        return appointment.to_dict(), 201
    
    #@admin_required()
    def get(self):
        appointments = Appointment.query.all()
        return [appointment.to_dict() for appointment in appointments], 200

    #@admin_required()
    def patch(self, appointment_id):
        appointment = Appointment.query.get_or_404(appointment_id)
        data = request.get_json()
        
        for key, value in data.items():
            setattr(appointment, key, value)
        
        db.session.commit()
        return appointment.to_dict(), 200

    #@admin_required()
    def delete(self, appointment_id):
        appointment = Appointment.query.get_or_404(appointment_id)
        db.session.delete(appointment)
        db.session.commit()
        return '', 204
    
class SingleAppointmentResource(Resource):
    @admin_or_patient_required()
    def get(self):
        claims = get_jwt_identity()
        if claims['role'] == 'admin':
            patient_id = request.args.get('patient_id')
            appointments = Appointment.query.filter_by(patient_id=patient_id).all()
        else:
            appointments = Appointment.query.filter_by(patient_id=claims['id']).all()
        return [appointment.to_dict() for appointment in appointments], 200
    
class AppointmentByID(Resource):
    
    @admin_or_patient_required()
    def get(self, appointment_id):
        appointment = Appointment.query.get_or_404(appointment_id)
        return appointment.to_dict(), 200

    def delete(self, appointment_id):
        appointment = Appointment.query.get_or_404(appointment_id)
        db.session.delete(appointment)
        db.session.commit()
        
        return {"message": "Appointment deleted successfully"}, 200


class BillResource(Resource):
    #@admin_required()
    def get(self):
        bills = Bill.query.all()
        return [bill.to_dict() for bill in bills], 200

    #@admin_required()
    def post(self):
        data = request.get_json()
        new_bill = Bill(**data)
        db.session.add(new_bill)
        db.session.commit()
        return new_bill.to_dict(), 201
    
class SingleBillResource(Resource):
    @admin_or_patient_required()
    def get(self):
        claims = get_jwt_identity()
        if claims['role'] == 'admin':
            patient_id = request.args.get('patient_id')
            bills = Bill.query.filter_by(patient_id=patient_id).all()
        else:
            bills = Bill.query.filter_by(patient_id=claims['id']).all()
        return [bill.to_dict() for bill in bills], 200


    
class services_offered(Resource):
    def get(self,patient_id):
        services = [service.to_dict() for service in Bill.query.filter(Bill.patient_id ==patient_id).all()]
        return make_response(services, 200)
    def post(self,patient_id):
        data = request.get_json()
        service = Service.query.filter(Service.id == data['service_id']).first()
        patient = Patient.query.filter(Patient.id == patient_id).first()
        if patient and service:
            bill = Bill(
                patient_id = patient_id
            )
            db.session.add(bill)
            db.session.commit()
            bill_service = BillService(
                bill_id = bill.id,
                service_id = data['service_id']
                )
            db.session.add(bill_service)
            db.session.commit()
            return make_response(bill_service.to_dict(), 201)
        else:
            return {"message":"Invalid patient or service"},404
    def patch(self,patient_id):
        data = request.get_json()
        bill = Bill.query.filter(Bill.id == data['bill_id']).first()
        if bill:
            bill.status = data['status']
            db.session.commit()
            return make_response(bill.to_dict(), 200)
        else:
            return {"message":"Invalid patient"},404
    def delete(self,patient_id):
        bill = Bill.query.filter_by(id = patient_id).first()
        if bill:
            db.session.delete(bill)
            db.session.commit()
            return {"message":"Bill deleted"},200
        else:
            return {"message":"Invalid bill"},404
class services_data(Resource):
    #@admin_or_patient_required()
    def get(self):
        services = [service.to_dict() for service in Service.query.all()]
        return make_response(services, 200)
    
    #@admin_required()
    def post(self):
        data = request.get_json()
        service = Service(
            name=data['name'],
            price=data['price'],
            description=data['description']
        )
        db.session.add(service)
        db.session.commit()
        return make_response(service.to_dict(), 201)
    
    #@admin_required()
    def patch(self, service_id):
        data = request.get_json()
        service = Service.query.filter_by(id=service_id).first()
        if service:
            service.name = data['name']
            service.price = data['price']
            service.description = data['description']
            db.session.commit()
            return make_response(service.to_dict(), 200)
        else:
            return {"message":"Invalid service"},404
        
    #@admin_required()
    def delete(self, service_id):
        service = Service.query.filter_by(id=service_id).first()
        if service:
            db.session.delete(service)
            db.session.commit()
            return {"message":"Service deleted"},200
        else:
            return {"message":"Invalid service"},404
        
class DoctorResource(Resource):
    def get(self):
        doctors = Doctor.query.all()
        return [doctor.to_dict() for doctor in doctors], 200

    def post(self):
        data = request.get_json()
        try:
            new_doctor = Doctor(
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                specialization=data.get('specialization')
            )
            db.session.add(new_doctor)
            db.session.commit()
            return new_doctor.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'An error occurred while creating the doctor'}, 500

class SingleDoctorResource(Resource):
    def get(self, doctor_id):
        doctor = Doctor.query.get_or_404(doctor_id)
        return doctor.to_dict(), 200

    def patch(self, doctor_id):
        doctor = Doctor.query.get_or_404(doctor_id)
        data = request.get_json()
        
        for key, value in data.items():
            setattr(doctor, key, value)
        
        db.session.commit()
        return doctor.to_dict(), 200

    def delete(self, doctor_id):
        doctor = Doctor.query.get_or_404(doctor_id)
        db.session.delete(doctor)
        db.session.commit()
        return '', 204
    

class ServiceByID(Resource):
    def get(self, service_id):
        service = Service.query.get_or_404(service_id)
        return {
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "price": service.price
        }, 200
    
    def delete(self, service_id):
        service = Service.query.get_or_404(service_id)
        try:
            # Delete associated bill_services first
            BillService.query.filter_by(service_id=service_id).delete()
            
            # Then delete the service
            db.session.delete(service)
            db.session.commit()
            return {"message": f"Service with id {service_id} has been deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": "An error occurred while deleting the service", "error": str(e)}, 500

    def patch(self, service_id):
        service = Service.query.get_or_404(service_id)
        data = request.get_json()
        try:
            for key, value in data.items():
                if hasattr(service, key):
                    setattr(service, key, value)
            db.session.commit()
            return service.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": "An error occurred while updating the service", "error": str(e)}, 500

# Routes
api.add_resource(Login, '/login')
api.add_resource(PatientResource, '/patients', '/patient')
api.add_resource(SinglePatientResource, '/patient/me', endpoint='patient_self')
api.add_resource(PatientByID, '/patient/<int:patient_id>', endpoint='patient_by_id')
api.add_resource(services_offered,'/services_offered/<int:patient_id>', endpoint='services_offered')
api.add_resource(services_data,'/services_data', endpoint='services_data')
api.add_resource(ServiceByID, '/service_data/<int:service_id>')
api.add_resource(AppointmentResource, '/appointments',)
api.add_resource(AppointmentByID, '/appointments/<int:appointment_id>', endpoint='appointment_by_id')
api.add_resource(SingleAppointmentResource, '/appointments/me', endpoint='appointments_self')
api.add_resource(BillResource, '/bills')
api.add_resource(SingleBillResource, '/bills/me', endpoint='bills_self')
api.add_resource(DoctorResource, '/doctors')
api.add_resource(SingleDoctorResource, '/doctors/<int:doctor_id>')
api.add_resource(checkSession,'/check_session',endpoint='check_session')
if __name__ == '__main__':
    app.run(port=5555, debug=True)
