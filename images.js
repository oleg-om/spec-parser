import fs from "fs";
import { PATHS } from "./config.js";
import { downloadImage, showProgress } from "./utils.js";


let cars = [];

export async function parseImages() {
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
  const generationsLength = generationsResponse.generations.length;

  // fetch gens loop

  const { bar } = showProgress(Number(generationsLength), "Downloading images");

  for await (const generation of generationsResponse.generations) {
    const { image } = generation;
    const { imageId } = image;

    await downloadImage(image.presets.default, `${imageId}-default.png`);
    await downloadImage(image.presets.preview, `${imageId}-preview.png`);

    bar.tick();
  }
}
