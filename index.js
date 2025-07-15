const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());
app.use(express.static('public')); // <-- Quan trọng để Zalo đọc file xác thực!

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

app.get("/", (req, res) => res.send("OK"));

app.listen(process.env.PORT || 8080);

