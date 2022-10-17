import axios from "axios";

export async function SendSkipSong() {
  try {
    await axios.get('skip');
  } catch (error) {
    console.log(error);
  }
}

export async function SendAddSong(songName: string) {
  try {
    await axios.get(`/play/${songName}`);
  } catch (error) {
    console.log(error);
  }
}