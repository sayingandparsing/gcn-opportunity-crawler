"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RequestChannel_1 = require("../../site-interaction/RequestChannel");
var cheerio = require("cheerio");
var fs = require("fs");
/*export interface HabitatResult
            extends EventOpportunity {

}*/
var HabitatResult = /** @class */ (function () {
    function HabitatResult(title) {
        this.org = "Habitat For Humanity Austin";
        this.description = "";
        this.longDescription = "";
        this.location = null;
        this.date = "";
        this.time = "";
        this.results = new Array;
        this.title = title;
    }
    return HabitatResult;
}());
exports.HabitatResult = HabitatResult;
var HabitatScraper = /** @class */ (function () {
    function HabitatScraper() {
        this.searchPage = 'https://austinhabitat.volunteerhub.com';
        this.requesting = new RequestChannel_1.RequestChannel();
        this.results = new Array();
        this.delay = 0.5;
        /**
         * Functions for generating CSV output
         *
         * The anonymous class below functions like a namespace,
         * and is used purely for organizational purposes
         */
        this.CSV = /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.header = function () {
                return '"' + [
                    "Title",
                    "Date",
                    "Time",
                    "Location",
                    "Description"
                ].join('", "') + '"';
            };
            class_1.prototype.toCsv = function (results, path) {
                var _this = this;
                var rows = results.map(function (res) {
                    return _this.arrayToRow(_this.resToArray(res));
                });
                console.log(this.header());
                var rowsWithHead = [this.header()].concat(rows);
                var content = rowsWithHead.join("\n");
                this.writeToFile(content, path);
            };
            class_1.prototype.writeToFile = function (content, path) {
                fs.writeFile(path, content, function (err) { return console.log(err); });
            };
            class_1.prototype.resToArray = function (res) {
                return [
                    res.title,
                    res.date,
                    res.time,
                    //...this.locationToArray(res.location),
                    res.location.address,
                    res.description
                ].map(function (item) {
                    return item ? item
                        : "";
                });
            };
            class_1.prototype.locationToArray = function (loc) {
                return [
                    loc.address,
                    loc.city
                ].map(function (item) {
                    return item ? item
                        : "";
                });
            };
            class_1.prototype.arrayToRow = function (elems) {
                return '"' + elems.join('", "') + '"';
            };
            return class_1;
        }());
    }
    HabitatScraper.prototype.process = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requesting.fetchPage(url, function () { })
                            .then(function (res) { return _this.extractListings(res); })
                            .catch(function (err) { return console.log(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HabitatScraper.prototype.extractListings = function (content) {
        var _this = this;
        var $ = cheerio.load(content);
        var dayBlocks = $('div .events-listing');
        dayBlocks.each(function (i, elem) {
            $(elem).find('.row.mx-sm-0').each(function (i, listing) {
                var res = _this.processListing(listing, $);
                console.log(_this.results.length);
                _this.results.push(res);
            });
        });
    };
    HabitatScraper.prototype.processListing = function (listing, $) {
        var title = $(listing).find('a').first().text().trim();
        var _a = this.getDateTime(listing, $), date = _a[0], time = _a[1];
        var address = $(listing).find('.fa-map-marker')
            .next().first().text().trim();
        var description = this.getDescription(listing, $);
        var res = new HabitatResult(title);
        res.date = date;
        res.time = time;
        res.location = { address: address, city: "Austin", country: "US" };
        res.description = description;
        return res;
    };
    HabitatScraper.prototype.getDateTime = function (listing, $) {
        var dateTime = $(listing).find('.fa-clock-o').next().first().text().trim();
        var date = dateTime.split(',')
            .map(function (x) { return x.trim(); })
            .splice(0, 2)
            .join(', ');
        var time = dateTime.split(',')
            .map(function (x) { return x.trim(); })[2];
        return [date, time];
    };
    HabitatScraper.prototype.getDescription = function (listing, $) {
        var desc = $(listing).find('div .tinyMceContent').find('p').first().text().trim();
        return desc;
    };
    return HabitatScraper;
}());
exports.HabitatScraper = HabitatScraper;
console.log('starting');
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var h;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    h = new HabitatScraper();
                    return [4 /*yield*/, h.process(h.searchPage)];
                case 1:
                    _a.sent();
                    console.log(h.results.length);
                    h.CSV.prototype.toCsv(h.results, '/home/reagan/Downloads/habitat_austin_may18.csv');
                    return [2 /*return*/];
            }
        });
    });
}
run();
//# sourceMappingURL=HabitatScraper.js.map