# DAILY

DAILY — mustaqil, tezkor va minimalist messenger platformasi uchun web MVP prototipi. Ushbu repository real-time messenger ekotizimining frontend asosiy tajribasini ko‘rsatadi: chatlar ro‘yxati, qidiruv, suhbat, xabar yuborish, profil va contact info paneli.

## Ishga tushirish

```bash
npm install
npm run dev
```

Production build va TypeScript tekshiruvi:

```bash
npm run lint
npm run build
```

## Keyingi arxitektura yo‘nalishi

To‘liq DAILY ekotizimi uchun backend alohida modular NestJS servislariga, PostgreSQL/Prisma ma’lumotlar qatlamiga, Redis presence/cache qatlamiga va Socket.IO real-time gateway’lariga ajratiladi. Flutter mobil ilovasi shu REST + WebSocket API’ni iste’mol qiladi. Ushbu frontend hozircha local mock data bilan ishlaydi va keyingi API integratsiyasi uchun UI qatlamini tayyorlaydi.

## Asosiy texnologiyalar

- React + TypeScript + Vite
- Lucide icons
- Responsive web layout
- Light, premium DAILY branding
- Mock chat state va local message sending
