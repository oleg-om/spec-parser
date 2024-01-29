import fs from "fs";
import { PATHS } from "./config.js";
import { downloadImage, showProgress } from "./utils.js";

let cars = [];

export async function parseImages(from, to) {
  // GENERATIONS
  // read file with generations
  const generations = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.generations, "utf8");
      console.log("Generations have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading generations", err);
    }
  };

  // MODIFICATIONS
  // await modifications
  const generationsResponse = await generations();

  const sliced = generationsResponse.generations.slice(from, to);

  const generationsLength = sliced.length;

  // fetch gens loop

  const { bar } = showProgress(
    Number(generationsLength),
    `Downloading images from ${from} to ${to}`,
  );

  for await (const generation of sliced) {
    const { image } = generation;

    const imageId = image?.imageId;

    console.log("IMAGE: ", image, generation.slug);

    if (imageId && image?.presets?.default && image?.presets?.preview) {
      await downloadImage(image.presets.default, `${imageId}-default.png`);
      await downloadImage(image.presets.preview, `${imageId}-preview.png`);
    }

    bar.tick();
  }
}
