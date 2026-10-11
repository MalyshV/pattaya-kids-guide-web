import type { DraftProgram } from "./overture-batch-1.types";

/**
 * Черновики занятий из ручного отбора кандидатов Overture (см.
 * prisma/places/overture-batch-1.ts). Каждая запись — школа или секция как
 * «занятие без каталожного места» (venueName/venueAddress). Точка и ссылка на
 * карточку сняты с карты вручную 11.10.2026; сайты проверены на открытие,
 * Facebook — официальные страницы. Категория — slug из справочника
 * ActivityCategory, null = в справочнике нет подходящей (выбрать в админке).
 */
export const OVERTURE_PROGRAMS_1: readonly DraftProgram[] = [
  {
    slug: "baby-shark-swim-school",
    name: "Baby Shark Swim School",
    venueAddress: "16/222 Nong Pla Lai, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9874068,
    venueLongitude: 100.9264955,
    googleMapsUrl:
      "https://www.google.com/maps/place/Baby+Shark+Swim+School/@12.9874068,100.9264955,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf2320c1a05d:0x4d3a799103e57957!8m2!3d12.9874068!4d100.9264955!16s%2Fg%2F11gxq2r9q6",
    categorySlug: "swimming",
    website: null,
    facebookUrl: "https://www.facebook.com/babysharkswimclub",
  },
  {
    slug: "swimming-kids-pattaya",
    name: "Swimming Kids Pattaya",
    venueAddress: "226 หมู่ 2, Na Chom Thian, Sattahip, Chon Buri 20250",
    venueLatitude: 12.8432878,
    venueLongitude: 100.9063222,
    googleMapsUrl:
      "https://www.google.com/maps/place/Swimming+Kids+Pattaya/@12.8432878,100.9063222,17z/data=!3m1!4b1!4m6!3m5!1s0x3102933fa92b2ec9:0xf081179dafdd7ee7!8m2!3d12.8432878!4d100.9063222!16s%2Fg%2F11l67sq_8z",
    categorySlug: "swimming",
    website: "https://swimmingkidsthailand.com/",
    facebookUrl: "https://www.facebook.com/swimmingkidspty",
  },
  {
    slug: "g-swim-academy-pattaya",
    name: "G Swim Academy",
    venueAddress:
      "IG Center, 53/48 หมู่ 4 Chaiyaphruek 2 Rd, Huai Yai, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.8815804,
    venueLongitude: 100.9285162,
    googleMapsUrl:
      "https://www.google.com/maps/place/G+SWIM+ACADEMY+PATTAYA/@12.8815804,100.9285162,17z/data=!3m1!4b1!4m6!3m5!1s0x310295d3445e7431:0xcdc02c09ab566f43!8m2!3d12.8815804!4d100.9285162!16s%2Fg%2F11n9qpk5g3",
    categorySlug: "swimming",
    website: null,
    facebookUrl: "https://www.facebook.com/people/G-Swim-Academy/61583556017254/",
  },
  {
    slug: "universe-gymnastics-pattaya",
    name: "Universe Gymnastics Pattaya & Bangkok",
    venueAddress:
      "Phon Prapha Nimit 24 Alley, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9311099,
    venueLongitude: 100.9436166,
    googleMapsUrl:
      "https://www.google.com/maps/place/UNIVERSE+GYMNASTICS+PATTAYA+%26+BANGKOK/@12.9311099,100.9436166,17z/data=!3m1!4b1!4m6!3m5!1s0x31029570822498b3:0x9525d140314109a2!8m2!3d12.9311099!4d100.9436166!16s%2Fg%2F11c42pfmwx",
    categorySlug: "gymnastics",
    website: null,
    facebookUrl: "https://www.facebook.com/UniverseGymnasticsClub",
  },
  {
    slug: "gymnastic-pattaya",
    name: "Gymnastic Pattaya — акробатика и художественная гимнастика",
    venueAddress: "25/584 หมู่ 12, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9002696,
    venueLongitude: 100.9013163,
    googleMapsUrl:
      "https://www.google.com/maps/place/Gymnastics+Pattaya/@12.9002696,100.9013163,17z/data=!3m1!4b1!4m6!3m5!1s0x31029514554b86bf:0x300d9a4eaca34191!8m2!3d12.9002696!4d100.9013163!16s%2Fg%2F11jvhr9rnk",
    categorySlug: "gymnastics",
    website: null,
    facebookUrl: "https://www.facebook.com/gymptt",
  },
  {
    slug: "boss-dance-studio-pattaya",
    name: "Boss Dance Studio Pattaya",
    venueAddress: "149/365-366 หมู่ 9, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9297098,
    venueLongitude: 100.9009604,
    googleMapsUrl:
      "https://www.google.com/maps/place/Boss+Dance+Studio+Pattaya/@12.9297098,100.9009604,17z/data=!3m1!4b1!4m6!3m5!1s0x310295e584fa1bbb:0x316da6edb3cf8524!8m2!3d12.9297098!4d100.9009604!16s%2Fg%2F11b7xm6tyc",
    categorySlug: "dance",
    website: null,
    facebookUrl: "https://www.facebook.com/BossDance0994166246",
  },
  {
    slug: "kiddy-dance-music-studio",
    name: "Kiddy Dance & Music Studio",
    venueAddress: "Wonder Space Pattaya, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9507154,
    venueLongitude: 100.9478899,
    googleMapsUrl:
      "https://www.google.com/maps/place/Kiddy+Dance+Studio/@12.9507154,100.9478899,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf10e73d2da3:0x321e0814c89654df!8m2!3d12.9507154!4d100.9478899!16s%2Fg%2F11syr43_t3",
    categorySlug: "dance",
    website: null,
    facebookUrl:
      "https://www.facebook.com/people/Kiddy-Dance-Music-Studio/100082247868628/",
  },
  {
    slug: "kc-dance-studio-pattaya-ballet",
    name: "Школа танцев и балета KC Dance Studio",
    venueAddress: "Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.893759,
    venueLongitude: 100.9447889,
    googleMapsUrl:
      "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B8%B1%E0%B8%A5%E0%B9%80%E0%B8%A5%E0%B8%95%E0%B9%8C%E0%B8%9E%E0%B8%B1%E0%B8%97%E0%B8%A2%E0%B8%B2/@12.893759,100.9447889,17z/data=!3m1!4b1!4m6!3m5!1s0x310294fce5169bf1:0xb2c05fe8bcd0dd5e!8m2!3d12.893759!4d100.9447889!16s%2Fg%2F11c6ppjqtg",
    categorySlug: "dance",
    website: null,
    facebookUrl: "https://www.facebook.com/kcdancestudiopattaya999",
  },
  {
    slug: "rosinka-ballet-pattaya",
    name: "Russian Ballet Rosinka",
    venueAddress: "445 Soi Saranchon, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.962532,
    venueLongitude: 100.8858415,
    googleMapsUrl:
      "https://www.google.com/maps/place/Pattaya+Dance+Studio+Rosinka+Ballet+and+Modern+Dance.%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%B1%E0%B8%A5%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%95%E0%B9%8C/@12.962532,100.8858415,17z/data=!3m1!4b1!4m6!3m5!1s0x310295d450baa713:0xf6ba4fde8ed6dede!8m2!3d12.962532!4d100.8858415!16s%2Fg%2F11dxm9mszk",
    categorySlug: "dance",
    website: null,
    facebookUrl: "https://www.facebook.com/pattayaballetschool",
  },
  {
    slug: "studio-d-lab-pattaya",
    name: "Studio D-LAB",
    venueAddress:
      "45/69-70 หมู่ 10 South Pattaya Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9195961,
    venueLongitude: 100.8875744,
    googleMapsUrl:
      "https://www.google.com/maps/place/Studio+D-LAB/@12.9195961,100.8875744,17z/data=!3m1!4b1!4m6!3m5!1s0x3102970b2d47863f:0xdc3bc208df97962e!8m2!3d12.9195961!4d100.8875744!16s%2Fg%2F11rmr3c44k",
    categorySlug: "dance",
    website: null,
    facebookUrl: "https://www.facebook.com/studio.dlab",
  },
  {
    slug: "interdance-studio-pattaya",
    name: "Interdance Studio (International Dance Company)",
    venueAddress:
      "315/331 หมู่ 12 Thepprasit Rd (Soi 12), Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9062201,
    venueLongitude: 100.8740319,
    googleMapsUrl:
      "https://www.google.com/maps/place/Interdance+Studio+Company+Pattaya/@12.9062201,100.8740319,17z/data=!3m1!4b1!4m6!3m5!1s0x310296640505a3eb:0xa28abd50015e0e21!8m2!3d12.9062201!4d100.8740319!16s%2Fg%2F11bc70yscz",
    categorySlug: "dance",
    website: "http://www.interdancepattaya.com/",
    facebookUrl: "https://www.facebook.com/Interdancepattaya",
  },
  {
    slug: "perfect-dance-pattaya",
    name: "Perfect Dance Pattaya",
    venueAddress: "223/16 Pornpranimit Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.937541,
    venueLongitude: 100.9271329,
    googleMapsUrl:
      "https://www.google.com/maps/place/Perfect+dance+pattaya/@12.937541,100.9271329,17z/data=!3m1!4b1!4m6!3m5!1s0x310295bf93cfd5b7:0x81e34974d38381d8!8m2!3d12.937541!4d100.9271329!16s%2Fg%2F11xgjqqmrn",
    categorySlug: "dance",
    website: null,
    facebookUrl: "https://www.facebook.com/people/Perfect-Dance-Pattaya/61573508856388/",
  },
  {
    slug: "yamaha-music-school-pattaya",
    name: "Yamaha Music School Pattaya",
    venueAddress: "3/140-141 หมู่ 6 Pattaya 3rd Rd, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9466098,
    venueLongitude: 100.896123,
    googleMapsUrl:
      "https://www.google.com/maps/place/Yamaha+Music+School+Pattaya/@12.9466098,100.896123,17z/data=!3m1!4b1!4m6!3m5!1s0x31029609ce92ec25:0x379568de92c431e2!8m2!3d12.9466098!4d100.896123!16s%2Fg%2F1vvr3pq3",
    categorySlug: "music",
    website: null,
    facebookUrl: "https://www.facebook.com/yamahaschoolpattaya",
  },
  {
    slug: "g-clef-music-studio-pattaya",
    name: "G Clef Music Studio Pattaya",
    venueAddress:
      "IG Center, 53/48 หมู่ 4 Chaiyaphruek 2 Rd, Huai Yai, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.8815699,
    venueLongitude: 100.9285487,
    googleMapsUrl:
      "https://www.google.com/maps/place/G+Clef+Music+Studio+Pattaya/@12.8815699,100.9285487,17z/data=!3m1!4b1!4m6!3m5!1s0x3102953e40cdfcbf:0x93a14fdaca02e336!8m2!3d12.8815699!4d100.9285487!16s%2Fg%2F11sr7nbn2c",
    categorySlug: "music",
    website: null,
    facebookUrl: "https://www.facebook.com/gclefmusicstudiopattaya",
  },
  {
    slug: "studio-melodica-pattaya",
    name: "Studio Melodica",
    venueAddress:
      "Swon Place Bldg, 512/17 หมู่ 9 Pattaya Klang Rd, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9326379,
    venueLongitude: 100.8976671,
    googleMapsUrl:
      "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%B5+Studio+Melodica/@12.9326379,100.8976671,17z/data=!3m1!4b1!4m6!3m5!1s0x310295e4cc1af7a1:0x6e084e50b88a35c0!8m2!3d12.9326379!4d100.8976671!16s%2Fg%2F11g6ymgfx8",
    categorySlug: "music",
    website: "https://www.studiomelodica.com/",
    facebookUrl: "https://www.facebook.com/s.melodica",
  },
  {
    slug: "music-garden-home",
    name: "Music Garden Home",
    venueAddress: "Life Garden Home, Takhian Tia, Bang Lamung, Chon Buri 20150",
    venueLatitude: 13.0204519,
    venueLongitude: 100.966334,
    googleMapsUrl:
      "https://www.google.com/maps/place/Music+garden+home/@13.0204519,100.966334,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf45833e0b79:0x23df997ae2eaba4f!8m2!3d13.0204519!4d100.966334!16s%2Fg%2F11fyllnld7",
    categorySlug: "music",
    website: null,
    facebookUrl: "https://www.facebook.com/Musicgardenhome",
  },
  {
    slug: "perfect-art-pattaya",
    name: "Perfect Art Pattaya",
    venueAddress:
      "IG Center, 53/48 Chaiyaphruek 2 Rd, Huai Yai, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.881517,
    venueLongitude: 100.9285041,
    googleMapsUrl:
      "https://www.google.com/maps/place/Perfect+Art+School+%E0%B8%AA%E0%B8%AD%E0%B8%99%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B8%B0+%E0%B8%9E%E0%B8%B1%E0%B8%97%E0%B8%A2%E0%B8%B2/@12.881517,100.9285041,17z/data=!3m1!4b1!4m6!3m5!1s0x31029528d7a358af:0xcb605ba4cd4018b6!8m2!3d12.881517!4d100.9285041!16s%2Fg%2F11f789jn06",
    categorySlug: "art",
    website: null,
    facebookUrl: "https://www.facebook.com/perfectartpattaya",
  },
  {
    slug: "global-art-pattaya",
    name: "Global Art Pattaya",
    venueAddress: "245 Bang Lamung, Chon Buri 20150",
    venueLatitude: 13.0264593,
    venueLongitude: 100.9304958,
    googleMapsUrl:
      "https://www.google.com/maps/place/Global+Art+Pattaya/@13.0264593,100.9304958,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf5ab024d90f:0x4b3b566462453d37!8m2!3d13.0264593!4d100.9304958!16s%2Fg%2F11yz9cnr2q",
    categorySlug: "art",
    website: "https://th.globalart.world/",
    facebookUrl: "https://www.facebook.com/GlobalartPattaya",
  },
  {
    slug: "the-painting-house-art-studio",
    name: "The painting house — арт-студия",
    venueAddress: "Soi 1, Muang Pattaya, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.927387,
    venueLongitude: 100.9148405,
    googleMapsUrl:
      "https://www.google.com/maps/place/The+painting+house_art+studio/@12.927387,100.9148405,17z/data=!3m1!4b1!4m6!3m5!1s0x310295bf0fb58ec1:0x76d430acbf6179e9!8m2!3d12.927387!4d100.9148405!16s%2Fg%2F11sqffgv93",
    categorySlug: "art",
    website: null,
    facebookUrl: "https://www.facebook.com/paintinghouse.watercolor",
  },
  {
    slug: "sabai-clay-pattaya",
    name: "Sabai Clay",
    venueAddress: "352/305 Phra Tamnak 5, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9107906,
    venueLongitude: 100.8596757,
    googleMapsUrl:
      "https://www.google.com/maps/place/Sabai+Clay/@12.9107906,100.8596757,17z/data=!3m1!4b1!4m6!3m5!1s0x31029711cf8cc37b:0x433cb86bf4f49316!8m2!3d12.9107906!4d100.8596757!16s%2Fg%2F11yldcn2wf",
    categorySlug: "art",
    website: null,
    facebookUrl: "https://www.facebook.com/people/Sabai-Clay/61583831005992/",
  },
  {
    slug: "rsr-pattaya-taekwondo",
    name: "RSR Pattaya Taekwondo",
    venueAddress: "19/94-95 Bang Lamung 31, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9302485,
    venueLongitude: 100.9105554,
    googleMapsUrl:
      "https://www.google.com/maps/place/RSR+PATTAYA+TAEKWONDO/data=!4m7!3m6!1s0x310295ed0433364f:0x2a53f2bf4162842f!8m2!3d12.9302485!4d100.9105554!16s%2Fg%2F11bttncqx9",
    categorySlug: null,
    website: null,
    facebookUrl: "https://www.facebook.com/Tel.0852294544",
  },
  {
    slug: "rsr-grand-taekwondo",
    name: "RSR Grand Taekwondo",
    venueAddress: "88/82 Wonder Space Pattaya, Nong Prue, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9506953,
    venueLongitude: 100.9478934,
    googleMapsUrl:
      "https://www.google.com/maps/place/RSR+GRAND+TAEKWONDO/@12.9506953,100.9478934,17z/data=!3m1!4b1!4m6!3m5!1s0x3102bf50ed10b089:0x65afa8c6a3ac4a2!8m2!3d12.9506953!4d100.9478934!16s%2Fg%2F11t1sgtts_",
    categorySlug: null,
    website: null,
    facebookUrl: "https://www.facebook.com/RSRGrand",
  },
  {
    slug: "pattaya-city-football-academy",
    name: "Pattaya City Football Academy",
    venueAddress:
      "Рядом со стадионом MC у железной дороги (перед пересечением Chaiyaphruek), Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.8839095,
    venueLongitude: 100.9043783,
    googleMapsUrl:
      "https://www.google.com/maps/place/PATTAYA+CITY+FOOTBALL+ACADEMY/data=!4m7!3m6!1s0x310295001cf6edc5:0xd8648228392bdb9a!8m2!3d12.8839095!4d100.9043783!16s%2Fg%2F11vt9p5htd",
    categorySlug: null,
    website: null,
    facebookUrl: "https://www.facebook.com/PattayaCityAcademy",
  },
  {
    slug: "sharks-basketball-academy-pattaya",
    name: "Sharks Basketball Academy Pattaya",
    venueAddress:
      "Planet Football Stadium, 55/15 หมู่ 2 Pornpranimit Rd, Pattaya City, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.9311587,
    venueLongitude: 100.9436206,
    googleMapsUrl:
      "https://www.google.com/maps/place/Sharks+Basketball+Academy+Pattaya/@12.9311587,100.9436206,17z/data=!3m1!4b1!4m6!3m5!1s0x824e1e4320214be1:0x32176a44911d53c7!8m2!3d12.9311587!4d100.9436206!16s%2Fg%2F11xkw10ggc",
    categorySlug: null,
    website: null,
    facebookUrl: "https://www.facebook.com/sharkbasketbasketball",
  },
  {
    slug: "g-bright-kids-pattaya",
    name: "G Bright Kids (с программой Robot Station)",
    venueAddress:
      "IG Center, 53/48 หมู่ 4 Chaiyaphruek 2 Rd, Huai Yai, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.8815164,
    venueLongitude: 100.9286081,
    googleMapsUrl:
      "https://www.google.com/maps/place/G+BRIGHT+KIDS/@12.8815164,100.9286081,17z/data=!3m1!4b1!4m6!3m5!1s0x310295d78431c825:0xedeb487f54a1595f!8m2!3d12.8815164!4d100.9286081!16s%2Fg%2F11fnw7l9j3",
    categorySlug: "early-development",
    website: null,
    facebookUrl: "https://www.facebook.com/gbrightkidspty",
  },
  {
    slug: "wonder-kids-pattaya",
    name: "Wonder Kids — ментальная арифметика и фоника",
    venueAddress: "109/247 หมู่ 13, Bang Lamung, Chon Buri 20150",
    venueLatitude: 12.917658,
    venueLongitude: 100.9026325,
    googleMapsUrl:
      "https://www.google.com/maps/place/WONDER+KIDS+%E0%B8%9E%E0%B8%B1%E0%B8%97%E0%B8%A2%E0%B8%B2/@12.917658,100.9026325,17z/data=!3m1!4b1!4m6!3m5!1s0xbd7c8b762017749:0x3c83c4b21a7593c7!8m2!3d12.917658!4d100.9026325!16s%2Fg%2F11sk9yg2yl",
    categorySlug: "math",
    website: null,
    facebookUrl: "https://www.facebook.com/people/Wonder-kids/100090655371475/",
  },
];
