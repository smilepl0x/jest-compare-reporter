import {
  AggregatedResult,
  Reporter,
  ReporterOnStartOptions,
  TestContext,
  Config,
} from "@jest/reporters";
import { fork } from "child_process";
import * as fs from "fs/promises";
import { CoverageMap } from "istanbul-lib-coverage";

export default class CompareReporter implements Reporter {
  private _config: Config.GlobalConfig;
  private _previousCoverage: CoverageMap | null;
  private _previousPercentages: Object = {};
  private _error?: Error;

  constructor(config: Config.GlobalConfig) {
    this._config = config;
    try {
      this._previousCoverage = require(`${config.coverageDirectory}\\\\coverage-final.json`);
    } catch (e) {
      // Coverage no existy
      this._previousCoverage = null;
    }
  }

  onRunStart = async (
    results: AggregatedResult,
    options: ReporterOnStartOptions
  ) => {
    if (!this._previousCoverage) {
      console.warn("No previous coverage file found! Skipping compare.");
      return;
    }

    const child = fork(__dirname + "/utils/getCoveragePercentages", [
      this._config.coverageDirectory,
    ]);
    child.on("message", async (message) => {
      this._previousPercentages = message;
    });
    child.send(this._previousCoverage);
  };

  onRunComplete = (
    testContexts: Set<TestContext>,
    results: AggregatedResult
  ) => {
    if (this._previousCoverage && this._previousPercentages) {
      const child = fork(__dirname + "/utils/getCoveragePercentages", [
        this._config.coverageDirectory,
      ]);
      child.on("message", async (message) => {
        try {
          console.dir(message, { depth: null });
          await fs.writeFile(
            `${process.cwd()}/jc-comparison.json`,
            JSON.stringify(
              { old: this._previousPercentages, new: message },
              null,
              2
            )
          );
        } catch (e) {
          console.error("An error occured\n%d", e);
        }
      });
      child.send(results.coverageMap as Object);
    }
  };

  protected _setError = (error: Error) => {
    this._error = error;
  };

  getLastError = () => {
    console.error(this._error);
  };
}
