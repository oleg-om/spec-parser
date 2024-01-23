import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { showProgress } from "./utils.js";

let cars = [];

export async function parseBatteries() {
  // MODIFICATIONS
  // read file with modifications
  const modifications = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.modifications, "utf8");
      console.log("Modifications have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading modifications", err);
    }
  };

  // MODIFICATIONS
  // await modifications
  const modificationsResponse = await modifications();
  const modificationsLength = modificationsResponse.modifications.length;

  // fetch wheel batteries function
  const fetchBatteries = async (modification) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.BATTERY_URL + modification)
        .then((res) => {
          if (res?.data) {
            const addedModToBatteries = {
              modification_slug: modification,
              data: res.data,
            };
            cars.push(addedModToBatteries);

            return resolve(addedModToBatteries);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error("Error while fetching battery sizes", err);
          reject(err);
        });
    });
  };

  // fetch gens loop

  const { bar } = showProgress(
    Number(modificationsLength),
    "Fetching battery sizes",
  );

  for await (const modification of modificationsResponse.modifications) {
    await fetchBatteries(modification.slug);

    bar.tick();
  }

  return await fs.promises.writeFile(
    PATHS.batteries,
    JSON.stringify({ sizes: cars }, null, 2),
    () => {
      console.log("Batteries sizes are fetched. Saved to " + PATHS.batteries);

      return cars;
    },
  );
}
