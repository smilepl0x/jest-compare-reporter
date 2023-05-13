"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs/promises"));
// TODO: Add options so compare against all files for just staged files.
// TODO: Add option to block completion of test or only warn
// TODO: Add configuration for atypical jest reports
// TODO: Add option for coverage to pass if under a configured threshold
// TODO: Post to gh/gl
class CompareReporter {
    constructor(config) {
        this._previousPercentages = {};
        this.onRunStart = (results, options) => __awaiter(this, void 0, void 0, function* () {
            if (!this._previousCoverage) {
                console.warn("No previous coverage file found! Skipping compare.");
                return;
            }
            const child = (0, child_process_1.fork)(__dirname + "/utils/getCoveragePercentages", [
                this._config.coverageDirectory,
            ]);
            child.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                this._previousPercentages = message;
            }));
            child.send(this._previousCoverage);
        });
        this.onRunComplete = (testContexts, results) => {
            var _a;
            if (this._previousCoverage && this._previousPercentages) {
                const child = (0, child_process_1.fork)(__dirname + "/utils/getCoveragePercentages", [
                    this._config.coverageDirectory,
                ]);
                child.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.dir(message, { depth: null });
                        yield fs.writeFile(`${process.cwd()}/jc-comparison.json`, JSON.stringify({ old: this._previousPercentages, new: message }, null, 2));
                    }
                    catch (e) {
                        console.error("An error occured\n%d", e);
                    }
                }));
                console.log("results", (_a = results === null || results === void 0 ? void 0 : results.coverageMap) === null || _a === void 0 ? void 0 : _a.toJSON());
                child.send(results.coverageMap);
            }
        };
        this._setError = (error) => {
            this._error = error;
        };
        this.getLastError = () => {
            console.error(this._error);
        };
        this._config = config;
        try {
            this._previousCoverage = require(`${config.coverageDirectory}\\\\coverage-final.json`);
        }
        catch (e) {
            // Coverage no existy
            this._previousCoverage = null;
        }
    }
}
exports.default = CompareReporter;
