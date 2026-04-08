const admin = require('firebase-admin');

// Bạn cần lấy file mã bí mật từ Firebase (mình sẽ hướng dẫn ở dưới)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-condensed-water-dh-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const SIX_MONTHS_AGO = Date.now() - (180 * 24 * 60 * 60 * 1000);

async function deleteOldData() {
  const ref = db.ref('his'); // Hoặc 'flow/his' tùy cấu hình của bạn
  const snapshot = await ref.once('value');
  
  if (!snapshot.exists()) return console.log("Không có dữ liệu.");

  const dates = snapshot.val();
  for (const dateStr in dates) {
    const dateTimestamp = new Date(dateStr).getTime();
    if (dateTimestamp < SIX_MONTHS_AGO) {
      console.log(`Đang xóa dữ liệu ngày: ${dateStr}`);
      await db.ref(`his/${dateStr}`).remove();
    }
  }
  process.exit();
}

deleteOldData();
