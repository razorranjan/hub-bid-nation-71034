"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Heart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuctionCard } from "@/components/AuctionCard";
import { EnquiryModal } from "@/components/EnquiryModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import auctionsData from "@/data/auctions.json";

const Listings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    status: searchParams.get("status") || "",
    sellerType: "",
    sortBy: "latest",
  });

  const [enquiryModal, setEnquiryModal] = useState<{
    open: boolean;
    auctionTitle: string;
  }>({
    open: false,
    auctionTitle: "",
  });

  const handleEnquire = (title: string) => {
    setEnquiryModal({ open: true, auctionTitle: title });
  };

  const filteredAuctions = useMemo(() => {
    let filtered = [...auctionsData];

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

    switch (filters.sortBy) {
      case "ending-soon":
        filtered.sort(
          (a, b) =>
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
  }, [searchQuery, filters]);

  const activeFilterCount = [
    filters.category,
    filters.city,
    filters.status,
    filters.sellerType,
  ].filter(Boolean).length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search City/Locality/Project"
              className="pl-9 pr-4 h-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-3 border-t bg-background">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shrink-0 rounded-full h-8 px-3"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6 pb-20">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, category: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Property">Property</SelectItem>
                        <SelectItem value="Non-Motor">Non-Motor Assets</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Select
                      value={filters.city}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, city: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        <SelectItem value="Jaipur">Jaipur</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, status: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Seller Type</label>
                    <Select
                      value={filters.sellerType}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, sellerType: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Seller" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sellers</SelectItem>
                        <SelectItem value="Bank">Bank</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setFilters({
                          category: "",
                          city: "",
                          status: "",
                          sellerType: "",
                          sortBy: "latest",
                        });
                      }}
                    >
                      Clear All
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={filters.sellerType}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, sellerType: v }))
              }
            >
              <SelectTrigger className="w-24 h-8 rounded-full shrink-0 border-muted-foreground/30">
                <SelectValue placeholder="Seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.city}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, city: v }))}
            >
              <SelectTrigger className="w-24 h-8 rounded-full shrink-0 border-muted-foreground/30">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, category: v }))
              }
            >
              <SelectTrigger className="w-24 h-8 rounded-full shrink-0 border-muted-foreground/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Property">Property</SelectItem>
                <SelectItem value="Non-Motor">Non-Motor</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, sortBy: v }))
              }
            >
              <SelectTrigger className="w-24 h-8 rounded-full shrink-0 border-muted-foreground/30">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              {...auction}
              onEnquire={() => handleEnquire(auction.title)}
            />
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No auctions found matching your criteria.
            </p>
          </div>
        )}
      </main>

      <EnquiryModal
        open={enquiryModal.open}
        onClose={() => setEnquiryModal({ open: false, auctionTitle: "" })}
        auctionTitle={enquiryModal.auctionTitle}
      />
    </div>
  );
};

export default Listings;
