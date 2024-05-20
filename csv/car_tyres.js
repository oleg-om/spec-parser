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

        const tyresList = sizes.map((size) => {
          return size.reduce((acc, rec) => {
            return [...acc, rec.map((it) => it.title).join(':')];
          },[]).join("|");
        });
        return tyresList.join("|");
      };

      // stringify object
      const simplifyStructure = (ob) => {
        // console.log('ob', Object.entries(ob).map(([key, value]) => flatten(value.sizes)))
        return Object.entries(ob).map(([key, value]) => value.sizes);
      };

      // rename types
      const withTypes = Object.fromEntries(
        Object.entries(rec).map(([key, value]) => [
          `${key}_tyres`,
          stringifySizes((simplifyStructure(value))),
        ]),
      );

      withTypes.modification_slug = modification_slug;

      withTypes.diameters =
        Object.entries(rec)
          .map(([key, value]) => {
            return Object.keys(value)
          })

      if (withTypes.diameters?.length) {
        withTypes.diameters = [...new Set([...new Set(withTypes.diameters)].join(',').split(','))].join('|')
      }



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
