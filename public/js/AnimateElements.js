function AnimatedObject() {
    this.init();
}

AnimatedObject.prototype.init = function () {
    this.backgroundColor = "#FFFFFF";
    this.foregroundColor = "#000000";
    this.highlighted = false;
    this.objectID = -1;
    this.layer = 0;
    this.addedToScene = true;
    this.label = "";
    this.labelColor = "#000000";
    this.alpha = 1.0;
    this.x = 0;
    this.y = 0;
    this.minHeightDiff = 3;
    this.range = 5;
    this.highlightIndex = -1;
    this.highlightIndexDirty = true;
};

AnimatedObject.prototype.alwaysOnTop = false;

AnimatedObject.prototype.setBackgroundColor = function (newColor) {
    this.backgroundColor = newColor;
};

AnimatedObject.prototype.setForegroundColor = function (newColor) {
    this.foregroundColor = newColor;
};

AnimatedObject.prototype.setNull = function () {
};

AnimatedObject.prototype.getNull = function () {
    return false;
};

AnimatedObject.prototype.setAlpha = function (newAlpha) {
    this.alpha = newAlpha;
};

AnimatedObject.prototype.getAlpha = function () {
    return this.alpha;
};

AnimatedObject.prototype.setForegroundColor = function (newColor) {
    this.foregroundColor = newColor;
    this.labelColor = newColor;
};


AnimatedObject.prototype.getHighlight = function () {
    return this.highlighted;
};

AnimatedObject.prototype.getWidth = function () {
    return 0;
};

AnimatedObject.prototype.getHeight = function () {
    return 0;
};

AnimatedObject.prototype.setHighlight = function (value) {
    this.highlighted = value;
};

AnimatedObject.prototype.centerX = function () {
    return this.x;
};

AnimatedObject.prototype.setWidth = function (newWidth) {
    // TODO:  Do we want to throw here?  Should always override this ...
};


AnimatedObject.prototype.centerY = function () {
    return this.y;
};


AnimatedObject.prototype.getAlignLeftPos = function (otherObject) {
    return [otherObject.right() + this.getWidth() / 2, otherObject.centerY()];
};

AnimatedObject.prototype.getAlignRightPos = function (otherObject) {

    return [otherObject.left() - this.getWidth() / 2, otherObject.centerY()];
};

AnimatedObject.prototype.alignLeft = function (otherObject) {
    this.y = otherObject.centerY();
    this.x = otherObject.right() + this.getWidth() / 2;
};

AnimatedObject.prototype.alignRight = function (otherObject) {
    this.y = otherObject.centerY();
    this.x = otherObject.left() - this.getWidth() / 2;
};

AnimatedObject.prototype.alignTop = function (otherObject) {
    this.x = otherObject.centerX();
    this.y = otherObject.top() - this.getHeight() / 2;
};

AnimatedObject.prototype.alignBottom = function (otherObject) {
    this.x = otherObject.centerX();
    this.y = otherObject.bottom() + this.getHeight() / 2;
};

AnimatedObject.prototype.getClosestCardinalPoint = function (fromX, fromY) {
    var xDelta;
    var yDelta;
    var xPos;
    var yPos;

    if (fromX < this.left()) {
        xDelta = this.left() - fromX;
        xPos = this.left();
    }
    else if (fromX > this.right()) {
        xDelta = fromX - this.right();
        xPos = this.right();
    }
    else {
        xDelta = 0;
        xPos = this.centerX();
    }

    if (fromY < this.top()) {
        yDelta = this.top() - fromY;
        yPos = this.top();
    }
    else if (fromY > this.bottom()) {
        yDelta = fromY - this.bottom();
        yPos = this.bottom();
    }
    else {
        yDelta = 0;
        yPos = this.centerY();
    }

    if (yDelta > xDelta) {
        xPos = this.centerX();
    }
    else {
        yPos = this.centerY();
    }

    return [xPos, yPos];
};


AnimatedObject.prototype.centered = function () {
    return false;
};


AnimatedObject.prototype.pulseHighlight = function (frameNum) {
    if (this.highlighted) {
        var frameMod = frameNum / 7.0;
        var delta = Math.abs((frameMod) % (2 * this.range - 2) - this.range + 1)
        this.highlightDiff = delta + this.minHeightDiff;
    }
};

AnimatedObject.prototype.getTailPointerAttachPos = function (fromX, fromY, anchorPoint) {
    return [this.x, this.y];
};

AnimatedObject.prototype.getHeadPointerAttachPos = function (fromX, fromY) {
    return [this.x, this.y];
};

AnimatedObject.prototype.identifier = function () {
    return this.objectID;
};

AnimatedObject.prototype.getText = function () {
    return this.label;
};

AnimatedObject.prototype.getTextColor = function () {
    return this.labelColor
};

AnimatedObject.prototype.setTextColor = function (color) {
    this.labelColor = color;
};

AnimatedObject.prototype.setText = function (newText) {
    this.label = newText;
};

AnimatedObject.prototype.setHighlightIndex = function (hlIndex) {
    this.highlightIndex = hlIndex;
    this.highlightIndexDirty = true;
};

AnimatedObject.prototype.getHighlightIndex = function () {
    return this.highlightIndex;
};

var AnimatedCircle = function (objectID, objectLabel) {
    this.objectID = objectID;
    this.label = objectLabel;
    this.radius = 20;
    this.thickness = 3;
    this.x = 0;
    this.y = 0;
    this.alpha = 1.0;
    this.addedToScene = true;
    this.highlightIndex = -1;
};

