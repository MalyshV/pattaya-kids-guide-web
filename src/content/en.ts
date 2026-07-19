import type { Dictionary } from "@/content/dictionary";

/**
 * English UI dictionary — mirrors ru.ts (the Dictionary type guarantees the
 * structures never drift apart). Tone: calm, parent-neutral, no hype.
 * English plurals are simple, so they are inlined instead of lib/plural.
 */
export const en: Dictionary = {
  brand: "Pattaya Kids Guide",

  meta: {
    title: "Pattaya Kids Guide",
    description: "A calm guide to kids' places and events in Pattaya — for parents.",
  },

  nav: {
    places: "Places",
    events: "Events",
    activities: "Activities",
    birthdays: "Birthdays",
    aria: "Site sections",
    langAria: "Language",
  },

  notFound: {
    eyebrow: "404",
    title: "Page not found",
    description:
      "The address may be mistyped or the link is outdated. Everything useful lives in the places catalog.",
    cta: "← To places",
  },

  common: {
    detailsCta: "Details",
    descriptionFallback: "Description coming soon.",
    // lightbox: click a photo to zoom, the balloon button closes it
    zoomPhoto: "Zoom photo",
    closePhoto: "Close photo",
    yes: "Yes",
    no: "No",
    affirmative: "Yes",
    negative: "No",
    unknown: "to be confirmed",
    backToTop: "Back to top",
  },

  share: {
    cta: "Share",
    copied: "Link copied",
  },

  memory: {
    navSaved: "Saved",
    navVisited: "Been here",
    pageTitle: "Saved",
    pageIntro:
      "Places, activities and events you've saved or already visited. The list is kept in this browser only — no sign-up.",
    backToCatalog: "← To places",
    emptyCta: "Browse places",
    saveLabel: "Save",
    savedLabel: "Saved",
    saveAria: "Save to your list",
    savedAria: "Remove from saved",
    visitLabel: "Been here",
    visitedLabel: "Marked: been here",
    visitAria: "Mark as been here",
    visitedAria: "Remove been-here mark",
    savedSection: "Saved",
    visitedSection: "Been here",
    savedSectionEmpty: "Nothing yet — tap ♡ on cards to save for later.",
    visitedSectionEmpty: "Nothing yet — tap ✓ on cards of places you've visited.",
    emptyTitle: "Nothing here yet",
    emptyHint:
      "Tap ♡ on cards to save, and ✓ to mark where you've been. Everything shows up here.",
    remove: "Remove",
    removed: "Removed from the list",
    restore: "Undo",
    entityPlace: "Place",
    entityActivity: "Activity",
    entityEvent: "Event",
    filterTitle: "“Been here” marks:",
    filterAll: "Show all",
    filterHide: "Hide visited",
    filterOnly: "Only visited",
    filterHiddenNote: (count: number) => `Visited places hidden: ${count}`,
    filterOnlyNote: (count: number) => `Showing only visited: ${count}`,
    filterEmptyOnlyTitle: "No visited places among these results",
    filterEmptyOnlyHint:
      "✓ “been here” marks live on place cards — none of these places are marked yet.",
    filterEmptyHiddenTitle: "Every place found here is already visited",
    filterEmptyHiddenHint:
      "All of these results carry the ✓ “been here” mark — show all to see them.",
    filterEmptyCta: "Show all",
  },

  age: {
    question: "How old is your child?",
    hint: "Pick two ages if you have two kids",
    all: "All ages",
    buckets: {
      "0-1": "Under 1",
      "1-3": "1–3 years",
      "3-6": "3–6 years",
      "6-12": "6–12 years",
    },
    showingFor: (labels: string[]): string =>
      labels.length === 1
        ? `Showing for a child: ${labels[0]}`
        : `Showing for kids: ${labels.join(" and ")}`,
  },

  openStatus: {
    openHours: (hours: number): string =>
      `Open for ~${hours} more ${hours === 1 ? "hour" : "hours"}`,
    openNow: "Open now",
    closingSoon: "Closing soon",
    opensAt: (time: string): string => `Opens at ${time}`,
    closedToday: "Closed today",
  },

  places: {
    heroTitle: "Places to go with kids in Pattaya",
    heroDescription:
      "Calmly pick places for kids: filters for indoor playgrounds, food, Wi-Fi and other useful details.",
    sectionTitle: "Places",
    count: (total: number): string => `${total} ${total === 1 ? "place" : "places"}`,
    emptyTitle: "Nothing found",
    emptyHint: "Try removing one of the filters.",
    emptyAgeHint:
      "Nothing found for this age yet — try another age or clear the selection.",
    emptyCta: "Show all places",
    emptyWorkTitle: "Not many such places yet",
    emptyWorkHint:
      "We're filling the catalog with places where a parent can work nearby. Try removing this filter for now.",
    emptyOpenNowTitle: "No places are open right now",
    emptyOpenNowHint:
      "Opening hours vary — check back a bit later, or turn off “Go now” to see all places.",
    emptyMorningTitle: "Not much is open in the morning",
    emptyMorningHint:
      "Most kids' places open later. Try turning off “Open in the morning”.",
    emptyShelterTitle: "Not many such places yet",
    emptyShelterHint:
      "We're collecting places to hide from heat and rain. Try turning this filter off for now.",
    badgeIndoor: "Indoor",
    badgeOutdoor: "Outdoor",
    addressFallback: "Address to be confirmed",
    // "Near me": geolocation states. Calm tone — denial is a hint, not an error.
    nearLocating: "Finding what's nearby…",
    nearDenied:
      "We couldn't get your location. If you'd like to see what's closest, allow location access in your browser settings.",
    nearFailed: "We couldn't detect your location.",
    nearRetry: "Try again",
    nearUnavailable: "Geolocation isn't available in this browser.",
    // the ?near=true link may have been shared — no location prompt without consent
    nearInvite:
      "Show the closest places? This needs your location — it stays in your browser.",
    nearInviteCta: "Use my location",
    // List|Map toggle and map labels
    viewList: "List",
    viewMap: "Map",
    viewToggleAria: "View: list or map",
    mapYouAreHere: "You are here",
    mapMissingNote: (count: number): string =>
      count === 1
        ? "1 place has no exact coordinates yet — find it in the list"
        : `${count} places have no exact coordinates yet — find them in the list`,
    features: {
      food: "Food",
      wifi: "Wi-Fi",
      childDropOff: "Child drop-off",
      animals: "Animals",
    },
  },

  placeFilters: {
    title: "Filters",
    subtitle: "Pick what matters",
    reset: "Reset",
    labels: {
      indoor: "Indoor",
      outdoor: "Outdoor",
      hasFood: "Food",
      hasWifi: "Wi-Fi",
      hasAirCon: "Aircon",
      hasParking: "Parking",
      canLeaveChild: "Child drop-off",
      animalContact: "Animals",
    },
  },

  // search box for places and activities (instant suggestions)
  search: {
    placeholder: "Find a place or activity…",
    ariaLabel: "Search places and activities",
    empty: "Nothing found. Try another word — a name, or “trampoline”",
    typePlace: "place",
    typeActivity: "activity",
  },

  scenarios: {
    title: "Quick picks",
    openNow: "Go now",
    openNowHint: "Open right now, or opening within half an hour",
    openNowActive: "Showing only what's open now",
    openMorning: "Open in the morning",
    openMorningHint: "Opens early — by 9:00",
    openMorningActive: "Showing places that open early today",
    workFriendly: "Work-friendly",
    workFriendlyHint: "Wi-Fi, aircon and a place to sit with a laptop",
    workFriendlyActive: "Showing places where a parent can work nearby",
    shelter: "Escape the heat",
    shelterHint: "Indoors with aircon, or under a canopy with fans — rain-proof too",
    shelterActive: "Showing places to hide from heat and rain",
    nearMe: "Near me",
    nearMeHint: "Closest places first. Your location stays in your browser",
    nearMeActive:
      "Closest first; distances are straight-line. Your location stays in the browser",
  },

  birthdays: {
    metaTitle: (cityName: string): string =>
      `Kids' birthday in ${cityName}: venues, packages and prices`,
    heroTitle: "A kid's birthday party in Pattaya",
    heroDescription:
      "Venues that host kids’ birthdays: packages, prices, deposits and contacts — collected and checked in person.",
    askOnBooking: "— ask when booking",
    ageNote: "Age doesn't filter here — showing all birthday venues.",
    guestsLabel: "Guests:",
    guestsFrom: (min: number): string => `from ${min}`,
    guestsRange: (min: number, max: number): string => `${min}–${max}`,
    depositLabel: "Deposit:",
    depositYes: "Yes",
    depositNo: "No",
    preBookLabel: "Book:",
    preBookDays: (days: number): string => `${days} ${days === 1 ? "day" : "days"} ahead`,
    openPlace: "Place page",
    emptyTitle: "Collecting venues",
    emptyHint:
      "We're confirming birthday packages with local venues — the list is coming soon.",
  },

  placeDetails: {
    back: "← Back to places",
    eyebrow: "Place",
    summary: {
      ageRange: (min: number, max: number): string => `${min}–${max} y.o.`,
      entryFrom: (price: string): string => `entry from ${price}`,
      entryFree: "free entry",
      canLeave: "child drop-off",
      canLeaveFrom: (age: string): string => `drop-off ${age}`,
      todayUntil: (time: string): string => `open today till ${time}`,
    },
    photosTitle: "Photos",
    addressTitle: "Address",
    openInMaps: "Open in Google Maps",
    detailsTitle: "Details",
    fields: {
      type: "Type",
      food: "Food",
      wifi: "Wi-Fi",
      airCon: "Aircon",
      parking: "Parking",
      powerOutlets: "Power outlets",
      cafeSeating: "A place to sit",
      childDropOff: "Child drop-off",
      animals: "Animals",
    },
    scheduleTitle: "Opening hours",
    days: {
      MON: "Monday",
      TUE: "Tuesday",
      WED: "Wednesday",
      THU: "Thursday",
      FRI: "Friday",
      SAT: "Saturday",
      SUN: "Sunday",
    },
    closed: "Closed",
    today: "today",
    pricingTitle: "Prices",
    entryLabel: "Entry",
    priceFree: "Free",
    priceUnknown: "Price to be confirmed",
    entryTitle: "Entry price",
    entryChild: "Child",
    entryAdult: "Adult",
    tipsTitle: "Good to know",
    tipVerified: (period: string): string => `verified: ${period}`,
    contactsTitle: "Contacts",
    contactChannels: {
      phone: "Phone",
      email: "Email",
      website: "Website",
      instagram: "Instagram",
      facebook: "Facebook",
      line: "LINE",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    activitiesTitle: "Activities",
    membershipsTitle: "Memberships",
    programTypes: {
      CAMP: "Camp",
      MEMBERSHIP: "Membership",
      COURSE: "Classes",
    },
    programOldPrice: (price: string): string => `was ${price}`,
    ageTitle: "Ages",
    amenitiesTitle: "Amenities",
    staffLanguagesTitle: "Staff languages",
    birthdayTitle: "Birthday",
    birthdayHas: "They host kids' birthday parties here",
    birthdayAllLink: "All birthday venues",
    categoriesTitle: "Categories",
    upcomingTitle: "Upcoming events here",
    noUpcoming: "No upcoming events yet.",
  },

  events: {
    heroTitle: "Kids' events in Pattaya",
    heroDescription: "See what's on now, what's ahead and what's already over.",
    sectionTitle: "Events",
    count: (total: number): string => `${total} ${total === 1 ? "event" : "events"}`,
    emptyTitle: "Nothing found",
    emptyHint: "Try another filter, or view all events.",
    emptyCta: "Show all events",
  },

  activities: {
    heroTitle: "Kids' activities in Pattaya",
    heroDescription:
      "Playgroups, studios and clubs: swimming, music, art and more — where to enrol your child for regular classes.",
    sectionTitle: "Activities",
    count: (total: number): string =>
      `${total} ${total === 1 ? "activity" : "activities"}`,
    emptyTitle: "Not many activities yet",
    emptyHint: "We're filling the catalog — studios and clubs are coming.",
    emptyFilteredHint: "Nothing matches these filters — try a different age or type.",
    emptyCta: "Show all activities",
    placeLabel: "Place",
    ageLabel: "Ages:",
    filterAgeTitle: "Child's age",
    filterTypeTitle: "Activity type",
    filterAny: "Any",
    filterAll: "All",
    ageBuckets: {
      "0-1": "Under 1",
      "1-3": "1–3 years",
      "3-6": "3–6 years",
      "6-12": "6–12 years",
    },
  },

  activityCard: {
    detailsCta: "Details",
  },

  activityDetails: {
    back: "← Back to activities",
    heroWhere: "Where:",
    whereTitle: "Where it happens",
    classesTitle: "Classes and schedule",
    classCol: "Class",
    ageCol: "Age",
    timeCol: "Days and times",
    withParent: "with parent",
    withoutParent: "without parent",
    parentDepends: "with or without parent",
    classLegend:
      "“With parent” — 45 min, you take part. “Without parent” — 1 hour, you watch from the lobby.",
  },

  eventCard: {
    starts: "Starts",
    ends: "Ends",
    ageLabel: "Ages",
    dateTbd: "Date to be confirmed",
    locationTbd: "Location to be confirmed",
    placeLabel: "Place",
    viewPlace: "Open place",
    statusOngoing: "Happening now",
    statusPast: "Already over",
  },

  eventFilters: {
    title: "Filters",
    subtitle: "When do you want to go",
    showAll: "Show all",
    labels: {
      upcoming: "Upcoming",
      ongoing: "Happening now",
      past: "Past",
    },
  },

  eventDetails: {
    back: "← Back to events",
    eyebrow: "Event",
    detailsTitle: "Details",
    when: "When",
    start: "Starts",
    end: "Ends",
    location: "Venue",
    address: "Address",
    notSpecified: "Not specified",
    placeTitle: "Place",
    placeLabel: "Place",
    noPlace: "This event isn't linked to a place.",
  },

  pagination: {
    pageOf: (current: number, totalPages: number): string =>
      `Page ${current} of ${totalPages}`,
    previous: "Back",
    next: "Next",
    placesAria: "Places pagination",
    eventsAria: "Events pagination",
    activitiesAria: "Activities pagination",
  },
};
