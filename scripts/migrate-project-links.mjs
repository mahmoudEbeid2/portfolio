// Moves project links from { demo, github, other } to one ordered list. Safe to run twice.
//
//   node scripts/migrate-project-links.mjs           preview only
//   node scripts/migrate-project-links.mjs --apply   write the changes
//
// Reads MONGODB_URI from .env.local.
import mongoose from "mongoose";

const apply = process.argv.includes("--apply");

function otherType(url) {
  if (url.includes("github.com")) return "github";
  if (url.includes("postman.com")) return "api";
  return "other";
}

function toList({ demo, github, other = [] }) {
  const links = [
    ...(demo ? [{ label: "Live demo", url: demo, type: "demo", variant: "primary" }] : []),
    ...(github ? [{ label: "GitHub", url: github, type: "github", variant: "secondary" }] : []),
    ...other.map(({ label, url }) => ({
      label: label || "Link",
      url,
      type: otherType(url),
      variant: "secondary",
    })),
  ];
  return links.map((link, order) => ({ ...link, group: "", order }));
}

process.loadEnvFile(".env.local");
await mongoose.connect(process.env.MONGODB_URI, { dbName: "portfolio" });
const projects = mongoose.connection.db.collection("projects");
const rows = await projects.find({}).sort({ order: 1 }).toArray();

const pending = rows.filter(({ links }) => !Array.isArray(links));

if (apply) {
  await Promise.all(
    pending.map(({ _id, links }) => projects.updateOne({ _id }, { $set: { links: toList(links) } })),
  );
}

for (const { slug, links } of pending) {
  console.log(`\n${slug}`);
  console.log(`  before: ${JSON.stringify(links)}`);
  for (const { order, label, type, variant, url } of toList(links)) {
    console.log(`  ${order}. ${label} [${type}/${variant}] ${url}`);
  }
  if (toList(links).length === 0) console.log("  (no links)");
}

console.log(
  apply ? `\nUpdated ${pending.length} projects.` : "\nPreview only. Add --apply to write.",
);
await mongoose.disconnect();
