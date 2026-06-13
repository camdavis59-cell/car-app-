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
  photos: string[];
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

export interface Business {
  id: string;
  name: string;
  type: "tire" | "tuning" | "supercar_dealer" | "oil_change" | "gas";
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  rating: number;
  reviews: number;
  description: string;
  cover: string;
  photos: string[];
  tags: string[];
  deal?: string;
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
  businesses: Business[];
  garage: GarageCar[];
  rallies: Rally[];
  conversations: Conversation[];
  market: MarketListing[];
  profile: UserProfile;
  rsvpdEvents: string[];

  addEvent: (e: AppEvent) => void;
  updateEvent: (id: string, data: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleRsvp: (id: string) => void;

  updateClub: (id: string, data: Partial<Club>) => void;

  addPhotoLocation: (p: PhotoLocation) => void;
  updatePhotoLocation: (id: string, data: Partial<PhotoLocation>) => void;
  addPhotoToLocation: (locationId: string, photo: PhotoSubmission) => void;

  addCar: (car: GarageCar) => void;
  updateCar: (id: string, data: Partial<GarageCar>) => void;
  deleteCar: (id: string) => void;
  addCarPhoto: (carId: string, url: string) => void;

  updateProfile: (data: Partial<UserProfile>) => void;

  addRally: (r: Rally) => void;
  updateRally: (id: string, data: Partial<Rally>) => void;

  sendMessage: (convId: string, msg: Message) => void;

  addListing: (l: MarketListing) => void;
  deleteListing: (id: string) => void;
}

const SEED_EVENTS: AppEvent[] = [
  { id: "e1", title: "Wynwood Car Meet", date: "2026-07-12", time: "7:00 PM", location: "Wynwood Walls, Miami", lat: 25.7617, lng: -80.1918, type: "meetup", rsvp: 87, max: 150, organizer: "MiamiCarScene", banner: "https://picsum.photos/seed/ev1banner/800/300", tags: ["all builds","photography","vibes"], description: "Monthly Wynwood meet. All cars welcome. Best backdrop in Miami for photos. Photographers will be on site. Trophies for best in show voted by attendees.", rules: "No burnouts. Respect the location. No racing on public roads.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: false, sponsor: "" },
  { id: "e2", title: "JDM Only — Hialeah", date: "2026-07-19", time: "6:00 PM", location: "Hialeah Speedway Area, Hialeah", lat: 25.7989, lng: -80.2500, type: "competition", rsvp: 44, max: 75, organizer: "JDMiami", banner: "https://picsum.photos/seed/ev2banner/800/300", tags: ["JDM","competition","prizes"], description: "JDM builds only. Top 3 voted by attendees win cash prizes. Best engine bay wins $200. All JDM marques welcome — Honda, Toyota, Nissan, Subaru, Mitsubishi.", rules: "JDM vehicles only. No racing on public roads. Keep it respectful.", attire: "JDM gear welcome", vehicleTypes: "JDM only", private: false, sponsored: false, sponsor: "" },
  { id: "e3", title: "Sunday Morning Cruise — Old Cutler", date: "2026-07-06", time: "8:00 AM", location: "Bird Road Lot → Old Cutler Road", lat: 25.7356, lng: -80.2625, type: "cruise", rsvp: 31, max: 50, organizer: "Drive59Official", banner: "https://picsum.photos/seed/ev3banner/800/300", tags: ["cruise","scenic","morning"], description: "Meet at Bird Road lot then cruise Old Cutler Road together. One of the most scenic drives in Miami. Coffee stop at the end. Keep it clean on the road.", rules: "Obey all traffic laws. Keep convoy tight. No aggressive driving.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: false, sponsor: "" },
  { id: "e4", title: "Exotic & Luxury Showcase", date: "2026-07-26", time: "5:00 PM", location: "Brickell City Centre, Miami", lat: 25.7607, lng: -80.1913, type: "show", rsvp: 120, max: 200, organizer: "BrickellAutos", banner: "https://picsum.photos/seed/ev4banner/800/300", tags: ["exotic","luxury","show","sponsored"], description: "Annual Brickell exotic showcase. Ferraris, Lambos, Rolls Royce, McLarens welcome. Sponsor booths, photography zone, live DJ. $10 spectator entry fee. Prestige Auto Group presenting sponsor.", rules: "Exotics and luxury only. Smart casual attire. No burnouts.", attire: "Smart casual", vehicleTypes: "Exotic & Luxury", private: false, sponsored: true, sponsor: "Prestige Auto Group" },
  { id: "e5", title: "Charity Rally — Miami to Keys", date: "2026-08-02", time: "9:00 AM", location: "Bayfront Park → Key Largo", lat: 25.7650, lng: -80.1340, type: "rally", rsvp: 28, max: 40, organizer: "Keys4Kids", banner: "https://picsum.photos/seed/ev5banner/800/300", tags: ["rally","charity","fundraiser","scenic"], description: "Fundraiser rally benefiting Miami children's hospital. Stunning scenic route through the Florida Keys. $50 entry fee goes directly to the cause. Swag bag for all participants.", rules: "Speed limits strictly enforced. No aggressive driving. Convoy stays together.", attire: "Casual", vehicleTypes: "All welcome", private: false, sponsored: true, sponsor: "Keys4Kids Foundation" },
];

const SEED_CLUBS: Club[] = [
  { id: "c1", name: "305 Exotics", type: "Exotic & Supercar", members: 48, location: "Miami, FL", description: "Miami's premier exotic car club. Monthly drives, private events, exclusive dealership tours.", banner: "https://picsum.photos/seed/cl1banner/800/200", public: true, fee: "$200/year", tags: ["exotic","supercar","luxury"], rules: "Minimum vehicle value $80k. Background check required.", meetSchedule: "First Saturday of every month", adminHandle: "@305exotics_admin" },
  { id: "c2", name: "JDMiami", type: "JDM", members: 134, location: "Miami / Hialeah", description: "All JDM builds. Weekly meets in Hialeah. Annual show every October.", banner: "https://picsum.photos/seed/cl2banner/800/200", public: true, fee: "Free", tags: ["JDM","honda","toyota","nissan","subaru"], rules: "JDM builds only. Respect all members.", meetSchedule: "Every Saturday at 7PM — Hialeah Speedway lot", adminHandle: "@jdmiamiofficial" },
  { id: "c3", name: "South Florida Muscle", type: "American Muscle", members: 67, location: "South Florida", description: "Mustangs, Camaros, Challengers. Drag days, cruise nights, and barbecues.", banner: "https://picsum.photos/seed/cl3banner/800/200", public: true, fee: "$50/year", tags: ["muscle","american","drag"], rules: "American muscle vehicles only. Family friendly events.", meetSchedule: "Every other Sunday", adminHandle: "@sfmuscleclub" },
  { id: "c4", name: "Miami Lowrider Society", type: "Lowrider & Custom", members: 29, location: "Little Havana, Miami", description: "Classic customs and lowriders. Culture, community, craftsmanship.", banner: "https://picsum.photos/seed/cl4banner/800/200", public: true, fee: "Free", tags: ["lowrider","custom","classic","culture"], rules: "Respect the culture. No drama.", meetSchedule: "Last Sunday of month — Little Havana", adminHandle: "@miamilowriders" },
  { id: "c5", name: "Bullitt Mustang Owners Club", type: "Mustang / Pony Car", members: 47, location: "South Florida", description: "Dedicated to the Ford Mustang Bullitt edition — the most iconic Mustang ever built. Highland Green or Black, all Bullitt owners welcome. Monthly drives and exclusive events.", banner: "https://picsum.photos/seed/bullittclub1/800/200", public: true, fee: "Free", tags: ["mustang","bullitt","v8","ford","pony car"], rules: "Must own a Mustang Bullitt edition to join.", meetSchedule: "Third Saturday of every month — Wynwood", adminHandle: "@camdavis59" },
  { id: "c6", name: "South Miami Car Club", type: "All Makes & Models", members: 89, location: "South Miami, FL", description: "The premier car club for South Miami enthusiasts. All makes, all models. Monthly cruises, community events, and good vibes only.", banner: "https://picsum.photos/seed/southmiamicc/800/200", public: true, fee: "$25/year", tags: ["south miami","cruise","community","all builds"], rules: "Respect members and their vehicles. Family-friendly events.", meetSchedule: "Every other Friday night — South Miami", adminHandle: "@camdavis59" },
];

const SEED_PHOTO_LOCATIONS: PhotoLocation[] = [
  { id: "p1", lat: 25.7617, lng: -80.1918, name: "Wynwood Walls", description: "Iconic murals, perfect backdrop for car photos", cover: "https://picsum.photos/seed/wynwood1/600/400", photos: [
    { id: "f1", url: "https://picsum.photos/seed/w1car/600/600", user: "@camdavis59", car: "2019 Mustang Bullitt", likes: 124, ago: "1h" },
    { id: "f2", url: "https://picsum.photos/seed/w2car/600/600", user: "@miamiturbo", car: "2020 GT-R", likes: 61, ago: "5h" },
    { id: "f3", url: "https://picsum.photos/seed/w3car/600/600", user: "@305builds", car: "Ferrari 488", likes: 210, ago: "1d" },
    { id: "f4", url: "https://picsum.photos/seed/w4car/600/600", user: "@southbeachv8", car: "Camaro SS", likes: 47, ago: "1d" },
    { id: "f5", url: "https://picsum.photos/seed/w5car/600/600", user: "@jdmmiami", car: "Honda S2000", likes: 99, ago: "2d" },
    { id: "f6", url: "https://picsum.photos/seed/w6car/600/600", user: "@brickellgt", car: "McLaren 720S", likes: 315, ago: "3d" },
  ]},
  { id: "p2", lat: 25.7827, lng: -80.1300, name: "Design District", description: "Modern architecture meets chrome — luxury backdrop", cover: "https://picsum.photos/seed/design22/600/400", photos: [
    { id: "f7", url: "https://picsum.photos/seed/d1car/600/600", user: "@designdistrict", car: "Lamborghini Urus", likes: 188, ago: "3h" },
    { id: "f8", url: "https://picsum.photos/seed/d2car/600/600", user: "@miamiturbo", car: "Porsche GT3", likes: 143, ago: "8h" },
    { id: "f9", url: "https://picsum.photos/seed/d3car/600/600", user: "@305builds", car: "BMW M4 Competition", likes: 77, ago: "1d" },
    { id: "f10", url: "https://picsum.photos/seed/d4car/600/600", user: "@camdavis59", car: "2019 Mustang Bullitt", likes: 92, ago: "2d" },
  ]},
  { id: "p3", lat: 25.7488, lng: -80.2384, name: "Miracle Mile Strip", description: "Classic strip for rolling shots and static photos", cover: "https://picsum.photos/seed/miracle3/600/400", photos: [
    { id: "f11", url: "https://picsum.photos/seed/m1car/600/600", user: "@coralwheels", car: "Dodge Challenger", likes: 39, ago: "1d" },
    { id: "f12", url: "https://picsum.photos/seed/m2car/600/600", user: "@jdmmiami", car: "Mitsubishi Evo IX", likes: 88, ago: "2d" },
    { id: "f13", url: "https://picsum.photos/seed/m3car/600/600", user: "@southbeachv8", car: "Ford Mustang GT500", likes: 101, ago: "3d" },
    { id: "f14", url: "https://picsum.photos/seed/m4car/600/600", user: "@camdavis59", car: "2019 Mustang Bullitt", likes: 78, ago: "4d" },
  ]},
  { id: "p4", lat: 25.7907, lng: -80.1300, name: "Brickell City Centre", description: "Glass towers reflect everything — ultimate urban backdrop", cover: "https://picsum.photos/seed/brickell4/600/400", photos: [
    { id: "f15", url: "https://picsum.photos/seed/b1car/600/600", user: "@brickellgt", car: "Rolls Royce Ghost", likes: 402, ago: "4h" },
    { id: "f16", url: "https://picsum.photos/seed/b2car/600/600", user: "@305builds", car: "Ferrari SF90", likes: 510, ago: "6h" },
    { id: "f17", url: "https://picsum.photos/seed/b3car/600/600", user: "@designdistrict", car: "Bentley Continental", likes: 287, ago: "12h" },
    { id: "f18", url: "https://picsum.photos/seed/b4car/600/600", user: "@miamiturbo", car: "Aston Martin DB11", likes: 193, ago: "1d" },
    { id: "f19", url: "https://picsum.photos/seed/b5car/600/600", user: "@camdavis59", car: "2019 Mustang Bullitt", likes: 156, ago: "2d" },
    { id: "f20", url: "https://picsum.photos/seed/b6car/600/600", user: "@jdmmiami", car: "Acura NSX", likes: 98, ago: "3d" },
  ]},
];

const SEED_BUSINESSES: Business[] = [
  { id: "biz1", type: "tire", name: "Miami Performance Tire Co.", address: "7890 NW 25th St, Miami, FL 33122", lat: 25.8050, lng: -80.3200, phone: "(305) 555-0142", hours: "Mon–Sat 8am–6pm", rating: 4.7, reviews: 218, description: "Full-service performance tire shop. Installation, balancing, TPMS service. Authorized dealer for Michelin, Pirelli, Continental, and Toyo. Serving Miami since 2005.", cover: "https://picsum.photos/seed/tireshop1/800/400", photos: ["https://picsum.photos/seed/tireshop1/800/500","https://picsum.photos/seed/tireshop2/800/500","https://picsum.photos/seed/tireshop3/800/500"], tags: ["tires","performance","michelin","pirelli"], deal: "10% off with Drive 59 app" },
  { id: "biz2", type: "tuning", name: "EvoTune Miami", address: "1245 SW 27th Ave, Miami, FL 33145", lat: 25.7630, lng: -80.2400, phone: "(305) 555-0187", hours: "Mon–Fri 9am–7pm · Sat 9am–5pm", rating: 4.9, reviews: 156, description: "Miami's most trusted ECU tuning and performance shop. Dyno tuning, engine builds, turbo kits, and custom fabrication for all makes and models. HP guaranteed.", cover: "https://picsum.photos/seed/tuningshop1/800/400", photos: ["https://picsum.photos/seed/tuningshop1/800/500","https://picsum.photos/seed/tuningshop2/800/500","https://picsum.photos/seed/tuningshop3/800/500"], tags: ["tuning","dyno","ecu","turbo","performance"], deal: "Free dyno pull with any tune" },
  { id: "biz3", type: "supercar_dealer", name: "Exotic Motorcar Group", address: "1000 Brickell Ave, Miami, FL 33131", lat: 25.7500, lng: -80.1950, phone: "(305) 555-0234", hours: "Mon–Sat 10am–7pm · Sun 11am–5pm", rating: 4.8, reviews: 94, description: "South Florida's premier pre-owned exotic and supercar dealer. Ferrari, Lamborghini, Porsche, McLaren, Bentley, and more. Financing available. Trade-ins welcome.", cover: "https://picsum.photos/seed/supercardeal1/800/400", photos: ["https://picsum.photos/seed/supercardeal1/800/500","https://picsum.photos/seed/supercardeal2/800/500","https://picsum.photos/seed/supercardeal3/800/500","https://picsum.photos/seed/supercardeal4/800/500"], tags: ["ferrari","lamborghini","porsche","mclaren","exotic","supercar"], deal: "Mention Drive 59 for complimentary detail with purchase" },
  { id: "biz4", type: "oil_change", name: "FastLane Oil & Lube", address: "5555 SW 40th St, Miami, FL 33155", lat: 25.7200, lng: -80.2800, phone: "(305) 555-0098", hours: "Mon–Sat 7am–7pm · Sun 8am–5pm", rating: 4.5, reviews: 412, description: "Fast, professional oil changes starting at $29.99. Full synthetic options for performance and European vehicles. No appointment needed. In and out in 15 minutes.", cover: "https://picsum.photos/seed/oilchange1/800/400", photos: ["https://picsum.photos/seed/oilchange1/800/500","https://picsum.photos/seed/oilchange2/800/500","https://picsum.photos/seed/oilchange3/800/500"], tags: ["oil change","lube","maintenance","quick service"], deal: "$5 off with Drive 59 app" },
  { id: "biz5", type: "gas", name: "Shell — Brickell", address: "890 SW 8th St, Miami, FL 33130", lat: 25.7660, lng: -80.2060, phone: "(305) 555-0310", hours: "Open 24 Hours", rating: 4.2, reviews: 88, description: "Shell V-Power premium fuel available. Car wash on site. Convenience store open 24/7.", cover: "https://picsum.photos/seed/shellgas/800/400", photos: ["https://picsum.photos/seed/shellgas/800/500"], tags: ["gas","shell","premium","24hrs"] },
  { id: "biz6", type: "gas", name: "BP — Wynwood", address: "2100 NW 2nd Ave, Miami, FL 33127", lat: 25.7980, lng: -80.2000, phone: "(305) 555-0311", hours: "Open 24 Hours", rating: 4.0, reviews: 62, description: "BP fuel station near Wynwood. Premium and regular unleaded. Quick convenience store.", cover: "https://picsum.photos/seed/bpgas/800/400", photos: ["https://picsum.photos/seed/bpgas/800/500"], tags: ["gas","bp","wynwood"] },
  { id: "biz7", type: "gas", name: "Chevron — Coral Gables", address: "1475 S Dixie Hwy, Miami, FL 33146", lat: 25.7270, lng: -80.2640, phone: "(305) 555-0312", hours: "Open 24 Hours", rating: 4.3, reviews: 104, description: "Chevron Techron premium fuel. Air and vacuum free for customers. Well-lit, safe station.", cover: "https://picsum.photos/seed/chevrongas/800/400", photos: ["https://picsum.photos/seed/chevrongas/800/500"], tags: ["gas","chevron","coral gables"] },
];

const SEED_GARAGE: GarageCar[] = [
  { id: "g1", year: 2019, make: "Ford", model: "Mustang Bullitt", color: "Highland Green", horsepower: "480", engine: "5.0L V8 Ti-VCT (Bullitt spec)", transmission: "6-Speed Manual (short-throw)", drivetrain: "RWD", weight: "3,705 lbs", description: "One of only 350 Highland Green examples built for 2019. Factory Bullitt package — open air intake, GT350 strut tower brace, unique Torsen diff. Daily driven but treated right. A true American icon.", mods: ["Borla ATAK cat-back exhaust", "Steeda adjustable panhard bar", "Ford Performance suspension lowering springs", "Magneride delete & coilover conversion", "Michelin Pilot Sport 4S 255/40/19"], photos: ["https://picsum.photos/seed/bullitt1/800/500","https://picsum.photos/seed/bullitt2/800/500","https://picsum.photos/seed/bullitt3/800/500","https://picsum.photos/seed/bullitt4/800/500"] },
];

const SEED_RALLIES: Rally[] = [
  { id: "r1", name: "Keys Run — Miami to Key West", date: "2026-08-15", startLocation: "Bayfront Park, Miami", endLocation: "Southernmost Point, Key West", stops: ["Card Sound Road","Islamorada Fuel Stop","Marathon Rest Area"], description: "Annual Keys run. Stunning scenery, smooth roads, minimal traffic. Fundraiser for ocean conservation.", banner: "https://picsum.photos/seed/ral1banner/800/200", members: ["@camdavis59","@miamiturbo","@305builds","@brickellgt","@jdmmiami"], maxCars: 30, fundraiser: true, goal: 5000, raised: 2840, status: "upcoming" },
  { id: "r2", name: "Everglades Loop", date: "2026-09-04", startLocation: "Homestead, Miami", endLocation: "Homestead, Miami", stops: ["Shark Valley Overlook","Everglades City Gas","Loop Road Turnaround"], description: "4th of July loop through the Everglades. Flat roads, wide open skies. BBQ at the finish.", banner: "https://picsum.photos/seed/ral2banner/800/200", members: ["@camdavis59","@southbeachv8","@coralwheels"], maxCars: 20, fundraiser: false, goal: 0, raised: 0, status: "upcoming" },
];

const SEED_CONVERSATIONS: Conversation[] = [
  { id: "cv1", with: "Alex Torres", handle: "@miamiturbo", car: "2020 GT-R", avatar: "AT", lastSeen: "2m ago", messages: [
    { id: "m1", from: "@miamiturbo", text: "Your Bullitt looked insane at Wynwood last night 🔥", time: "8:45 PM" },
    { id: "m2", from: "me", text: "Thanks man! Your GT-R sounded incredible", time: "8:47 PM" },
    { id: "m3", from: "@miamiturbo", text: "You coming to JDM Only next weekend?", time: "8:48 PM" },
    { id: "m4", from: "me", text: "Definitely. Already RSVPd", time: "8:49 PM" },
  ]},
  { id: "cv2", with: "Sofia Reyes", handle: "@305builds", car: "Ferrari 488", avatar: "SR", lastSeen: "1h ago", messages: [
    { id: "m5", from: "@305builds", text: "Love the Bullitt. Highland Green is so clean.", time: "Yesterday" },
    { id: "m6", from: "me", text: "Thanks! It's one of 350. Couldn't pass it up.", time: "Yesterday" },
  ]},
  { id: "cv3", with: "Marco Diaz", handle: "@jdmmiami", car: "Honda S2000", avatar: "MD", lastSeen: "3h ago", messages: [
    { id: "m7", from: "@jdmmiami", text: "Let's meet up at Aventura lot Friday night?", time: "2 days ago" },
    { id: "m8", from: "me", text: "I'll be there around 8", time: "2 days ago" },
  ]},
];

const SEED_MARKET: MarketListing[] = [
  { id: "mk1", title: "HKS Hi-Power Exhaust — 350Z/370Z", price: 650, category: "Exhaust", condition: "Used - Excellent", seller: "@miamiturbo", location: "Hialeah, FL", image: "https://picsum.photos/seed/exhaust1/600/400", description: "Full cat-back, great sound, no drone. Fits 350Z and 370Z. 40k miles on it, still sings.", compatibleWith: "Nissan 350Z, 370Z", posted: "2 days ago" },
  { id: "mk2", title: "Volk TE37 18x9.5 +22 — Set of 4", price: 2800, category: "Wheels", condition: "Used - Good", seller: "@305builds", location: "Brickell, Miami", image: "https://picsum.photos/seed/wheels1/600/400", description: "Bronze TE37s. Some curb rash on 2 wheels, priced accordingly. Rare bronze finish.", compatibleWith: "Universal 5x114.3", posted: "4 days ago" },
  { id: "mk3", title: "KW V3 Coilover Kit — BRZ/GR86", price: 1900, category: "Suspension", condition: "Used - Like New", seller: "@camdavis59", location: "Miami, FL", image: "https://picsum.photos/seed/coilovers1/600/400", description: "Only 8k miles. Full kit, both adjusters work perfectly. Selling because I sold the car.", compatibleWith: "Toyota GR86, Subaru BRZ (2022+)", posted: "1 week ago" },
  { id: "mk4", title: "Brembo GT 6-Piston Front Kit", price: 3200, category: "Brakes", condition: "New", seller: "@brickellgt", location: "Brickell, Miami", image: "https://picsum.photos/seed/brakes1/600/400", description: "Never installed, still in box. Ordered for a build that fell through.", compatibleWith: "BMW M3/M4 (F80/F82)", posted: "3 days ago" },
  { id: "mk5", title: "Mishimoto Intercooler — WRX STI", price: 420, category: "Cooling", condition: "Used - Good", seller: "@jdmmiami", location: "Hialeah, FL", image: "https://picsum.photos/seed/intercooler1/600/400", description: "Direct fit FMIC. Minor paint scuffs on endtanks, zero issues. Great upgrade.", compatibleWith: "Subaru WRX STI 2008-2021", posted: "5 days ago" },
  { id: "mk6", title: "Recaro Pole Position Seat", price: 880, category: "Interior", condition: "Used - Excellent", seller: "@southbeachv8", location: "South Beach, Miami", image: "https://picsum.photos/seed/seat1/600/400", description: "Driver seat only. Black/red fabric. No tears. Includes side mount adapters.", compatibleWith: "Universal with adapters", posted: "1 week ago" },
  { id: "mk7", title: "Borla ATAK Cat-Back — Mustang GT", price: 750, category: "Exhaust", condition: "Used - Excellent", seller: "@camdavis59", location: "Miami, FL", image: "https://picsum.photos/seed/borlaexhaust/600/400", description: "Removed from 2019 Mustang Bullitt when upgrading. Aggressive sound, no drone at highway speeds. One of the best cat-backs for the S550.", compatibleWith: "Ford Mustang GT S550 2015-2023", posted: "3 days ago" },
  { id: "mk8", title: "Pirelli P Zero 305/30/20 — Pair", price: 480, category: "Tires", condition: "Used - Good", seller: "@305builds", location: "Brickell, Miami", image: "https://picsum.photos/seed/tires1/600/400", description: "Rear tires off Ferrari 488. 60% tread remaining. Perfect for track day or spirited driving.", compatibleWith: "Universal — check fitment", posted: "6 days ago" },
  { id: "mk9", title: "Edelbrock E-Force Supercharger — Mustang GT", price: 4800, category: "Engine", condition: "Used - Excellent", seller: "@sfmuscle", location: "Homestead, FL", image: "https://picsum.photos/seed/supercharger1/600/400", description: "Complete kit. Adds ~200whp to stock GT. Professionally installed, removed during engine rebuild. Includes all hardware.", compatibleWith: "Ford Mustang GT 5.0 2015-2020", posted: "2 weeks ago" },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      events: SEED_EVENTS,
      clubs: SEED_CLUBS,
      photoLocations: SEED_PHOTO_LOCATIONS,
      businesses: SEED_BUSINESSES,
      garage: SEED_GARAGE,
      rallies: SEED_RALLIES,
      conversations: SEED_CONVERSATIONS,
      market: SEED_MARKET,
      rsvpdEvents: [],
      profile: { name: "Cameron Davis", handle: "@camdavis59", location: "South Miami, FL", points: 2840, bio: "Miami native. 2019 Mustang Bullitt owner. Building the car culture community in South Florida one meet at a time. Drive 59 founder.", avatar: "", banner: "https://picsum.photos/seed/profilebanner/800/300", eventsAttended: 12, photosUploaded: 34, following: 89, followers: 203 },

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
    { name: "drive59-store-v2" }
  )
);
