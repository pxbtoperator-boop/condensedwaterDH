name: Tự động dọn dẹp Firebase
on:
  schedule:
    - cron: '0 0 * * 0' # Chạy vào 00:00 mỗi Chủ Nhật
  workflow_dispatch: # Cho phép bạn bấm nút chạy thử thủ công

jobs:
  delete-old-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cài đặt Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Cài đặt thư viện firebase-admin
        run: npm install firebase-admin
      - name: Chạy lệnh xóa dữ liệu cũ
        run: node auto_delete.js
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
