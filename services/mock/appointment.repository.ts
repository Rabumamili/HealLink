import { BaseRepository } from './base.repository';
import { Appointment, AppointmentStats, EnrichedAppointment, AppointmentStatus, BookAppointmentRequest, BookAppointmentResponse, PaymentStatus, AppointmentFilters } from '@/types/entities/appointment.types';
import { PatientRepository } from './patient.repository';
import { ServiceRepository } from './service.repository';
import { ProviderRepository } from './provider.repository';
import { CardRepository } from './card.repository';
import { PaymentRepository } from './payment.repository';
import { Card } from '@/types/entities/card.types';

export class AppointmentRepository extends BaseRepository<Appointment> {
  private static instance: AppointmentRepository;
  private patientRepo: PatientRepository;
  private serviceRepo: ServiceRepository;
  private providerRepo: ProviderRepository;
  private cardRepo: CardRepository;
  private paymentRepo: PaymentRepository;
  
  private constructor() {
    super();
    this.patientRepo = PatientRepository.getInstance();
    this.serviceRepo = ServiceRepository.getInstance();
    this.providerRepo = ProviderRepository.getInstance();
    this.cardRepo = CardRepository.getInstance();
    this.paymentRepo = PaymentRepository.getInstance();
    this.initializeMockData();
  }

  static getInstance(): AppointmentRepository {
    if (!AppointmentRepository.instance) {
      AppointmentRepository.instance = new AppointmentRepository();
    }
    return AppointmentRepository.instance;
  }

  private initializeMockData(): void {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    this.items = [
      // Today's appointments
      {
        id: 1,
        patientId: 201,
        serviceId: 1,
        providerId: 101,
        slotId: 5,
        scheduledDateTime: `${today} 09:00:00`,
        status: 'Confirmed',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: 'First-time patient',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        paymentId: 5001,
        cardId: null
      },
      {
        id: 2,
        patientId: 202,
        serviceId: 2,
        providerId: 102,
        slotId: 6,
        scheduledDateTime: `${today} 10:30:00`,
        status: 'Checked-in',
        checkInTime: new Date().toISOString(),
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: 15,
        notes: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        paymentId: null,
        cardId: 1
      },
      {
        id: 3,
        patientId: 201,
        serviceId: 10,
        providerId: 104,
        slotId: 7,
        scheduledDateTime: `${today} 14:00:00`,
        status: 'Scheduled',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: 'Requires fasting',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        paymentId: null,
        cardId: null
      },
      // Tomorrow's appointments
      {
        id: 4,
        patientId: 202,
        serviceId: 6,
        providerId: 103,
        slotId: 8,
        scheduledDateTime: `${tomorrow} 11:00:00`,
        status: 'Scheduled',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentId: null,
        cardId: null
      },
      {
        id: 5,
        patientId: 201,
        serviceId: 3,
        providerId: 105,
        slotId: 1,
        scheduledDateTime: `${tomorrow} 09:00:00`,
        status: 'Confirmed',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: 'Bring previous medical records',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentId: null,
        cardId: null
      },
      // Completed appointments (yesterday)
      {
        id: 6,
        patientId: 202,
        serviceId: 4,
        providerId: 106,
        slotId: 2,
        scheduledDateTime: `${yesterday} 10:00:00`,
        status: 'Completed',
        checkInTime: `${yesterday} 09:50:00`,
        startTime: `${yesterday} 10:00:00`,
        endTime: `${yesterday} 10:30:00`,
        estimatedWaitMinutes: 10,
        notes: null,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: `${yesterday} 10:30:00`,
        paymentId: null,
        cardId: null
      }
    ];
  }

