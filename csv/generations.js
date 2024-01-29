import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS } from "../config.js";
import { Buffer } from "node:buffer";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "generations";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

export async function modifyGensAndExportToCsv() {
  const file = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.generations, "utf8");
      console.log(name + " have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading " + name, err);
    }
  };

  const { generations } = await file();

  const dataToCsv = generations.map((item) => {
    const obj = { ...item };
    delete obj["itemsCount"];
    delete obj["releaseYearStart"];
    delete obj["releaseYearEnd"];
    delete obj["isSubitemsOptional"];
    delete obj["image"];
    delete obj["uuid"];
    delete obj["uuid"];
    delete obj["imageId"]

    return {
      ...obj,
      id: obj.id.toString(),
      items_count: item.itemsCount.toString(),
      release_year_start: item.releaseYearStart.toString(),
      release_year_end: item.releaseYearEnd.toString(),
      is_subitems_optional: item.isSubitemsOptional ? "1" : "0",
      image_default: item.image?.presets?.default
        ? item.image?.imageId + "-default" + ".png"
        : null,
      image_preview: item.image?.presets?.preview
        ? item.image?.imageId + "-preview" + ".png"
        : null,
    };
  });

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(dataToCsv);
  const filename = `assets/csv/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  return await fs.promises.writeFile(filename, csvBuffer, () => {
    console.log(name + " are converted to CSV. Saved to " + filename);
  });
}
