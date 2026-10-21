# Сбор 21.10.2026 — какие места и занятия добавлены

Всего **125 мест и 91 занятие**. Волна 1 — 115 мест и 90 занятий (центр, Джомтьен, Наклуа + находки по русским, английским, тайским источникам и Facebook, плюс оставшиеся кандидаты отбора Overture). Волна 2 — 10 мест и 1 занятие (Восточная Паттайя, Хуай Яй, Нонг Пруэ, Банг Сарай).

**Состояние.** 21.10 все записи опубликованы на сайте для проверки (`prisma/publish-harvest-2026-10.ts`). В Telegram они не уходят: в журнале автопостинга записаны «без отправки». Откат всего сбора — одной командой:

```bash
npx tsx --env-file=.env prisma/publish-harvest-2026-10.ts --revert --write
```

Если карточку одобрить для канала по одной, сначала удалить её строку из журнала автопостинга (таблица `TelegramPost`), иначе она считается уже опубликованной.

**Пометки:** ⚠ — уверенность низкая, проверить (детские группы или формат не подтверждены); 🐾 — место с животными, формат — решение за вами. В описании каждой карточки — служебная пометка «[черновик]» с тем, что известно, и источниками: её заменяют настоящим описанием.

Данные: `prisma/places/harvest-2026-10.ts`, `prisma/programs/harvest-2026-10.ts` (волна 1), те же файлы с `-b` (волна 2). Более ранние черновики (отбор Overture, 10–12.10) — `prisma/places/overture-batch-*.ts`, `prisma/programs/overture-batch-1.ts`.

## Волна 1

### Места (115)

**Аттракционы, музеи, спорт и прочее** (51)

