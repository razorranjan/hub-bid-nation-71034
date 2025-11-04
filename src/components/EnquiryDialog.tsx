"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import type { AuctionCardProps } from "./AuctionCard";

interface EnquiryDialogProps {
  property: AuctionCardProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnquiryDialog({ property, open, onOpenChange }: EnquiryDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    agreeToTerms: false,
  });
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enquiry Submitted:", formData);
    if (!formData.agreeToTerms) {
      console.log("not checked");
      toast.error("Please accept terms & conditions");
      return;
    }

    toast.success("Enquiry submitted successfully — we'll contact you soon with property details.");
    
    onOpenChange(false);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      city: "",
      agreeToTerms: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-1">
                Enquire About This Auction
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{property.title}</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, agreeToTerms: checked as boolean })
              }
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to receive updates and accept the terms & conditions
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Enquiry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
