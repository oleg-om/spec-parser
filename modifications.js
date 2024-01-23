import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { showProgress, transformId } from "./utils.js";

let cars = [];

export async function parseModifications() {
  // GENERATIONS
  // read file with generations
  const generations = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.generations, "utf8");
      console.log("Models have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading models", err);
    }
  };

  // MODIFICATIONS
  // await modifications
  const generationsResponse = await generations();
  const generationsLength = generationsResponse.generations.length;

  // fetch modifications function
  const fetchGeneration = async (gen) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.MODIFICATION_URL_1 + gen + ENV.MODIFICATION_URL_2)
        .then((res) => {
          if (res?.data && res?.data?.length) {
            const addedGenToMods = res.data.reduce(
              (acc, rec) => [
                ...acc,
                { ...transformId(rec), generation_slug: gen },
              ],
              [],
            );
            cars.push(...addedGenToMods);

            return resolve(addedGenToMods);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error("Error while fetching modification", err);
          reject(err);
        });
    });
  };

  // fetch gens loop

  const { bar } = showProgress(
    Number(generationsLength),
    "Fetching modifications",
  );

  for await (const generation of generationsResponse.generations) {
    await fetchGeneration(generation.slug);

    bar.tick();
  }

  return await fs.promises.writeFile(
    PATHS.modifications,
    JSON.stringify({ modifications: cars }, null, 2),
    () => {
      console.log("Modifications are fetched. Saved to " + PATHS.modifications);

      return cars;
    },
  );
}
