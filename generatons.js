import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { showProgress, transformId, transformImages } from "./utils.js";

let cars = [];

export async function parseGenerations() {
  // MODELS
  // read file with models
  const models = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.models, "utf8");
      console.log("Models have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading models", err);
    }
  };

  // GENS
  // await models
  const modelsResponse = await models();
  const modelsLength = modelsResponse.models.length;

  // fetch gens function
  const fetchGeneration = async (model) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.GENERATION_URL_1 + model + ENV.GENERATION_URL_2)
        .then((res) => {
          if (res?.data) {
            if (res.data?.length) {
              const addedModelsToGen = res.data.reduce(
                (acc, rec) => [
                  ...acc,
                  { ...transformId(transformImages(rec)), model_slug: model },
                ],
                [],
              );
              cars.push(...addedModelsToGen);

              return resolve(addedModelsToGen);
            } else {
              return resolve();
            }
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error(
            "Error while fetching generation, model is ",
            model,
            err,
          );
          reject(err);
        });
    });
  };

  // fetch gens loop

  const { bar } = showProgress(Number(modelsLength), "Fetching generations");

  for await (const model of modelsResponse.models) {
    await fetchGeneration(model.slug);

    bar.tick();
  }

  return await fs.promises.writeFile(
    PATHS.generations,
    JSON.stringify({ generations: cars }, null, 2),
    () => {
      console.log("Generations are fetched. Saved to " + PATHS.generations);

      return cars;
    },
  );
}
