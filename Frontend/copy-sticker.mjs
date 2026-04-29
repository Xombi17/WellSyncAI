import { copyFileSync } from 'fs';
const src = 'C:/Users/SRUSHTI/.gemini/antigravity/brain/ba7d6d53-815d-4b7a-a1cf-b894945ee1b9/happy_rural_family_sticker_1777472834871.png';
const dst = 'c:/Users/SRUSHTI/OneDrive/Desktop/TISD/WellSyncAI/Frontend/public/images/landing/family-sticker.png';
try {
    copyFileSync(src, dst);
    console.log('Success');
} catch (e) {
    console.error(e);
}
