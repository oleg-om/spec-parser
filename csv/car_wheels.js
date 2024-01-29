import { mkConfig, generateCsv, asString } from "export-to-csv";
import fs from "fs";
import { PATHS, RANGES } from "../config.js";
import { Buffer } from "node:buffer";
import { flatten, objectToString, showProgress } from "../utils.js";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const name = "car_wheels";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name });

const temp = [];
export async function modifyWheelsAndExportToCsv() {
  const getFile = async (range) => {
    try {
      const file = PATHS.wheels + "_" + range + ".json";
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
  const { bar } = showProgress(Number(length), `Processing wheels / ` + length);

  // PROCESS DATA

  const sizesToCsv = (data) => {
    return data.reduce((acc, rec) => {
      // remove modification_slug
      const obj = { ...rec };
      const { modification_slug } = obj;
      delete rec.modification_slug;

      const modified = obj.kits.map((kit) => {
        const { frontAxle, backAxle } = kit;
        return objectToString({
          modification_slug,
          group_label: kit?.groupLabel || null,
          kit: kit?.kit ? 1 : 0,
          factory: kit?.factory ? 1 : 0,
          front_axle_title: frontAxle?.title || null,
          front_axle_diameter: frontAxle.params.diameter,
          front_axle_pn: frontAxle.params.pn,
          front_axle_pcd: frontAxle.params.pcd,
          front_axle_width_min: frontAxle.params.widthMin,
          front_axle_width_max: frontAxle.params.widthMax,
          front_axle_et_min: frontAxle.params.etMin,
          front_axle_et_max: frontAxle.params.etMax,
          front_axle_co_min: frontAxle.params.coMin,
          front_axle_co_max: frontAxle.params.coMax,
          back_axle_title: backAxle?.title || null,
          back_axle_diameter: backAxle.params.diameter,
          back_axle_pn: backAxle.params.pn,
          back_axle_pcd: backAxle.params.pcd,
          back_axle_width_min: backAxle.params.widthMin,
          back_axle_width_max: backAxle.params.widthMax,
          back_axle_et_min: backAxle.params.etMin,
          back_axle_et_max: backAxle.params.etMax,
          back_axle_co_min: backAxle.params.coMin,
          back_axle_co_max: backAxle.params.coMax,
        });
      });

      bar.tick();

      return [...acc, ...modified];
    }, []);
  };
  // PROCESS DATA

  const dataToCsv = flatten(sizesToCsv(temp));

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const filename = (num) => `assets/csv/${csvConfig.filename}_${num}.csv`;
  // 1
  const csv_1 = generateCsv(csvConfig)(dataToCsv.slice(0, 30000));
  const csv_2 = generateCsv(csvConfig)(dataToCsv.slice(30000, 60000));
  const csv_3 = generateCsv(csvConfig)(dataToCsv.slice(60000, 90000));
  const csv_4 = generateCsv(csvConfig)(dataToCsv.slice(90000, 120000));

  const csvBuffer = (csvData) => new Uint8Array(Buffer.from(asString(csvData)));

  await fs.promises.writeFile(filename(1), csvBuffer(csv_1), () => {
    console.log(name + " are converted to CSV. Saved to " + filename(1));
  })

  await fs.promises.writeFile(filename(2), csvBuffer(csv_2), () => {
    console.log(name + " are converted to CSV. Saved to " + filename(2));
  })

  await fs.promises.writeFile(filename(3), csvBuffer(csv_3), () => {
    console.log(name + " are converted to CSV. Saved to " + filename(3));
  })

  await fs.promises.writeFile(filename(4), csvBuffer(csv_4), () => {
    console.log(name + " are converted to CSV. Saved to " + filename(4));
  })
}
