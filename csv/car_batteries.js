import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS, RANGES } from "../config.js";
import { Buffer } from "node:buffer";
import { flatten, objectToString, showProgress } from "../utils.js";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "car_batteries";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

const temp = [];
export async function modifyBatteriesAndExportToCsv() {
  const getFile = async (range) => {
    try {
      const file = PATHS.batteries + "_" + range + ".json";
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

  // progress
  const length = temp.length;
  const { bar } = showProgress(
    Number(length),
    `Processing batteries / ` + length,
  );

  // PROCESS DATA

  const sizesToCsv = (data) => {
    return data.reduce((acc, rec) => {
      // remove modification_slug
      const obj = { ...rec };
      const { modification_slug } = obj;
      delete rec.modification_slug;

      const modified = obj.data.map((kit) => {
        const {
          type_case,
          type_cleat,
          polarity,
          capacity,
          length,
          width,
          height,
        } = kit;
        return objectToString({
          modification_slug,
          appointment: kit.appointment,
          start_stop: kit.start_stop ? 1 : 0,
          is_factory: kit.is_factory ? 1 : 0,
          type_case: type_case.value,
          type_case_id: type_case.id,
          type_cleat: type_cleat.value,
          type_cleat_id: type_cleat.id,
          polarity: polarity.value,
          polarity_id: polarity.id,
          capacity_min: capacity.min,
          capacity_max: capacity.max,
          length_min: length.min,
          length_max: length.max,
          width_min: width.min,
          width_max: width.max,
          height_min: height.min,
          height_max: height.max,
          grouped_params: kit.groupedParams,
        });
      });

      bar.tick();

      return [...acc, ...modified];
    }, []);
  };
  // PROCESS DATA

  const dataToCsv = flatten(sizesToCsv(temp));

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(dataToCsv);
  const filename = `assets/csv/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  return await fs.promises.writeFile(filename, csvBuffer, () => {
    console.log(name + " are converted to CSV. Saved to " + filename);
  });
}