AnimatedCircle.prototype = new AnimatedObject();
AnimatedCircle.prototype.constructor = AnimatedCircle;

AnimatedCircle.prototype.getTailPointerAttachPos = function (fromX, fromY) {
    return this.getHeadPointerAttachPos(fromX, fromY);
};


AnimatedCircle.prototype.getWidth = function () {
    return this.radius * 2;
};

AnimatedObject.prototype.setWidth = function (newWidth) {
    this.radius = newWidth / 2;
};

AnimatedCircle.prototype.getHeadPointerAttachPos = function (fromX, fromY) {
    var xVec = fromX - this.x;
    var yVec = fromY - this.y;
    var len = Math.sqrt(xVec * xVec + yVec * yVec);
    if (len == 0) {
        return [this.x, this.y];
    }
    return [this.x + (xVec / len) * (this.radius), this.y + (yVec / len) * (this.radius)];
};

AnimatedCircle.prototype.setHighlightIndex = function (hlIndex) {
    this.highlightIndex = hlIndex;
    this.highlightIndexDirty = true;
};

AnimatedCircle.prototype.draw = function (ctx) {
    ctx.globalAlpha = this.alpha;

    if (this.highlighted) {
        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + this.highlightDiff, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    ctx.fillStyle = this.backgroundColor;
    ctx.strokeStyle = this.foregroundColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = '10px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    ctx.fillStyle = this.foregroundColor;

    var strList = this.label.split("\n");
    if (strList.length == 1) {
        if (this.highlightIndexDirty && this.highlightIndex != -1) {
            this.leftWidth = ctx.measureText(this.label.substring(0, this.highlightIndex)).width;
            this.centerWidth = ctx.measureText(this.label.substring(this.highlightIndex, this.highlightIndex + 1)).width;
            this.textWidth = ctx.measureText(this.label).width;
            this.highlightIndexDirty = false;
        }
        if (this.highlightIndex != -1 && this.highlightIndex < this.label.length) //this.highlghtIndex < this.label.length)
        {
            var startingXForHighlight = this.x - this.textWidth / 2;
            ctx.textAlign = 'left';
            var leftStr = this.label.substring(0, this.highlightIndex);
            var highlightStr = this.label.substring(this.highlightIndex, this.highlightIndex + 1);
            var rightStr = this.label.substring(this.highlightIndex + 1);
            ctx.fillText(leftStr, startingXForHighlight, this.y);
            ctx.strokeStyle = "#ddd";
            ctx.fillStyle = "#ddd";
            ctx.fillText(highlightStr, startingXForHighlight + this.leftWidth, this.y);
            ctx.strokeStyle = this.labelColor;
            ctx.fillStyle = this.labelColor;
            ctx.fillText(rightStr, startingXForHighlight + this.leftWidth + this.centerWidth, this.y);
        } else {
            ctx.fillText(this.label, this.x, this.y);
        }
    }
    else if (strList.length % 2 == 0) {
        var i;
        var mid = strList.length / 2;
        for (i = 0; i < strList.length / 2; i++) {
            ctx.fillText(strList[mid - i - 1], this.x, this.y - (i + 0.5) * 12);
            ctx.fillText(strList[mid + i], this.x, this.y + (i + 0.5) * 12);

        }
    }
    else {
        var mid = (strList.length - 1) / 2;
        var i;
        ctx.fillText(strList[mid], this.x, this.y);
        for (i = 0; i < mid; i++) {
            ctx.fillText(strList[mid - (i + 1)], this.x, this.y - (i + 1) * 12);
            ctx.fillText(strList[mid + (i + 1)], this.x, this.y + (i + 1) * 12);
        }
    }
};

AnimatedCircle.prototype.createUndoDelete = function () {
    return new UndoDeleteCircle(this.objectID, this.label, this.x, this.y, this.foregroundColor, this.backgroundColor, this.layer, this.radius);
};

function UndoDeleteCircle(id, lab, x, y, foregroundColor, backgroundColor, l, radius) {
    this.objectID = id;
    this.posX = x;
    this.posY = y;
    this.nodeLabel = lab;
    this.fgColor = foregroundColor;
    this.bgColor = backgroundColor;
    this.layer = l;
    this.radius = radius;
}

UndoDeleteCircle.prototype = new UndoBlock();
UndoDeleteCircle.prototype.constructor = UndoDeleteCircle;

UndoDeleteCircle.prototype.undoInitialStep = function (world) {
    world.addCircleObject(this.objectID, this.nodeLabel);
    world.setWidth(this.objectID, this.radius * 2);
    world.setNodePosition(this.objectID, this.posX, this.posY);
    world.setForegroundColor(this.objectID, this.fgColor);
    world.setBackgroundColor(this.objectID, this.bgColor);
    world.setLayer(this.objectID, this.layer);
};

function AnimatedLabel(id, val, center, initialWidth) {
    this.centering = center;
    this.label = val;
    this.highlighted = false;
    this.objectID = id;
    this.alpha = 1.0;
    this.addedToScene = true;
    this.labelColor = "#000000";
    this.textWidth = 0;
    if (initialWidth != undefined) {
        this.textWidth = initialWidth;
    }

    this.leftWidth = -1;
    this.centerWidth = -1;
    this.highlightIndex = -1;
}

AnimatedLabel.prototype = new AnimatedObject();
AnimatedLabel.prototype.constructor = AnimatedLabel;

AnimatedLabel.prototype.alwaysOnTop = true;

AnimatedLabel.prototype.centered = function () {
    return this.centering;
};

AnimatedLabel.prototype.draw = function (ctx) {
    if (!this.addedToScene) {
        return;
    }

    ctx.globalAlpha = this.alpha;
    ctx.font = '10px sans-serif';

    var startingXForHighlight = this.x;

    if (this.highlightIndex >= this.label.length) {
        this.highlightIndex = -1;
    }
    if (this.highlightIndexDirty && this.highlightIndex != -1) {
        this.leftWidth = ctx.measureText(this.label.substring(0, this.highlightIndex)).width;
        this.centerWidth = ctx.measureText(this.label.substring(this.highlightIndex, this.highlightIndex + 1)).width;
        this.highlightIndexDirty = false;
    }

    if (this.centering) {
        if (this.highlightIndex != -1) {
            startingXForHighlight = this.x - this.width / 2;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
        }
        else {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        }
    }
    else {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
    }
    if (this.highlighted) {
        ctx.strokeStyle = "#ddd";
        ctx.fillStyle = "#ddd";
        ctx.lineWidth = this.highlightDiff;
        ctx.strokeText(this.label, this.x, this.y);
    }
    ctx.strokeStyle = this.labelColor;
    ctx.fillStyle = this.labelColor;
    ctx.lineWidth = 1;
    strList = this.label.split("\n");
    if (strList.length == 1) {
        if (this.highlightIndex == -1) {
            ctx.fillText(this.label, this.x, this.y);
        }
        else {
            var leftStr = this.label.substring(0, this.highlightIndex);
            var highlightStr = this.label.substring(this.highlightIndex, this.highlightIndex + 1)
            var rightStr = this.label.substring(this.highlightIndex + 1)
            ctx.fillText(leftStr, startingXForHighlight, this.y)
            ctx.strokeStyle = "#ddd";
            ctx.fillStyle = "#ddd";
            ctx.fillText(highlightStr, startingXForHighlight + this.leftWidth, this.y)


            ctx.strokeStyle = this.labelColor;
            ctx.fillStyle = this.labelColor;
            ctx.fillText(rightStr, startingXForHighlight + this.leftWidth + this.centerWidth, this.y)


        }
    }
    else {
        var offset = (this.centering) ? (1.0 - strList.length) / 2.0 : 0;
        for (var i = 0; i < strList.length; i++) {
            ctx.fillText(strList[i], this.x, this.y + offset + i * 12);
        }
    }
    ctx.closePath();
};

AnimatedLabel.prototype.getAlignLeftPos = function (otherObject) {
    if (this.centering) {
        return [otherObject.left() - this.textWidth / 2, this.y = otherObject.centerY()];
    }
    else {
        return [otherObject.left() - this.textWidth, otherObject.centerY() - 5];
    }
}

AnimatedLabel.prototype.alignLeft = function (otherObject) {
    if (this.centering) {
        this.y = otherObject.centerY();
        this.x = otherObject.left() - this.textWidth / 2;
    }
    else {
        this.y = otherObject.centerY() - 5;
        this.x = otherObject.left() - this.textWidth;
    }
}

AnimatedLabel.prototype.alignRight = function (otherObject) {
    if (this.centering) {
        this.y = otherObject.centerY();
        this.x = otherObject.right() + this.textWidth / 2;
    }
    else {
        this.y = otherObject.centerY() - 5;
        this.x = otherObject.right();
    }
}
AnimatedLabel.prototype.getAlignRightPos = function (otherObject) {
    if (this.centering) {
        return [otherObject.right() + this.textWidth / 2, otherObject.centerY()];
    }
    else {
        return [otherObject.right(), otherObject.centerY() - 5];
    }
}


AnimatedLabel.prototype.alignTop = function (otherObject) {
    if (this.centering) {
        this.y = otherObject.top() - 5;
        this.x = otherObject.centerX();
    }
    else {
        this.y = otherObject.top() - 10;
        this.x = otherObject.centerX() - this.textWidth / 2;
    }
}


AnimatedLabel.prototype.getAlignTopPos = function (otherObject) {
    if (this.centering) {
        return [otherObject.centerX(), otherObject.top() - 5];
    }
    else {
        return [otherObject.centerX() - this.textWidth / 2, otherObject.top() - 10];
    }
}


AnimatedLabel.prototype.alignBottom = function (otherObject) {
    if (this.centering) {
        this.y = otherObject.bottom() + 5;
        this.x = otherObject.centerX();
    }
    else {
        this.y = otherObject.bottom();
        this.x = otherObject.centerX() - this.textWidth / 2;
    }
}


AnimatedLabel.prototype.getAlignBottomPos = function (otherObject) {
    if (this.centering) {
        return [otherObject.centerX(), otherObject.bottom() + 5];
    }
    else {
        return [otherObject.centerX() - this.textWidth / 2, otherObject.bottom()];
    }
}


AnimatedLabel.prototype.getWidth = function () {
    return this.textWidth;
}

AnimatedLabel.prototype.getHeight = function () {
    return 10;  // HACK!  HACK!  HACK!  HACK!
}


AnimatedLabel.prototype.setHighlight = function (value) {
    this.highlighted = value;
}

AnimatedLabel.prototype.createUndoDelete = function () {
    return new UndoDeleteLabel(this.objectID, this.label, this.x, this.y, this.centering, this.labelColor, this.layer, this.highlightIndex);
}


AnimatedLabel.prototype.centerX = function () {
    if (this.centering) {
        return this.x;
    }
    else {
        return this.x + this.textWidth;
    }

}

AnimatedLabel.prototype.centerY = function () {
    if (this.centering) {
        return this.y;
    }
    else {
        return this.y + 5; //
    }

}

AnimatedLabel.prototype.top = function () {
    if (this.centering) {
        return this.y - 5; //TODO: Un-Hardwire
    }
    else {
        return this.y;
    }
}


AnimatedLabel.prototype.bottom = function () {
    if (this.centering) {
        return this.y + 5; // TODO: + height / 2;
    }
    else {
        return this.y + 10; // TODO: + hieght;
    }
}


AnimatedLabel.prototype.right = function () {
    if (this.centering) {
        return this.x + this.textWidth / 2; // TODO: + width / 2;
    }
    else {
        return this.x + this.textWidth; // TODO: + width;
    }
}


AnimatedLabel.prototype.left = function () {
    if (this.centering) {
        return this.x - this.textWidth / 2;
    }
    else {
        return this.x; // TODO:  - a little?
    }
}


AnimatedLabel.prototype.setHighlightIndex = function (hlIndex) {
    // Only allow highlight index for labels that don't have End-Of-Line
    if (this.label.indexOf("\n") == -1 && this.label.length > hlIndex) {
        this.highlightIndex = hlIndex;
        this.highlightIndexDirty = true;
    }
    else {
        this.highlightIndex = -1;

    }
}


AnimatedLabel.prototype.getTailPointerAttachPos = function (fromX, fromY, anchorPoint) {
    return this.getClosestCardinalPoint(fromX, fromY);
}

AnimatedLabel.prototype.getHeadPointerAttachPos = function (fromX, fromY) {
    return this.getClosestCardinalPoint(fromX, fromY);
}

AnimatedLabel.prototype.setText = function (newText, textIndex, initialWidth) {
    this.label = newText;
    if (initialWidth != undefined) {
        this.textWidth = initialWidth;
    }
}


function UndoDeleteLabel(id, lab, x, y, centered, color, l, hli) {
    this.objectID = id;
    this.posX = x;
    this.posY = y;
    this.nodeLabel = lab;
    this.labCentered = centered;
    this.labelColor = color;
    this.layer = l;
    this.highlightIndex = hli;
    this.dirty = true;
}

UndoDeleteLabel.prototype = new UndoBlock();
UndoDeleteLabel.prototype.constructor = UndoDeleteLabel;

UndoDeleteLabel.prototype.undoInitialStep = function (world) {
    world.addLabelObject(this.objectID, this.nodeLabel, this.labCentered);
    world.setNodePosition(this.objectID, this.posX, this.posY);
    world.setForegroundColor(this.objectID, this.labelColor);
    world.setLayer(this.objectID, this.layer);
};

function AnimatedLinkedList(id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor) {
    this.init(id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor);
}

AnimatedLinkedList.prototype = new AnimatedObject();
AnimatedLinkedList.prototype.constructor = AnimatedLinkedList;
AnimatedLinkedList.superclass = AnimatedObject.prototype;


AnimatedLinkedList.prototype.init = function (id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor) {

    AnimatedLinkedList.superclass.init.call(this);

    this.w = wth;
    this.h = hgt;
    this.backgroundColor = fillColor;
    this.foregroundColor = edgeColor;

    this.vertical = verticalOrientation;
    this.linkPositionEnd = linkPosEnd;
    this.linkPercent = linkPer;

    this.numLabels = numLab;

    this.labels = [];
    this.labelPosX = [];
    this.labelPosY = [];
    this.labelColors = [];
    this.nullPointer = false;

    this.currentHeightDif = 6;
    this.maxHeightDiff = 5;
    this.minHeightDiff = 3;


    for (var i = 0; i < this.numLabels; i++) {
        this.labels[i] = "";
        this.labelPosX[i] = 0;
        this.labelPosY[i] = 0;
        this.labelColors[i] = this.foregroundColor;
    }

    this.labels[0] = val;
    this.highlighted = false;
    this.objectID = id;
}


AnimatedLinkedList.prototype.left = function () {
    if (this.vertical) {
        return this.x - this.w / 2.0;
    }
    else if (this.linkPositionEnd) {
        return this.x - ((this.w * (1 - this.linkPercent)) / 2);
    }
    else {
        return this.x - (this.w * (this.linkPercent + 1)) / 2;
    }
}


AnimatedLinkedList.prototype.setNull = function (np) {
    if (this.nullPointer != np) {
        this.nullPointer = np;
    }

}

AnimatedLinkedList.prototype.getNull = function () {
    return this.nullPointer;
}

AnimatedLinkedList.prototype.right = function () {
    if (this.vertical) {
        return this.x + this.w / 2.0;
    }
    else if (this.linkPositionEnd) {
        return this.x + ((this.w * (this.linkPercent + 1)) / 2);
    }
    else {
        return this.x + (this.w * (1 - this.linkPercent)) / 2;
    }
}

AnimatedLinkedList.prototype.top = function () {
    if (!this.vertical) {
        return this.y - this.h / 2.0;
    }
    else if (this.linkPositionEnd) {
        return this.y - (this.h * (1 - this.linkPercent)) / 2;
    }
    else {
        return this.y - (this.h * (1 + this.linkPercent)) / 2;
    }
}

AnimatedLinkedList.prototype.bottom = function () {
    if (!this.vertical) {
        return this.y + this.h / 2.0;
    }
    else if (this.linkPositionEnd) {
        return this.y + (this.h * (1 + this.linkPercent)) / 2;
    }
    else {
        return this.y + (this.h * (1 - this.linkPercent)) / 2;
    }
}


// TODO: Should we move this to the draw function, and save the
//       space of the arrays?  Bit of a leftover from the Flash code,
//       which did drawing differently
AnimatedLinkedList.prototype.resetTextPosition = function () {
    if (this.vertical) {
        this.labelPosX[0] = this.x;

        this.labelPosY[0] = this.y + this.h * (1 - this.linkPercent) / 2 * (1 / this.numLabels - 1);
        //				labelPosY[0] = -height * (1-linkPercent) / 2 + height*(1-linkPercent)/2*numLabels;
        for (var i = 1; i < this.numLabels; i++) {
            this.labelPosY[i] = this.labelPosY[i - 1] + this.h * (1 - this.linkPercent) / this.numLabels;
            this.labelPosX[i] = this.x;
        }
    }
    else {
        this.labelPosY[0] = this.y;
        this.labelPosX[0] = this.x + this.w * (1 - this.linkPercent) / 2 * (1 / this.numLabels - 1);
        for (var i = 1; i < this.numLabels; i++) {
            this.labelPosY[i] = this.y;
            this.labelPosX[i] = this.labelPosX[i - 1] + this.w * (1 - this.linkPercent) / this.numLabels;
        }
    }

}


AnimatedLinkedList.prototype.getTailPointerAttachPos = function (fromX, fromY, anchor) {
    if (this.vertical && this.linkPositionEnd) {
        return [this.x, this.y + this.h / 2.0];
    }
    else if (this.vertical && !this.linkPositionEnd) {
        return [this.x, this.y - this.h / 2.0];
    }
    else if (!this.vertical && this.linkPositionEnd) {
        return [this.x + this.w / 2.0, this.y];
    }
    else // (!this.vertical && !this.linkPositionEnd)
    {
        return [this.x - this.w / 2.0, this.y];
    }
}


AnimatedLinkedList.prototype.getHeadPointerAttachPos = function (fromX, fromY) {
    return this.getClosestCardinalPoint(fromX, fromY);
}


AnimatedLinkedList.prototype.setWidth = function (wdth) {
    this.w = wdth;
    this.resetTextPosition();
}


AnimatedLinkedList.prototype.setHeight = function (hght) {
    this.h = hght;
    this.resetTextPosition();
}

AnimatedLinkedList.prototype.getWidth = function () {
    return this.w;
}

AnimatedLinkedList.prototype.getHeight = function () {
    return this.h;
}

AnimatedLinkedList.prototype.draw = function (context) {
    var startX;
    var startY;

    startX = this.left();
    startY = this.top();

    if (this.highlighted) {
        context.strokeStyle = "#ddd";
        context.fillStyle = "#ddd";

        context.beginPath();
        context.moveTo(startX - this.highlightDiff, startY - this.highlightDiff);
        context.lineTo(startX + this.w + this.highlightDiff, startY - this.highlightDiff);
        context.lineTo(startX + this.w + this.highlightDiff, startY + this.h + this.highlightDiff);
        context.lineTo(startX - this.highlightDiff, startY + this.h + this.highlightDiff);
        context.lineTo(startX - this.highlightDiff, startY - this.highlightDiff);
        context.closePath();
        context.stroke();
        context.fill();
    }
    context.strokeStyle = this.foregroundColor;
    context.fillStyle = this.backgroundColor;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(startX + this.w, startY);
    context.lineTo(startX + this.w, startY + this.h);
    context.lineTo(startX, startY + this.h);
    context.lineTo(startX, startY);
    context.closePath();
    context.stroke();
    context.fill();

    var i;
    if (this.vertical) {
        startX = this.left();
        for (i = 1; i < this.numLabels; i++) {
            //TODO: this doesn't look right ...
            startY = this.y + this.h * (1 - this.linkPercent) * (i / this.numLabels - 1 / 2);

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(startX + this.w, startY);
            context.closePath();
            context.stroke();
        }
    }
    else {
        startY = this.top();
        for (i = 1; i < this.numLabels; i++) {
            startX = this.x + this.w * (1 - this.linkPercent) * (i / this.numLabels - 1 / 2);
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(startX, startY + this.h);
            context.closePath();
            context.stroke();
        }
    }

    if (this.vertical && this.linkPositionEnd) {
        startX = this.left();
        startY = this.bottom() - this.h * this.linkPercent;


        context.beginPath();
        context.moveTo(startX + this.w, startY);
        context.lineTo(startX, startY);
        if (this.nullPointer) {
            context.lineTo(this.startX + this.w, this.bottom());
        }
        context.closePath();
        context.stroke();
    }
    else if (this.vertical && !this.linkPositionEnd) {
        startX = this.left();
        startY = this.top() + this.h * this.linkPercent;

        context.beginPath();
        context.moveTo(startX + this.w, startY);
        context.lineTo(startX, startY);
        if (this.nullPointer) {
            context.lineTo(startX + this.w, this.top());
        }
        context.closePath();
        context.stroke();

    }
    else if (!this.vertical && this.linkPositionEnd) {
        startX = this.right() - this.w * this.linkPercent;
        startY = this.top();

        context.beginPath();
        context.moveTo(startX, startY + this.h);
        context.lineTo(startX, startY);
        if (this.nullPointer) {
            context.lineTo(this.right(), startY + this.h);
        }
        context.closePath();
        context.stroke();

    }
    else // (!vertical && !linkPositionEnd)
    {
        startX = this.left() + this.w * this.linkPercent;
        startY = this.top();

        context.beginPath();
        context.moveTo(startX, startY + this.h);
        context.lineTo(startX, startY);
        if (this.nullPointer) {
            context.lineTo(this.left(), startY);
        }
        context.closePath();
        context.stroke();
    }


    context.textAlign = 'center';
    context.font = '10px sans-serif';
    context.textBaseline = 'middle';
    context.lineWidth = 1;


    this.resetTextPosition();
    for (i = 0; i < this.numLabels; i++) {
        context.fillStyle = this.labelColors[i];
        context.fillText(this.labels[i], this.labelPosX[i], this.labelPosY[i]);
    }
}


AnimatedLinkedList.prototype.setTextColor = function (color, textIndex) {

    this.labelColors[textIndex] = color;
}


AnimatedLinkedList.prototype.getTextColor = function (textIndex) {
    return this.labelColors[textIndex];
}


AnimatedLinkedList.prototype.getText = function (index) {
    return this.labels[index];
}

AnimatedLinkedList.prototype.setText = function (newText, textIndex) {
    this.labels[textIndex] = newText;
    this.resetTextPosition();
}


AnimatedLinkedList.prototype.createUndoDelete = function () {
    return new UndoDeleteLinkedList(this.objectID, this.numLabels, this.labels, this.x, this.y, this.w, this.h, this.linkPercent,
        this.linkPositionEnd, this.vertical, this.labelColors, this.backgroundColor, this.foregroundColor,
        this.layer, this.nullPointer);
}

AnimatedLinkedList.prototype.setHighlight = function (value) {
    if (value != this.highlighted) {
        this.highlighted = value;
    }
}


function UndoDeleteLinkedList(id, numlab, lab, x, y, w, h, linkper, posEnd, vert, labColors, bgColor, fgColor, l, np) {
    this.objectID = id;
    this.posX = x;
    this.posY = y;
    this.width = w;
    this.height = h;
    this.backgroundColor = bgColor;
    this.foregroundColor = fgColor;
    this.labels = lab;
    this.linkPercent = linkper;
    this.verticalOrentation = vert;
    this.linkAtEnd = posEnd;
    this.labelColors = labColors
    this.layer = l;
    this.numLabels = numlab;
    this.nullPointer = np;
}

UndoDeleteLinkedList.prototype = new UndoBlock();
UndoDeleteLinkedList.prototype.constructor = UndoDeleteLinkedList;


UndoDeleteLinkedList.prototype.undoInitialStep = function (world) {
    world.addLinkedListObject(this.objectID, this.labels[0], this.width, this.height, this.linkPercent, this.verticalOrentation, this.linkAtEnd, this.numLabels, this.backgroundColor, this.foregroundColor);
    world.setNodePosition(this.objectID, this.posX, this.posY);
    world.setLayer(this.objectID, this.layer);
    world.setNull(this.objectID, this.nullPointer);
    for (var i = 0; i < this.numLabels; i++) {
        world.setText(this.objectID, this.labels[i], i);
        world.setTextColor(this.objectID, this.labelColors[i], i);
    }
}

AnimatedRectangle = function (id, val, wth, hgt, xJust, yJust, fillColor, edgeColor) {
    this.w = wth;
    this.h = hgt;
    this.xJustify = xJust;
    this.yJustify = yJust;
    this.label = val;
    this.labelColor = edgeColor

    this.backgroundColor = fillColor;
    this.foregroundColor = edgeColor;
    this.labelColor = this.foregroundColor;
    this.highlighted = false;
    this.objectID = id;
    this.nullPointer = false;
    this.alpha = 1.0;
    this.addedToScene = true;

}

AnimatedRectangle.prototype = new AnimatedObject();
AnimatedRectangle.prototype.constructor = AnimatedRectangle;

AnimatedRectangle.prototype.setNull = function (np) {
    this.nullPointer = np;
}

AnimatedRectangle.prototype.getNull = function () {
    return this.nullPointer;
}


AnimatedRectangle.prototype.left = function () {
    if (this.xJustify == "left") {
        return this.x;
    }
    else if (this.xJustify == "center") {
        return this.x - this.w / 2.0;
    }
    else
    {
        return this.x - this.w;
    }

}

AnimatedRectangle.prototype.centerX = function () {
    if (this.xJustify == "center") {
        return this.x;
    }
    else if (this.xJustify == "left") {
        return this.x + this.w / 2.0;
    }
    else // (this.xJustify == "right")
    {
        return this.x - this.w / 2.0;
    }
}

AnimatedRectangle.prototype.centerY = function () {
    if (this.yJustify == "center") {
        return this.y;
    }
    else if (this.yJustify == "top") {
        return this.y + this.h / 2.0;
    }
    else // (this.xJustify == "bottom")
    {
        return this.y - this.w / 2.0;
    }

}

AnimatedRectangle.prototype.top = function () {
    if (this.yJustify == "top") {
        return this.y;
    }
    else if (this.yJustify == "center") {
        return this.y - this.h / 2.0;
    }
    else //(this.xJustify == "bottom")
    {
        return this.y - this.h;
    }
}

AnimatedRectangle.prototype.bottom = function () {
    if (this.yJustify == "top") {
        return this.y + this.h;
    }
    else if (this.yJustify == "center") {
        return this.y + this.h / 2.0;
    }
    else //(this.xJustify == "bottom")
    {
        return this.y;
    }
}


AnimatedRectangle.prototype.right = function () {
    if (this.xJustify == "left") {
        return this.x + this.w;
    }
    else if (this.xJustify == "center") {
        return this.x + this.w / 2.0;
    }
    else // (this.xJustify == "right")
    {
        return this.x;
    }
}


AnimatedRectangle.prototype.getHeadPointerAttachPos = function (fromX, fromY) {
    return this.getClosestCardinalPoint(fromX, fromY);
};

AnimatedRectangle.prototype.setWidth = function (wdth) {
    this.w = wdth;
};

AnimatedRectangle.prototype.setHeight = function (hght) {
    this.h = hght;
};

AnimatedRectangle.prototype.getWidth = function () {
    return this.w;
};

AnimatedRectangle.prototype.getHeight = function () {
    return this.h;
};

AnimatedRectangle.prototype.draw = function (context) {
    if (!this.addedToScene) {
        return;
    }

    var startX;
    var startY;
    var labelPosX;
    var labelPosY;

    context.globalAlpha = this.alpha;

    if (this.xJustify == "left") {
        startX = this.x;
        labelPosX = this.x + this.w / 2.0;
    }
    else if (this.xJustify == "center") {
        startX = this.x - this.w / 2.0;
        labelPosX = this.x;

    }
    else if (this.xJustify == "right") {
        startX = this.x - this.w;
        labelPosX = this.x - this.w / 2.0
    }
    if (this.yJustify == "top") {
        startY = this.y;
        labelPosY = this.y + this.h / 2.0;
    }
    else if (this.yJustify == "center") {
        startY = this.y - this.h / 2.0;
        labelPosY = this.y;

    }
    else if (this.yJustify == "bottom") {
        startY = this.y - this.h;
        labelPosY = this.y - this.h / 2.0;
    }

    context.lineWidth = 1;

    if (this.highlighted) {
        context.strokeStyle = "#ddd";
        context.fillStyle = "#ddd";

        context.beginPath();
        context.moveTo(startX - this.highlightDiff, startY - this.highlightDiff);
        context.lineTo(startX + this.w + this.highlightDiff, startY - this.highlightDiff);
        context.lineTo(startX + this.w + this.highlightDiff, startY + this.h + this.highlightDiff);
        context.lineTo(startX - this.highlightDiff, startY + this.h + this.highlightDiff);
        context.lineTo(startX - this.highlightDiff, startY - this.highlightDiff);
        context.closePath();
        context.stroke();
        context.fill();

    }
    context.strokeStyle = this.foregroundColor;
    context.fillStyle = this.backgroundColor;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(startX + this.w, startY);
    context.lineTo(startX + this.w, startY + this.h);
    context.lineTo(startX, startY + this.h);
    context.lineTo(startX, startY);
    context.closePath();
    context.stroke();
    context.fill();

    if (this.nullPointer) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + this.w, startY + this.h);
        context.closePath();
        context.stroke();
    }

    context.fillStyle = this.labelColor;

    context.textAlign = 'center';
    context.font = '10px sans-serif';
    context.textBaseline = 'middle';
    context.lineWidth = 1;
    context.fillText(this.label, this.x, this.y);
};

