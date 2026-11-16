// Veri dosyasını başlangıç (seed) verisine sıfırlar: npm run seed
const { resetToSeed, DATA_FILE } = require('./store');

resetToSeed();
console.log(`Veriler başlangıç durumuna döndürüldü: ${DATA_FILE}`);
