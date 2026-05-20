export type Ribbon = {
  color: string;
  label: string;
  year: number;
};

export type Result = {
  show: string;
  date: string;
  location: string;
  judge: string;
  class: string;
  placement: string;
  award?: string;
};

export type Dog = {
  slug: string;
  callName: string;
  registeredName: string;
  breed: string;
  dob: string;
  sex: "Dog" | "Bitch";
  owner: string;
  handler: string;
  titles: string[];
  bio: string;
  color: string;
  ribbons: Ribbon[];
  results: Result[];
  stats: { ccs: number; rccs: number; bobs: number; shows: number };
  accentColor: string;
  coverGradient: string;
  coverImage: string;
  profileImage: string;
};

export const mockDogs: Dog[] = [
  {
    slug: "luna",
    callName: "Luna",
    registeredName: "Silvermoor Lunar Eclipse ShCh",
    breed: "Border Collie",
    dob: "14 March 2021",
    sex: "Bitch",
    owner: "Sarah M.",
    handler: "Sarah M. (owner-handler)",
    titles: ["Show Champion", "Junior Warrant"],
    bio:
      "This demo profile shows how Pawdium brings a dog's results, ribbons, titles and milestones into one beautiful career timeline — from first class to Show Champion.",
    color: "Black & White",
    accentColor: "#6B9FD4",
    coverGradient: "from-blue-950 via-navy-900 to-navy-950",
    coverImage: "/dogs/luna.jpg",
    profileImage: "/dogs/luna.jpg",
    stats: { ccs: 7, rccs: 4, bobs: 12, shows: 34 },
    ribbons: [
      { color: "#C9A24A", label: "Challenge Certificate", year: 2024 },
      { color: "#7C3AED", label: "Best of Breed", year: 2024 },
      { color: "#3B82F6", label: "Group 3", year: 2024 },
      { color: "#C9A24A", label: "Challenge Certificate", year: 2023 },
      { color: "#7C3AED", label: "Best of Breed", year: 2023 },
      { color: "#9CA3AF", label: "Reserve CC", year: 2023 },
      { color: "#C9A24A", label: "Challenge Certificate", year: 2022 },
      { color: "#9CA3AF", label: "Reserve CC", year: 2022 },
      { color: "#16A34A", label: "Junior Warrant", year: 2022 },
      { color: "#DC2626", label: "1st Open Bitch", year: 2021 },
      { color: "#16A34A", label: "Best Puppy in Breed", year: 2021 },
      { color: "#DC2626", label: "1st Minor Puppy", year: 2021 },
    ],
    results: [
      {
        show: "Crufts 2024",
        date: "7 March 2024",
        location: "NEC Birmingham",
        judge: "Mrs. Patricia Holloway",
        class: "Open Bitch",
        placement: "1st",
        award: "Best of Breed",
      },
      {
        show: "Border Union CH Show",
        date: "12 Aug 2023",
        location: "Kelso, Scotland",
        judge: "Mr. David Cairns",
        class: "Open Bitch",
        placement: "1st",
        award: "Challenge Certificate",
      },
      {
        show: "LKA Championship Show",
        date: "16 Dec 2023",
        location: "Birmingham NEC",
        judge: "Mrs. Helen Forsyth",
        class: "Open Bitch",
        placement: "1st",
        award: "Challenge Certificate",
      },
    ],
  },
  {
    slug: "caspian",
    callName: "Caspian",
    registeredName: "Auroral Fire on the Horizon",
    breed: "Irish Setter",
    dob: "22 July 2022",
    sex: "Dog",
    owner: "James H.",
    handler: "James H. (owner-handler)",
    titles: [],
    bio:
      "This demo profile shows how Pawdium tracks a rising dog's career — RCCs, BOBs, show diary entries and the steady climb towards a first CC.",
    color: "Rich Mahogany",
    accentColor: "#B45309",
    coverGradient: "from-orange-950 via-navy-900 to-navy-950",
    coverImage: "/dogs/caspian.jpg",
    profileImage: "/dogs/caspian.jpg",
    stats: { ccs: 0, rccs: 2, bobs: 3, shows: 18 },
    ribbons: [
      { color: "#9CA3AF", label: "Reserve CC", year: 2024 },
      { color: "#9CA3AF", label: "Reserve CC", year: 2024 },
      { color: "#7C3AED", label: "Best of Breed", year: 2024 },
      { color: "#DC2626", label: "1st Post Graduate", year: 2023 },
      { color: "#DC2626", label: "1st Junior", year: 2023 },
      { color: "#16A34A", label: "Best Puppy in Breed", year: 2023 },
      { color: "#DC2626", label: "1st Minor Puppy", year: 2022 },
    ],
    results: [
      {
        show: "Southern Counties CH Show",
        date: "15 Jun 2024",
        location: "Ardingley, West Sussex",
        judge: "Mrs. Caroline Webb",
        class: "Open Dog",
        placement: "2nd",
        award: "Reserve CC",
      },
      {
        show: "Leeds Championship Show",
        date: "20 Jul 2024",
        location: "Harewood, Leeds",
        judge: "Mr. Robert Ashton",
        class: "Limit Dog",
        placement: "1st",
        award: "Reserve CC",
      },
      {
        show: "Irish Setter Club of GB",
        date: "18 May 2024",
        location: "Coventry",
        judge: "Mrs. Sandra Lyons",
        class: "Limit Dog",
        placement: "1st",
        award: "Best of Breed",
      },
    ],
  },
  {
    slug: "stella",
    callName: "Stella",
    registeredName: "Greybridge Star Performer ShCh",
    breed: "Miniature Schnauzer",
    dob: "3 November 2019",
    sex: "Bitch",
    owner: "The Greybridge Kennel",
    handler: "Emma Greybridge",
    titles: ["Show Champion", "Junior Warrant"],
    bio:
      "This demo profile shows how Pawdium handles a kennel dog's full career — multiple CCs, Group placings, BOBs and a complete show diary across seasons.",
    color: "Salt & Pepper",
    accentColor: "#64748B",
    coverGradient: "from-slate-900 via-navy-900 to-navy-950",
    coverImage: "/dogs/stella.jpg",
    profileImage: "/dogs/stella.jpg",
    stats: { ccs: 11, rccs: 6, bobs: 22, shows: 61 },
    ribbons: [
      { color: "#C9A24A", label: "Challenge Certificate", year: 2024 },
      { color: "#7C3AED", label: "Best of Breed", year: 2024 },
      { color: "#3B82F6", label: "Group 2", year: 2024 },
      { color: "#C9A24A", label: "Challenge Certificate", year: 2023 },
      { color: "#7C3AED", label: "Best of Breed", year: 2023 },
      { color: "#C9A24A", label: "Challenge Certificate", year: 2023 },
      { color: "#EF4444", label: "Best in Show (Open)", year: 2023 },
      { color: "#3B82F6", label: "Group 1", year: 2022 },
      { color: "#C9A24A", label: "Challenge Certificate", year: 2022 },
      { color: "#7C3AED", label: "Best of Breed", year: 2022 },
      { color: "#9CA3AF", label: "Reserve CC", year: 2021 },
      { color: "#16A34A", label: "Junior Warrant", year: 2021 },
    ],
    results: [
      {
        show: "Crufts 2024",
        date: "9 March 2024",
        location: "NEC Birmingham",
        judge: "Mr. Stephen Griffith",
        class: "Open Bitch",
        placement: "1st",
        award: "Challenge Certificate",
      },
      {
        show: "WELKS Championship Show",
        date: "25 Feb 2024",
        location: "Malvern, Worcestershire",
        judge: "Mrs. Jane Carrington",
        class: "Open Bitch",
        placement: "1st",
        award: "Challenge Certificate & Best of Breed",
      },
      {
        show: "Birmingham National",
        date: "2 Sep 2023",
        location: "Stoneleigh Park",
        judge: "Mr. Peter Vaughan",
        class: "Open Bitch",
        placement: "1st",
        award: "Challenge Certificate",
      },
    ],
  },
];

export function getDogBySlug(slug: string): Dog | undefined {
  return mockDogs.find((d) => d.slug === slug);
}