AnimatedRectangle.prototype.setText = function (newText, textIndex) {
    this.label = newText;
};

AnimatedRectangle.prototype.createUndoDelete = function () {
    return new UndoDeleteRectangle(this.objectID, this.label, this.x, this.y, this.w, this.h, this.xJustify, this.yJustify, this.backgroundColor, this.foregroundColor, this.highlighted, this.layer);
};

AnimatedRectangle.prototype.setHighlight = function (value) {
    this.highlighted = value;
};

function UndoDeleteRectangle(id, lab, x, y, w, h, xJust, yJust, bgColor, fgColor, highlight, lay) {
    this.objectID = id;
    this.posX = x;
    this.posY = y;
    this.width = w;
    this.height = h;
    this.xJustify = xJust;
    this.yJustify = yJust;
    this.backgroundColor = bgColor;
    this.foregroundColor = fgColor;
    this.nodeLabel = lab;
    this.layer = lay;
    this.highlighted = highlight;
}

UndoDeleteRectangle.prototype = new UndoBlock();
UndoDeleteRectangle.prototype.constructor = UndoDeleteRectangle;

UndoDeleteRectangle.prototype.undoInitialStep = function (world) {
    world.addRectangleObject(this.objectID, this.nodeLabel, this.width, this.height, this.xJustify, this.yJustify, this.backgroundColor, this.foregroundColor);
    world.setNodePosition(this.objectID, this.posX, this.posY);
    world.setLayer(this.objectID, this.layer);
    world.setHighlight(this.objectID, this.highlighted);
};

