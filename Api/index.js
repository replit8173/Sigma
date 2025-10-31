import { writeFileSync, readFileSync, existsSync } from "fs";

const DB_FILE = "/tmp/db.json"; // file tạm

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      let data = [];

      if (existsSync(DB_FILE)) {
        data = JSON.parse(readFileSync(DB_FILE, "utf-8"));
      }

      data.unshift(body);
      if (data.length > 20) data = data.slice(0, 20);

      writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      return res.status(200).json({ ok: true, message: "Data received!" });
    } catch (err) {
      return res.status(400).json({ error: "Invalid data", details: err.message });
    }
  } else if (req.method === "GET") {
    if (existsSync(DB_FILE)) {
      const data = JSON.parse(readFileSync(DB_FILE, "utf-8"));
      return res.status(200).json(data);
    } else {
      return res.status(200).json({ message: "No data yet" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
