import { parseGenerations } from "./generatons.js";
import { parseModels } from "./models.js";
import { parseBrands } from "./brands.js";
import { parseModifications } from "./modifications.js";
import { parseImages } from "./images.js";
import { parseTyres } from "./tyres.js";
import { parseWheels } from "./wheels.js";
import { parseBatteries } from "./batteries.js";

(async () => {
  await parseBrands();
  await parseModels();
  await parseGenerations();
  await parseImages();
  await parseModifications();
  await parseTyres();
  await parseWheels();
  await parseBatteries();
  console.log('Everything is done!')
})();