  private enrichAppointment(appointment: Appointment): EnrichedAppointment {
    const patient = this.patientRepo.findById(appointment.patientId);
    const service = appointment.serviceId ? this.serviceRepo.findById(appointment.serviceId) : null;
    
    let providerName = '';
    let providerType: 'doctor' | 'clinic' | 'diagnostic_center' = 'doctor';
    let location = '';
    let locationDetail = '';
    let fee = service?.standardFee || 0;
    let providerImage = '';
    let providerEmail = '';
    let providerPhone = '';
    
    if (service) {
      const provider = this.providerRepo.findById(service.providerId);
      if (provider) {
        providerName = provider.name;
        providerType = provider.type === 'diagnostic' ? 'diagnostic_center' : (provider.type === 'doctor' ? 'doctor' : 'clinic');
        location = provider.location;
        locationDetail = provider.locationDetail || '';
        providerImage = provider.image || '';
        providerEmail = provider.contactEmail;
        providerPhone = provider.contactPhone;
      }
      fee = service.standardFee;
    }
    
    let cardNumber = undefined;
    let cardStatus = undefined;
    if (appointment.cardId) {
      const card = this.cardRepo.findById(appointment.cardId);
      if (card) {
        cardNumber = card.cardNumber;
        cardStatus = card.status;
      }
    }
    
    let paymentStatus: PaymentStatus = 'PENDING';
    if (appointment.paymentId) {
      const payment = this.paymentRepo.findById(appointment.paymentId);
      if (payment) {
        paymentStatus = payment.status;
      }
    }
    
    return {
      ...appointment,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
      patientImage: patient?.profile_photo,
      patientEmail: patient?.email,
      patientPhone: patient?.phone_number,
      serviceName: service ? service.name : 'No Service',
      serviceDescription: service?.description,
      serviceDuration:service?.durationMinutes,
      serviceType: service?.serviceType,
      slotTime: this.formatSlotTime(appointment.slotId),
      providerName,
      providerType,
      location,
      locationDetail,
      fee,
      providerImage,
      providerEmail,
      providerPhone,
      paymentStatus,
      cardNumber,
      cardStatus
    };
  }

  private formatSlotTime(slotId: number): string {
    const slotMap: Record<number, string> = {
      1: '09:00 AM - 09:30 AM',
      2: '09:30 AM - 10:00 AM',
      3: '10:00 AM - 10:30 AM',
      4: '10:30 AM - 11:00 AM',
      5: '11:00 AM - 11:30 AM',
      6: '11:30 AM - 12:00 PM',
      7: '02:00 PM - 02:30 PM',
      8: '02:30 PM - 03:00 PM'
    };
    return slotMap[slotId] || 'Time not specified';
  }

  // ============= APPOINTMENT LISTING METHODS =============
  
  getAppointmentsForPatient(patientId: number): EnrichedAppointment[] {
    const patientAppointments = this.items.filter(
      appointment => appointment.patientId === patientId
    );
    return patientAppointments.map(app => this.enrichAppointment(app));
  }

  getAppointmentsForProvider(providerId: number): EnrichedAppointment[] {
    const providerAppointments = this.items.filter(appointment => {
      const service = this.serviceRepo.findById(appointment.serviceId);
      return service?.providerId === providerId;
    });
    return providerAppointments.map(app => this.enrichAppointment(app));
  }

  getUpcomingAppointmentsForPatient(patientId: number): EnrichedAppointment[] {
    const now = new Date();
    const upcoming = this.items.filter(appointment => 
      appointment.patientId === patientId &&
      appointment.status !== 'Completed' &&
      appointment.status !== 'Cancelled' &&
      new Date(appointment.scheduledDateTime) >= now
    );
    return upcoming.map(app => this.enrichAppointment(app));
  }

  getUpcomingAppointmentsForProvider(providerId: number): EnrichedAppointment[] {
    const now = new Date();
    const upcoming = this.items.filter(appointment => {
      const service = this.serviceRepo.findById(appointment.serviceId);
      return service?.providerId === providerId &&
        appointment.status !== 'Completed' &&
        appointment.status !== 'Cancelled' &&
        new Date(appointment.scheduledDateTime) >= now;
    });
    return upcoming.map(app => this.enrichAppointment(app));
  }

  getPastAppointmentsForPatient(patientId: number): EnrichedAppointment[] {
    const now = new Date();
    const past = this.items.filter(appointment => 
      appointment.patientId === patientId &&
      (appointment.status === 'Completed' || appointment.status === 'Cancelled' ||
       new Date(appointment.scheduledDateTime) < now)
    );
    return past.map(app => this.enrichAppointment(app));
  }

  getTodayAppointmentsForProvider(providerId: number): EnrichedAppointment[] {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = this.items.filter(appointment => {
      const service = this.serviceRepo.findById(appointment.serviceId);
      return service?.providerId === providerId &&
        appointment.scheduledDateTime.startsWith(today);
    });
    return todayAppointments.map(app => this.enrichAppointment(app));
  }

