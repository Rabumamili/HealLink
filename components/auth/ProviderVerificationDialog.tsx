// components/auth/ProviderVerificationDialog.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, Search } from 'lucide-react';

interface ProviderVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationData: {
    email: string;
    professionalId: string;
    role: string;
  } | null;
  onVerificationComplete: () => void;
}

export const ProviderVerificationDialog = ({
  open,
  onOpenChange,
  registrationData,
  onVerificationComplete,
}: ProviderVerificationDialogProps) => {
  const auth = useAuth() as any;
  const { verifyProvider } = auth;
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifier, setVerifier] = useState<any>(null);

  const handleVerify = async () => {
    if (!registrationData) return;
    
    setIsVerifying(true);
    setError(null);
    
    verifyProvider(
      {
        professionalId: registrationData.professionalId,
        role: registrationData.role,
        verificationCode,
      },
      {
        onSuccess: (response: any) => {
          setVerifier(response.verifier);
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Verification failed');
          setIsVerifying(false);
        },
      }
    );
  };

  const handleComplete = () => {
    onVerificationComplete();
    onOpenChange(false);
  };

  if (verifier) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Verification Successful!
            </DialogTitle>
            <DialogDescription>
              Your professional status has been verified by:
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">{verifier.name}</p>
                <p className="text-sm text-green-700">
                  {verifier.role} • License: {verifier.licenseNumber}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Verified on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleComplete} className="bg-teal-600 hover:bg-teal-700">
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Professional Verification Required</DialogTitle>
          <DialogDescription>
            To complete your registration as a healthcare provider, please verify your professional credentials.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Your Professional ID:</strong> {registrationData?.professionalId}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verification_code">
              Verification Code from Existing Professional
            </Label>
            <Input
              id="verification_code"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              An existing licensed professional (doctor, clinic admin, or diagnostic admin) 
              needs to provide you with a verification code.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !verificationCode}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              {isVerifying ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};