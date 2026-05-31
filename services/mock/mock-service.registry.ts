import { AppointmentRepository } from './appointment.repository';
import { PatientRepository } from './patient.repository';
import { ServiceRepository } from './service.repository';
import { ProviderRepository } from './provider.repository';
import { CardRepository } from './card.repository';
import { PaymentRepository } from './payment.repository';

export class MockServiceRegistry {
  private static instance: MockServiceRegistry;
  private appointments: AppointmentRepository;
  private patients: PatientRepository;
  private services: ServiceRepository;
  private providers: ProviderRepository;
  private cards: CardRepository;
  private payments: PaymentRepository;

  private constructor() {
    this.patients = PatientRepository.getInstance();
    this.services = ServiceRepository.getInstance();
    this.providers = ProviderRepository.getInstance();
    this.cards = CardRepository.getInstance();
    this.payments = PaymentRepository.getInstance();
    this.appointments = AppointmentRepository.getInstance();
  }

  static getInstance(): MockServiceRegistry {
    if (!MockServiceRegistry.instance) {
      MockServiceRegistry.instance = new MockServiceRegistry();
    }
    return MockServiceRegistry.instance;
  }

  getAppointments() {
    return this.appointments;
  }

  getPatients() {
    return this.patients;
  }

  getServices() {
    return this.services;
  }

  getProviders() {
    return this.providers;
  }

  getCards() {
    return this.cards;
  }

  getPayments() {
    return this.payments;
  }

}