import type { Dictionary } from "@/content/dictionary";

/**
 * Тайский словарь интерфейса — зеркалит ru.ts (тип Dictionary не даст
 * разъехаться). Тон: вежливый письменный тайский без гендерных частиц
 * (ครับ/ค่ะ в UI не используются), нейтральный к обоим родителям
 * (ผู้ปกครอง). Времена — с น. (тайская запись часов), «уточняется» —
 * รอยืนยัน. Во множественном числе тайский обходится без форм —
 * счёт через классификаторы (แห่ง для мест, รายการ для списков).
 */
export const th: Dictionary = {
  brand: "Pattaya Kids Guide",

  meta: {
    title: "Pattaya Kids Guide",
    description:
      "คู่มือฉบับสบาย ๆ รวมสถานที่และอีเวนต์สำหรับเด็กในพัทยา — สำหรับผู้ปกครอง",
  },

  nav: {
    places: "สถานที่",
    events: "อีเวนต์",
    activities: "คลาสเรียน",
    birthdays: "วันเกิด",
    aria: "หมวดของเว็บไซต์",
    langAria: "เลือกภาษา",
    sectionsAria: "หมวดหมู่",
    themeToggle: "สลับธีมสีเว็บไซต์",
    themeToDark: "ธีมมืด",
    themeToLight: "ธีมสว่าง",
    skipToContent: "ไปยังเนื้อหาหลัก",
  },

  notFound: {
    eyebrow: "404",
    title: "ไม่พบหน้านี้",
    description:
      "ลิงก์อาจพิมพ์ผิดหรือหน้าถูกย้ายไปแล้ว สิ่งที่เป็นประโยชน์ทั้งหมดอยู่ในหน้ารวมสถานที่",
    cta: "← ไปหน้าสถานที่",
  },
  errorPage: {
    eyebrow: "ข้อผิดพลาด",
    title: "มีบางอย่างผิดพลาด",
    description: "เราทราบปัญหาแล้ว ลองรีเฟรชหน้าอีกครั้ง — โดยปกติจะช่วยได้",
    retry: "ลองอีกครั้ง",
    cta: "← ไปหน้าสถานที่",
  },

  common: {
    detailsCta: "ดูรายละเอียด",
    descriptionFallback: "จะเพิ่มคำอธิบายเร็ว ๆ นี้",
    opensInNewTab: "(เปิดในแท็บใหม่)",
    zoomPhoto: "ขยายรูป",
    closePhoto: "ปิดรูป",
    prevPhoto: "รูปก่อนหน้า",
    nextPhoto: "รูปถัดไป",
    photoCounter: (current: number, total: number) => `${current} จาก ${total}`,
    // «Есть/Нет» — состояния фактов (еда, Wi-Fi, животные)
    yes: "มี",
    no: "ไม่มี",
    // «Да/Нет» — вопросы возможности («можно ли…») → ได้/ไม่ได้
    affirmative: "ได้",
    negative: "ไม่ได้",
    unknown: "รอยืนยัน",
    backToTop: "กลับขึ้นด้านบน",
  },

  share: {
    cta: "แชร์",
    copied: "คัดลอกลิงก์แล้ว",
  },

  memory: {
    menuAria: "ถูกใจและเคยไปแล้ว",
    navSaved: "ถูกใจ",
    navVisited: "เคยไปแล้ว",
    pageTitle: "ถูกใจ · เคยไปแล้ว",
    pageIntro:
      "สถานที่ คลาสเรียน และอีเวนต์ที่คุณถูกใจหรือเคยไปมาแล้ว รายการเก็บอยู่ในเบราว์เซอร์นี้เท่านั้น — ไม่ต้องสมัครสมาชิก Safari บน iPhone และ Mac อาจล้างรายการนี้ไปเอง หากไม่ได้เข้าเว็บไซต์นี้นานราวหนึ่งสัปดาห์",
    backToCatalog: "← ไปหน้าสถานที่",
    emptyCta: "ดูสถานที่",
    saveLabel: "ถูกใจ",
    savedLabel: "นำออกจาก “ถูกใจ”",
    visitLabel: "เคยไปแล้ว",
    visitedLabel: "นำออกจาก “เคยไปแล้ว”",
    savedSection: "ถูกใจ",
    visitedSection: "เคยไปแล้ว",
    likedHideVisited: "ซ่อนที่เคยไปแล้ว",
    likedAllVisitedTitle: "ทุกอย่างที่ถูกใจ คุณเคยไปมาแล้ว",
    likedAllVisitedHint: "ปิด “ซ่อนที่เคยไปแล้ว” เพื่อดูทั้งหมด",
    savedSectionEmpty:
      "ยังว่างอยู่ — กด ♡ บนการ์ดสถานที่ คลาสเรียน และอีเวนต์ที่คุณถูกใจ",
    visitedSectionEmpty:
      "ยังว่างอยู่ — กด ✓ บนการ์ดสถานที่ คลาสเรียน และอีเวนต์ที่เคยไปมาแล้ว",
    emptyTitle: "ยังว่างอยู่",
    emptyHint: "ถูกใจอะไร กด ♡ เคยไปที่ไหนแล้ว กด ✓ ทุกอย่างจะมารวมอยู่ที่นี่",
    remove: "นำออก",
    removed: "นำออกจากรายการแล้ว",
    restore: "กู้คืน",
    entityPlace: "สถานที่",
    entityActivity: "คลาสเรียน",
    entityEvent: "อีเวนต์",
    filterTitle: "เครื่องหมาย “เคยไปแล้ว”:",
    filterAll: "แสดงทั้งหมด",
    filterHide: "ซ่อนที่เคยไปแล้ว",
    filterOnly: "เฉพาะที่เคยไปแล้ว",
    filterHiddenNote: (count: number) => `ซ่อนที่เคยไปแล้ว: ${count} แห่ง`,
    filterOnlyNote: (count: number) => `แสดงเฉพาะที่เคยไปแล้ว: ${count} แห่ง`,
    filterEmptyOnlyTitle: "ในผลลัพธ์นี้ยังไม่มีสถานที่ที่เคยไป",
    filterEmptyOnlyHint:
      "เครื่องหมาย ✓ “เคยไปแล้ว” กดได้บนการ์ดสถานที่ — ตอนนี้ยังไม่มีสถานที่ใดในผลลัพธ์ที่ถูกทำเครื่องหมายไว้",
    filterEmptyHiddenTitle: "สถานที่ในผลลัพธ์นี้เคยไปมาแล้วทั้งหมด",
    filterEmptyHiddenHint:
      "ทุกสถานที่ในผลลัพธ์นี้มีเครื่องหมาย ✓ “เคยไปแล้ว” — ปิดตัวกรองเพื่อดูทั้งหมด",
    filterEmptyCta: "แสดงทั้งหมด",
    filterApplying: "กำลังใช้ตัวกรองตามเครื่องหมาย “เคยไปแล้ว”…",
  },

  age: {
    question: "ลูกอายุเท่าไร?",
    hint: "เลือกได้สองช่วงวัย หากมีลูกสองคน",
    all: "ทุกช่วงวัย",
    buckets: {
      "0-1": "ไม่เกิน 1 ขวบ",
      "1-3": "1–3 ขวบ",
      "3-6": "3–6 ขวบ",
      "6-12": "6–12 ขวบ",
    },
    showingFor: (labels: string[]): string =>
      labels.length === 1
        ? `กำลังแสดงสำหรับลูกวัย ${labels[0]}`
        : `กำลังแสดงสำหรับลูกวัย ${labels.join(" และ ")}`,
  },

  openStatus: {
    openHours: (hours: number): string => `เปิดอีกประมาณ ${hours} ชั่วโมง`,
    openNow: "เปิดอยู่ตอนนี้",
    closesIn: (minutes: number): string =>
      minutes === 0
        ? "ใกล้ปิดแล้ว"
        : minutes >= 60
          ? "ปิดในอีก 1 ชั่วโมง"
          : `ปิดในอีก ${minutes} นาที`,
    opensAt: (time: string): string => `จะเปิดเวลา ${time} น.`,
    closedToday: "วันนี้ปิด",
  },

  places: {
    heroTitle: "พาลูกไปเที่ยวที่ไหนดีในพัทยา",
    heroDescription:
      "เลือกที่พาลูกไปได้อย่างสบายใจ — มีตัวกรองพื้นที่ในร่ม อาหาร Wi-Fi และรายละเอียดเล็ก ๆ ที่ช่วยได้จริง",
    sectionTitle: "สถานที่",
    count: (total: number): string => `${total} แห่ง`,
    emptyTitle: "ไม่พบผลลัพธ์",
    emptyHint: "ลองปิดตัวกรองสักตัว",
    emptyAgeHint: "ยังไม่พบสถานที่สำหรับช่วงวัยนี้ — ลองเปลี่ยนช่วงวัยหรือยกเลิกการเลือก",
    emptyCta: "แสดงสถานที่ทั้งหมด",
    emptyWorkTitle: "สถานที่แบบนี้ยังมีไม่มาก",
    emptyWorkHint:
      "เรากำลังเพิ่มสถานที่ที่นั่งทำงานใกล้ลูกได้สะดวก ระหว่างนี้ลองปิดตัวกรองนี้ดูก่อน",
    emptyOpenNowTitle: "ตอนนี้ยังไม่มีที่เปิดอยู่",
    emptyOpenNowHint:
      "แต่ละที่เปิด–ปิดไม่ตรงกัน — ลองกลับมาดูอีกครั้ง หรือปิด “ไปตอนนี้” เพื่อดูสถานที่ทั้งหมด",
    emptyMorningTitle: "ช่วงเช้ายังเปิดไม่กี่ที่",
    emptyMorningHint: "สถานที่สำหรับเด็กส่วนใหญ่เปิดสายกว่านั้น ลองปิด “เปิดตั้งแต่เช้า”",
    emptyMorningTomorrowHint:
      "สถานที่สำหรับเด็กส่วนใหญ่เปิดหลัง 9:00 น. ลองปิด “พรุ่งนี้เปิดเช้า”",
    emptyShelterTitle: "สถานที่แบบนี้ยังมีไม่มาก",
    emptyShelterHint:
      "เรากำลังรวบรวมสถานที่หลบร้อนหลบฝน ระหว่างนี้ลองปิดตัวกรองนี้ดูก่อน",
    badgeIndoor: "ในร่ม",
    badgeOutdoor: "กลางแจ้ง",
    addressFallback: "ที่อยู่รอยืนยัน",
    nearLocating: "กำลังหาสถานที่ใกล้คุณ…",
    nearDenied:
      "ไม่สามารถระบุตำแหน่งได้ หากอยากเห็นสถานที่ใกล้คุณ ลองอนุญาตการเข้าถึงตำแหน่งในการตั้งค่าเบราว์เซอร์",
    nearFailed: "ไม่สามารถระบุตำแหน่งได้",
    nearRetry: "ลองอีกครั้ง",
    nearUnavailable: "เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง",
    nearInvite:
      "แสดงสถานที่ใกล้คุณไหม? ต้องใช้การเข้าถึงตำแหน่ง — ข้อมูลจะอยู่ในเบราว์เซอร์ของคุณเท่านั้น",
    nearInviteCta: "ระบุตำแหน่งของฉัน",
    viewList: "รายการ",
    viewMap: "แผนที่",
    mapRegionLabel: "แผนที่สถานที่",
    mapLegend: {
      title: "คำอธิบายสัญลักษณ์",
      place: "สถานที่",
      event: "อีเวนต์",
      activity: "คลาสเรียน",
    },
    viewToggleAria: "สลับมุมมอง: รายการหรือแผนที่",
    mapYouAreHere: "คุณอยู่ที่นี่",
    mapEmptyTitle: "ยังไม่มีอะไรบนแผนที่",
    mapShowList: "ดูแบบรายการ",
    mapMissingNote: (count: number): string =>
      `${count} แห่งยังไม่มีพิกัดที่แน่นอน — แต่ยังดูได้ในรายการ`,
    features: {
      food: "อาหาร",
      wifi: "Wi-Fi",
      childDropOff: "ฝากลูกไว้ได้",
      animals: "สัตว์",
    },
  },

  placeFilters: {
    title: "ตัวกรอง",
    subtitle: "เลือกสิ่งที่สำคัญสำหรับคุณ",
    reset: "ล้างตัวกรอง",
    labels: {
      indoor: "ในร่ม",
      outdoor: "กลางแจ้ง",
      hasFood: "อาหาร",
      hasWifi: "Wi-Fi",
      hasAirCon: "แอร์",
      hasParking: "ที่จอดรถ",
      canLeaveChild: "ฝากลูกไว้ได้",
      animalContact: "สัตว์",
    },
  },

  search: {
    placeholder: "ค้นหาสถานที่ คลาสเรียน หรืออีเวนต์…",
    ariaLabel: "ค้นหาสถานที่ คลาสเรียน และอีเวนต์",
    // контент пока RU/EN — честно подсказываем искать по английскому названию
    empty: "ไม่พบผลลัพธ์ ลองคำอื่น — เช่น ชื่อสถานที่ภาษาอังกฤษ หรือ “trampoline”",
    typePlace: "สถานที่",
    typeActivity: "คลาสเรียน",
    typeEvent: "อีเวนต์",
  },

  // тексты посадочной — черновой тайский, на нативное ревью (как весь th)
  landing: {
    // «วันนี้» отражает «прямо сейчас» и разводит title с каталогом мест
    metaTitle: "วันนี้พาลูกไปเที่ยวที่ไหนดีในพัทยา",
    question: "ตอนนี้กำลังมองหาอะไรอยู่?",
    slotNotes: {
      morning: "ตอนเช้า — คำตอบจะเปลี่ยนตอนเย็น",
      day: "ตอนกลางวัน — คำตอบจะเปลี่ยนตอนเย็น",
      evening: "ตอนเย็น — พรุ่งนี้เช้าจะมีคำตอบใหม่",
      night: "ดึกแล้ว — พรุ่งนี้เช้าจะมีคำตอบใหม่",
    },
    refresh: "ดูตัวเลือกอื่น",
    refreshAria: "แสดงตัวเลือกอื่น",
    allCatalog: "ดูทั้งหมด",
    mapTitle: "บนแผนที่",
    onMap: "ดูบนแผนที่",
    scenarios: {
      ageBefore: "กิจกรรมสำหรับเด็กวัย",
      ageHint: "คลาสเรียนและกิจกรรมตามวัย",
      ageAria: "อายุของลูก",
      workFriendly: "ที่นั่งทำงานได้",
      workFriendlyHint: "ลูกเล่น — คุณทำงาน: Wi-Fi แอร์ คาเฟ่",
      openMorning: "เปิดตั้งแต่เช้า",
      openMorningHint: "เปิดแล้วตั้งแต่ 8:00–9:00",
      openMorningTomorrow: "พรุ่งนี้เปิดตั้งแต่เช้า",
      openNow: "ไปได้เลยตอนนี้",
      openNowHint: "เปิดอยู่ตอนนี้ หรือกำลังจะเปิด",
      openNowHintOpen: "เปิดอยู่ตอนนี้",
      shelter: "หลบร้อน",
      shelterHint: "เย็นสบาย: แอร์หรือร่มเงา — และหลบฝนได้",
      events: "สัปดาห์นี้มีอะไรบ้าง",
      eventsHint: "อีเวนต์ที่กำลังจะมาถึง",
      birthdays: "จัดวันเกิด",
      birthdaysHint: "สถานที่และแพ็กเกจวันเกิด",
      near: "ใกล้ฉัน",
      nearHint: "ที่ใกล้ที่สุดขึ้นก่อน ตำแหน่งอยู่ในเบราว์เซอร์ของคุณ",
    },
    ageOption: (years: number): string => {
      if (years < 1) {
        return "ไม่ถึง 1 ขวบ";
      }
      return `${years} ขวบ`;
    },
  },

  scenarios: {
    title: "เลือกด่วน",
    openNow: "ไปตอนนี้",
    openNowHint: "เปิดอยู่ตอนนี้ หรือจะเปิดภายในครึ่งชั่วโมง",
    openNowActive: "กำลังแสดงเฉพาะที่เปิดอยู่ตอนนี้",
    openMorning: "เปิดตั้งแต่เช้า",
    openMorningHint: "เปิดเช้า — ไม่เกิน 9:00 น.",
    openMorningActive: "กำลังแสดงสถานที่ที่เปิดตั้งแต่เช้า",
    openMorningTomorrow: "พรุ่งนี้เปิดเช้า",
    openMorningTomorrowHint: "พรุ่งนี้เปิดเช้า — ไม่เกิน 9:00 น.",
    openMorningTomorrowActive: "กำลังแสดงสถานที่ที่พรุ่งนี้เปิดไม่เกิน 9:00 น.",
    workFriendly: "นั่งทำงานได้",
    workFriendlyHint: "มี Wi-Fi แอร์ และที่นั่งสบาย ๆ",
    workFriendlyActive: "กำลังแสดงสถานที่ที่นั่งทำงานใกล้ลูกได้สะดวก",
    shelter: "หลบร้อน",
    shelterHint: "ในร่มมีแอร์ หรือใต้หลังคามีพัดลม — หลบฝนได้ด้วย",
    shelterActive: "กำลังแสดงที่หลบร้อนหลบฝน",
    nearMe: "ใกล้ฉัน",
    nearMeHint: "ที่ใกล้ที่สุดขึ้นก่อน ตำแหน่งของคุณอยู่ในเบราว์เซอร์เท่านั้น",
    nearMeActive:
      "เรียงจากที่ใกล้ก่อน ระยะทางเป็นเส้นตรง ตำแหน่งของคุณอยู่ในเบราว์เซอร์เท่านั้น",
  },

  birthdays: {
    metaTitle: (cityName: string): string =>
      `จัดวันเกิดเด็กใน${cityName === "Pattaya" ? "พัทยา" : cityName}: สถานที่ แพ็กเกจ และราคา`,
    heroTitle: "จัดวันเกิดเด็กในพัทยา",
    heroDescription:
      "สถานที่ที่รับจัดวันเกิดสำหรับเด็ก: แพ็กเกจ ราคา เงินมัดจำ และช่องทางติดต่อ — เรารวบรวมและตรวจสอบถึงที่",
    askOnBooking: "— สอบถามตอนจอง",
    ageNote: "หน้านี้ไม่กรองตามวัย — แสดงสถานที่จัดวันเกิดทั้งหมด",
    guestsLabel: "แขก:",
    guestsFrom: (min: number): string => `ตั้งแต่ ${min} คน`,
    guestsRange: (min: number, max: number): string => `${min}–${max} คน`,
    depositLabel: "มัดจำ:",
    depositYes: "มี",
    depositNo: "ไม่มี",
    preBookLabel: "ควรจองล่วงหน้า:",
    preBookDays: (days: number): string => `${days} วัน`,
    openPlace: "หน้าสถานที่",
    mapRegionLabel: "แผนที่สถานที่จัดงานวันเกิด",
    emptyTitle: "กำลังรวบรวมสถานที่",
    emptyHint:
      "เรากำลังสอบถามแพ็กเกจวันเกิดจากสถานที่ต่าง ๆ ในเมือง — เร็ว ๆ นี้จะมีให้ดูที่นี่",
  },

  placeDetails: {
    back: "← กลับไปหน้าสถานที่",
    eyebrow: "สถานที่",
    summary: {
      ageRange: (min: number, max: number): string => `${min}–${max} ขวบ`,
      entryFrom: (price: string): string => `ค่าเข้าเริ่มต้น ${price}`,
      entryFree: "เข้าฟรี",
      canLeave: "ฝากลูกไว้ได้",
      canLeaveFrom: (age: string): string => `ฝากลูกได้ ${age}`,
      todayUntil: (time: string): string => `วันนี้เปิดถึง ${time} น.`,
    },
    photosTitle: "รูปภาพ",
    addressTitle: "ที่อยู่",
    openInMaps: "เปิดใน Google Maps",
    detailsTitle: "รายละเอียด",
    fields: {
      type: "ประเภท",
      food: "อาหาร",
      wifi: "Wi-Fi",
      airCon: "แอร์",
      parking: "ที่จอดรถ",
      powerOutlets: "ปลั๊กไฟ",
      cafeSeating: "มีที่นั่ง",
      childDropOff: "ฝากลูกไว้ได้",
      animals: "สัตว์",
    },
    scheduleTitle: "เวลาเปิด–ปิด",
    days: {
      MON: "วันจันทร์",
      TUE: "วันอังคาร",
      WED: "วันพุธ",
      THU: "วันพฤหัสบดี",
      FRI: "วันศุกร์",
      SAT: "วันเสาร์",
      SUN: "วันอาทิตย์",
    },
    closed: "ปิด",
    today: "วันนี้",
    pricingTitle: "ราคา",
    entryLabel: "ค่าเข้า",
    priceFree: "ฟรี",
    priceUnknown: "ราคารอยืนยัน",
    entryTitle: "อัตราค่าเข้า",
    entryChild: "เด็ก",
    entryAdult: "ผู้ใหญ่",
    tipsTitle: "น่ารู้ก่อนไป",
    tipVerified: (period: string): string => `ตรวจสอบเมื่อ: ${period}`,
    contactsTitle: "ช่องทางติดต่อ",
    contactChannels: {
      phone: "โทรศัพท์",
      email: "อีเมล",
      website: "เว็บไซต์",
      instagram: "Instagram",
      facebook: "Facebook",
      line: "LINE",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    activitiesTitle: "คลาสเรียน",
    membershipsTitle: "แพ็กเกจสมาชิก",
    programTypes: {
      CAMP: "แคมป์",
      MEMBERSHIP: "แพ็กเกจสมาชิก",
      COURSE: "คลาสเรียน",
    },
    programOldPrice: (price: string): string => `เดิม ${price}`,
    ageTitle: "เหมาะสำหรับวัย",
    amenitiesTitle: "สิ่งอำนวยความสะดวก",
    staffLanguagesTitle: "ภาษาที่พนักงานพูดได้",
    birthdayTitle: "วันเกิด",
    birthdayHas: "ที่นี่รับจัดวันเกิดสำหรับเด็ก",
    birthdayAllLink: "ดูสถานที่จัดวันเกิดทั้งหมด",
    categoriesTitle: "หมวดหมู่",
    upcomingTitle: "อีเวนต์ที่จะจัดที่นี่เร็ว ๆ นี้",
    noUpcoming: "ตอนนี้ยังไม่มีอีเวนต์ที่กำลังจะมาถึง",
  },

  events: {
    heroTitle: "อีเวนต์สำหรับเด็กในพัทยา",
    heroDescription: "ดูว่าตอนนี้มีงานอะไร กำลังจะมีอะไร และอะไรที่ผ่านไปแล้ว",
    sectionTitle: "อีเวนต์",
    count: (total: number): string => `${total} รายการ`,
    emptyTitle: "ไม่พบผลลัพธ์",
    emptyHint: "ลองตัวกรองอื่น หรือดูอีเวนต์ทั้งหมด",
    emptyCta: "แสดงอีเวนต์ทั้งหมด",
    mapRegionLabel: "แผนที่อีเวนต์",
    mapMissingNote: (count: number): string =>
      `${count} อีเวนต์ยังไม่ระบุสถานที่ — แต่ยังดูได้ในรายการ`,
    mapPastNote: (count: number): string =>
      `${count} อีเวนต์ที่จบไปแล้วไม่แสดงบนแผนที่ — แต่ยังดูได้ในรายการ`,
  },

  activities: {
    heroTitle: "คลาสเรียนสำหรับเด็กในพัทยา",
    heroDescription:
      "คลาสพัฒนาทักษะ สตูดิโอ และชมรมสำหรับเรียนประจำ — ว่ายน้ำ ดนตรี ศิลปะ และอื่น ๆ อีกมากมาย",
    sectionTitle: "คลาสเรียน",
    count: (total: number): string => `${total} รายการ`,
    emptyTitle: "คลาสเรียนยังมีไม่มาก",
    emptyHint: "เรากำลังเพิ่มข้อมูล — เร็ว ๆ นี้จะมีสตูดิโอและชมรมมาเพิ่ม",
    emptyFilteredHint: "ยังไม่มีคลาสที่ตรงกับตัวกรองนี้ — ลองเปลี่ยนช่วงวัยหรือประเภท",
    emptyCta: "แสดงคลาสทั้งหมด",
    mapRegionLabel: "แผนที่คลาสเรียน",
    mapMissingNote: (count: number): string =>
      `${count} คลาสยังไม่ระบุสถานที่ — แต่ยังดูได้ในรายการ`,
    mapPastNote: (count: number): string =>
      `${count} แคมป์ที่จบไปแล้วไม่แสดงบนแผนที่ — แต่ยังดูได้ในรายการ`,
    placeLabel: "สถานที่",
    ageLabel: "อายุ:",
    filterAgeTitle: "วัยของลูก",
    filterTypeTitle: "ประเภทคลาส",
    filterAny: "ทั้งหมด",
    filterAll: "ทั้งหมด",
    ageBuckets: {
      "0-1": "ไม่เกิน 1 ขวบ",
      "1-3": "1–3 ขวบ",
      "3-6": "3–6 ขวบ",
      "6-12": "6–12 ขวบ",
    },
  },

  activityCard: {
    detailsCta: "ดูรายละเอียด",
  },

  activityDetails: {
    back: "← กลับไปหน้าคลาสเรียน",
    heroWhere: "สถานที่:",
    whereTitle: "จัดที่ไหน",
    classesTitle: "คลาสและตารางเวลา",
    classCol: "คลาส",
    ageCol: "อายุ",
    timeCol: "วันและเวลา",
    withParent: "เรียนกับผู้ปกครอง",
    withoutParent: "เรียนเอง",
    parentDepends: "มีหรือไม่มีผู้ปกครองก็ได้",
    classLegend:
      "“เรียนกับผู้ปกครอง” — 45 นาที คุณร่วมกิจกรรมด้วย ส่วน “เรียนเอง” — 1 ชั่วโมง คุณนั่งดูได้จากล็อบบี้",
  },

  eventCard: {
    starts: "เริ่ม",
    ends: "สิ้นสุด",
    ageLabel: "อายุ",
    dateTbd: "วันที่รอยืนยัน",
    locationTbd: "สถานที่รอยืนยัน",
    placeLabel: "สถานที่",
    viewPlace: "เปิดดูสถานที่",
    statusOngoing: "กำลังจัดอยู่",
    statusPast: "จบไปแล้ว",
  },

  eventFilters: {
    title: "ตัวกรอง",
    subtitle: "อยากไปช่วงไหน",
    showAll: "แสดงทั้งหมด",
    labels: {
      upcoming: "กำลังจะมาถึง",
      ongoing: "กำลังจัดอยู่",
      past: "ผ่านไปแล้ว",
    },
  },

  eventDetails: {
    back: "← กลับไปหน้าอีเวนต์",
    eyebrow: "อีเวนต์",
    detailsTitle: "รายละเอียด",
    when: "เมื่อไร",
    start: "เริ่ม",
    end: "สิ้นสุด",
    location: "สถานที่จัดงาน",
    address: "ที่อยู่",
    notSpecified: "ไม่ระบุ",
    placeTitle: "สถานที่",
    placeLabel: "สถานที่",
    noPlace: "อีเวนต์นี้ไม่ได้ผูกกับสถานที่ในเว็บไซต์",
  },

  pagination: {
    pageOf: (current: number, totalPages: number): string =>
      `หน้า ${current} จาก ${totalPages}`,
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    placesAria: "การแบ่งหน้ารายการสถานที่",
    eventsAria: "การแบ่งหน้ารายการอีเวนต์",
    activitiesAria: "การแบ่งหน้ารายการคลาสเรียน",
  },

  suggest: {
    cta: "ร่วมแนะนำ",
    metaTitle: "แนะนำสถานที่ อีเวนต์ หรือคลาสเรียน",
    heroTitle: "แนะนำให้เรารู้จัก",
    heroDescription:
      "รู้จักสถานที่ อีเวนต์ หรือคลาสเรียนดี ๆ สำหรับเด็กที่ยังไม่มีในเว็บไหม เล่าให้เราฟังได้ เราจะตรวจสอบแล้วเพิ่มให้ ช่องที่ต้องกรอกมีแค่สองช่อง",
    back: "← กลับ",
    kindLegend: "คุณอยากแนะนำอะไร",
    kinds: {
      place: "สถานที่",
      event: "อีเวนต์",
      activity: "คลาสเรียนหรือกิจกรรม",
      birthday: "สถานที่จัดงานวันเกิด",
    },
    optional: "ไม่บังคับ",
    nameLabel: "ชื่อ",
    namePlaceholder: {
      place: "เช่น The Play Barn",
      event: "เช่น เวิร์กช็อปทำการ์ดวันพ่อ",
      activity: "เช่น ว่ายน้ำสำหรับเด็กเล็ก",
      birthday: "เช่น LariDea Kids' Café",
    },
    locationLabel: "อยู่ที่ไหน",
    locationPlaceholder: "ลิงก์ Google Maps หรือที่อยู่",
    locationHint:
      "ง่ายที่สุดคือลิงก์จาก Google Maps: เปิดสถานที่ กด “แชร์” → “คัดลอกลิงก์” แล้ววางที่นี่ หรือพิมพ์ที่อยู่ก็ได้",
    whenLabel: "จัดเมื่อไร",
    whenPlaceholder: "เช่น 28 กันยายน 10:00 น.",
    tipLabel: {
      place: "สถานที่นี้ดีอย่างไร",
      event: "ในงานมีอะไร น่าสนใจอย่างไร",
      activity: "เป็นคลาสแบบไหน น่าสนใจอย่างไร",
      birthday: "เหมาะกับการจัดงานวันเกิดอย่างไร",
    },
    tipHint: "เคล็ดลับสำหรับผู้ปกครองคนอื่น ๆ เล่าด้วยภาษาของคุณเอง สั้น ๆ ก็ได้",
    birthdayLabel: "งานวันเกิดมีอะไรบ้าง",
    birthdayHint: "ถ้าทราบ: แพ็กเกจ ราคา จำนวนแขก อาหาร",
    linkLabel: "เว็บไซต์หรือโซเชียลมีเดีย",
    linkPlaceholder: "Instagram, Facebook หรือเว็บไซต์ ถ้าทราบ",
    ownerLabel: {
      place: "ฉันเป็นเจ้าของ ผู้จัด หรือตัวแทน",
      event: "ฉันเป็นเจ้าของ ผู้จัด หรือตัวแทน",
      activity: "ฉันเป็นเจ้าของ ผู้จัด หรือตัวแทน",
      birthday: "ฉันเป็นเจ้าของ ผู้จัด หรือตัวแทน",
    },
    ownerFree: "ลงข้อมูลบนเว็บและมีหน้าของตัวเองได้ฟรี",
    contactLabel: "ติดต่อคุณได้ทางไหน",
    contactHint:
      "โทรศัพท์, LINE, Telegram หรืออีเมล — เห็นเฉพาะทีมงานของเรา ใช้เพื่อสอบถามรายละเอียดเท่านั้น",
    consent:
      "เมื่อกดส่ง คุณยินยอมให้เราเผยแพร่ข้อมูลที่ส่งมาบนเว็บไซต์ได้ ยกเว้นข้อมูลติดต่อของคุณ",
    submit: "ส่ง",
    submitting: "กำลังส่ง…",
    honeypotLabel: "กรุณาเว้นช่องนี้ว่างไว้",
    draftRestored: "เราเก็บฉบับร่างที่ยังกรอกไม่เสร็จไว้ให้แล้ว",
    draftStartOver: "เริ่มใหม่",
    photos: {
      label: "รูปภาพ",
      hint: (max: number): string =>
        `ได้สูงสุด ${max} รูป ถ้าเป็นไปได้ ไม่ควรมีเด็กคนอื่นอยู่ในภาพ`,
      add: "เพิ่มรูป",
      addMore: "เพิ่มอีก",
      remove: "ลบออก",
      removeLabel: (n: number): string => `ลบรูปที่ ${n}`,
      alt: (n: number): string => `รูปที่ ${n}`,
      processing: "กำลังเตรียม…",
      preparing: "กำลังเตรียมรูป…",
      tooMany: (max: number): string =>
        `เพิ่มได้สูงสุด ${max} รูป รูปที่เกินมาเราไม่ได้เพิ่มให้`,
      unreadable: (names: string): string =>
        `เปิดไฟล์นี้เป็นรูปภาพไม่ได้: ${names} ลองใช้ไฟล์อื่น เช่น JPG หรือ PNG`,
      rightsLabel: "เป็นรูปของฉันเอง หรือฉันมีสิทธิ์แชร์รูปเหล่านี้",
      rightsRequired: "กรุณาติ๊กช่องนี้ หรือลบรูปออก",
      lostOnRestore: "รูปภาพไม่ได้บันทึกไว้ในฉบับร่าง กรุณาเพิ่มใหม่อีกครั้ง",
    },
    errorSummary: "กรุณาตรวจสอบช่องที่ทำเครื่องหมายไว้",
    errors: {
      required: "กรุณากรอกช่องนี้",
      tooShort: "สั้นเกินไป",
      tooLong: "ยาวเกินไป กรุณาย่อให้สั้นลง",
    },
    formErrors: {
      rateLimited:
        "ในชั่วโมงที่ผ่านมามีการส่งจากอุปกรณ์นี้หลายครั้งแล้ว กรุณาลองใหม่อีกสักพัก ข้อมูลที่กรอกไว้ยังอยู่ครบ",
      failed:
        "ขออภัย มีบางอย่างผิดพลาดที่ฝั่งเรา กรุณาลองใหม่อีกสักครู่ ข้อมูลที่กรอกไว้ยังอยู่ครบ",
      network:
        "ส่งไม่สำเร็จ ดูเหมือนอินเทอร์เน็ตหลุด ข้อมูลที่กรอกไว้ยังอยู่ครบ ลองส่งอีกครั้งได้เลย",
      photos:
        "รับรูปไม่สำเร็จ ลองอีกครั้ง หรือลบรูปออกแล้วส่งโดยไม่มีรูป ข้อมูลอื่นยังอยู่ครบ",
    },
    similar: {
      title: "ดูเหมือนจะมีในเว็บแล้ว:",
      open: "เปิดดู",
      nearby: (distance: string): string => `ห่างไป ${distance}`,
      sameSpot: "ตำแหน่งเดียวกัน",
      pastEvent: "จบไปแล้ว ถ้าเป็นครั้งใหม่ ส่งได้เลย",
      draft: "กำลังเตรียมเผยแพร่",
      pending: "ดูเหมือนจะมีคนแนะนำไว้แล้ว กำลังรอการตรวจสอบ ไม่จำเป็นต้องส่งซ้ำ",
      otherwise: "ถ้าไม่ใช่อันเดียวกัน กรอกต่อได้เลย",
      dismiss: "ไม่ใช่อันเดียวกัน",
      dismissed: "เข้าใจแล้ว เราจะบันทึกไว้ว่าไม่ใช่อันเดียวกัน กรอกต่อได้เลย",
      markedDifferent: "ระบุว่าไม่ใช่อันเดียวกัน",
      pendingAdmin: "คล้ายกับคำแนะนำที่ส่งมาแล้ว",
      kinds: { place: "สถานที่", event: "อีเวนต์", activity: "คลาส" },
    },
    thanks: {
      metaTitle: "ขอบคุณ!",
      title: "ขอบคุณ! เราได้รับคำแนะนำของคุณแล้ว",
      text: "เราจะตรวจสอบก่อน ถ้าทุกอย่างเรียบร้อยจะเพิ่มลงในเว็บ บางครั้งอาจใช้เวลาสองสามวัน เพราะต้องเช็กรายละเอียดให้ถูกต้อง",
      telegramText: "เรายังโพสต์สถานที่และอีเวนต์ใหม่ ๆ ในช่อง Telegram ด้วย",
      telegramCta: "ช่อง Telegram ของเรา",
      again: "แนะนำเพิ่มอีก",
      back: "กลับไปที่รายการ",
    },
  },
};
