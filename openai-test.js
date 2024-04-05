import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

import sharp from "sharp";
const imagePath = "public/Test1.png";
async function getImageDescription(imagePath) {
  try {
    // Read the image file and convert it to base64
    const imageBuffer = await sharp(imagePath).png().toBuffer();
    const imageBase64 = imageBuffer.toString("base64");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                detail: "low",
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });
    // Now you can use the imageBase64 in your function as required
    // ...
    return completion.choices[0];
  } catch (error) {
    console.error(`Error processing image: ${error}`);
    throw error;
  }
}
//getImageDescription(imagePath);
