const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

// Konfigurasi CORS untuk mengizinkan domain spesifik
const corsOptions = {
  origin: "https://my-portfolio-v-1-2.vercel.app", // Ganti dengan domain yang diizinkan
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Aktifkan middleware CORS dengan opsi
const port = process.env.PORT || 3001;
const url = process.env.MONGODB_URL;
const dbName = "contact";

app.use(express.json());

app.post("/user", async (req, res) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Koneksi Berhasil");

    const db = client.db(dbName);
    const newUser = {
      name: req.body.name,
      phone: req.body.phone,
    };

    const insertResult = await db.collection("user").insertOne(newUser);
    res.status(201).json({
      message: "Dokumen baru berhasil disisipkan",
      userId: insertResult.insertedId,
    });
  } catch (error) {
    console.error("Koneksi Gagal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
