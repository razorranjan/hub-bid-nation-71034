"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CategoryIcons } from "@/components/CategoryIcons";
import { HeroSearch } from "@/components/HeroSearch";
import { AuctionCard } from "@/components/AuctionCard";
import { EnquiryModal } from "@/components/EnquiryModal";
import { SellPropertySection } from "@/components/SellPropertySection";
import { SEOContent } from "@/components/SEOContent";
import auctionsData from "@/data/auctions.json";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    status: "",
    sellerType: "",
    sortBy: "latest",
    priceRange: [0, 20000000],
  });
  
  const [enquiryModal, setEnquiryModal] = useState<{
    open: boolean;
    auctionTitle: string;
  }>({
    open: false,
    auctionTitle: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (category: string, city: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category || "",
      city: city || "",
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleEnquire = (title: string) => {
    setEnquiryModal({ open: true, auctionTitle: title });
  };

  const filteredAuctions = useMemo(() => {
    let filtered = [...auctionsData];

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((a) => a.category === filters.category);
    }
    if (filters.city && filters.city !== "all") {
      filtered = filtered.filter((a) => a.city === filters.city);
    }
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters.sellerType && filters.sellerType !== "all") {
      filtered = filtered.filter((a) => a.sellerType === filters.sellerType);
    }
    
    filtered = filtered.filter(
      (a) => a.basePrice >= filters.priceRange[0] && a.basePrice <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case "ending-soon":
        filtered.sort((a, b) => 
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [filters]);

  const liveAuctions = filteredAuctions.filter(a => a.status === "Live");
  const upcomingAuctions = filteredAuctions.filter(a => a.status === "Upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Header scrolled={scrolled} />
      {!scrolled && <CategoryIcons onCategorySelect={handleCategorySelect} />}
      {!scrolled && <HeroSearch onSearch={handleSearch} />}

      <main className="container px-4 py-6 md:py-8">
        {liveAuctions.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Live Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {liveAuctions.slice(0, 6).map((auction) => (
                <AuctionCard
                  key={auction.id}
                  {...auction}
                  onEnquire={() => handleEnquire(auction.title)}
                />
              ))}
              {liveAuctions.length > 6 && (
                <Link href="/listings?status=Live" className="md:col-span-2 lg:col-span-3">
                  <button className="w-full py-3 md:py-4 text-primary font-medium flex items-center justify-center gap-2 hover:bg-secondary/50 rounded-lg transition-colors">
                    View more
                    <span className="text-xl">→</span>
                  </button>
                </Link>
              )}
            </div>
          </section>
        )}

        {upcomingAuctions.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Upcoming Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {upcomingAuctions.slice(0, 6).map((auction) => (
                <AuctionCard
                  key={auction.id}
                  {...auction}
                  onEnquire={() => handleEnquire(auction.title)}
                />
              ))}
              {upcomingAuctions.length > 6 && (
                <Link href="/listings?status=Upcoming" className="md:col-span-2 lg:col-span-3">
                  <button className="w-full py-3 md:py-4 text-primary font-medium flex items-center justify-center gap-2 hover:bg-secondary/50 rounded-lg transition-colors">
                    View more
                    <span className="text-xl">→</span>
                  </button>
                </Link>
              )}
            </div>
          </section>
        )}

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No auctions found matching your criteria.
            </p>
          </div>
        )}
      </main>

      <SellPropertySection />

      <SEOContent />

      <EnquiryModal
        open={enquiryModal.open}
        onClose={() => setEnquiryModal({ open: false, auctionTitle: "" })}
        auctionTitle={enquiryModal.auctionTitle}
      />
    </div>
  );
};

export default Index;
