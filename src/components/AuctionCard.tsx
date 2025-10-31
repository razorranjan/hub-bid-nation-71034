import { Clock, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuctionCardProps {
  id: number;
  title: string;
  city: string;
  category: string;
  price: string;
  auctionType: string;
  status: string;
  endDate: string;
  sellerType: string;
  onEnquire: () => void;
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
  onEnquire,
}: AuctionCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");

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
        <div className="absolute top-3 left-3">
          <Badge 
            className={`${
              status === "Live" 
                ? "bg-[#FF5722] hover:bg-[#FF5722]" 
                : "bg-secondary"
            } text-white text-sm px-3 py-1 font-semibold`}
          >
            {status}
          </Badge>
        </div>
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
          variant="outline" 
          size="default"
          className="flex-1 h-10 md:h-11 font-semibold text-sm md:text-base"
          onClick={onEnquire}
        >
          Enquire Now
        </Button>
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
