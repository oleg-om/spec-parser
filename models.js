import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import { ENV, PATHS } from "./config.js";
import { showProgress, transformId } from "./utils.js";
import ProgressBar from "progress";

let cars = [];

export async function parseModels() {
  // BRANDS
  // read file with brands
  const brands = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.brands, "utf8");
      console.log("Brands have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading brands", err);
    }
  };

  // MODELS
  // await brands
  const brandsResponse = await brands();
  const brandsLength = brandsResponse.brands.length;

  // fetch models function
  const fetchModel = async (brand) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.MODELS_URL + brand + ".json")
        .then((res) => {
          if (res?.data && res?.data?.length) {
            const addedBrandsToModel = res.data.reduce(
              (acc, rec) => [
                ...acc,
                { ...transformId(rec), brand_slug: brand },
              ],
              [],
            );
            cars.push(...addedBrandsToModel);

            return resolve(addedBrandsToModel);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error("Error while fetching model", err);
          reject(err);
        });
    });
  };

  // fetch models loop

  const { bar } = showProgress(Number(brandsLength), "Fetching models");

  for await (const brand of brandsResponse.brands) {
    await fetchModel(brand.slug);

    bar.tick();
  }

  return await fs.promises.writeFile(
    PATHS.models,
    JSON.stringify({ models: cars }, null, 2),
    () => {
      console.log("Models are fetched. Saved to " + PATHS.models);

      return cars;
    },
  );
}
