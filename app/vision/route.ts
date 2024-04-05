import OpenAI from "openai";

export const runtime = "edge";
export const dynamic = "force-dynamic";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const imageBase64 = body.imageBase64;

  if (!imageBase64) {
    return new Response("Missing imageBase64", { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Is there anything contextual about where I am or what I see?",
          },
          {
            type: "image_url",
            image_url: {
              detail: "low",
              url: `${imageBase64}`,
            },
          },
        ],
      },
    ],
  });

  if (completion.choices.length === 0) {
    return new Response("No completion", { status: 500 });
  }

  if (completion.choices[0].message.content === "NULL") {
    return new Response("", { status: 200 });
  }

  return new Response(JSON.stringify(completion.choices[0]), { status: 200 });
}

const prompt = `\
You are helping a visually impaired person understand the world around them. \
Your response will be turned to speech so use as few words as possible. \
You receive an image from a camera feed. Return any relevant message to the user about this image. \
If there is nothing important, return "NULL"`;
