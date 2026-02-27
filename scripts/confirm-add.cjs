#!/usr/bin/env node

const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Do you want to git add . to stage formatted changes? (y/N) ",
  (answer) => {
    if (answer && answer.toLowerCase().startsWith("y")) {
      try {
        execSync("git add .", { stdio: "inherit" });
      } catch (err) {
        console.error("Failed to run git add .", err);
      }
    }
    rl.close();
  },
);
