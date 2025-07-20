// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: 'application/json',
  };
  const model = 'gemini-2.5-flash-preview-05-20';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Write a two different script for 30 seconds video on Topic : Ghibli style , . Give me response in JSON format and follow the schema -{ scripts : [ { content : " }, ], } 

`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Developing Video Script Topics**

I've decided to tackle "Sustainable Living Tips" as the overarching theme for these scripts. Now, I'm focusing on crafting two distinct concepts, ensuring each packs a punch within the 30-second timeframe. The goal is to make them both informative and engaging.


**Drafting Video Outlines**

I've sketched a preliminary outline for both video scripts. Script 1 is centered on quick, actionable steps, while Script 2 targets a specific area of sustainable living for viewers to start with. I'm focusing on crafting clear calls to action and ensuring each script conveys an impactful message.


**Outlining Video Concepts**

I've moved on to the structure of the video scripts. I've sketched two distinct narratives. Script 1 focuses on quick, actionable steps anyone can take right now. Script 2 delves into a specific area to help viewers start their sustainable journey. I am aiming for clear calls to action in both concepts.


`,
        },
        {
          text: `\`\`\`json
{
  "scripts": [
    {
      "content": "Script 1: Topic - Sustainable Living Tips.\\n\\n(Scene: Upbeat music, quick cuts of everyday actions.)\\n\\nVOICEOVER: (Energetic, friendly tone) Ever wondered how to live greener without a complete lifestyle overhaul? It's easier than you think!\\n\\n(Scene: Person refilling a reusable water bottle, then using a fabric shopping bag.)\\n\\nVOICEOVER: Tip one: Ditch single-use plastics! Carry a reusable water bottle and coffee cup, and always bring your own shopping bags.\\n\\n(Scene: Person unplugging a charger, then turning off a light, then a quick shot of a plant.)\\n\\nVOICEOVER: Tip two: Save energy at home. Unplug electronics when not in use, switch to LED bulbs, and embrace natural light. Small changes, big impact!\\n\\n(Scene: Logo for 'Green Living Now' appears with a website/social media handle.)\\n\\nVOICEOVER: Start your sustainable journey today! Your planet will thank you. #GoGreen #SustainableTips"
    },
    {
      "content": "Script 2: Topic - Sustainable Living Tips.\\n\\n(Scene: Calming music, shots of nature and then close-ups of sustainable products.)\\n\\nVOICEOVER: (Calm, thoughtful tone) Our planet needs us. But what truly makes a difference in our daily lives?\\n\\n(Scene: Hand sorting recycling, then a person choosing a bulk food item.)\\n\\nVOICEOVER: It starts with conscious consumption. Think before you buy: Do you really need it? Can you choose reusable or pre-loved items instead? Support local and bulk options to reduce waste.\\n\\n(Scene: Person tending to a small home garden, then a shot of solar panels or a wind turbine.)\\n\\nVOICEOVER: Another key: Reduce your carbon footprint. Consider plant-based meals more often and look into energy-efficient appliances. Every choice empowers change.\\n\\n(Scene: Text on screen: 'Make a Difference. Live Sustainably.')\\n\\nVOICEOVER: Be part of the solution. Live consciously, live sustainably. Learn more at [YourOrganizationName].com."
    }
  ]
}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `Write a two different script for 30 seconds video on Topic : Ghibli style , . Give me response in JSON format and follow the schema -{ scripts : [ { content : " }, ], }
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Considering Ghibli Style**

I'm focusing on the Ghibli style, especially the sense of wonder. I'm imagining how to make mundane scenes feel extraordinary, capturing that magical essence. The 30-second scripts need to reflect this, incorporating the aesthetic and themes of Ghibli films.


**Refining Script Concepts**

I'm now honing script ideas, aiming to encapsulate Ghibli's essence within 30 seconds. One centers on a character's simple act in nature, infusing everyday tasks with wonder. The other will explore themes of flight and discovery, perhaps a child's imagination taking wing. I'm prioritizing sensory details like light, sound, and movement to convey a magical atmosphere.


**Formulating Visual Concepts**

I'm developing initial visual concepts for the two scripts. For the first, I'm envisioning soft morning light and a young character interacting with nature, highlighting sensory details. The second focuses on a character's quiet exploration of a natural environment, emphasizing simple pleasures and discovery. I'm focusing on framing each scene for impact within a 30-second timeframe, ensuring the Ghibli feeling pervades the visuals. I plan to use a combination of simple yet intricate animation to evoke the style. I'm carefully selecting sound effects and music that underscore the Ghibli vibe.


**Drafting Initial Concepts**

I'm now refining the drafts. For Script 1, I'm adjusting the visuals to better convey the essence of quiet wonder. I've re-imagined Script 2, aiming for more concise visuals to fit the 30-second timeframe, including playful sounds. I am considering the overall pacing and flow to fit within the time frame, and I am exploring variations in the audio components. I want to convey both scripts as impactful and heartwarming.


**Finalizing Visual Cues**

I've revised the visuals, emphasizing concise shots to fit the 30-second window.  The focus is now on capturing evocative details with vibrant descriptions, ensuring each frame feels like a scene from a Ghibli film. The sound cues remain integral, aiming to create a blend of music and sound effects that is evocative and impactful. The visual elements have now been sharpened with a detailed, cinematic approach.


**Polishing Visual Storytelling**

I've revised the visuals, giving even more emphasis to sensory details, such as light and texture, creating a distinctively Ghibli atmosphere in the scripts. I focused on building simple, impactful moments in both scripts, ensuring the feeling of quiet, peaceful discovery comes across with the use of light and space. I'm focusing on the characters as a means to connect to the viewer.


**Conceptualizing Visual Flow**

I'm now focusing on a more granular approach. Script 1 will be about small moments. I'm imagining how to make the tea ritual feel intimate and extraordinary. For Script 2, I'm adjusting shot lengths, focusing on movement and transitions for that sense of adventure and discovery in the limited timeframe. I am now refining the music choice to ensure a fitting Ghibli feel, with music cues and sound cues carefully aligned.


`,
        },
        {
          text: `\`\`\`json
{
  "scripts": [
    {
      "content": "Script 1: Topic - Ghibli Style (Everyday Magic)\\n\\n(Scene: Soft, early morning light filters through a window, illuminating dust motes dancing in the air. Gentle, whimsical piano music begins. SFX: Distant birdsong, a soft breeze.)\\n\\nVISUAL: A pair of bare feet step onto a worn wooden floor. Close-up on hands carefully pouring hot water into a chipped, beautifully decorated teacup. Steam rises delicately, swirling like a small cloud.\\n\\nVISUAL: A tiny, vibrant flower on the windowsill slowly unfurls a petal in an almost magical way. A small, curious bird perches just outside, chirping softly, its head tilted.\\n\\nVISUAL: The character (seen from behind, or just their silhouette) holds the teacup, taking a slow, deep breath. A single, sun-dappled leaf drifts gently past the window, as if guided by an unseen hand.\\n\\nVISUAL: Close-up on the character’s hand, gently touching the warm teacup, a sense of profound peace radiating from them. The light shimmers around them.\\n\\n(Music swells slightly, then fades out gently with the last visual.)\\n\\n(Duration: 30 seconds)"
    },
    {
      "content": "Script 2: Topic - Ghibli Style (Forest Discovery)\\n\\n(Scene: Upbeat, yet gentle and adventurous string and flute music begins. SFX: Rustling leaves, distant stream sounds.)\\n\\nVISUAL: A young character (e.g., a curious child or teen) stands at the edge of a dense, sun-dappled forest, eyes wide with wonder as they gaze into the shadows.\\n\\nVISUAL: They step onto a path of fallen leaves, which crunch softly beneath their worn shoes. Quick cuts: a perfectly formed, dewy mushroom, sunlight dappling through high canopies, a tiny snail slowly making its way across a mossy rock.\\n\\nVISUAL: The character rounds a bend, revealing a hidden, crystal-clear stream, sparkling brilliantly. A small, glowing dust sprite (or similar tiny, fantastical creature) briefly flits past the frame, almost unseen, adding a touch of magic. SFX: A subtle 'twinkle'.\\n\\nVISUAL: The character reaches out, hesitantly touching the cool, clear water, then looks up at the towering trees, a gentle smile spreading across their face – as if they’ve found a long-lost secret. The forest feels alive around them.\\n\\n(Music swells to a hopeful peak, then fades out with the final peaceful visual.)\\n\\n(Duration: 30 seconds)"
    }
  ]
}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
} 
main();