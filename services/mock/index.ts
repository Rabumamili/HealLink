import { AppointmentRepository } from './appointment.repository';
import { MockServiceRegistry } from './mock-service.registry';
import { PatientRepository } from './patient.repository';
import { PaymentRepository } from './payment.repository';
import { ProviderRepository } from './provider.repository';
import { ServiceRepository } from './service.repository';

// Export all repositories
export { BaseRepository } from './base.repository';
export { ServiceRepository } from './service.repository';
export { PatientRepository } from './patient.repository';
export { ProviderRepository, type Provider } from './provider.repository';
export { PaymentRepository } from './payment.repository';
export { CardRepository } from './card.repository';
export { AppointmentRepository } from './appointment.repository';
export { MockServiceRegistry } from './mock-service.registry';

// Export convenience functions
export const getCardRepository = () => import('./card.repository').then(m => m.CardRepository.getInstance());
export const getMockServiceRegistry = () => MockServiceRegistry.getInstance();
export const getServiceRepository = () => ServiceRepository.getInstance();
export const getPatientRepository = () => PatientRepository.getInstance();
export const getProviderRepository = () => ProviderRepository.getInstance();
export const getAppointmentRepository = () => AppointmentRepository.getInstance();
export const getPaymentRepository = () => PaymentRepository.getInstance();