var HighlightCircle = function (objectID, color, radius) {
    this.objectID = objectID;
    this.radius = radius;
    this.thickness = 4;
    this.foregroundColor = color;
    this.x = 0;
    this.y = 0;
    this.alpha = 1;
};

HighlightCircle.prototype = new AnimatedObject();
HighlightCircle.prototype.constructor = HighlightCircle;

HighlightCircle.prototype.draw = function (ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.foregroundColor;
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
};

HighlightCircle.prototype.createUndoDelete = function () {
    return new UndoDeleteHighlightCircle(this.objectID, this.x, this.y, this.foregroundColor, this.radius, this.layer, this.alpha);
};

function UndoDeleteHighlightCircle(objectID, x, y, circleColor, r, layer, alpha) {
    this.objectID = objectID;
    this.x = x;
    this.y = y;
    this.color = circleColor;
    this.r = r;
    this.layer = layer;
    this.alpha = alpha
}

UndoDeleteHighlightCircle.prototype = new UndoBlock();
UndoDeleteHighlightCircle.prototype.constructor = UndoDeleteHighlightCircle;

UndoDeleteHighlightCircle.prototype.undoInitialStep = function (world) {
    world.addHighlightCircleObject(this.objectID, this.color, this.r);
    world.setLayer(this.objectID, this.layer);
    world.setNodePosition(this.objectID, this.x, this.y);
    world.setAlpha(this.objectID, this.alpha)
};

