import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { showProgress, transformId } from "./utils.js";

let cars = [];

export async function parseModifications(from, to) {
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
  const sliced = generationsResponse.generations.slice(from, to);
  const generationsLength = sliced.length;

  // fetch modifications function
  const fetchGeneration = async (gen) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.MODIFICATION_URL_1 + gen + ENV.MODIFICATION_URL_2)
        .then((res) => {
          if (res?.data && res?.data) {
            if (res.data?.length) {
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
              return resolve();
            }
          } else {
            console.log("ERROR: gen is ", gen, ", data: ", res.data);
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
    `Fetching modifications from ${from} to ${to}`,
  );

  for await (const generation of sliced) {
    await fetchGeneration(generation.slug);

    bar.tick();
  }

  const fileName = `${PATHS.modifications}_${from}_${to}.json`;

  return await fs.promises.writeFile(
    fileName,
    JSON.stringify({ modifications: cars }, null, 2),
    () => {
      console.log("Modifications are fetched. Saved to " + fileName);

      return cars;
    },
  );
}
