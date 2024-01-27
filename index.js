const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = 2000;

// Ambil informasi kredensial Supabase dari variabel lingkungan
const supabaseUrl = process.env.BASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Buat klien Supabase
const supabase = createClient(process.env.BASE_URL, process.env.SUPABASE_KEY);

// Aktifkan Cross-Origin Resource Sharing (CORS) untuk aplikasi
app.use(cors());

// Parse permintaan JSON yang masuk
app.use(express.json());

// Rute

// Dapatkan semua data mahasiswa
app.get("/mahasiswa", async (req, res) => {
  try {
    // Ambil data dari Supabase menggunakan Axios
    const response = await axios.get(`${supabaseUrl}/rest/v1/mahasiswa`, {
      headers: {
        apikey: supabaseKey,
        "Content-Type": "application/json",
      },
    });

    console.log("Response dari Supabase:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error mengambil data mahasiswa:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Tambahkan mahasiswa baru
app.post("/mahasiswa", async (req, res) => {
  try {
    // Kirim permintaan POST untuk menambahkan data ke Supabase
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/mahasiswa`,
      req.body,
      {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response dari Supabase:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error menambahkan mahasiswa:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Hapus mahasiswa berdasarkan ID
app.delete("/mahasiswa/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Kirim permintaan DELETE untuk menghapus data dari Supabase
    const response = await axios.delete(
      `${supabaseUrl}/rest/v1/mahasiswa?id=eq.${id}`,
      {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error menghapus mahasiswa:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Perbarui mahasiswa berdasarkan ID
app.put("/mahasiswa/:id", async (req, res) => {
  const mahasiswaId = req.params.id;

  try {
    // Gunakan klien Supabase untuk memperbarui data
    const { data, error } = await supabase
      .from("mahasiswa")
      .update(req.body)
      .eq("id", mahasiswaId)
      .select();

    if (error) {
      console.error(
        `Error memperbarui mahasiswa dengan ID ${mahasiswaId}:`,
        error
      );
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Response dari Supabase:", data);
      res.json(data);
    }
  } catch (error) {
    console.error(
      `Error memperbarui mahasiswa dengan ID ${mahasiswaId}:`,
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