var LINE_maxHeightDiff = 5;
var LINE_minHeightDiff = 3;
var LINE_range = LINE_maxHeightDiff - LINE_minHeightDiff + 1;

function Line(n1, n2, color, cv, d, weight, anchorIndex) {
    this.arrowHeight = 8;
    this.arrowWidth = 4;

    this.Node1 = n1;
    this.Node2 = n2;
    this.Dirty = false;
    this.directed = d;
    this.edgeColor = color;
    this.edgeLabel = weight;
    this.highlighted = false;
    this.addedToScene = true;
    this.anchorPoint = anchorIndex;
    this.highlightDiff = 0;
    this.curve = cv;

    this.alpha = 1.0;
    this.color = function color() {
        return this.edgeColor;
    };

    this.setColor = function (newColor) {
        this.edgeColor = newColor;
        Dirty = true;
    };

    this.setHighlight = function (highlightVal) {
        this.highlighted = highlightVal;
    };

    this.pulseHighlight = function (frameNum) {
        if (this.highlighted) {
            var frameMod = frameNum / 14.0;
            var delta = Math.abs((frameMod) % (2 * LINE_range - 2) - LINE_range + 1)
            this.highlightDiff = delta + LINE_minHeightDiff;
            Dirty = true;
        }
    };

    this.hasNode = function (n) {
        return ((this.Node1 == n) || (this.Node2 == n));
    };

    this.createUndoDisconnect = function () {
        return new UndoConnect(this.Node1.objectID, this.Node2.objectID, true, this.edgeColor, this.directed, this.curve, this.edgeLabel, this.anchorPoint);
    };

    this.sign = function (n) {
        if (n > 0) {
            return 1;
        }
        else {
            return -1;
        }
    };

    this.drawArrow = function (pensize, color, context) {
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = pensize;
        var fromPos = this.Node1.getTailPointerAttachPos(this.Node2.x, this.Node2.y, this.anchorPoint);
        var toPos = this.Node2.getHeadPointerAttachPos(this.Node1.x, this.Node1.y);

        var deltaX = toPos[0] - fromPos[0];
        var deltaY = toPos[1] - fromPos[1];
        var midX = (deltaX) / 2.0 + fromPos[0];
        var midY = (deltaY) / 2.0 + fromPos[1];
        var controlX = midX - deltaY * this.curve;

        var controlY = midY + deltaX * this.curve;

        context.beginPath();
        context.moveTo(fromPos[0], fromPos[1]);
        context.quadraticCurveTo(controlX, controlY, toPos[0], toPos[1]);
        context.stroke();
        var labelPosX = 0.25 * fromPos[0] + 0.5 * controlX + 0.25 * toPos[0];
        var labelPosY = 0.25 * fromPos[1] + 0.5 * controlY + 0.25 * toPos[1];

        var midLen = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
        if (midLen != 0) {
            labelPosX += (-deltaY * this.sign(this.curve)) / midLen * 10;
            labelPosY += ( deltaX * this.sign(this.curve)) / midLen * 10;
        }

        context.textAlign = 'center';
        context.font = '10px sans-serif';
        context.textBaseline = 'middle';
        context.fillText(this.edgeLabel, labelPosX, labelPosY);

        if (this.directed) {
            var xVec = controlX - toPos[0];
            var yVec = controlY - toPos[1];
            var len = Math.sqrt(xVec * xVec + yVec * yVec);

            if (len > 0) {
                xVec = xVec / len;
                yVec = yVec / len;

                context.beginPath();
                context.moveTo(toPos[0], toPos[1]);
                context.lineTo(toPos[0] + xVec * this.arrowHeight - yVec * this.arrowWidth, toPos[1] + yVec * this.arrowHeight + xVec * this.arrowWidth);
                context.lineTo(toPos[0] + xVec * this.arrowHeight + yVec * this.arrowWidth, toPos[1] + yVec * this.arrowHeight - xVec * this.arrowWidth);
                context.lineTo(toPos[0], toPos[1]);
                context.closePath();
                context.stroke();
                context.fill();
            }
        }
    };


    this.draw = function (ctx) {
        if (!this.addedToScene) {
            return;
        }
        ctx.globalAlpha = this.alpha;

        if (this.highlighted)
            this.drawArrow(this.highlightDiff, "#ddd", ctx);
        this.drawArrow(1, this.edgeColor, ctx);
    }
}

function UndoConnect(from, to, createConnection, edgeColor, isDirected, cv, lab, anch) {
    this.fromID = from;
    this.toID = to;
    this.connect = createConnection;
    this.color = edgeColor;
    this.directed = isDirected;
    this.curve = cv;
    this.edgeLabel = lab;
    this.anchorPoint = anch;
}

UndoConnect.prototype.undoInitialStep = function (world) {
    if (this.connect) {
        world.connectEdge(this.fromID, this.toID, this.color, this.curve, this.directed, this.edgeLabel, this.anchorPoint);
    }
    else {
        world.disconnect(this.fromID, this.toID);
    }
};

UndoConnect.prototype.addUndoAnimation = function (animationList) {
    return false;
};

