const fs = require("fs");
const path = require("path");

const packageFile = path.join(process.cwd(), "ios", "App", "CapApp-SPM", "Package.swift");
if (!fs.existsSync(packageFile)) process.exit(0);

const source = fs.readFileSync(packageFile, "utf8");
const normalized = source.replace(/(path:\s*")([^"]+)(")/g, (_, before, value, after) => (
  `${before}${value.replace(/\\/g, "/")}${after}`
));

if (normalized !== source) fs.writeFileSync(packageFile, normalized);
