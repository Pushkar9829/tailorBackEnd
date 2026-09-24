import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { seedDemo } from "./data/demoSeed.js";

const app = createApp();

connectDatabase()
  .then((mode) => seedDemo().then((seeded) => {
    console.log(`Demo data: ${seeded.patterns} patterns, ${seeded.jobs} orders`);
    return mode;
  }))
  .then((mode) => {
    app.listen(env.port, () => {
      console.log(`Pattern API on http://localhost:${env.port} (${mode})`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
