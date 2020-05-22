const packageSelect = require("./packageCheck");
const { spawn } = require("child_process");

const main = async () => {
  const { packages } = await packageSelect();
  packages.forEach((package) => {
    const buildProcess = spawn("node", [
      "scripts/tasks/childProcess.js",
      package,
    ]);
    buildProcess.stdout.addListener("data", (chunk) => {
      console.log(chunk.toString());
    });
    buildProcess.stdout.addListener("error", (chunk) => {
      console.log(chunk.toString());
    });
  });
};

main().catch((err) => {
  console.error("BUILD ERROR");
  console.error(err);
});
