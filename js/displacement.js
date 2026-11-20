var filters = filters || {};
(function () {
    filters.ColorChannel = {RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3};
    filters.Point = function (x, y) { this.x = x || 0; this.y = y || 0; };
    filters.DisplacementMap = function (source, map, target, point, scaleX, scaleY, channelX, channelY) {
        this.source = source;
        this.map = map;
        this.target = target;
        this.sourceCtx = source.getContext("2d");
        this.mapCtx = map.getContext("2d");
        this.targetCtx = target.getContext("2d");
        this.point = point || new filters.Point();
        this.scaleX = scaleX || 0;
        this.scaleY = scaleY || 0;
        this.channelX = channelX || filters.ColorChannel.RED;
        this.channelY = channelY || filters.ColorChannel.RED;
        if ([0, 1, 2, 3].indexOf(this.channelX) === -1) this.channelX = filters.ColorChannel.RED;
        if ([0, 1, 2, 3].indexOf(this.channelY) === -1) this.channelY = filters.ColorChannel.RED;
        // Only opt in when the map pixels are static (the aquarium's Perlin map).
        this.cacheMap = false;
        this.mapKey = null;
    };
    var proto = filters.DisplacementMap.prototype;
    proto.invalidateMap = function () { this.mapKey = null; };
    proto.prepareMap = function () {
        var key = [this.map.width, this.map.height, this.scaleX, this.scaleY,
            this.channelX, this.channelY].join(":");
        if (this.cacheMap && this.mapKey === key) return;
        var pixels = this.mapCtx.getImageData(0, 0, this.map.width, this.map.height).data;
        var count = pixels.length / 4;
        if (!this.offsetX || this.offsetX.length !== count) {
            this.offsetX = new Int32Array(count);
            this.offsetY = new Int32Array(count);
        }
        for (var i = 0; i < count; i++) {
            var alpha = pixels[i * 4 + 3] / 255;
            this.offsetX[i] = ((((pixels[i * 4 + this.channelX] / 255) * 2 - 1) * alpha) * this.scaleX) | 0;
            this.offsetY[i] = ((((pixels[i * 4 + this.channelY] / 255) * 2 - 1) * alpha) * this.scaleY) | 0;
        }
        this.mapKey = key;
    };
    proto.draw = function () {
        var source = this.sourceCtx.getImageData(0, 0, this.source.width, this.source.height);
        var input = new Uint32Array(source.data.buffer, source.data.byteOffset, source.data.length / 4);
        if (!this.output || this.output.width !== source.width || this.output.height !== source.height) {
            this.intermediate = new Uint32Array(input.length);
            this.output = this.targetCtx.createImageData(source.width, source.height);
            this.outputPixels = new Uint32Array(this.output.data.buffer, this.output.data.byteOffset, input.length);
        }
        // Preserve the old filter's copied background, untouched edges and zeroed
        // out-of-range reads. Copying whole pixels keeps the same RGBA bytes.
        this.intermediate.set(input);
        this.outputPixels.set(input);
        this.prepareMap();
        var x, y, column, row, sourceRow, targetRow, i = 0;
        for (y = 0; y < this.map.height; y++) {
            row = (y + this.point.y) | 0;
            sourceRow = this.source.width * row;
            targetRow = this.target.width * row;
            for (x = 0; x < this.map.width; x++, i++) {
                column = (x + this.point.x) | 0;
                this.intermediate[sourceRow + column] = input[targetRow + column + this.offsetX[i]];
            }
        }
        i = 0;
        for (y = 0; y < this.map.height; y++) {
            row = (y + this.point.y) | 0;
            sourceRow = this.source.width * row;
            for (x = 0; x < this.map.width; x++, i++) {
                column = (x + this.point.x) | 0;
                this.outputPixels[sourceRow + column] = this.intermediate[this.target.width * (row + this.offsetY[i]) + column];
            }
        }
        this.targetCtx.putImageData(this.output, 0, 0);
    };
    proto.setPixels = function (target, sourceIndex, source, targetIndex) {
        for (var channel = 0; channel < 4; channel++) {
            target.data[targetIndex * 4 + channel] = source.data[sourceIndex * 4 + channel];
        }
    };
}());
