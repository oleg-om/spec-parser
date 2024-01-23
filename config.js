import "dotenv/config";

export const PATHS = {
  brands_test: "assets/test.json",
  brands: "assets/brands.json",
  models: "assets/models.json",
  generations: "assets/generations.json",
  modifications: "assets/modifications.json",
  tyres: "assets/tyres.json",
  wheels: "assets/wheels.json",
  batteries: "assets/batteries.json",
};

export const ENV = {
  BRANDS_URL: process.env.BRANDS_URL,
  MODELS_URL: process.env.MODELS_URL,
  GENERATION_URL_1: process.env.GENERATION_URL_1,
  GENERATION_URL_2: process.env.GENERATION_URL_2,
  MODIFICATION_URL_1: process.env.MODIFICATION_URL_1,
  MODIFICATION_URL_2: process.env.MODIFICATION_URL_2,
  TYRE_URL_1: process.env.TYRE_URL_1,
  TYRE_URL_2: process.env.TYRE_URL_2,
  WHEEL_URL: process.env.WHEEL_URL,
  BATTERY_URL: process.env.BATTERY_URL,
};
