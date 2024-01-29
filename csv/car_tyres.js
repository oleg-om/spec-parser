import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS, RANGES } from "../config.js";
import { Buffer } from "node:buffer";
import {flatten, objectToString} from "../utils.js";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "car_tyres";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

const temp = [];
export async function modifyTyresAndExportToCsv() {
  const getFile = async (range) => {
    try {
      const file = PATHS.tyres + "_" + range + ".json";
      const data = await fs.promises.readFile(file, "utf8");
      temp.push(...JSON.parse(data).sizes);

      return;
    } catch (err) {
      console.error("Error while reading " + name, err);
    }
  };

  for await (const range of RANGES) {
    await getFile(range);
  }

  // PROCESS DATA


  const sizesToCsv = (data) => {
    return data.reduce((acc, rec) => {
      // remove modification_slug
      const obj = { ...rec };
      const { modification_slug } = obj;
      delete rec.modification_slug;

      // stringify sizes
      const stringifySizes = (sizes) => {
        // display.log('-->', size)
        return sizes.map((s) => s.title).join("|");
      };

      // stringify object
      const simplifyStructure = (ob) => {
        return Object.entries(ob).map(([key, value]) => flatten(value.sizes));
      };

      // rename types
      const withTypes = Object.fromEntries(
        Object.entries(rec).map(([key, value]) => [
          `${key}_tyres`,
          stringifySizes(flatten(simplifyStructure(value))),
        ]),
      );

      withTypes.modification_slug = modification_slug;
      withTypes.diameters =
        Object.entries(rec)
          .map(([key, value]) => {
            if (key === "factory")
              return Object.entries(value).map((d) => {
                return d[0];
              });
          })
          .filter((it) => !!it)[0]
          ?.join("|") || null;

      if (!withTypes.tuning_tyres) {
        withTypes.tuning_tyres = null;
      }

      return [...acc, objectToString(withTypes)];
    }, []);
  };
  // PROCESS DATA

  const dataToCsv = sizesToCsv(temp);

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(dataToCsv);
  const filename = `assets/csv/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  return await fs.promises.writeFile(filename, csvBuffer, () => {
    console.log(name + " are converted to CSV. Saved to " + filename);
  });
}
