"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, Edit2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import type { AuctionCardProps } from "./AuctionCard";

interface PlaceBidDialogProps {
  property: AuctionCardProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlaceBidDialog({ property, open, onOpenChange }: PlaceBidDialogProps) {
  const currentBid = 4500000;
  const [bidAmount, setBidAmount] = useState(currentBid + 10000);
  const [isEditing, setIsEditing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // Mock top bids
  const topBids = [
    { bidder: "You", amount: bidAmount, isUser: true },
    { bidder: "Bidder #2847", amount: 4500000, isUser: false },
    { bidder: "Bidder #1923", amount: 4490000, isUser: false },
  ];

  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handleIncrease = () => {
    setBidAmount((prev) => prev + 10000);
  };

  const handleDecrease = () => {
    setBidAmount((prev) => Math.max(currentBid + 10000, prev - 10000));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bidAmount <= currentBid) {
      toast.error("Invalid bid amount — your bid must be higher than the current bid.");
      return;
    }

    toast.success(`Bid placed successfully! 🎉 Your bid of ₹${bidAmount.toLocaleString("en-IN")} has been placed.`);
    
    onOpenChange(false);
  };

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Place Your Bid</DialogTitle>
          <p className="text-sm text-muted-foreground">{property.title}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bid Deadline */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Bid Deadline</span>
            </div>
            <div className="flex gap-2 mt-2 text-2xl font-bold text-destructive">
              <span>{formatTime(timeLeft.hours)}h</span>
              <span>:</span>
              <span>{formatTime(timeLeft.minutes)}m</span>
              <span>:</span>
              <span>{formatTime(timeLeft.seconds)}s</span>
            </div>
          </div>

          {/* Current Bid */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
            <p className="text-2xl font-bold text-primary">
              ₹{currentBid.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Bid Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="bid-amount">Your Bid Amount (₹)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrease}
                disabled={isEditing}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="relative flex-1">
                <Input
                  id="bid-amount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  disabled={!isEditing}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrease}
                disabled={isEditing}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Increment: ₹10,000 per step
            </p>
          </div>

          {/* Top Bids */}
          <div className="space-y-2">
            <Label>Top 3 Bids</Label>
            <div className="space-y-2">
              {topBids.map((bid, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    bid.isUser
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-muted"
                  }`}
                >
                  <span className="font-medium">
                    {index + 1}. {bid.bidder}
                  </span>
                  <span className="font-bold">
                    ₹{bid.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
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
            <Button type="submit" variant="action" className="flex-1">
              Submit Bid
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
