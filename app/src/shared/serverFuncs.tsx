import axios from "axios";

export async function SendSkipSong() {
  try {
    await axios.get('skip');
  } catch (error) {
    console.log(error);
  }
}