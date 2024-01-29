import "dotenv/config";

export const PATHS = {
  brands_test: "assets/test.json",
  brands: "assets/brands.json",
  models: "assets/models.json",
  generations: "assets/generations.json",
  modifications: "assets/modifications",
  tyres: "assets/tyres",
  tyres_1: "assets/tyres_0_1000.json",
  tyres_2: "assets/tyres_1000_2000.json",
  tyres_3: "assets/tyres_2000_3000.json",
  tyres_4: "assets/tyres_3000_4000.json",
  wheels: "assets/wheels.json",
  wheels_1: "assets/wheels.json_0_1000.json",
  wheels_2: "assets/wheels.json_1000_2000.json",
  wheels_3: "assets/wheels.json_2000_3000.json",
  wheels_4: "assets/wheels.json_3000_4000.json",
  batteries: "assets/batteries.json",
  batteries_1: "assets/batteries.json_0_1000.json",
  batteries_2: "assets/batteries.json_1000_2000.json",
  batteries_3: "assets/batteries.json_2000_3000.json",
  batteries_4: "assets/batteries.json_3000_4000.json",
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

export const RANGES = ['0_1000','1000_2000', '2000_3000', '3000_4000']
