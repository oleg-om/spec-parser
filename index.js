import { parseGenerations } from "./generatons.js";
import { parseModels } from "./models.js";
import { parseBrands } from "./brands.js";
import { parseModifications } from "./modifications.js";
import { parseImages } from "./images.js";
import { parseTyres } from "./tyres.js";
import { parseWheels } from "./wheels.js";
import { parseBatteries } from "./batteries.js";
import { modifyBrandsAndExportToCsv } from "./csv/brands.js";
import { modifyModelsAndExportToCsv } from "./csv/models.js";
import { modifyGensAndExportToCsv } from "./csv/generations.js";
import { modifyModificationsAndExportToCsv } from "./csv/modifications.js";
import { modifyTyresAndExportToCsv } from "./csv/car_tyres.js";
import { modifyWheelsAndExportToCsv } from "./csv/car_wheels.js";
import { modifyBatteriesAndExportToCsv } from "./csv/car_batteries.js";

(async () => {
  // await parseBrands();
  //
  // await parseModels();
  //
  // await parseGenerations();
  //
  // await parseImages(0, 500);
  // await parseImages(500, 1000);
  // await parseImages(1000, 1500);
  // await parseImages(1500, 2000);
  // await parseImages(2000, 2500);
  // await parseImages(2500, 3000);
  // await parseImages(3000, 3500);
  // await parseImages(3500, 4000);
  //
  // await parseModifications(0, 1000);
  // await parseModifications(1000, 2000);
  // await parseModifications(2000, 3000);
  // await parseModifications(3000, 4000);
  //
  // await parseTyres('0_1000');
  // await parseTyres('1000_2000');
  // await parseTyres('2000_3000');
  // await parseTyres('3000_4000');
  //
  // await parseWheels('0_1000');
  //  await parseWheels('1000_2000');
  // await parseWheels('2000_3000');
  // await parseWheels('3000_4000');
  //
  // await parseBatteries('0_1000');
  // await parseBatteries('1000_2000');
  // await parseBatteries('2000_3000');
  // await parseBatteries('3000_4000');
  //
  // await modifyBrandsAndExportToCsv();
  // await modifyModelsAndExportToCsv();
  // await modifyGensAndExportToCsv();
  // await modifyModificationsAndExportToCsv();
  // await modifyTyresAndExportToCsv();
  // await modifyWheelsAndExportToCsv();
  await modifyBatteriesAndExportToCsv();

  console.log("Everything is done!");
})();
