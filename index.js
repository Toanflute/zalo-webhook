const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Nhận tin nhắn từ Zalo webhook
app.post("/", async (req, res) => {
    const data = req.body;
    console.log("Webhook nhận:", JSON.stringify(data));  // Ghi log ra Render để bạn dễ kiểm tra

    if (!data.message || !data.sender) {
        console.log("Dữ liệu không hợp lệ, bỏ qua.");
        return res.sendStatus(200);
    }

    const zalo_id = data.sender.id;
    const message = data.message.text || "";
    const time = new Date().toISOString();

    // ĐÂY LÀ LINK GOOGLE APPS SCRIPT BẠN CUNG CẤP
    await fetch("https://script.google.com/macros/s/AKfycbxwKOOAr__ljV6n2LrLYWIvaclFKNYBw-CuOiKv_Tjz1gMx6LWrjGhF4V8It7zfTj0ieA/exec", {
        method: "POST",
        body: JSON.stringify({ zalo_id, message, time }),
        headers: { "Content-Type": "application/json" }
    });

    console.log(`Đã gửi ${message} của user ${zalo_id} lên Google Sheets thành công.`);

    res.sendStatus(200);
});

// Check trang chủ xem còn sống
app.get("/", (req, res) => res.send("Webhook Zalo - OK!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