- ⚠ [Active Kids Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/active-kids-farm)
- ⚠ [Annethong Public Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/annethong-public-park)
- ⚠ [Bang Saray Public Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bang-saray-public-park)
- ⚠ [Bann Thai Food Museum](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bann-thai-food-museum)
- ⚠ [Big Robot Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/big-robot-pattaya)
- ⚠ [Bira Go Kart Circuit](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bira-go-kart-circuit)
- ⚠ [Chalerm Rajakumari Public Library](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/chalerm-rajakumari-library-naklua)
- ⚠ [Chaloem Phra Kiat Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/chaloem-phra-kiat-park)
- ⚠ [Chill at the Hill](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/chill-at-the-hill-skatepark)
- ⚠ [Daddy Hug Farm & Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/daddy-hug-farm-cafe)
- ⚠ [Duck Square Skate Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/duck-square-skate-park)
- [E-Gokart (Terminal 21)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/e-gokart-terminal-21)
- ⚠ [Escape Room Thailand](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/escape-room-thailand-central)
- ⚠ [Fairy Sweet Village](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/fairy-sweet-village)
- ⚠ [Farm & Friends](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/farm-and-friends-na-jomtien)
- ⚠ [Flower Land](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/flower-land-pattaya)
- ⚠ [Fun City (Central Pattaya)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/fun-city-central-pattaya)
- ⚠ [Jomtien Fishing Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/jomtien-fishing-park)
- [JungleKart Off-Road Go-Karting](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/junglekart-off-road)
- ⚠ [Ka-Ting-Lai Skatepark](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/ka-ting-lai-skatepark)
- ⚠ [KiDs Meow Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/kids-meow-cafe)
- [Legend Siam](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/legend-siam)
- ⚠ [Level3 Hub](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/level3-hub)
- ⚠ [Mercury Cat Coffee](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/mercury-cat-coffee)
- ⚠ [Midori Melon Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/midori-melon-farm)
- [Mini Golf Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/mini-golf-pattaya)
- ⚠ [Naklua Chalermprakiat Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/naklua-chalermprakiat-park)
- ⚠ [Nexustriad](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/nexustriad)
- [PADO Media Art Space](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pado-media-art-space)
- ⚠ [Pattaya Art Museum](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-art-museum)
- ⚠ [Pattaya City Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-city-park-chaiyaphruek)
- ⚠ [Pattaya City Public Library](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-city-public-library)
- ⚠ [Pattaya Floating Market](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-floating-market)
- ⚠ [Pattaya Water Space](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-water-space)
- ⚠ [Pet and Play Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pet-and-play-cafe)
- ⚠ [Phornprapha Botanic Garden](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/phornprapha-botanic-garden)
- ⚠ [Pinn Kid's Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pinn-kids-club)
- [Piya Silpakarn Art Gallery](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/piya-silpakarn-art-gallery)
- ⚠ [Public Park Soi Chaiyapruek 4](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/public-park-chaiyapruek-4)
- ⚠ [Queen Sirikit Health Garden](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/queen-sirikit-health-garden)
- ⚠ [Skatepark Under the Bridge](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/skatepark-under-the-bridge)
- [Space & Time Cube](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/space-time-cube-central-pattaya)
- ⚠ [Sunplay Club Bangsaray](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/sunplay-club-bangsaray)
- ⚠ [Tarzan Trail Adventure Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/tarzan-trail-horseshoe-point)
- [Thai Wake Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/thai-wake-park-pattaya)
- ⚠ [The Backyard Pumptrack](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/backyard-pumptrack)
- [The Sanctuary of Truth](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/sanctuary-of-truth)
- ⚠ [The Wave Bowl](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/the-wave-bowl)
- ⚠ [Wasana Family Lake](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/wasana-family-lake)
- [Wisdom Skate Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/wisdom-skate-park)
- ⚠ [Wonder Space](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/wonder-space-pattaya)

**С животными** (38)

- 🐾 [Animal Paradise Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/animal-paradise-cafe)
- ⚠ 🐾 [Bang Lamung Wildlife Breeding Station](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bang-lamung-wildlife-breeding-station)
- 🐾 [Capybara Coffee](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/capybara-coffee-pattaya)
- 🐾 [Cat Meow 4289](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/cat-meow-4289)
- 🐾 [Cat Sky Bar Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/cat-sky-bar-cafe)
- ⚠ 🐾 [Chang Siam Zoo](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/chang-siam-zoo)
- ⚠ 🐾 [Chang Thai Thappraya Safari](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/chang-thai-thappraya-safari)
- ⚠ 🐾 [Creep&Crawl Snake Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/creep-crawl-snake-cafe)
- 🐾 [Dog Club Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/dog-club-pattaya)
- ⚠ 🐾 [Dog'C Blog Felicita](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/dogc-blog-felicita)
- ⚠ 🐾 [Farm Kratai Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/farm-kratai-pattaya)
- ⚠ 🐾 [Fox Haus (Twenty Twenty Fox)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/fox-haus-bang-saray)
- 🐾 [Great & Grand Sweet Destination](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/great-grand-sweet-destination)
- 🐾 [Hong Hong Dog Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/hong-hong-dog-cafe)
- ⚠ 🐾 [Khao Chi Chan Elephant Village](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/khao-chi-chan-elephant-village)
- 🐾 [Le Refuge Cafe & Animal Sanctuary](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/le-refuge-pattaya)
- ⚠ 🐾 [Little Fields](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/little-fields-pattaya)
- 🐾 [Loftbit Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/loftbit-park)
- ⚠ 🐾 [Maine Coon Cat Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/maine-coon-cat-cafe-pattaya)
- ⚠ 🐾 [Mini Zoo Na Jomtien](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/mini-zoo-na-jomtien)
- ⚠ 🐾 [Mongchang Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/mongchang-cafe)
- 🐾 [Narak Pets Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/narak-pets-cafe)
- ⚠ 🐾 [Nine Rabbit House Cafe by Legend Siam](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/nine-rabbit-house-cafe)
- ⚠ 🐾 [OnlyDogs](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/onlydogs-cafe)
- ⚠ 🐾 [Pa Thip Sheep Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pa-thip-sheep-farm)
- ⚠ 🐾 [Pattaya Elephant Village](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-elephant-village)
- ⚠ 🐾 [Pattaya Snake Show](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pattaya-snake-show)
- ⚠ 🐾 [Pettopia Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pettopia-cafe)
- ⚠ 🐾 [Pixmie Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pixmie-cafe-bang-saray)
- ⚠ 🐾 [RABBiT Café](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/rabbit-cafe-na-jomtien)
- 🐾 [Sunshine Cat Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/sunshine-cat-cafe)
- 🐾 [Swiss Sheep Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/swiss-sheep-farm-pattaya)
- ⚠ 🐾 [Thaithani Cultural Village & Elephant](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/thaithani-cultural-village)
- ⚠ 🐾 [The Lunar Beach House](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/lunar-beach-house)
- ⚠ 🐾 [VOID café & hub](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/void-cafe-hub)
- 🐾 [Wind of Heaven Horse Riding Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/wind-of-heaven-horse-riding)
- ⚠ 🐾 [Wonder Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/wonder-farm-bang-saray)
- ⚠ 🐾 [Zhao Wei Cat Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/zhao-wei-cat-cafe)

**Кафе** (15)

- [Art Studio Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/art-studio-cafe-boonsampan)
- ⚠ [Bambini Baby Center](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bambini-baby-center)
- ⚠ [BumbleBee Cafe & Gallery](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bumblebee-cafe-gallery)
- ⚠ [Ice-nee Bingsu & Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/ice-nee-bingsu-cafe)
- [Miffy's Voyage Café](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/miffys-voyage-cafe)
- ⚠ [Nazzy Kids Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/nazzy-kids-cafe)
- ⚠ [Outback Sports Bar & Restaurant](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/outback-mabprachan)
- [Pa Boon Cafe 5](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/pa-boon-cafe-5)
- [Picnic Ground Cafe & BBQ](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/picnic-ground-cafe)
- [Rain Forest Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/rain-forest-cafe-pattaya)
- [Slowride Coffee & Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/slowride-coffee-cafe)
- ⚠ [Suan Banjong x Bunny Shake Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/bunny-shake-cafe)
- [The Chalet Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/the-chalet-cafe)
- [Tigertoys Cafe](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/tigertoys-cafe)
- [À La Campagne](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/a-la-campagne-na-jomtien)

**Площадки и парки** (5)

- ⚠ [Ban Amphur Beach](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/ban-amphur-beach)
- ⚠ [Greta Resort & Sport Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/greta-resort-sport-club)
- ⚠ [Jomtien Night Market](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/jomtien-night-market)
- [Nongprue Public Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/nongprue-public-park)
- ⚠ [Spielplatz (Jomtien)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/spielplatz-playground-jomtien)

**Крытые игровые** (5)

- [Coco Play](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/coco-play-beach-road)
- [Funtasea Kid's World (Royal Cliff)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/funtasea-kids-world-royal-cliff)
- ⚠ [Games — playroom for children](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/games-playroom-jomtien)
- [Holiday Inn Kids Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/holiday-inn-kids-club)
- ⚠ [Tanoshii Playground](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/tanoshii-playground)

**Аквапарки** (1)

- ⚠ [Splashdown Action Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/splashdown-action-park)

### Занятия (90)

**Единоборства** (20)

- ⚠ [Global Taekwondo Federation — тхэквондо](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/global-taekwondo-federation)
- [Hansoo Gym — тхэквондо (PK Residents)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/hansoo-gym-pk-residents)
- [Hansoo Gym — тхэквондо (Toongklom-Talman)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/hansoo-gym-toongklom-talman)
- ⚠ [Kru Ped Muay Thai Gym — муай-тай](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kru-ped-muay-thai-gym)
- [Mavinn Muay Thai — детский класс](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/mavinn-muay-thai-pattaya)
- ⚠ [Mixfight Pattaya — бокс](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/mixfight-pattaya)
- [Nova Fencing Academy — фехтование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/nova-fencing-academy)
- ⚠ [Pattaya TKD Team Training — тхэквондо](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pattaya-tkd-team-training)
- [Pesuso Martial Arts Academy — тхэквондо (Lotus North)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pesuso-taekwondo-lotus-north)
- ⚠ [Pesuso Taekwondo — Harbor Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pesuso-taekwondo-harbor)
- [Pesuso Taekwondo — Soi Siam Country Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pesuso-taekwondo-siam-country-club)
- ⚠ [Petchrungruang Gym — муай-тай](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/petchrungruang-gym)
- [Rangsiya Gym — тхэквондо](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/rangsiya-gym-taekwondo-boonsampan)
- [Rusich Club](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/rusich-club)
- [Sing Taekwondo Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/sing-taekwondo-pattaya)
- ⚠ [Sityodtong Muay Thai Camp](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/sityodtong-muay-thai-camp)
- [STC Monkeys Taekwondo](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/stc-monkeys-taekwondo)
- ⚠ [Sudsakorn Muay Thai Gym](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/sudsakorn-muay-thai-gym)
- [Thanita Martial Arts — тхэквондо](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/thanita-martial-arts-nong-prue)
- [Venum Training Camp — муай-тай и BJJ для детей](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/venum-training-camp-kids)

**Музыка** (16)

- ⚠ [Baan Pleng Pattaya Music & Art (บ้านเพลงพัทยา)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/baan-pleng-pattaya-music-art)
- ⚠ [Drumclub by Ahnon](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/drumclub-by-ahnon)
- [Goodsound — музыкальная студия](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/goodsound-music-studio)
- [KPN Music School Harbor Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kpn-music-school-harbor-pattaya)
- ⚠ [Lillini Music School (โรงเรียนสอนดนตรี ลิลลินิย์)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/lillini-music-school)
- ⚠ [Melody Harmony Music Studio](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/melody-harmony-music-studio)
- ⚠ [Music Drum School](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/music-drum-school)
- ⚠ [Ome Studio My Music](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/ome-studio-my-music)
- ⚠ [Patchy Guitar Studio](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/patchy-guitar-studio)
- ⚠ [Piano Class by Kru Namhom](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/piano-class-kru-namhom)
- [Playtune Music Studio](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/playtune-music-studio)
- ⚠ [Pun Piano Studio](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pun-piano-studio)
- ⚠ [Rongrian Son Rong Phleng Pattaya (โรงเรียนสอนร้องเพลงพัทยา)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/singing-school-pattaya)
- ⚠ [Somchai Dontri Thai Pattaya (สมชัยดนตรีไทย)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/somchai-dontri-thai-pattaya)
- ⚠ [The Pattaya Violin Centre](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pattaya-violin-centre)
- [Vienna Music Academy Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/vienna-music-academy-pattaya)

**Математика** (16)

- ⚠ [EnJoy Math Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/enjoy-math-pattaya)
- ⚠ [Happy Math Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/happy-math-pattaya)
- ⚠ [Imaxbrain](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/imaxbrain-pattaya)
- [Kumon Banglamung (Rong Po)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kumon-banglamung-rong-po)
- [Kumon Central Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kumon-central-pattaya)
- [Kumon Nakluea (FN Outlet)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kumon-nakluea-fn-outlet)
- [Kumon Pattaya Klang](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kumon-pattaya-klang)
- [Kumon Pattaya Soi Khao Talo](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kumon-pattaya-khao-talo)
- ⚠ [Levent Jintakanit Pattaya (เลอวองจินตคณิต)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/levent-jintakanit-pattaya)
- ⚠ [Math by Zen](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/math-by-zen)
- [Math Million Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/math-million-pattaya)
- [Math Talent by Dr.Ying](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/math-talent-dr-ying)
- ⚠ [Mathplus](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/mathplus-pattaya)
- [S.A.M Singapore Maths Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/sam-singapore-maths-pattaya)
- ⚠ [Smart Minds Academy](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/smart-minds-academy)
- ⚠ [Top One Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/top-one-pattaya)

**Рисование** (10)

- ⚠ [Above Academy](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/above-academy-pattaya)
- [Art School Pattaya (สอนศิลป์เมืองพัทยา)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/art-school-pattaya)
- [Artist Ace — рисование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/artist-ace-keha)
- ⚠ [Baan Cartoon Son Silp (บ้านการ์ตูนสอนศิลป์) — рисование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/baan-cartoon-art-school)
- ⚠ [Happen Enjoy Art School — рисование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/happen-enjoy-art-school)
- ⚠ [Healjai Art School](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/healjai-art-school)
- [One Day Art Studio — рисование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/one-day-art-studio)
- ⚠ [Salasil — керамика](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/salasil-pattaya)
- ⚠ [Suan Son Sin (สอนศิลปะ สวน สอน ศิลป์ พัทยา) — рисование](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/suan-son-sin-art)
- [Working Together — рисование для детей](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/working-together-art)

**Спортивные секции** (7)

- [ATT Pattaya Table Tennis Club — настольный теннис](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/att-table-tennis-pattaya)
- [Fast Pro Football Academy](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/fast-pro-football-academy)
- [Pattaya Archery Club — стрельба из лука](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pattaya-archery-club)
- [Planet Football Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/planet-football-pattaya)
- ⚠ [Primo Football Academy](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/primo-football-academy)
- [THATA Basketball Clinic — баскетбол](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/thata-basketball-clinic-pattaya)
- [Tos Tennis Academy](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/tos-tennis-academy)

**Языки** (5)

- ⚠ [Champ Language Center](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/champ-language-center-pattaya)
- ⚠ [English Planet Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/english-planet-pattaya)
- [Home Language School](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/home-language-school)
- ⚠ [Pattaya Tutor School](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pattaya-tutor-school)
- ⚠ [Pimsorn Baan Phasa](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/pimsorn-baan-phasa)

**Танцы** (3)

- ⚠ [Bangkok Dance Academy Pattaya](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/bangkok-dance-academy-pattaya)
- [Dance Studio Pattaya School — балет](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/dance-studio-pattaya-school)
- [Nareethip Dance School](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/nareethip-dance-school)

**Плавание** (3)

- ⚠ [JPS Pattaya Swim (Kru Nat) — плавание](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/jps-pattaya-swim)
- ⚠ [Junior Pattaya Swim — уроки плавания](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/junior-pattaya-swim-nong-pla-lai)
- ⚠ [Kru B — уроки плавания](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kru-b-swimming-nong-pla-lai)

**Без категории** (3)

- ⚠ [Regents International School — каникулярные лагеря](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/regents-pattaya-holiday-camps)
- ⚠ [The Ark Learning Centre](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/the-ark-learning-centre)
- ⚠ [Wisdom Camps — каникулярные лагеря](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/wisdom-camps-rugby-school)

**Гимнастика** (2)

- ⚠ [Center of Rhythmic Gymnastics — художественная гимнастика](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/center-of-rhythmic-gymnastics)
- ⚠ [Peace Gymnastics](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/peace-gymnastics-pattaya)

**Роботы и код** (2)

- [KIBERone — Sukhumvit](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kiberone-sukhumvit)
- [KIBERone — Thepprasit](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/kiberone-thepprasit)

**Раннее развитие** (2)

- [Phasook Playgroup](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/phasook-playgroup)
- [Rugby Rascals — плейгруппа (Rugby School Thailand)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/rugby-rascals-playgroup)

**Кулинария** (1)

- [A-Little Chef Cooking Studio — кулинария](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/a-little-chef-cooking-studio)

## Волна 2

### Места (10)

**Аттракционы, музеи, спорт и прочее** (5)

- ⚠ [Ban Chang Khon Thawee Sin (บ้านช่างโขนทวีศิลป์)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/ban-chang-khon-thawee-sin)
- ⚠ [Datsun & Nissan Museum](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/datsun-nissan-museum-pong)
- ⚠ [Koh Samae San Nature Museum (พิพิธภัณฑ์ธรรมชาติเกาะแสมสาร)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/koh-samae-san-nature-museum)
- ⚠ [Suriyaland](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/suriyaland)
- ⚠ [Viharn Sien (Anek Kusala Sala)](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/viharn-sien-anek-kusala-sala)

**С животными** (2)

- ⚠ 🐾 [Camp Chang Adventure Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/camp-chang-adventure-park)
- 🐾 [On Ground Cafe & Farm](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/on-ground-cafe-farm)

**Площадки и парки** (2)

- ⚠ [Khao Mai Kaeo Reservoir Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/khao-mai-kaeo-reservoir-park)
- ⚠ [Map Prachan Reservoir Park](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/map-prachan-reservoir-park)

**Крытые игровые** (1)

- ⚠ [Kid Soft Play](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/places/kid-soft-play-pattaya)

### Занятия (1)

**Спортивные секции** (1)

- [Royal Varuna Yacht Club — парусный спорт](https://pattaya-kids-guide-web.vercel.app/ru/pattaya/activities/royal-varuna-yacht-club)
