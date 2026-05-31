'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatsCard } from '@/components/common/StatsCard';
import { GradientHeader } from '@/components/common/GradientHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Search, CheckCircle, AlertCircle, Loader2, Users, CreditCard, Building2, Stethoscope, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CardWithAppointment {
  id: number;
  cardNumber: string;
  status: string;
  appointmentId: number;
  expiresAt: string;
  usedAt: string | null;
  appointment?: {
    patientName: string;
    patientId: number;
    serviceName: string;
    serviceType: string;
    scheduledDateTime: string;
    providerName: string;
    providerType: 'doctor' | 'clinic' | 'diagnostic_center';
  };
}

export default function StaffCheckinPage() {
  const { user, isLoading: authLoading, hasStaffRole } = useAuth({
    requireAuth: true,
    allowedRoles: ['staff']
  });

  const [cardNumber, setCardNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [foundCard, setFoundCard] = useState<CardWithAppointment | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'doctor' | 'clinic' | 'diagnostic'>('all');
  const [cards, setCards] = useState<CardWithAppointment[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const staffId = user?.id;
  const employerInfo = {
    type: user?.employer_type || 'clinic',
    id: user?.employer_id
  };

  // Fetch active cards for this employer
  const fetchCards = useCallback(async () => {
    if (!employerInfo.id) return;
    
    setCardsLoading(true);
    try {
      const response = await fetch(`/api/cards/active?employerId=${employerInfo.id}&employerType=${employerInfo.type}`);
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      toast.error('Failed to load active cards');
    } finally {
      setCardsLoading(false);
    }
  }, [employerInfo.id, employerInfo.type]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Filter cards by provider type
  const allActiveCards = cards.filter(card => card.status === 'Active');
  
  const filteredActiveCards = useCallback(() => {
    if (activeTab === 'all') return allActiveCards;
    return allActiveCards.filter(card => card.appointment?.providerType === activeTab);
  }, [allActiveCards, activeTab]);

  const doctorCards = allActiveCards.filter(card => card.appointment?.providerType === 'doctor');
  const clinicCards = allActiveCards.filter(card => card.appointment?.providerType === 'clinic');
  const diagnosticCards = allActiveCards.filter(card => card.appointment?.providerType === 'diagnostic_center');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCards();
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleVerify = async () => {
    if (!cardNumber.trim()) {
      toast.error('Please enter a card number');
      return;
    }

    setIsVerifying(true);
    setFoundCard(null);
    
    try {
      const response = await fetch('/api/cards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, employerId: employerInfo.id })
      });
      
      const result = await response.json();
      
      if (result.isValid && result.card) {
        const fullCard = cards.find(c => c.cardNumber === cardNumber);
        setFoundCard(fullCard || null);
        toast.success('Patient found');
      } else {
        setFoundCard(null);
        toast.error(result.message || 'Invalid card number');
      }
    } catch (error) {
      toast.error('Failed to verify card');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckIn = async () => {
    if (!foundCard || !staffId) return;

    try {
      const response = await fetch('/api/cards/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: foundCard.cardNumber,
          verifiedByStaffId: staffId,
          verifiedByType: employerInfo.type,
          appointmentId: foundCard.appointmentId
        })
      });
      
      const result = await response.json();

      if (result.success) {
        setCheckInSuccess(true);
        toast.success(`${result.patientName || foundCard.appointment?.patientName} checked in successfully`);
        
        await fetchCards();
        
        setTimeout(() => {
          setCardNumber('');
          setFoundCard(null);
          setCheckInSuccess(false);
        }, 2000);
      } else {
        toast.error(result.message || 'Check-in failed');
      }
    } catch (error) {
      toast.error('Check-in failed');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'PT';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProviderIcon = (providerType: string) => {
    switch (providerType) {
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'clinic': return <Building2 className="h-4 w-4" />;
      case 'diagnostic_center': return <FlaskConical className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#008282]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GradientHeader
          title="Patient Check-in"
          description="Enter card numbers to verify and check in patients for appointments."
          icon={<CreditCard className="h-5 w-5" />}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total Active Cards"
            value={allActiveCards.length}
            icon={<Users className="h-5 w-5" />}
            variant="default"
          />
          <StatsCard
            title="Doctor Appointments"
            value={doctorCards.length}
            icon={<Stethoscope className="h-5 w-5" />}
            variant="primary"
          />
          <StatsCard
            title="Clinic Services"
            value={clinicCards.length}
            icon={<Building2 className="h-5 w-5" />}
            variant="info"
          />
          <StatsCard
            title="Diagnostic Tests"
            value={diagnosticCards.length}
            icon={<FlaskConical className="h-5 w-5" />}
            variant="success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Check-in Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Search className="h-5 w-5 text-[#008282]" />
                Quick Patient Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter card number (e.g., CARD-12345)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="font-mono border-slate-200 focus:border-[#008282] focus:ring-[#008282]"
                      disabled={isVerifying || checkInSuccess}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerify();
                      }}
                    />
                    <p className="text-xs text-slate-400 mt-1">Enter the card number shown to the patient</p>
                  </div>
                  <Button 
                    className="bg-[#008282] hover:bg-[#00a0a0] whitespace-nowrap rounded-xl" 
                    onClick={handleVerify}
                    disabled={isVerifying || !cardNumber.trim() || checkInSuccess}
                  >
                    {isVerifying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>

                {foundCard && !checkInSuccess && (
                  <div className="p-4 rounded-xl border bg-[#008282]/5 border-[#008282]/10">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 rounded-xl">
                            <AvatarFallback className="bg-[#008282]/10 text-[#008282] text-base">
                              {getInitials(foundCard.appointment?.patientName || 'Patient')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800">{foundCard.appointment?.patientName || 'Unknown Patient'}</p>
                            <p className="text-sm text-slate-500">
                              ID: {foundCard.appointment?.patientId || `APT-${foundCard.appointmentId}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Verified</Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            {getProviderIcon(foundCard.appointment?.providerType || 'clinic')}
                            {foundCard.appointment?.providerType?.replace('_', ' ') || 'Provider'}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid gap-2 text-sm border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Service</span>
                          <span className="font-medium text-slate-700">{foundCard.appointment?.serviceName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Provider</span>
                          <span className="font-medium text-slate-700">{foundCard.appointment?.providerName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Appointment Time</span>
                          <span className="font-medium text-slate-700">
                            {foundCard.appointment?.scheduledDateTime 
                              ? new Date(foundCard.appointment.scheduledDateTime).toLocaleString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-[#008282] hover:bg-[#00a0a0] rounded-xl" 
                        onClick={handleCheckIn}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Check-in
                      </Button>
                    </div>
                  </div>
                )}

                {checkInSuccess && (
                  <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Check-in Successful!</span>
                    </div>
                    <p className="text-emerald-600 mt-1">
                      Patient has been checked in successfully.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments by Type */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5 text-[#008282]" />
                Pending Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <div className="px-4 pt-4 border-b border-slate-100">
                  <TabsList className="bg-slate-100 rounded-xl">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                      All ({allActiveCards.length})
                    </TabsTrigger>
                    <TabsTrigger value="doctor" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                      Doctors ({doctorCards.length})
                    </TabsTrigger>
                    <TabsTrigger value="clinic" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                      Clinics ({clinicCards.length})
                    </TabsTrigger>
                    <TabsTrigger value="diagnostic" className="data-[state=active]:bg-white data-[state=active]:text-[#008282] rounded-lg">
                      Diagnostic ({diagnosticCards.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="m-0">
                  {cardsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-[#008282]" />
                    </div>
                  ) : filteredActiveCards().length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                      {filteredActiveCards().map((card) => (
                        <div key={card.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800">
                                {card.appointment?.patientName || `Appointment #${card.appointmentId}`}
                              </p>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                {getProviderIcon(card.appointment?.providerType || 'clinic')}
                                {card.appointment?.providerType?.replace('_', ' ') || 'Provider'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {card.appointment?.serviceName || 'Service'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {card.appointment?.providerName}
                            </p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Ready</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-3 rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10"
                            onClick={() => {
                              setCardNumber(card.cardNumber);
                              setTimeout(() => handleVerify(), 100);
                            }}
                          >
                            Check In
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No pending check-ins</p>
                      <p className="text-xs text-slate-400 mt-1">Active cards will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}