const packageSelect = require("./packageCheck");
const { spawn } = require("child-process-promise");

const main = async () => {
  const { packages } = await packageSelect();

  const results = packages.map((package) => {
    return spawn("node", [
      "scripts/tasks/childProcess.js",
      package,
    ]).then((result) => {
      if (result.stderr != null) {
        console.error('fail to build');
        console.error(buildProcess.stderr);
      }
      if (result.stdout != null) console.error(results.stdout);
    })
    .catch(err => {
      console.error(err);
    });
  });
};

main().catch((err) => {
  console.error("BUILD ERROR");
  console.error(err);
});
