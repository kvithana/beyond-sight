export class GPTVisionGenerator {
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
      body: JSON.stringify({ imageBase64: image }),
    }).then((response) => response.json());

    return data as {
      message: {
        content: string;
      };
    };
  }
}
