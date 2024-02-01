import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS, RANGES } from "../config.js";
import { Buffer } from "node:buffer";
import { objectToString } from "../utils.js";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "modifications";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

const temp = [];
export async function modifyModificationsAndExportToCsv() {
  const getFile = async (range) => {
    try {
      const file = PATHS.modifications + "_" + range + ".json";
      const data = await fs.promises.readFile(file, "utf8");
      temp.push(...JSON.parse(data)[name]);

      return;
    } catch (err) {
      console.error("Error while reading " + name, err);
    }
  };

  for await (const range of RANGES) {
    await getFile(range);
  }

  const dataToCsv = temp
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((item) => {
      const obj = { ...item };
      delete obj["itemsCount"];
      delete obj["releaseYearStart"];
      delete obj["releaseYearEnd"];
      delete obj["engineType"];
      delete obj["engineTypeText"];
      delete obj["engineDisplacement"];
      delete obj["hpFrom"];
      delete obj["hpTo"];
      delete obj["uuid"];

      return objectToString({
        ...obj,
        id: item.id,
        items_count: item.itemsCount,
        release_year_start: item.releaseYearStart,
        release_year_end: item.releaseYearEnd,
        engine_type: item.engineType,
        engine_type_text: item.engineTypeText,
        engine_displacement: item.engineDisplacement?.toFixed(1) || "",
        hp_from: item.hpFrom,
        hp_to: item.hpTo,
        kw: item.kw,
        hp_title:
          item.hpFrom && item.hpTo
            ? item.hpFrom === item.hpTo
              ? `${item.hpFrom} л.с.`
              : `${item.hpFrom} - ${item.hpTo} л.с.`
            : "",
        is_active: 1,
      });
    });

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(dataToCsv);
  const filename = `assets/csv/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  return await fs.promises.writeFile(filename, csvBuffer, () => {
    console.log(name + " are converted to CSV. Saved to " + filename);
  });
}
