const express = require("express");
const fetch = require("node-fetch");
const path = require("path"); // Thêm path để xử lý thư mục public chính xác

const app = express();

// Cho phép truy cập file tĩnh từ thư mục public (chứa file xác minh Zalo)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post("/", async (req, res) => {
    const data = req.body;
    if (!data.message || !data.sender) return res.sendStatus(200);

    const zalo_id = data.sender.id;
    const message = data.message.text || "";
    const time = new Date().toISOString();

    await fetch("https://script.google.com/macros/s/AKfycbxwKOOAr__ljV6n2LrLYWIvaclFKNYBw-CuOiKv_Tjz1gMx6LWrjGhF4V8It7zfTj0ieA/exec", {
        method: "POST",
        body: JSON.stringify({ zalo_id, message, time }),
        headers: { "Content-Type": "application/json" }
    });

    res.sendStatus(200);
});

// Đường dẫn kiểm tra cho Render hoạt động
app.get("/", (req, res) => res.send("Webhook Zalo - OK!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
