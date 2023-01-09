import axios from 'axios';

// Extracts duration from youtube video without google api
export async function fetchYoutubeStats(songID) {
	const response = await axios(`https://www.youtube.com/watch?v=${songID}`);
	const html = await response.data;
	const durationMs = html.split('"approxDurationMs":"')[1].split(`","audioSampleRate`)[0];
	const title = html.split('<title>')[1].split(` - YouTube</title>`)[0];
	return {duration: durationMs, title: title};
}
