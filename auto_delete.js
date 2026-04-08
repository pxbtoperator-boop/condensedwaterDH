const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-condensed-water-dh-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const SIX_MONTHS_AGO = Date.now() - (180 * 24 * 60 * 60 * 1000);

// Hàm quét và xóa cho từng thư mục
async function cleanPath(path) {
    console.log(`Đang quét thư mục: ${path}...`);
    const snapshot = await db.ref(path).once('value');
    
    if (!snapshot.exists()) {
        console.log(`-> Thư mục ${path} không có dữ liệu.`);
        return;
    }
    
    const dates = snapshot.val();
    let deletedCount = 0;
    for (const dateStr in dates) {
        const dateTimestamp = new Date(dateStr).getTime();
        // Nếu ngày đó cũ hơn 6 tháng thì xóa
        if (dateTimestamp < SIX_MONTHS_AGO) {
            console.log(`-> Đang xóa dữ liệu cũ ngày: ${dateStr}`);
            await db.ref(`${path}/${dateStr}`).remove();
            deletedCount++;
        }
    }
    if (deletedCount === 0) {
        console.log(`-> Dữ liệu chưa đủ 6 tháng tuổi. Không xóa gì cả.`);
    }
}

// Chạy luồng chính
async function main() {
    try {
        await cleanPath('his');
        await cleanPath('flow/his');
        console.log("Hoàn tất quét dữ liệu!");
    } catch (error) {
        console.error("Gặp lỗi trong quá trình quét:", error);
    } finally {
        // Đóng kết nối Firebase và tắt Bot
        console.log("Đóng kết nối Firebase và tắt Bot.");
        await admin.app().delete(); 
        process.exit(0); 
    }
}

main();
