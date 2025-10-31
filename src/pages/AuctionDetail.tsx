import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building, Calendar, ChevronLeft, ChevronRight, Phone, Heart, Bell } from "lucide-react";
import auctionsData from "@/data/auctions.json";
import { useState } from "react";
import { EnquiryModal } from "@/components/EnquiryModal";
import { AuctionCard } from "@/components/AuctionCard";

const AuctionDetail = () => {
  const { id } = useParams();
  const auction = auctionsData.find((a) => a.id === Number(id));
  const [enquiryModal, setEnquiryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!auction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    auction.category === "Property" 
      ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop"
      : "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=600&fit=crop",
  ];

  const similarAuctions = auctionsData
    .filter(a => a.id !== auction.id && a.category === auction.category)
    .slice(0, 4);

  const handleEnquire = (title: string) => {
    setEnquiryModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-4 md:py-8 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">{auction.title}</h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 leading-relaxed">
          {auction.description}
        </p>

        {/* Image Carousel */}
        <div className="relative mb-4 md:mb-8 rounded-lg overflow-hidden bg-muted">
          <div className="aspect-video md:aspect-[21/9] relative">
            <img 
              src={images[currentImageIndex]} 
              alt={auction.title} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-1.5 md:p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
            </button>
            <button 
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-1.5 md:p-2 rounded-full transition-colors"
            >
              <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
            </button>
          </div>
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "w-6 md:w-8 bg-primary" : "w-1.5 md:w-2 bg-background/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* About This Auction */}
            <section>
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">About This Auction</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
                {auction.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="border-b pb-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Type of Possession</p>
                  <p className="text-sm md:text-base font-medium">Physical</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Property Address</p>
                  <p className="text-sm md:text-base font-medium">{auction.city}, {auction.state}</p>
                </div>
              </div>
            </section>

            {/* Asset Details */}
            <section>
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Asset Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">Property Type</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm md:text-base font-medium">{auction.category}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">Property Category</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm md:text-base font-medium">Residential</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-3 md:mt-4 border-t pt-3 md:pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Plot area</p>
                    <p className="text-sm md:text-base font-semibold">
                      {auction.specifications?.area || "1200 sq.ft"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Auctions - Mobile/Tablet */}
            <section className="lg:hidden">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Similar Auctions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {similarAuctions.map((similarAuction) => (
                  <AuctionCard
                    key={similarAuction.id}
                    {...similarAuction}
                    onEnquire={() => handleEnquire(similarAuction.title)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <Card className="sticky top-20">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base md:text-xl font-bold mb-1">Auction Details</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xl md:text-3xl font-bold text-primary">{auction.price}</p>
                      <Badge variant={auction.status === "Live" ? "default" : "secondary"} className="text-[10px] md:text-xs">
                        {auction.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium">{auction.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EMD:</span>
                    <span className="font-medium">₹{(auction.basePrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bid Increment:</span>
                    <span className="font-medium">₹10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auction Date:</span>
                    <span className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inspection Date:</span>
                    <span className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Deadline:</span>
                    <span className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" size="lg">
                  Download Auction Assets (Free)
                </Button>
                <p className="text-[10px] md:text-xs text-center text-muted-foreground">
                  3 free downloads remaining
                </p>

                <div className="pt-3 md:pt-4 border-t">
                  <p className="text-xs md:text-sm font-semibold mb-2 md:mb-3">NEED HELP?</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Talk to us on whatsapp
                  </Button>
                  <p className="text-[10px] md:text-xs text-center text-muted-foreground mt-2">
                    Get instant support and auction assistance
                  </p>
                </div>

                <div className="pt-3 md:pt-4 border-t">
                  <p className="text-xs md:text-sm font-semibold mb-2 md:mb-3">BANK DETAILS</p>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-muted rounded-lg">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Canara_Bank_logo.svg/1200px-Canara_Bank_logo.svg.png" 
                      alt="Bank logo" 
                      className="h-8 w-8 md:h-10 md:w-10 object-contain"
                    />
                    <p className="text-sm md:text-base font-semibold">
                      {auction.sellerType === "Bank" ? "Canara Bank" : "DCB Bank Ltd"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 md:pt-4 border-t space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Area:</span>
                    <span className="font-medium">1200 Sq.ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status of Possession:</span>
                    <span className="font-medium">Physical</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground mb-1">Contact Person:</p>
                    <p className="font-medium">Visarg Shah</p>
                    <p className="text-muted-foreground">(8866826588)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Auctions - Desktop */}
        <section className="hidden lg:block mt-8 md:mt-12">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Similar Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {similarAuctions.map((similarAuction) => (
              <AuctionCard
                key={similarAuction.id}
                {...similarAuction}
                onEnquire={() => handleEnquire(similarAuction.title)}
              />
            ))}
          </div>
        </section>
      </main>

      <EnquiryModal
        open={enquiryModal}
        onClose={() => setEnquiryModal(false)}
        auctionTitle={auction.title}
      />
    </div>
  );
};

export default AuctionDetail;
