import axios from "axios";
import fs from "fs";
import { ENV, PATHS } from "./config.js";
import { transformId } from "./utils.js";

export async function parseBrands() {
  // fetch brands function

  return new Promise(function (resolve, reject) {
    return axios
      .get(ENV.BRANDS_URL)
      .then(async (res) => {
        if (res?.data) {
          const modifiesBrands = res.data.reduce(
            (acc, rec) => [...acc, { ...transformId(rec) }],
            [],
          );

          await fs.writeFile(
            PATHS.brands,
            JSON.stringify(
              {
                brands: modifiesBrands,
              },
              null,
              2,
            ),
            () => {
              console.info(
                modifiesBrands.length +
                  " Brands are fetched. Saved to " +
                  PATHS.brands,
              );
              resolve();
            },
          );
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        console.error("Error while fetching brands", err);
        reject();
      });
  });
}
