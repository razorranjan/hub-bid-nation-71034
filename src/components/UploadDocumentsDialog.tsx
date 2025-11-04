"use client";

import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import type { AuctionCardProps } from "./AuctionCard";

interface UploadDocumentsDialogProps {
  property: AuctionCardProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2 | 3;

export function UploadDocumentsDialog({ property, open, onOpenChange }: UploadDocumentsDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [panVerified, setPanVerified] = useState(false);
  const [emdVerified, setEmdVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  

  const handlePanVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setPanVerified(true);
    toast.success("PAN Verified Successfully ✅");
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleEmdVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setEmdVerified(true);
    toast.success("EMD Verified Successfully ✅");
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleAadhaarVerify = () => {
    setAadhaarVerified(true);
    toast.success("Documents verified successfully — you can now place bids on this property.");
    setTimeout(() => {
      onOpenChange(false);
      // Reset state
      setCurrentStep(1);
      setPanVerified(false);
      setEmdVerified(false);
      setAadhaarVerified(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Documents</DialogTitle>
          <p className="text-sm text-muted-foreground">{property.title}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 3 ? "flex-1" : ""}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {(step === 1 && panVerified) ||
                  (step === 2 && emdVerified) ||
                  (step === 3 && aadhaarVerified) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: PAN Details */}
          {currentStep === 1 && (
            <form onSubmit={handlePanVerify} className="space-y-4">
              <h3 className="font-semibold text-lg">Step 1: PAN Details</h3>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input id="pan" placeholder="ABCDE1234F" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan-doc">Upload PAN Document *</Label>
                <div className="flex items-center gap-2">
                  <Input id="pan-doc" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <Button type="submit" className="w-full">
                Verify PAN
              </Button>
            </form>
          )}

          {/* Step 2: EMD Details */}
          {currentStep === 2 && (
            <form onSubmit={handleEmdVerify} className="space-y-4">
              <h3 className="font-semibold text-lg">Step 2: EMD Details</h3>
              <div className="space-y-2">
                <Label htmlFor="emd-amount">EMD Amount (₹) *</Label>
                <Input
                  id="emd-amount"
                  type="number"
                  placeholder="Enter EMD amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emd-doc">Upload EMD Receipt / DD Copy *</Label>
                <div className="flex items-center gap-2">
                  <Input id="emd-doc" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <Button type="submit" className="w-full">
                Verify EMD
              </Button>
            </form>
          )}

          {/* Step 3: Aadhaar Validation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 3: Aadhaar Validation</h3>
              <div className="bg-muted p-6 rounded-lg text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verify your identity using DigiLocker for secure Aadhaar verification
                </p>
                <Button
                  onClick={handleAadhaarVerify}
                  className="w-full"
                  variant="action"
                >
                  Verify via DigiLocker
                </Button>
                <p className="text-xs text-muted-foreground">
                  This is a simulated verification process
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
