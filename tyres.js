import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { showProgress } from "./utils.js";

let cars = [];

export async function parseTyres() {
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

  // fetch tyre sizes function
  const fetchTyres = async (modification) => {
    return new Promise((resolve, reject) => {
      return axios
        .get(ENV.TYRE_URL_1 + modification + ENV.TYRE_URL_2)
        .then((res) => {
          if (res?.data && res?.data?.data) {
            const addedModToTyres = {
              modification_slug: modification,
              ...res.data.data,
            };
            cars.push(addedModToTyres);

            return resolve(addedModToTyres);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error("Error while fetching tyre sizes", err);
          reject(err);
        });
    });
  };

  // fetch gens loop

  const { bar } = showProgress(
    Number(modificationsLength),
    "Fetching tyre sizes",
  );

  for await (const modification of modificationsResponse.modifications) {
    await fetchTyres(modification.slug);

    bar.tick();
  }

  return await fs.promises.writeFile(
    PATHS.tyres,
    JSON.stringify({ sizes: cars }, null, 2),
    () => {
      console.log("Tyre sizes are fetched. Saved to " + PATHS.tyres);

      return cars;
    },
  );
}
