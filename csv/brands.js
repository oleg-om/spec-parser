import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS } from "../config.js";
import { Buffer } from "node:buffer";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "brands",
  showColumnHeaders: true,
});

export async function modifyBrandsAndExportToCsv() {
  const file = async () => {
    try {
      const data = await fs.promises.readFile(PATHS.brands, "utf8");
      console.log("brands have been read");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error while reading brands", err);
    }
  };

  const { brands } = await file();

  const dataToCsv = brands
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((brand) => {
      return {
        id: brand.id.toString(),
        is_active: "1",
        items_count: brand.itemsCount.toString(),
        filename: `${brand.slug}.png`,
        slug: brand.slug,
        title: brand.title,
      };
    });

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(dataToCsv);
  const filename = `assets/csv/${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  return await fs.promises.writeFile(filename, csvBuffer, () => {
    console.log("Brands are converted to CSV. Saved to " + fileName);
  });
}
