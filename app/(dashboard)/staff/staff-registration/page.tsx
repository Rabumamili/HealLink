// app/(auth)/staff-registration/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function StaffRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { completeStaffRegistration, isLoading } = useAuth({ requireAuth: false });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      toast.error("Invalid registration link. Please contact your employer.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Invalid registration token");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await completeStaffRegistration(token, formData.password, formData.confirmPassword);
      toast.success("Registration successful! Please login.");
      router.push("/staff-login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e5eeff] to-white p-4">
        <Card className="w-full max-w-md shadow-xl border-red-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Link</CardTitle>
            <CardDescription>
              This registration link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/staff-login")}
              className="w-full bg-[#006767] hover:bg-[#005555] text-white rounded-xl"
            >
              Go to Staff Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e5eeff] to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-[#E2E8F0]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#006767] rounded-2xl flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#0b1c30]">Complete Registration</CardTitle>
          <CardDescription>
            Set up your password to activate your staff account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="bg-[#e5eeff] p-4 rounded-xl mb-4">
              <div className="flex items-center gap-2 text-sm text-[#006767]">
                <CheckCircle className="h-4 w-4" />
                <span>Your account has been verified. Please set your password.</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#3d4949]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#F1F5F9] border-none rounded-xl pr-10 focus:ring-2 focus:ring-[#006767]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949] hover:text-[#006767]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-[#3d4949]">Password must be at least 8 characters long</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#3d4949]">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-[#F1F5F9] border-none rounded-xl pr-10 focus:ring-2 focus:ring-[#006767]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4949] hover:text-[#006767]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006767] hover:bg-[#005555] text-white rounded-xl py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating Account...
                </>
              ) : (
                "Activate Account"
              )}
            </Button>
            <div className="text-center text-sm text-[#3d4949]">
              Already have an account?{" "}
              <Link href="/staff-login" className="text-[#006767] hover:underline font-medium">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}