  getAppointmentsWithFilters(filters: AppointmentFilters): EnrichedAppointment[] {
    let filtered = [...this.items];
    
    if (filters.patientId) {
      filtered = filtered.filter(a => a.patientId === filters.patientId);
    }
    
    if (filters.providerId) {
      filtered = filtered.filter(a => {
        const service = this.serviceRepo.findById(a.serviceId);
        return service?.providerId === filters.providerId;
      });
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    if (filters.serviceId) {
      filtered = filtered.filter(a => a.serviceId === filters.serviceId);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(a => a.scheduledDateTime.split(' ')[0] >= filters.startDate!);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(a => a.scheduledDateTime.split(' ')[0] <= filters.endDate!);
    }
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(a => {
        const service = this.serviceRepo.findById(a.serviceId);
        return service?.serviceType === filters.type;
      });
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(a => {
        const patient = this.patientRepo.findById(a.patientId);
        const service = this.serviceRepo.findById(a.serviceId);
        const patientName = patient ? `${patient.first_name} ${patient.last_name}`.toLowerCase() : '';
        const serviceName = service?.name.toLowerCase() || '';
        return patientName.includes(term) || serviceName.includes(term);
      });
    }
    
    return filtered.map(app => this.enrichAppointment(app));
  }

  // ============= CORE CRUD METHODS =============
  
  findById(id: number): EnrichedAppointment | undefined {
    const appointment = super.findById(id);
    if (!appointment) return undefined;
    return this.enrichAppointment(appointment);
  }

  findAll(): EnrichedAppointment[] {
    return this.items.map(appointment => this.enrichAppointment(appointment));
  }

  findByPatientId(patientId: number): EnrichedAppointment[] {
    return this.getAppointmentsForPatient(patientId);
  }

  findByProviderId(providerId: number): EnrichedAppointment[] {
    return this.getAppointmentsForProvider(providerId);
  }

