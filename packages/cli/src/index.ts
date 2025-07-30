import chalk from "chalk";
import meow from "meow";

const cli = meow(
  `
  ${chalk.bold.cyan("sourcedive")} - Circular dependency detector

  ${chalk.yellow("Usage")}
    $ sourcedive -o <outputDirectory> -f <entryFile>

  ${chalk.yellow("Options")}
    --output, -o        Output directory
    --file, -f         Entry file
    --verbose, -v       Verbose output
    --help              Show help
    --version           Show version

  ${chalk.yellow("Examples")}
    $ sourcedive -o ./output -f ./src/index.ts
    $ sourcedive -o ./output -f ./src/index.ts --verbose
`,
  {
    importMeta: import.meta,
    flags: {
      output: {
        type: "string",
        shortFlag: "o",
      },
      file: {
        type: "string",
        shortFlag: "f",
      },
      verbose: {
        type: "boolean",
        shortFlag: "v",
        default: false,
      },
    },
  }
);

async function main() {
  const entryFile = cli.flags.file;
  if (!entryFile) {
    console.error(chalk.red("❌ Error: entry file을 입력해주세요"));
    cli.showHelp();
    process.exit(1);
  }
  const options = {
    output: cli.flags.output,
    file: cli.flags.file,
    verbose: cli.flags.verbose,
  };
  try {
    console.log(chalk.cyan(`🔍 Analyzing dependencies in: ${entryFile}`));
  } catch (error) {
    console.error(chalk.red("💥 Error:"), error instanceof Error ? error.message : error);
    if (options.verbose && error instanceof Error) {
      console.error(chalk.red(error.stack));
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red("Unexpected error:"), error);
  process.exit(1);
});
