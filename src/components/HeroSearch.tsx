import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSearchProps {
  onSearch: (category: string, city: string) => void;
}

export const HeroSearch = ({ onSearch }: HeroSearchProps) => {
  const [auctionType, setAuctionType] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    onSearch(auctionType, city);
  };

  return (
    <section className="relative h-[280px] md:h-[320px] flex items-end overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=900&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
          opacity: 0.6,
        }}
      />
      
      <div className="container relative z-10 px-4 pb-4 md:pb-6">
        <div className="max-w-md md:max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Select value={auctionType} onValueChange={setAuctionType}>
              <SelectTrigger className="w-full h-12 bg-background">
                <SelectValue placeholder="Select Auction Type" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Property">Property</SelectItem>
                <SelectItem value="Non-Motor">Non-Motor Assets</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
              </SelectContent>
            </Select>

            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full h-12 bg-background">
                <SelectValue placeholder="Select a city..." />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full h-12 md:h-14 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold text-base md:text-lg mt-3 md:mt-4"
          >
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};
