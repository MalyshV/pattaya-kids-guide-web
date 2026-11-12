/**
 * Пакет дня рождения LariDea — официальный пост в Instagram 22.09.2026
 * («Our NEW Birthday Package», закреплён первым в профиле 12.11.2026):
 * один пакет на 3 часа вместо трёх мартовских. Тайский — по тайскому слайду
 * того же поста. Один источник для seed.ts, thai-content.json (проверяет
 * тест) и точечного prisma/fix-laridea-birthday-2026-11.ts.
 *
 * Переносы строк осмысленные: блок дня рождения выводит текст с переносами.
 */
export const LARIDEA_BIRTHDAY = {
  minGuests: 10,
  notes:
    "Пакет на 3 часа — 1 280 ฿ за ребёнка, оплачивается минимум 10 детей.\nВходят: игровая, нескользящие носки детям и одному родителю, еда, вода и сок, тематический торт, аквагрим, глиттер-тату, творческое занятие, присмотр весь праздник и каждому ребёнку — ваучер на бесплатный час в другой день.\nПраздник не закрытый — кафе работает и для других гостей. Закрыть зал — 5 000 ฿, от 20 детей бесплатно.\nДепозит 50%. К ценам добавляется НДС 7% и сбор персоналу 1 000 ฿ — его снимут при оплате, если сервис не понравился.\nДопы: декор — 2 500 ฿, фокусник (30 мин) — 6 000 ฿, аниматор (1 ч) — 6 000 ฿, фотограф (1 ч) — 6 000 ฿, мыльные пузыри — 1 000 ฿, попкорн — 1 500 ฿.",
  notesEn:
    "A 3-hour package — 1,280 ฿ per child, with a minimum charge for 10 children.\nIncluded: the play area, grip socks for each child and one parent, food, water and juice, a themed birthday cake, face painting, glitter tattoos, an art and craft activity, supervision throughout the party, and a voucher for one free hour of play on another day for each child.\nThe party is not private — the café stays open to other guests. A private venue is 5,000 ฿, free for 20 children or more.\n50% deposit. 7% VAT and a 1,000 ฿ staff service fee are added to the prices — the fee is removed at checkout if you are unhappy with the service.\nAdd-ons: decorations — 2,500 ฿, magic show (30 min) — 6,000 ฿, animator (1 h) — 6,000 ฿, photographer (1 h) — 6,000 ฿, bubble machine — 1,000 ฿, popcorn station — 1,500 ฿.",
  notesTh:
    "แพ็กเกจ 3 ชั่วโมง — 1,280 ฿ ต่อเด็ก 1 คน คิดขั้นต่ำ 10 คน\nรวม: เข้าใช้พื้นที่เล่น ถุงเท้ากันลื่นสำหรับเด็กแต่ละคนและผู้ปกครอง 1 ท่าน อาหาร น้ำเปล่าและน้ำผลไม้ เค้กวันเกิดตามธีม เพ้นท์หน้า กลิตเตอร์แทททู กิจกรรมศิลปะและงานประดิษฐ์ ดูแลตลอดช่วงงาน และบัตรกำนัลเล่นฟรี 1 ชั่วโมงสำหรับเด็กแต่ละคน\nแพ็กเกจนี้ไม่ใช่แบบส่วนตัว คาเฟ่ยังเปิดให้บริการลูกค้าท่านอื่นตามปกติ ค่าปิดสถานที่ 5,000 ฿ ฟรีสำหรับงาน 20 คนขึ้นไป\nมัดจำ 50% ราคายังไม่รวม VAT 7% และค่าธรรมเนียมพนักงาน 1,000 ฿ ซึ่งยกเลิกได้ตอนชำระเงินหากไม่พอใจบริการ\nเพิ่มเติมได้: ตกแต่ง 2,500 ฿ โชว์มายากล (30 นาที) 6,000 ฿ แอนิเมเตอร์ (1 ชั่วโมง) 6,000 ฿ ช่างภาพ (1 ชั่วโมง) 6,000 ฿ เครื่องทำฟองสบู่ 1,000 ฿ ซุ้มป๊อปคอร์น 1,500 ฿",
} as const;

/**
 * Прежние тексты, которые скрипт вправе заменить: из seed (март 2026) и
 * после правки НДС (prisma/fix-laridea-vat-2026-11.ts). Всё остальное —
 * правка из админки, её не трогаем.
 */
export const LARIDEA_BIRTHDAY_PREVIOUS = {
  minGuests: [5],
  notes: [
    "«Little Joy» — от 946 ฿ за ребёнка (от 5 детей, 2 часа)\n«Happy Moments» — 1 166 ฿ (от 10 детей)\n«Magic Day» — 1 496 ฿ (от 10 детей, 4 часа, приватная игровая)\nДепозит 50%, цены включают VAT. Допы: декор, фотограф, шоу.",
    "«Little Joy» — от 946 ฿ за ребёнка (от 5 детей, 2 часа)\n«Happy Moments» — 1 166 ฿ (от 10 детей)\n«Magic Day» — 1 496 ฿ (от 10 детей, 4 часа, приватная игровая)\nДепозит 50%, к ценам добавляется НДС 7%. Допы: декор — 2 500 ฿, фотограф — 6 000 ฿, шоу фокусов — 6 000 ฿.",
  ],
  notesEn: [
    "“Little Joy” — from 946 ฿ per child (from 5 kids, 2 hours)\n“Happy Moments” — 1,166 ฿ (from 10 kids)\n“Magic Day” — 1,496 ฿ (from 10 kids, 4 hours, private playground)\n50% deposit, prices include VAT. Add-ons: decor, photographer, show.",
    "“Little Joy” — from 946 ฿ per child (from 5 kids, 2 hours)\n“Happy Moments” — 1,166 ฿ (from 10 kids)\n“Magic Day” — 1,496 ฿ (from 10 kids, 4 hours, private playground)\n50% deposit; 7% VAT is added to the prices. Add-ons: decorations — 2,500 ฿, photographer — 6,000 ฿, magic show — 6,000 ฿.",
  ],
  notesTh: [
    "«Little Joy» — เริ่มต้น 946 ฿ ต่อเด็กหนึ่งคน (ตั้งแต่ 5 คน 2 ชั่วโมง)\n«Happy Moments» — 1 166 ฿ (ตั้งแต่ 10 คน)\n«Magic Day» — 1 496 ฿ (ตั้งแต่ 10 คน 4 ชั่วโมง สนามเด็กเล่นส่วนตัว)\nมัดจำ 50% ราคารวม VAT แล้ว เพิ่มเติมได้: ตกแต่ง ช่างภาพ โชว์",
    "«Little Joy» — เริ่มต้น 946 ฿ ต่อเด็กหนึ่งคน (ตั้งแต่ 5 คน 2 ชั่วโมง)\n«Happy Moments» — 1 166 ฿ (ตั้งแต่ 10 คน)\n«Magic Day» — 1 496 ฿ (ตั้งแต่ 10 คน 4 ชั่วโมง สนามเด็กเล่นส่วนตัว)\nมัดจำ 50% ราคายังไม่รวม VAT 7% เพิ่มเติมได้: ตกแต่ง 2,500 ฿ ช่างภาพ 6,000 ฿ โชว์มายากล 6,000 ฿",
  ],
} as const;
