// Moves projects from complete-app/small-project to the five categories and sets
// isOpenSource from the GitHub link. Safe to run twice.
//
//   node scripts/migrate-project-categories.mjs           preview only
//   node scripts/migrate-project-categories.mjs --apply   write the changes
//
// Reads MONGODB_URI from .env.local.
import mongoose from "mongoose";

const CATEGORIES = {
  "full-stack": ["dokany", "geotrack", "crop-yield-prediction", "movie-site"],
  backend: ["paynest", "natours-api"],
  library: ["egypt-natid"],
  mobile: ["movie-app", "ecommerce-mobile-app"],
  frontend: [
    "react-ecommerce",
    "electronics-store",
    "family-tree",
    "ice-cream-website",
    "todo-list",
    "furniro-landing-page",
  ],
};

const apply = process.argv.includes("--apply");
const categoryBySlug = new Map(
  Object.entries(CATEGORIES).flatMap(([category, slugs]) => slugs.map((slug) => [slug, category])),
);

process.loadEnvFile(".env.local");
await mongoose.connect(process.env.MONGODB_URI, { dbName: "portfolio" });
const projects = mongoose.connection.db.collection("projects");
const rows = await projects.find({}).sort({ order: 1 }).toArray();

const unmapped = rows.map(({ slug }) => slug).filter((slug) => !categoryBySlug.has(slug));
const missing = [...categoryBySlug.keys()].filter((slug) => !rows.some((row) => row.slug === slug));
if (unmapped.length > 0 || missing.length > 0) {
  console.error("Stopped, nothing was written.", { unmapped, missing });
  await mongoose.disconnect();
  process.exit(1);
}

const changes = rows.map((row) => ({
  slug: row.slug,
  before: `${row.category} oss=${row.isOpenSource ?? "unset"}`,
  category: categoryBySlug.get(row.slug),
  isOpenSource: Boolean(row.links?.github),
  live: Boolean(row.links?.demo),
  team: Boolean(row.isTeamProject),
}));

if (apply) {
  await Promise.all(
    changes.map(({ slug, category, isOpenSource }) =>
      projects.updateOne({ slug }, { $set: { category, isOpenSource } }),
    ),
  );
}

console.table(
  changes.map(({ slug, before, category, isOpenSource, live, team }) => ({
    slug,
    before,
    after: `${category} oss=${isOpenSource}`,
    live,
    team,
  })),
);
console.log(apply ? `Updated ${changes.length} projects.` : "Preview only. Add --apply to write.");
await mongoose.disconnect();
