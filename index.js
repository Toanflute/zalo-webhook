const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/", (req, res) => {
    const data = req.body;
    console.log("Webhook nhận:", JSON.stringify(data));

    // Luôn trả về 200 ngay lập tức cho Zalo
    res.sendStatus(200);

    // Xử lý song song, không cần đợi
    if (!data.message || !data.sender) return;

    const zalo_id = data.sender.id;
    const message = data.message.text || "";
    const time = new Date().toISOString();

    fetch("https://script.google.com/macros/s/AKfycbxwKOOAr__ljV6n2LrLYWIvaclFKNYBw-CuOiKv_Tjz1gMx6LWrjGhF4V8It7zfTj0ieA/exec", {
        method: "POST",
        body: JSON.stringify({ zalo_id, message, time }),
        headers: { "Content-Type": "application/json" }
    })
    .then(() => console.log(`Đã gửi ${message} của user ${zalo_id} lên Google Sheets.`))
    .catch((error) => console.error("Lỗi gửi Google Sheets:", error));
});

app.get("/", (req, res) => res.send("Webhook Zalo - OK!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
