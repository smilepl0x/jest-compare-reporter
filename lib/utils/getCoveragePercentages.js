"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoveragePercentages = void 0;
const getPercentage = (obj) => {
    var _a, _b;
    let total = 0;
    let covered = 0;
    for (const item of Object.values(obj)) {
        total++;
        item > 0 && covered++;
    }
    return (_b = (_a = ((covered * 100) / total)) === null || _a === void 0 ? void 0 : _a.toFixed(2)) !== null && _b !== void 0 ? _b : 0;
};
const getCoveragePercentages = (previousCoverage) => {
    const result = {};
    // this ugly
    for (const [key, value] of Object.entries(previousCoverage)) {
        const [_, fileName] = key.split(process.cwd());
        Object.assign(result, {
            [fileName]: {
                s: getPercentage((value === null || value === void 0 ? void 0 : value.s) || {}),
                f: getPercentage((value === null || value === void 0 ? void 0 : value.f) || {}),
                b: getPercentage((value === null || value === void 0 ? void 0 : value.b) || {}),
            },
        });
    }
    return result;
};
exports.getCoveragePercentages = getCoveragePercentages;
process.on("message", (message) => {
    var _a;
    let percentages = (0, exports.getCoveragePercentages)(message);
    (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, percentages);
});
