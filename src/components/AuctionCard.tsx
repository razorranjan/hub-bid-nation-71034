"use client";

import { Clock, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UploadDocumentsDialog } from "./UploadDocumentsDialog";
import { EnquiryDialog } from "./EnquiryDialog";
import { PlaceBidDialog } from "./PlaceBidDialog";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type PropertyStage = "enquiry" | "verification" | "bidding";

export interface AuctionCardProps {
  id: number;
  title: string;
  city: string;
  category: string;
  price: string;
  basePrice?: number;
  image?: string;
  description?: string;
  auctionType: string;
  status: string;
  endDate: string;
  sellerType: string;
  stage: PropertyStage;
}

export const AuctionCard = ({
  id,
  title,
  city,
  category,
  price,
  auctionType,
  status,
  endDate,
  sellerType,
  stage,
}: AuctionCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const { isLoggedIn, watchlist, toggleWatchlist } = useUser();
  const isWatchlisted = watchlist.includes(id);

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showBid, setShowBid] = useState(false);

  const getStageConfig = () => {
    switch (stage) {
      case "verification":
        return {
          buttonText: "Upload Documents",
          buttonVariant: "secondary" as const,
          onClick: () => setShowUpload(true),
          badge: "Verification Pending",
          badgeVariant: "warning" as const,
        };
      case "bidding":
        return {
          buttonText: "Place Bid",
          buttonVariant: "action" as const,
          onClick: () => setShowBid(true),
          badge: "Bidding Open",
          badgeVariant: "success" as const,
        };
      default:
        return {
          buttonText: "Enquire Now",
          buttonVariant: "outline" as const,
          onClick: () => setShowEnquiry(true),
          badge: "Live",
          badgeVariant: "default" as const,
        };
    }
  };

  const config = getStageConfig();

  useEffect(() => {
    if (status !== "Live") return;

    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [endDate, status]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please submit an enquiry to add items to watchlist");
      return;
    }
    
    toggleWatchlist(id);
    toast.success(isWatchlisted ? "Removed from watchlist" : "Added to watchlist");
  };

  const imageUrl = category === "Property" 
    ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    : "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={cn(
            "absolute top-4 left-4",
            config.badgeVariant === "warning" && "bg-warning text-warning-foreground",
            config.badgeVariant === "success" && "bg-success text-success-foreground",
            config.badgeVariant === "default" && "bg-primary text-primary-foreground"
          )}
        >
          {config.badge}
        </Badge>
        <button
          onClick={handleWatchlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWatchlisted 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground'
          }`}
          aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <CardContent className="p-4 md:p-5 space-y-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-base md:text-lg line-clamp-2">{title}</h3>
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{city}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-t border-b flex-1">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Reserve Price</p>
            <p className="text-base md:text-lg font-bold text-[#FF5722]">{price}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Auction Date</p>
            <p className="text-sm md:text-base font-semibold">{formatDate(endDate)}</p>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-muted-foreground mb-1">Seller</p>
          <p className="text-sm md:text-base font-bold">{sellerType}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 md:p-5 pt-0 flex gap-2 md:gap-3">
        <Button
          size="default"
          variant={config.buttonVariant}
          className="flex-1 h-10 md:h-11 font-semibold text-sm md:text-base"
          onClick={config.onClick}
        >
          {config.buttonText}
        </Button>
        <EnquiryDialog
          property={{
            id,
            title,
            city,
            category,
            price,
            auctionType,
            status,
            endDate,
            sellerType,
            stage,
          }}
          open={showEnquiry}
          onOpenChange={setShowEnquiry}
        />
        <UploadDocumentsDialog
          property={{
            id,
            title,
            city,
            category,
            price,
            auctionType,
            status,
            endDate,
            sellerType,
            stage,
          }}
          open={showUpload}
          onOpenChange={setShowUpload}
        />
        <PlaceBidDialog
          property={{
            id,
            title,
            city,
            category,
            price,
            auctionType,
            status,
            endDate,
            sellerType,
            stage,
          }}
          open={showBid}
          onOpenChange={setShowBid}
        />
        <Link href={`/auction/${id}`} className="flex-1">
          <Button 
            className="w-full h-10 md:h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 font-semibold text-sm md:text-base"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
