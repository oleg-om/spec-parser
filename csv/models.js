import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS } from "../config.js";
import { Buffer } from "node:buffer";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "models";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

export async function modifyModelsAndExportToCsv() {
  const file = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.models, "utf8");
      console.log(name + " have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading " + name, err);
    }
  };

  const { models } = await file();

  const dataToCsv = models
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((item) => {
      return {
        id: item.id.toString(),
        is_active: "1",
        title: item.title,
        slug: item.slug,
        brand_slug: item.brand_slug,
        items_count: item.itemsCount.toString(),
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
