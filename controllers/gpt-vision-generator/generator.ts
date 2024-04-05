import { History } from "../audio-engine/history";

export class GPTVisionGenerator {
  history: History<string> = new History(5);
  constructor() {}

  async generate() {
    const image = sessionStorage.getItem("image");
    if (!image) {
      console.error("No image found in session storage");
      return null;
    }
    const data = await fetch("/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: image,
        history: this.history.getArray(),
      }),
    }).then((response) => response.json());

    if (!data) {
      console.error("No data returned from vision endpoint");
      return null;
    }

    if (data.message.content.length < 10) {
      console.error("Vision response too short", data);
      return null;
    }

    this.history.add(data.message.content);

    return data as {
      message: {
        content: string;
      };
    };
  }
}