  findByDate(date: string): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => 
      appointment.scheduledDateTime.startsWith(date)
    );
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  findByDateRange(startDate: string, endDate: string): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => {
      const appointmentDate = appointment.scheduledDateTime.split(' ')[0];
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  getStats(): AppointmentStats {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = this.items.filter(a => a.scheduledDateTime.startsWith(today));
    
    const completedAppointments = this.items.filter(a => a.status === 'Completed');
    const checkedInAppointments = this.items.filter(a => a.status === 'Checked-in');
    
    const totalWaitTime = checkedInAppointments.reduce((sum, a) => sum + (a.estimatedWaitMinutes || 0), 0);
    const averageWaitTime = checkedInAppointments.length > 0 ? totalWaitTime / checkedInAppointments.length : 0;

    const revenue = this.items.reduce((sum, appointment) => {
      if (appointment.status === 'Completed') {
        const service = this.serviceRepo.findById(appointment.serviceId);
        return sum + (service?.standardFee || 0);
      }
      return sum;
    }, 0);

    const cardsIssued = this.items.filter(a => a.cardId !== null).length;
    const cardsUtilized = this.items.filter(a => a.status === 'Checked-in').length;

    return {
      total: this.items.length,
      today: todayAppointments.length,
      confirmed: this.items.filter(a => a.status === "Confirmed").length,
      checkedIn: checkedInAppointments.length,
      inProgress: this.items.filter(a => a.status === "In Progress").length,
      completed: completedAppointments.length,
      cancelled: this.items.filter(a => a.status === "Cancelled").length,
      noShow: this.items.filter(a => a.status === "No-show").length,
      averageWaitTime: Math.round(averageWaitTime),
      revenue: revenue,
      upcoming: this.items.filter(a => 
        a.status === "Scheduled" || a.status === "Confirmed" || a.status === "Checked-in"
      ).length,
      cardsIssued: cardsIssued,
      cardsUtilized: cardsUtilized
    };
  }

  updateStatus(id: number, status: AppointmentStatus): EnrichedAppointment | undefined {
    const updated = this.update(id, { status });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  updateCheckIn(id: number, checkInTime: string, estimatedWaitMinutes: number): EnrichedAppointment | undefined {
    const updated = this.update(id, { 
      checkInTime, 
      estimatedWaitMinutes,
      status: 'Checked-in'
    });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  updateTiming(id: number, startTime: string, endTime: string): EnrichedAppointment | undefined {
    const updated = this.update(id, { startTime, endTime });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    return this.create(data);
  }

  /**
   * Helper method to generate a card and get the Card object
   */
  private generateAndGetCard(appointmentId: number, validityHours: number = 24): Card | null {
    const result = this.cardRepo.generateCard({
      appointmentId: appointmentId,
      validityHours: validityHours
    });
    
    if (result.success && result.card) {
      return result.card;
    }
    return null;
  }

  /**
   * BOOKING FLOW WITH CHAPA PAYMENT
   */
  async bookAppointment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    // Check if slot is available
    const existingAppointment = this.items.find(
      a => a.slotId === request.slotId && 
           a.scheduledDateTime === request.scheduledDateTime &&
           a.status !== 'Cancelled' && a.status !== 'Completed'
    );
    
    if (existingAppointment) {
      return {
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      };
    }

    // Get service to get providerId
    const service = this.serviceRepo.findById(request.serviceId);
    if (!service) {
      return {
        success: false,
        message: 'Service not found.'
      };
    }

    // Create appointment with status "Scheduled" (NOT confirmed yet)
    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: request.patientId,
      serviceId: request.serviceId,
      providerId: service.providerId,
      slotId: request.slotId,
      scheduledDateTime: request.scheduledDateTime,
      status: 'Scheduled',
      checkInTime: null,
      startTime: null,
      endTime: null,
      estimatedWaitMinutes: null,
      notes: request.notes || null,
      paymentId: null,
      cardId: null
    };
    
    const appointment = this.create(appointmentData);
    
    // Process payment via Chapa
    const chapaResult = await this.processChapaPayment(request, appointment);
    
    // ONLY confirm if payment status is SUCCESS
    if (chapaResult.paymentStatus === 'SUCCESS') {
      // Create payment record
      const payment = this.paymentRepo.create({
        patientId: request.patientId,
        appointmentId: appointment.id,
        provider: 'chapa',
        txRef: chapaResult.transactionId!,
        amount: chapaResult.amount!,
        currency: 'ETB',
        status: 'SUCCESS',
        checkoutUrl: null,
        chapaReference: null
      });
      
      // Update appointment with payment ID and status = Confirmed
      const updatedAppointment = this.update(appointment.id, { 
        status: 'Confirmed',
        paymentId: payment.id
      });
      
      // Generate card ONLY after SUCCESS payment
      const card = this.generateAndGetCard(appointment.id, 24);
      
      if (card) {
        // Link card to appointment
        this.update(appointment.id, { cardId: card.id });
      }
      
      return {
        success: true,
        appointment: updatedAppointment ? this.enrichAppointment(updatedAppointment) : this.enrichAppointment(appointment),
        card: card || undefined,
        paymentId: payment.id,
        paymentStatus: 'SUCCESS',
        message: card 
          ? `Payment SUCCESSFUL! Appointment confirmed. Card number: ${card.cardNumber}`
          : 'Payment SUCCESSFUL! Appointment confirmed. (Card generation pending)'
      };
    } else if (chapaResult.paymentStatus === 'FAILED') {
      // Create failed payment record
      this.paymentRepo.create({
        patientId: request.patientId,
        appointmentId: appointment.id,
        provider: 'chapa',
        txRef: chapaResult.transactionId || `FAILED-${Date.now()}`,
        amount: chapaResult.amount || 0,
        currency: 'ETB',
        status: 'FAILED',
        checkoutUrl: null,
        chapaReference: null
      });
      
      // Appointment remains Scheduled, no card generated
      return {
        success: false,
        appointment: this.enrichAppointment(appointment),
        paymentStatus: 'FAILED',
        message: 'Payment FAILED. Please try again or use different payment method.'
      };
    } else {
      // Payment pending - appointment remains Scheduled
      return {
        success: false,
        appointment: this.enrichAppointment(appointment),
        paymentStatus: 'PENDING',
        message: 'Payment PENDING. Please complete payment to confirm appointment.'
      };
    }
  }

  /**
   * Process payment through Chapa API
   */
  private async processChapaPayment(
    request: BookAppointmentRequest, 
    appointment: Appointment
  ): Promise<{ 
    paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
    transactionId?: string;
    amount?: number;
    message?: string;
  }> {
    const service = this.serviceRepo.findById(request.serviceId);
    const amount = service?.standardFee || 0;
    
    // Simulate Chapa API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check payment status from Chapa
    if (request.paymentConfirmed) {
      const txRef = `CHAPA-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      return {
        paymentStatus: 'SUCCESS',
        transactionId: txRef,
        amount: amount,
        message: `Chapa payment of ETB ${amount} successful.`
      };
    }
    
    // Simulate failed payment
    if (request.paymentConfirmed === false) {
      return {
        paymentStatus: 'FAILED',
        amount: amount,
        message: 'Chapa payment failed. Please try again.'
      };
    }
    
    return {
      paymentStatus: 'PENDING',
      amount: amount,
      message: 'Payment pending. Please complete payment.'
    };
  }

  /**
   * Create Chapa payment link/checkout URL
   */
  async createChapaCheckout(request: BookAppointmentRequest): Promise<{ checkoutUrl: string; txRef: string }> {
    const service = this.serviceRepo.findById(request.serviceId);
    const amount = service?.standardFee || 0;
    const patient = this.patientRepo.findById(request.patientId);
    
    const txRef = `CHAPA-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const checkoutUrl = `https://checkout.chapa.co/checkout?tx_ref=${txRef}&amount=${amount}&email=${patient?.email}&currency=ETB`;
    
    return { checkoutUrl, txRef };
  }

  /**
   * Verify Chapa payment
   */
  async verifyChapaPayment(txRef: string): Promise<{ verified: boolean; amount: number; status: 'success' | 'failed' | 'pending' }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { verified: true, amount: 500, status: 'success' };
  }

  /**
   * Book appointment with pending payment (pay later at clinic)
   */
  async bookAppointmentWithPendingPayment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    const existingAppointment = this.items.find(
      a => a.slotId === request.slotId && 
           a.scheduledDateTime === request.scheduledDateTime &&
           a.status !== 'Cancelled' && a.status !== 'Completed'
    );
    
    if (existingAppointment) {
      return {
        success: false,
        message: 'This time slot is already booked.'
      };
    }

    const service = this.serviceRepo.findById(request.serviceId);
    if (!service) {
      return {
        success: false,
        message: 'Service not found.'
      };
    }

    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: request.patientId,
      serviceId: request.serviceId,
      providerId: service.providerId,
      slotId: request.slotId,
      scheduledDateTime: request.scheduledDateTime,
      status: 'Scheduled',
      checkInTime: null,
      startTime: null,
      endTime: null,
      estimatedWaitMinutes: null,
      notes: request.notes || null,
      paymentId: null,
      cardId: null
    };
    
    const appointment = this.create(appointmentData);
    
    // Create PENDING payment record
    this.paymentRepo.create({
      patientId: request.patientId,
      appointmentId: appointment.id,
      provider: 'chapa',
      txRef: `PENDING-${Date.now()}`,
      amount: 0,
      currency: 'ETB',
      status: 'PENDING',
      checkoutUrl: null,
      chapaReference: null
    });
    
    return {
      success: true,
      appointment: this.enrichAppointment(appointment),
      paymentStatus: 'PENDING',
      message: 'Appointment booked. Payment is pending. Please complete payment at the clinic.'
    };
  }

  /**
   * Confirm appointment after successful Chapa payment
   */
  async confirmAfterChapaPayment(appointmentId: number, paymentId: number, txRef: string): Promise<BookAppointmentResponse> {
    const appointment = this.findById(appointmentId);
    if (!appointment) {
      return { success: false, message: 'Appointment not found.' };
    }
    
    const payment = this.paymentRepo.findById(paymentId);
    if (!payment || payment.status !== 'SUCCESS') {
      return { success: false, message: 'Payment not successful. Cannot confirm appointment.' };
    }
    
    const updatedAppointment = this.update(appointmentId, { 
      status: 'Confirmed',
      paymentId: paymentId
    });
    
    const card = this.generateAndGetCard(appointmentId, 24);
    
    if (card) {
      this.update(appointmentId, { cardId: card.id });
    }
    
    return {
      success: true,
      appointment: updatedAppointment ? this.enrichAppointment(updatedAppointment) : undefined,
      card: card || undefined,
      paymentId: paymentId,
      paymentStatus: 'SUCCESS',
      message: card 
        ? `Payment confirmed. Card number: ${card.cardNumber}`
        : 'Payment confirmed. (Card generation pending)'
    };
  }

  async getPaymentStatus(appointmentId: number): Promise<PaymentStatus> {
    const appointment = this.findById(appointmentId);
    if (!appointment || !appointment.paymentId) return 'PENDING';
    
    const payment = this.paymentRepo.findById(appointment.paymentId);
    return payment?.status || 'PENDING';
  }

  async updatePaymentStatus(appointmentId: number, status: PaymentStatus): Promise<boolean> {
    const appointment = this.findById(appointmentId);
    if (!appointment || !appointment.paymentId) return false;
    
    return this.paymentRepo.updateStatus(appointment.paymentId, status);
  }
}