import cors from "cors";
import express from "express";
import { getGameOnline, getOnlineFixGames } from "./src/api.js";

const app = express();
app.use(cors());
const port = 3000;

app.get("/online/:id", async (req, res) => {
	res.send(await getGameOnline(req.params.id));
});

app.get("/onlineFix", async (req, res) => {
	res.send(await getOnlineFixGames());
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
