"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GarageCar {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  horsepower: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  weight: string;
  description: string;
  mods: string[];
  photos: string[];   // blob URLs or picsum
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  rsvp: number;
  max: number;
  organizer: string;
  banner: string;
  tags: string[];
  description: string;
  rules: string;
  attire: string;
  vehicleTypes: string;
  private: boolean;
  sponsored: boolean;
  sponsor: string;
}

export interface Club {
  id: string;
  name: string;
  type: string;
  members: number;
  location: string;
  description: string;
  banner: string;
  public: boolean;
  fee: string;
  tags: string[];
  rules: string;
  meetSchedule: string;
  adminHandle: string;
}

export interface PhotoLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  cover: string;
  photos: PhotoSubmission[];
}

export interface PhotoSubmission {
  id: string;
  url: string;
  user: string;
  car: string;
  likes: number;
  ago: string;
}

export interface Rally {
  id: string;
  name: string;
  date: string;
  startLocation: string;
  endLocation: string;
  stops: string[];
  description: string;
  banner: string;
  members: string[];
  maxCars: number;
  fundraiser: boolean;
  goal: number;
  raised: number;
  status: "upcoming" | "active" | "completed";
}

export interface UserProfile {
  name: string;
  handle: string;
  location: string;
  points: number;
  bio: string;
  avatar: string;
  banner: string;
  eventsAttended: number;
  photosUploaded: number;
  following: number;
  followers: number;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  scripted?: boolean;
}

export interface Conversation {
  id: string;
  with: string;
  handle: string;
  car: string;
  avatar: string;
  messages: Message[];
  lastSeen: string;
}

export interface MarketListing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  seller: string;
  location: string;
  image: string;
  description: string;
  compatibleWith: string;
  posted: string;
}

interface AppState {
  events: AppEvent[];
  clubs: Club[];
  photoLocations: PhotoLocation[];
  garage: GarageCar[];
  rallies: Rally[];
  conversations: Conversation[];
  market: MarketListing[];
  profile: UserProfile;
  rsvpdEvents: string[];

