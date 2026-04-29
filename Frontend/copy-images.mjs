import { copyFileSync } from 'fs';
const src = 'C:/Users/SRUSHTI/.gemini/antigravity/brain/ba7d6d53-815d-4b7a-a1cf-b894945ee1b9/';
const dst = 'c:/Users/SRUSHTI/OneDrive/Desktop/TISD/WellSyncAI/Frontend/public/images/landing/';
const files = [
  ['hero_vaccination_1777467130673.png', 'hero-vaccination.png'],
  ['medical_tech_1777467146255.png', 'medical-tech.png'],
  ['vaccine_vials_1777467254006.png', 'vaccine-vials.png'],
  ['family_health_1777467366424.png', 'family-health.png'],
  ['medical_elements_1777467381177.png', 'medical-elements.png'],
  ['health_monitoring_1777467556602.png', 'health-monitoring.png'],
];
files.forEach(f => {
  copyFileSync(src + f[0], dst + f[1]);
  console.log('Copied: ' + f[1]);
});
