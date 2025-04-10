import axios from "axios";
import * as cheerio from "cheerio";
import { drizzle } from "drizzle-orm/postgres-js";
import iconv from "iconv-lite";
import postgres from "postgres";
import { gamesTable } from "./db/schema.js";

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

export async function getGameOnline(id) {
	const { data } = await axios.get(`https://steamcharts.com/app/${id}`);
	const $ = cheerio.load(data);

	const [currentOnline, peakOnlineToday, allTimePeakOnline] =
		$(".app-stat .num").toArray();

	const [, avgPlayer, gain, gainPercent, peakPlayers] = $(
		".common-table tbody tr",
	)
		.first()
		.children()
		.toArray();

	return JSON.stringify({
		currentOnline: $(currentOnline).text(),
		peakOnlineToday: $(peakOnlineToday).text(),
		allTimePeakOnline: $(allTimePeakOnline).text(),
		avgPlayer: $(avgPlayer).text(),
		gain: $(gain).text(),
		gainPercent: $(gainPercent).text(),
		peakPlayers: $(peakPlayers).text(),
	});
}

function extractName(title) {
	const networkPart = " по сети";

	const name = title.trim();
	if (name.endsWith(networkPart)) {
		return name.slice(0, name.length - networkPart.length);
	}

	return name;
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getOnlineFixGames() {
	const games = [];
	const maxPages = 74;

	for (let index = 1; index <= maxPages; index++) {
		const { data } = await axios.get(`https://online-fix.me/page/${index}`, {
			responseType: "arraybuffer",
		});

		const $ = cheerio.load(iconv.decode(data, "win1251"));

		const pageGames = $(".news .article")
			.toArray()
			.map((el) => {
				return {
					link: $(el).find(".big-link").attr("href") ?? "",
					name: extractName($(el).find(".title").text()),
				};
			});

		games.push(...pageGames);

		if (index < maxPages) {
			await delay(1000);
		}
	}

	return games;
}

export async function addGame() {
	const games = await getOnlineFixGames();

	await db.insert(gamesTable).values(games);
	console.log("New games created!");
}