  // Events
  addEvent: (e: AppEvent) => void;
  updateEvent: (id: string, data: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleRsvp: (id: string) => void;

  // Clubs
  updateClub: (id: string, data: Partial<Club>) => void;

  // Photo locations
  addPhotoLocation: (p: PhotoLocation) => void;
  updatePhotoLocation: (id: string, data: Partial<PhotoLocation>) => void;
  addPhotoToLocation: (locationId: string, photo: PhotoSubmission) => void;

  // Garage
  addCar: (car: GarageCar) => void;
  updateCar: (id: string, data: Partial<GarageCar>) => void;
  deleteCar: (id: string) => void;
  addCarPhoto: (carId: string, url: string) => void;

  // Profile
  updateProfile: (data: Partial<UserProfile>) => void;

  // Rally
  addRally: (r: Rally) => void;
  updateRally: (id: string, data: Partial<Rally>) => void;

  // Messages
  sendMessage: (convId: string, msg: Message) => void;

  // Market
  addListing: (l: MarketListing) => void;
  deleteListing: (id: string) => void;
}

const SEED_EVENTS: AppEvent[] = [
  { id: "e1", title: "Wynwood Car Meet", date: "2026-05-24", time: "7:00 PM", location: "Wynwood Walls, Miami", lat: 25.7617, lng: -80.1918, type: "meetup", rsvp: 87, max: 150, organizer: "MiamiCarScene", banner: "https://picsum.photos/seed/ev1/800/200", tags: ["all builds","photography","vibes"], description: "Monthly Wynwood meet. All cars welcome. Best backdrop in Miami for photos. Photographers will be on site.", rules: "No burnouts. Respect the location.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: false, sponsor: "" },
  { id: "e2", title: "JDM Only — Hialeah", date: "2026-05-31", time: "6:00 PM", location: "Hialeah Speedway Area", lat: 25.7989, lng: -80.2500, type: "competition", rsvp: 44, max: 75, organizer: "JDMiami", banner: "https://picsum.photos/seed/ev2/800/200", tags: ["JDM","competition","prizes"], description: "JDM builds only. Top 3 voted by attendees win prizes. Cash prize for best engine bay.", rules: "JDM vehicles only. No racing on public roads.", attire: "JDM gear welcome", vehicleTypes: "JDM only", private: false, sponsored: false, sponsor: "" },
  { id: "e3", title: "Sunday Morning Cruise — Old Cutler", date: "2026-06-01", time: "8:00 AM", location: "Bird Road Lot → Old Cutler Road", lat: 25.7356, lng: -80.2625, type: "cruise", rsvp: 31, max: 50, organizer: "Drive59Official", banner: "https://picsum.photos/seed/ev3/800/200", tags: ["cruise","scenic","morning"], description: "Meet at Bird Road lot then cruise Old Cutler together. Coffee stop at the end.", rules: "Obey all traffic laws. Keep convoy tight.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: false, sponsor: "" },
  { id: "e4", title: "Exotic & Luxury Showcase", date: "2026-06-07", time: "5:00 PM", location: "Brickell City Centre", lat: 25.7907, lng: -80.1300, type: "show", rsvp: 120, max: 200, organizer: "BrickellAutos", banner: "https://picsum.photos/seed/ev4/800/200", tags: ["exotic","luxury","show","sponsored"], description: "Annual Brickell exotic showcase. Ferraris, Lambos, Rolls Royce welcome.", rules: "Exotics and luxury only. $10 spectator entry.", attire: "Smart casual", vehicleTypes: "Exotic & Luxury", private: false, sponsored: true, sponsor: "Prestige Auto Group" },
  { id: "e5", title: "Charity Rally — Miami to Keys", date: "2026-06-14", time: "9:00 AM", location: "Bayfront Park → Key Largo", lat: 25.7650, lng: -80.1340, type: "rally", rsvp: 28, max: 40, organizer: "Keys4Kids", banner: "https://picsum.photos/seed/ev5/800/200", tags: ["rally","charity","fundraiser","scenic"], description: "Fundraiser rally to benefit Miami children's hospital. Scenic route through the Keys. $50 entry.", rules: "Speed limits enforced. No aggressive driving.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: true, sponsor: "Keys4Kids Foundation" },
];

const SEED_CLUBS: Club[] = [
  { id: "c1", name: "305 Exotics", type: "Exotic & Supercar", members: 48, location: "Miami, FL", description: "Miami's premier exotic car club. Monthly drives, private events, exclusive dealership tours.", banner: "https://picsum.photos/seed/cl1/800/200", public: true, fee: "$200/year", tags: ["exotic","supercar","luxury"], rules: "Minimum vehicle value $80k. Background check required.", meetSchedule: "First Saturday of every month", adminHandle: "@305exotics_admin" },
  { id: "c2", name: "JDMiami", type: "JDM", members: 134, location: "Miami / Hialeah", description: "All JDM builds. Weekly meets in Hialeah. Annual show every October.", banner: "https://picsum.photos/seed/cl2/800/200", public: true, fee: "Free", tags: ["JDM","honda","toyota","nissan","subaru"], rules: "JDM builds only. Respect all members.", meetSchedule: "Every Saturday at 7PM — Hialeah Speedway lot", adminHandle: "@jdmiamiofficial" },
  { id: "c3", name: "South Florida Muscle", type: "American Muscle", members: 67, location: "South Florida", description: "Mustangs, Camaros, Challengers. Drag days, cruise nights, and barbecues.", banner: "https://picsum.photos/seed/cl3/800/200", public: true, fee: "$50/year", tags: ["muscle","american","drag"], rules: "American muscle vehicles only. Family friendly events.", meetSchedule: "Every other Sunday", adminHandle: "@sfmuscleclub" },
  { id: "c4", name: "Miami Lowrider Society", type: "Lowrider & Custom", members: 29, location: "Little Havana, Miami", description: "Classic customs and lowriders. Culture, community, craftsmanship.", banner: "https://picsum.photos/seed/cl4/800/200", public: true, fee: "Free", tags: ["lowrider","custom","classic","culture"], rules: "Respect the culture. No drama.", meetSchedule: "Last Sunday of month — Little Havana", adminHandle: "@miamilowriders" },
];

const SEED_PHOTO_LOCATIONS: PhotoLocation[] = [
  { id: "p1", lat: 25.7617, lng: -80.1918, name: "Wynwood Walls", description: "Iconic murals, perfect backdrop for car photos", cover: "https://picsum.photos/seed/wynwood1/600/400", photos: [
    { id: "f1", url: "https://picsum.photos/seed/w1/600/600", user: "@carlosriv59", car: "1994 Supra", likes: 84, ago: "2h" },
    { id: "f2", url: "https://picsum.photos/seed/w2/600/600", user: "@miamiturbo", car: "2020 GT-R", likes: 61, ago: "5h" },
    { id: "f3", url: "https://picsum.photos/seed/w3/600/600", user: "@305builds", car: "Ferrari 488", likes: 210, ago: "1d" },
    { id: "f4", url: "https://picsum.photos/seed/w4/600/600", user: "@southbeachv8", car: "Camaro SS", likes: 47, ago: "1d" },
  ]},
  { id: "p2", lat: 25.7827, lng: -80.1300, name: "Design District", description: "Modern architecture meets chrome", cover: "https://picsum.photos/seed/design22/600/400", photos: [
    { id: "f7", url: "https://picsum.photos/seed/d1/600/600", user: "@designdistrict", car: "Lamborghini Urus", likes: 188, ago: "3h" },
    { id: "f8", url: "https://picsum.photos/seed/d2/600/600", user: "@miamiturbo", car: "Porsche GT3", likes: 143, ago: "8h" },
  ]},
  { id: "p3", lat: 25.7488, lng: -80.2384, name: "Miracle Mile Strip", description: "Classic strip for rolling shots", cover: "https://picsum.photos/seed/miracle3/600/400", photos: [
    { id: "f11", url: "https://picsum.photos/seed/m1/600/600", user: "@coralwheels", car: "Dodge Challenger", likes: 39, ago: "1d" },
    { id: "f12", url: "https://picsum.photos/seed/m2/600/600", user: "@jdmmiami", car: "Mitsubishi Evo IX", likes: 88, ago: "2d" },
  ]},
  { id: "p4", lat: 25.7907, lng: -80.1300, name: "Brickell City Centre", description: "Glass towers reflect everything", cover: "https://picsum.photos/seed/brickell4/600/400", photos: [
    { id: "f14", url: "https://picsum.photos/seed/b1/600/600", user: "@brickellgt", car: "Rolls Royce Ghost", likes: 402, ago: "4h" },
    { id: "f15", url: "https://picsum.photos/seed/b2/600/600", user: "@305builds", car: "Ferrari SF90", likes: 510, ago: "6h" },
    { id: "f16", url: "https://picsum.photos/seed/b3/600/600", user: "@designdistrict", car: "Bentley Continental", likes: 287, ago: "12h" },
  ]},
  { id: "p5", lat: 25.7743, lng: -80.1937, name: "Overtown Bridge", description: "Underpass with great lighting at night", cover: "https://picsum.photos/seed/overtown5/600/400", photos: [
    { id: "f20", url: "https://picsum.photos/seed/o1/600/600", user: "@overtownraw", car: "Honda Civic Type R", likes: 44, ago: "6h" },
    { id: "f21", url: "https://picsum.photos/seed/o2/600/600", user: "@305builds", car: "Subaru WRX STI", likes: 67, ago: "1d" },
  ]},
];

const SEED_GARAGE: GarageCar[] = [
  { id: "g1", year: 2019, make: "Ford", model: "Mustang Bullitt", color: "Highland Green", horsepower: "480", engine: "5.0L V8 Ti-VCT (Bullitt spec)", transmission: "6-Speed Manual (short-throw)", drivetrain: "RWD", weight: "3,705 lbs", description: "One of only 350 Highland Green examples built. Factory Bullitt package — open air intake, GT350 strut tower brace, unique Torsen diff. Daily driven but treated right. A true icon.", mods: ["Borla ATAK cat-back exhaust", "Steeda adjustable panhard bar", "Ford Performance suspension lowering springs", "Magneride delete & coilover conversion", "Michelin Pilot Sport 4S 255/40/19"], photos: ["https://picsum.photos/seed/bullitt1/800/500","https://picsum.photos/seed/bullitt2/800/500","https://picsum.photos/seed/bullitt3/800/500"] },
];

const SEED_RALLIES: Rally[] = [
  { id: "r1", name: "Keys Run — Miami to Key West", date: "2026-06-21", startLocation: "Bayfront Park, Miami", endLocation: "Southernmost Point, Key West", stops: ["Card Sound Road", "Islamorada Fuel Stop", "Marathon Rest Area"], description: "Annual Keys run. Stunning scenery, smooth roads, minimal traffic. Fundraiser for ocean conservation.", banner: "https://picsum.photos/seed/ral1/800/200", members: ["@carlosriv59","@miamiturbo","@305builds","@brickellgt","@jdmmiami"], maxCars: 30, fundraiser: true, goal: 5000, raised: 2840, status: "upcoming" },
  { id: "r2", name: "Everglades Loop", date: "2026-07-04", startLocation: "Homestead, Miami", endLocation: "Homestead, Miami", stops: ["Shark Valley Overlook","Everglades City Gas","Loop Road Turnaround"], description: "4th of July loop through the Everglades. Flat roads, wide open skies. BBQ at the finish.", banner: "https://picsum.photos/seed/ral2/800/200", members: ["@carlosriv59","@southbeachv8","@coralwheels"], maxCars: 20, fundraiser: false, goal: 0, raised: 0, status: "upcoming" },
];

const SEED_CONVERSATIONS: Conversation[] = [
  { id: "cv1", with: "Alex Torres", handle: "@miamiturbo", car: "2020 GT-R", avatar: "AT", lastSeen: "2m ago", messages: [
    { id: "m1", from: "@miamiturbo", text: "Saw your Supra at Wynwood last night 🔥", time: "8:45 PM" },
    { id: "m2", from: "me", text: "Thanks man! Your GT-R sounded insane", time: "8:47 PM" },
    { id: "m3", from: "@miamiturbo", text: "You coming to JDM Only next weekend?", time: "8:48 PM" },
    { id: "m4", from: "me", text: "Definitely. Already RSVPd", time: "8:49 PM" },
  ]},
  { id: "cv2", with: "Sofia Reyes", handle: "@305builds", car: "Ferrari 488", avatar: "SR", lastSeen: "1h ago", messages: [
    { id: "m5", from: "@305builds", text: "Love the mods on your Z. Who did the coilovers?", time: "Yesterday" },
    { id: "m6", from: "me", text: "KW V3s, did the install myself. Happy to help if you need a hand", time: "Yesterday" },
  ]},
  { id: "cv3", with: "Marco Diaz", handle: "@jdmmiami", car: "Honda S2000", avatar: "MD", lastSeen: "3h ago", messages: [
    { id: "m7", from: "@jdmmiami", text: "Let's meet up at Aventura lot Friday night?", time: "2 days ago" },
    { id: "m8", from: "me", text: "I'll be there around 8", time: "2 days ago" },
  ]},
];

const SEED_MARKET: MarketListing[] = [
  { id: "mk1", title: "HKS Hi-Power Exhaust — 350Z/370Z", price: 650, category: "Exhaust", condition: "Used - Excellent", seller: "@miamiturbo", location: "Hialeah, FL", image: "https://picsum.photos/seed/mk1/600/400", description: "Full cat-back, great sound, no drone. Fits 350Z and 370Z. 40k miles.", compatibleWith: "Nissan 350Z, 370Z", posted: "2 days ago" },
  { id: "mk2", title: "Volk TE37 18x9.5 +22 — Set of 4", price: 2800, category: "Wheels", condition: "Used - Good", seller: "@305builds", location: "Brickell, Miami", image: "https://picsum.photos/seed/mk2/600/400", description: "Bronze TE37s. Some curb rash on 2 wheels, priced accordingly. Rare bronze finish.", compatibleWith: "Universal 5x114.3", posted: "4 days ago" },
  { id: "mk3", title: "KW V3 Coilover Kit — BRZ/GR86", price: 1900, category: "Suspension", condition: "Used - Like New", seller: "@carlosriv59", location: "Wynwood, Miami", image: "https://picsum.photos/seed/mk3/600/400", description: "Only 8k miles. Full kit, both adjusters work perfectly. Selling because I sold the car.", compatibleWith: "Toyota GR86, Subaru BRZ (2022+)", posted: "1 week ago" },
  { id: "mk4", title: "Brembo GT 6-Piston Front Kit", price: 3200, category: "Brakes", condition: "New", seller: "@brickellgt", location: "Brickell, Miami", image: "https://picsum.photos/seed/mk4/600/400", description: "Never installed, still in box. Ordered for a build that fell through.", compatibleWith: "BMW M3/M4 (F80/F82)", posted: "3 days ago" },
  { id: "mk5", title: "Mishimoto Intercooler — WRX STI", price: 420, category: "Cooling", condition: "Used - Good", seller: "@jdmmiami", location: "Hialeah, FL", image: "https://picsum.photos/seed/mk5/600/400", description: "Direct fit FMIC. Minor paint scuffs on endtanks, zero issues. Great upgrade.", compatibleWith: "Subaru WRX STI 2008-2021", posted: "5 days ago" },
  { id: "mk6", title: "Recaro Pole Position Seat", price: 880, category: "Interior", condition: "Used - Excellent", seller: "@southbeachv8", location: "South Beach, Miami", image: "https://picsum.photos/seed/mk6/600/400", description: "Driver seat only. Black/red fabric. No tears. Includes side mount adapters.", compatibleWith: "Universal with adapters", posted: "1 week ago" },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      events: SEED_EVENTS,
      clubs: SEED_CLUBS,
      photoLocations: SEED_PHOTO_LOCATIONS,
      garage: SEED_GARAGE,
      rallies: SEED_RALLIES,
      conversations: SEED_CONVERSATIONS,
      market: SEED_MARKET,
      rsvpdEvents: [],
      profile: { name: "Carlos Rivera", handle: "@carlosriv59", location: "Miami, FL", points: 2840, bio: "Miami native. JDM obsessed. Building the Supra one mod at a time. Drive 59 co-founder.", avatar: "", banner: "https://picsum.photos/seed/profilebanner/800/300", eventsAttended: 12, photosUploaded: 34, following: 89, followers: 203 },

      addEvent: (e) => set(s => ({ events: [...s.events, e] })),
      updateEvent: (id, data) => set(s => ({ events: s.events.map(e => e.id === id ? { ...e, ...data } : e) })),
      deleteEvent: (id) => set(s => ({ events: s.events.filter(e => e.id !== id) })),
      toggleRsvp: (id) => set(s => ({
        rsvpdEvents: s.rsvpdEvents.includes(id) ? s.rsvpdEvents.filter(i => i !== id) : [...s.rsvpdEvents, id],
        events: s.events.map(e => e.id === id ? { ...e, rsvp: s.rsvpdEvents.includes(id) ? e.rsvp - 1 : e.rsvp + 1 } : e),
      })),

      updateClub: (id, data) => set(s => ({ clubs: s.clubs.map(c => c.id === id ? { ...c, ...data } : c) })),

      addPhotoLocation: (p) => set(s => ({ photoLocations: [...s.photoLocations, p] })),
      updatePhotoLocation: (id, data) => set(s => ({ photoLocations: s.photoLocations.map(p => p.id === id ? { ...p, ...data } : p) })),
      addPhotoToLocation: (locationId, photo) => set(s => ({
        photoLocations: s.photoLocations.map(p => p.id === locationId ? { ...p, photos: [photo, ...p.photos] } : p),
      })),

      addCar: (car) => set(s => ({ garage: [...s.garage, car] })),
      updateCar: (id, data) => set(s => ({ garage: s.garage.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteCar: (id) => set(s => ({ garage: s.garage.filter(c => c.id !== id) })),
      addCarPhoto: (carId, url) => set(s => ({
        garage: s.garage.map(c => c.id === carId ? { ...c, photos: [...c.photos, url] } : c),
      })),

      updateProfile: (data) => set(s => ({ profile: { ...s.profile, ...data } })),

      addRally: (r) => set(s => ({ rallies: [...s.rallies, r] })),
      updateRally: (id, data) => set(s => ({ rallies: s.rallies.map(r => r.id === id ? { ...r, ...data } : r) })),

      sendMessage: (convId, msg) => set(s => ({
        conversations: s.conversations.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg] } : c),
      })),

      addListing: (l) => set(s => ({ market: [...s.market, l] })),
      deleteListing: (id) => set(s => ({ market: s.market.filter(l => l.id !== id) })),
    }),
    { name: "drive59-store" }
  )
);
