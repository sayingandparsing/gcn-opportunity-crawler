"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentExtraction = /** @class */ (function () {
    function ContentExtraction() {
    }
    ContentExtraction.prototype.isolatePostings = function (pageContent, selectFn) {
    };
    ContentExtraction.prototype.extractInformation = function (post, extractFn) {
        return extractFn(post);
    };
    return ContentExtraction;
}());
exports.ContentExtraction = ContentExtraction;
//# sourceMappingURL=ContentExtractionAbstract.js.map