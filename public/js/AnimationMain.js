var objectManager;
var animationManager;
var canvas;
var timer;

function initCanvas() {
    var element = document.createElement("div");
    var newTable = document.createElement("table");
    var midLevel = document.createElement("tr");
    var bottomLevel = document.createElement("td");
    canvas =  document.getElementById("canvas");
    objectManager = new ObjectManager();
    animationManager = new AnimationManager(objectManager);
    element.setAttribute("display", "inline-block");
    element.setAttribute("float", "left");
    midLevel.appendChild(bottomLevel);
    bottomLevel.appendChild(element);
    newTable.appendChild(midLevel);
    midLevel = document.createElement("tr");
    bottomLevel = document.createElement("td");
    bottomLevel.align = "center";
    midLevel.appendChild(bottomLevel);
    newTable.appendChild(midLevel);
    element.setAttribute("style", "width:200px");
    objectManager.width = canvas.width;
    objectManager.height = canvas.height;
    return animationManager;
}

function timeout() {
    timer = setTimeout('timeout()', 30);
    animationManager.update();
    objectManager.draw();
}

function AnimationManager(objectManager) {
    this.animatedObjects = objectManager;
    this.AnimationSteps = [];
    this.currentAnimation = 0;
    this.previousAnimationSteps = [];
    this.currFrame = 0;
    this.animationBlockLength = 0;
    this.currentBlock = null;
    this.undoStack = [];
    this.doingUndo = false;
    this.undoAnimationStepIndices = [];
    this.undoAnimationStepIndicesStack = [];
    this.animationBlockLength = 10;

    this.lerp = function(from, to, percent) {
        return (to - from) * percent + from;
    };

    this.parseBool = function(str) {
        var uppercase = str.toUpperCase();
        return !(['False', 'f', ' 0', '0', ''].indexOf(uppercase) > -1);
    };

    this.parseColor = function(clr) {
        if (clr.charAt(0) == "#") {
            return clr;
        } else if (clr.substring(0,2) == "0x") {
            return "#" + clr.substring(2);
        }
    };

    this.startNextBlock = function() {
        var undoBlock = [];
        var foundBreak= false;
        var anyAnimations= false;
        this.awaitingStep = false;
        this.currentBlock = [];

        if (this.currentAnimation == this.AnimationSteps.length ) {
            this.currentlyAnimating = false;
            this.awaitingStep = false;
            this.fireEvent("AnimationEnded","NoData");
            clearTimeout(timer);
            this.animatedObjects.update();
            this.animatedObjects.draw();
            return;
        }

        this.undoAnimationStepIndices.push(this.currentAnimation);

        while (this.currentAnimation < this.AnimationSteps.length && !foundBreak) {
            var nextCommand = this.AnimationSteps[this.currentAnimation].split("<;>");
            if (nextCommand[0].toUpperCase() == "CREATECIRCLE") {
                this.animatedObjects.addCircleObject(parseInt(nextCommand[1]), nextCommand[2]);
                if (nextCommand.length > 4) {
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[3]), parseInt(nextCommand[4]));
                }
                undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
            } else if (nextCommand[0].toUpperCase() == "CONNECT") {
                if (nextCommand.length > 7) {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        this.parseColor(nextCommand[3]),
                        parseFloat(nextCommand[4]),
                        this.parseBool(nextCommand[5]),
                        nextCommand[6],
                        parseInt(nextCommand[7]));
                } else if (nextCommand.length > 6) {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        this.parseColor(nextCommand[3]),
                        parseFloat(nextCommand[4]),
                        this.parseBool(nextCommand[5]),
                        nextCommand[6],
                        0);
                } else if (nextCommand.length > 5) {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        this.parseColor(nextCommand[3]),
                        parseFloat(nextCommand[4]),
                        this.parseBool(nextCommand[5]),
                        "",
                        0);
                } else if (nextCommand.length > 4) {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        this.parseColor(nextCommand[3]),
                        parseFloat(nextCommand[4]),
                        true,
                        "",
                        0);
                } else if (nextCommand.length > 3) {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        this.parseColor(nextCommand[3]),
                        0.0,
                        true,
                        "",
                        0);
                } else {
                    this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                        parseInt(nextCommand[2]),
                        "#000000",
                        0.0,
                        true,
                        "",
                        0);

                }
                undoBlock.push(new UndoConnect(parseInt(nextCommand[1]), parseInt (nextCommand[2]), false));
            } else if (nextCommand[0].toUpperCase() == "CREATERECTANGLE") {
                if (nextCommand.length == 9) {
                    this.animatedObjects.addRectangleObject(parseInt(nextCommand[1]),
                        nextCommand[2],
                        parseInt(nextCommand[3]),
                        parseInt(nextCommand[4]),
                        nextCommand[7],
                        nextCommand[8],
                        "#ffffff",
                        "#000000");
                } else {
                    this.animatedObjects.addRectangleObject(parseInt(nextCommand[1]),
                        nextCommand[2],
                        parseInt(nextCommand[3]),
                        parseInt(nextCommand[4]),
                        "center",
                        "center",
                        "#ffffff",
                        "#000000");
                }

                if (nextCommand.length > 6) {
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                }
                undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
            } else if (nextCommand[0].toUpperCase() == "MOVE") {
                var objectID = parseInt(nextCommand[1]);
                var nextAnim =  new SingleAnimation(objectID,
                    this.animatedObjects.getNodeX(objectID),
                    this.animatedObjects.getNodeY(objectID),
                    parseInt(nextCommand[2]),
                    parseInt(nextCommand[3]));
                this.currentBlock.push(nextAnim);

                undoBlock.push(new UndoMove(nextAnim.objectID, nextAnim.toX, nextAnim.toY, nextAnim.fromX, nextAnim.fromY));

                anyAnimations = true;
            } else if (nextCommand[0].toUpperCase() == "MOVETOALIGNRIGHT") {
                var id = parseInt(nextCommand[1]);
                var otherId = parseInt(nextCommand[2]);
                var newXY = this.animatedObjects.getAlignRightPos(id, otherId);
                var nextAnim =  new SingleAnimation(id,
                    this.animatedObjects.getNodeX(id),
                    this.animatedObjects.getNodeY(id),
                    newXY[0],
                    newXY[1]);
                this.currentBlock.push(nextAnim);
                undoBlock.push(new UndoMove(nextAnim.objectID, nextAnim.toX, nextAnim.toY, nextAnim.fromX, nextAnim.fromY));
                anyAnimations = true;
            } else if (nextCommand[0].toUpperCase() == "STEP") {
                foundBreak = true;
            } else if (nextCommand[0].toUpperCase() == "SETFOREGROUNDCOLOR") {
                var id = parseInt(nextCommand[1]);
                var oldColor = this.animatedObjects.foregroundColor(id);
                this.animatedObjects.setForegroundColor(id, this.parseColor(nextCommand[2]));
                undoBlock.push(new UndoSetForegroundColor(id, oldColor));
            } else if (nextCommand[0].toUpperCase() == "SETBACKGROUNDCOLOR") {
                id = parseInt(nextCommand[1]);
                oldColor = this.animatedObjects.backgroundColor(id);
                this.animatedObjects.setBackgroundColor(id, this.parseColor(nextCommand[2]));
                undoBlock.push(new UndoSetBackgroundColor(id, oldColor));
            } else if (nextCommand[0].toUpperCase() == "SETHIGHLIGHT") {
                var newHighlight = this.parseBool(nextCommand[2]);
                this.animatedObjects.setHighlight( parseInt(nextCommand[1]), newHighlight);
                undoBlock.push(new UndoHighlight( parseInt(nextCommand[1]), !newHighlight));
            } else if (nextCommand[0].toUpperCase() == "DISCONNECT") {
                var undoConnect = this.animatedObjects.disconnect(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
                if (undoConnect != null) {
                    undoBlock.push(undoConnect);
                }
            } else if (nextCommand[0].toUpperCase() == "SETALPHA") {
                var oldAlpha = this.animatedObjects.getAlpha(parseInt(nextCommand[1]));
                this.animatedObjects.setAlpha(parseInt(nextCommand[1]), parseFloat(nextCommand[2]));
                undoBlock.push(new UndoSetAlpha(parseInt(nextCommand[1]), oldAlpha));
            } else if (nextCommand[0].toUpperCase() == "SETTEXT") {
                if (nextCommand.length > 3) {
                    var oldText = this.animatedObjects.getText(parseInt(nextCommand[1]), parseInt(nextCommand[3]));
                    this.animatedObjects.setText(parseInt(nextCommand[1]), nextCommand[2], parseInt(nextCommand[3]));
                    if (oldText != undefined) {
                        undoBlock.push(new UndoSetText(parseInt(nextCommand[1]), oldText, parseInt(nextCommand[3]) ));
                    }
                } else {
                    oldText = this.animatedObjects.getText(parseInt(nextCommand[1]), 0);
                    this.animatedObjects.setText(parseInt(nextCommand[1]), nextCommand[2], 0);
                    if (oldText != undefined)
                    {
                        undoBlock.push(new UndoSetText(parseInt(nextCommand[1]), oldText, 0));
                    }
                }
            } else if (nextCommand[0].toUpperCase() == "DELETE") {
                var objectID  = parseInt(nextCommand[1]);

                var i;
                var removedEdges = this.animatedObjects.deleteIncident(objectID);
                if (removedEdges.length > 0)
                {
                    undoBlock = undoBlock.concat(removedEdges);
                }
                var obj = this.animatedObjects.getObject(objectID);
                if (obj != null)
                {
                    undoBlock.push(obj.createUndoDelete());
                    this.animatedObjects.removeObject(objectID);
                }
            } else if (nextCommand[0].toUpperCase() == "CREATEHIGHLIGHTCIRCLE") {
                if (nextCommand.length > 5)
                {
                    this.animatedObjects.addHighlightCircleObject(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), parseFloat(nextCommand[5]));
                }
                else
                {
                    this.animatedObjects.addHighlightCircleObject(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), 20);
                }
                if (nextCommand.length > 4)
                {
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[3]), parseInt(nextCommand[4]));
                }
                undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
            } else if (nextCommand[0].toUpperCase() == "CREATELABEL") {
                if (nextCommand.length == 6) {
                    this.animatedObjects.addLabelObject(parseInt(nextCommand[1]), nextCommand[2], this.parseBool(nextCommand[5]));
                } else {
                    this.animatedObjects.addLabelObject(parseInt(nextCommand[1]), nextCommand[2], true);
                } if (nextCommand.length >= 5) {
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseFloat(nextCommand[3]), parseFloat(nextCommand[4]));
                }
                undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
            } else if (nextCommand[0].toUpperCase() == "SETEDGECOLOR") {
                var from = parseInt(nextCommand[1]);
                var to = parseInt(nextCommand[2]);
                var newColor = this.parseColor(nextCommand[3]);
                var oldColor = this.animatedObjects.setEdgeColor(from, to, newColor);
                undoBlock.push(new UndoSetEdgeColor(from, to, oldColor));
            } else if (nextCommand[0].toUpperCase() == "SETEDGEALPHA") {
                var from = parseInt(nextCommand[1]);
                var to = parseInt(nextCommand[2]);
                var newAlpha = parseFloat(nextCommand[3]);
                var oldAplpha = this.animatedObjects.setEdgeAlpha(from, to, newAlpha);
                undoBlock.push(new UndoSetEdgeAlpha(from, to, oldAplpha));
            } else if (nextCommand[0].toUpperCase() == "SETEDGEHIGHLIGHT") {
                var newHighlight = this.parseBool(nextCommand[3]);
                var from = parseInt(nextCommand[1]);
                var to = parseInt(nextCommand[2]);
                var oldHighlight = this.animatedObjects.setEdgeHighlight(from, to, newHighlight);
                undoBlock.push(new UndoHighlightEdge(from, to, oldHighlight));
            } else if (nextCommand[0].toUpperCase() == "SETHEIGHT") {
                id = parseInt(nextCommand[1]);
                var oldHeight = this.animatedObjects.getHeight(id);
                this.animatedObjects.setHeight(id, parseInt(nextCommand[2]));
                undoBlock.push(new UndoSetHeight(id, oldHeight));
            } else if (nextCommand[0].toUpperCase() == "SETLAYER") {
                this.animatedObjects.setLayer(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "CREATELINKEDLIST") {
                if (nextCommand.length == 11) {
                    this.animatedObjects.addLinkedListObject(parseInt(nextCommand[1]), nextCommand[2],
                        parseInt(nextCommand[3]), parseInt(nextCommand[4]), parseFloat(nextCommand[7]),
                        this.parseBool(nextCommand[8]), this.parseBool(nextCommand[9]),parseInt(nextCommand[10]), "#FFFFFF", "#000000");
                } else {
                    this.animatedObjects.addLinkedListObject(parseInt(nextCommand[1]), nextCommand[2], parseInt(nextCommand[3]), parseInt(nextCommand[4]), 0.25, true, false, 1, "#FFFFFF", "#000000");
                } if (nextCommand.length > 6) {
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                }
            } else if (nextCommand[0].toUpperCase() == "SETNULL") {
                var oldNull = this.animatedObjects.getNull(parseInt(nextCommand[1]));
                this.animatedObjects.setNull(parseInt(nextCommand[1]), this.parseBool(nextCommand[2]));
                undoBlock.push(new UndoSetNull(parseInt(nextCommand[1]), oldNull));
            } else if (nextCommand[0].toUpperCase() == "SETTEXTCOLOR") {
                if (nextCommand.length > 3) {
                    oldColor = this.animatedObjects.getTextColor(parseInt(nextCommand[1]), parseInt(nextCommand[3]));
                    this.animatedObjects.setTextColor(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), parseInt(nextCommand[3]));
                    undoBlock.push(new UndoSetTextColor(parseInt(nextCommand[1]), oldColor, parseInt(nextCommand[3]) ));
                } else {
                    oldColor = this.animatedObjects.getTextColor(parseInt(nextCommand[1]), 0);
                    this.animatedObjects.setTextColor(parseInt(nextCommand[1]),this.parseColor(nextCommand[2]), 0);
                    undoBlock.push(new UndoSetTextColor(parseInt(nextCommand[1]), oldColor, 0));
                }
            } else if (nextCommand[0].toUpperCase() == "CREATEBTREENODE") {
                this.animatedObjects.addBTreeNode(parseInt(nextCommand[1]), parseFloat(nextCommand[2]), parseFloat(nextCommand[3]),
                    parseInt(nextCommand[4]),this.parseColor(nextCommand[7]), this.parseColor(nextCommand[8]));
                this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
            } else if (nextCommand[0].toUpperCase() == "SETWIDTH") {
                var id = parseInt(nextCommand[1]);
                this.animatedObjects.setWidth(id, parseInt(nextCommand[2]));
                var oldWidth = this.animatedObjects.getWidth(id);
                undoBlock.push(new UndoSetWidth(id, oldWidth));
            } else if (nextCommand[0].toUpperCase() == "SETNUMELEMENTS") {
                var oldElem = this.animatedObjects.getObject(parseInt(nextCommand[1]));
                undoBlock.push(new UndoSetNumElements(oldElem, parseInt(nextCommand[2])));
                this.animatedObjects.setNumElements(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "SETPOSITION") {
                var id = parseInt(nextCommand[1])
                var oldX = this.animatedObjects.getNodeX(id);
                var oldY = this.animatedObjects.getNodeY(id);
                undoBlock.push(new UndoSetPosition(id, oldX, oldY));
                this.animatedObjects.setNodePosition(id, parseInt(nextCommand[2]), parseInt(nextCommand[3]));
            } else if (nextCommand[0].toUpperCase() == "ALIGNRIGHT") {
                var id = parseInt(nextCommand[1])
                var oldX = this.animatedObjects.getNodeX(id);
                var oldY = this.animatedObjects.getNodeY(id);
                undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                this.animatedObjects.alignRight(id, parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "ALIGNLEFT") {
                var id = parseInt(nextCommand[1])
                var oldX = this.animatedObjects.getNodeX(id);
                var oldY = this.animatedObjects.getNodeY(id);
                undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                this.animatedObjects.alignLeft(id, parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "ALIGNTOP") {
                var id = parseInt(nextCommand[1])
                var oldX = this.animatedObjects.getNodeX(id);
                var oldY = this.animatedObjects.getNodeY(id);
                undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                this.animatedObjects.alignTop(id, parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "ALIGNBOTTOM") {
                var id = parseInt(nextCommand[1]);
                var oldX = this.animatedObjects.getNodeX(id);
                var oldY = this.animatedObjects.getNodeY(id);
                undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                this.animatedObjects.alignBottom(id, parseInt(nextCommand[2]));
            } else if (nextCommand[0].toUpperCase() == "SETHIGHLIGHTINDEX") {
                var id = parseInt(nextCommand[1]);
                var index = parseInt(nextCommand[2]);
                var oldIndex = this.animatedObjects.getHighlightIndex(id);
                undoBlock.push(new UndoSetHighlightIndex(id, oldIndex));
                this.animatedObjects.setHighlightIndex(id,index);
            }

            this.currentAnimation = this.currentAnimation+1;
        }
        this.currFrame = 0;
        this.undoStack.push(undoBlock);
    };

    this.StartNewAnimation =  function(commands) {
        clearTimeout(timer);

        if (this.AnimationSteps != null) {
            this.previousAnimationSteps.push(this.AnimationSteps);
            this.undoAnimationStepIndicesStack.push(this.undoAnimationStepIndices);
        }

        if (commands == undefined || commands.length == 0) {
            this.AnimationSteps = ["Step"];
        } else {
            this.AnimationSteps = commands;
        }

        this.undoAnimationStepIndices = new Array();
        this.currentAnimation = 0;
        this.startNextBlock();
        this.currentlyAnimating = true;
        this.fireEvent("AnimationStarted","NoData");
        timer = setTimeout('timeout()', 30);
    };

    this.step = function() {
        if (this.awaitingStep) {
            this.startNextBlock();
            this.fireEvent("AnimationStarted","NoData");
            this.currentlyAnimating = true;
            clearTimeout(timer);
            timer = setTimeout('timeout()', 30);
        }
    };

    this.clearHistory = function() {
        this.undoStack = [];
        this.undoAnimationStepIndices = null;
        this.previousAnimationSteps = [];
        this.undoAnimationStepIndicesStack = [];
        this.AnimationSteps = null;
        this.fireEvent("AnimationUndoUnavailable","NoData");
        clearTimeout(timer);
        this.animatedObjects.update();
        this.animatedObjects.draw();
    };

    this.skipForward = function() {
        if (this.currentlyAnimating) {
            this.animatedObjects.runFast = true;
            while (this.AnimationSteps != null && this.currentAnimation < this.AnimationSteps.length) {
                var i;
                for (i = 0; this.currentBlock != null && i < this.currentBlock.length; i++) {
                    var objectID = this.currentBlock[i].objectID;
                    this.animatedObjects.setNodePosition(objectID,
                        this.currentBlock[i].toX,
                        this.currentBlock[i].toY);
                }

                if (this.doingUndo) {
                    this.finishUndoBlock(this.undoStack.pop())
                }

                this.startNextBlock();

                for (i= 0; i < this.currentBlock.length; i++) {
                    var objectID = this.currentBlock[i].objectID;
                    this.animatedObjects.setNodePosition(objectID,
                        this.currentBlock[i].toX,
                        this.currentBlock[i].toY);
                }
            }

            this.animatedObjects.update();
            this.currentlyAnimating = false;
            this.awaitingStep = false;
            this.doingUndo = false;

            this.animatedObjects.runFast = false;
            this.fireEvent("AnimationEnded","NoData");
            clearTimeout(timer);
            this.animatedObjects.update();
            this.animatedObjects.draw();
        }
    };

    this.finishUndoBlock = function(undoBlock) {
        for (var i = undoBlock.length - 1; i >= 0; i--) {
            undoBlock[i].undoInitialStep(this.animatedObjects);

        }
        this.doingUndo = false;

        if (this.undoAnimationStepIndices.length == 0) {
            this.awaitingStep = false;
            this.currentlyAnimating = false;
            this.undoAnimationStepIndices = this.undoAnimationStepIndicesStack.pop();
            this.AnimationSteps = this.previousAnimationSteps.pop();
            this.fireEvent("AnimationEnded","NoData");
            this.fireEvent("AnimationUndo","NoData");
            this.currentBlock = [];
            if (this.undoStack == null || this.undoStack.length == 0) {
                this.currentlyAnimating = false;
                this.awaitingStep = false;
                this.fireEvent("AnimationUndoUnavailable","NoData");
            }
            clearTimeout(timer);
            this.animatedObjects.update();
            this.animatedObjects.draw();
            return false;
        }
        return true;
    };

    this.setLayer = function(shown, layers) {
        this.animatedObjects.setLayer(shown, layers);
        this.animatedObjects.draw();
    };

    this.setAllLayers = function(layers) {
        this.animatedObjects.setAllLayers(layers);
        this.animatedObjects.draw();
    };

    this.update = function() {
        if (this.currentlyAnimating) {
            this.currFrame = this.currFrame + 1;
            var i;
            for (i = 0; i < this.currentBlock.length; i++)
            {
                if (this.currFrame == this.animationBlockLength || (this.currFrame == 1 && this.animationBlockLength == 0))
                {
                    this.animatedObjects.setNodePosition(this.currentBlock[i].objectID,
                        this.currentBlock[i].toX,
                        this.currentBlock[i].toY);
                }
                else if (this.currFrame < this.animationBlockLength)
                {
                    var objectID = this.currentBlock[i].objectID;
                    var percent = 1 / (this.animationBlockLength - this.currFrame);
                    var newX = this.lerp(this.animatedObjects.getNodeX(objectID), this.currentBlock[i].toX, percent);
                    var newY = this.lerp(this.animatedObjects.getNodeY(objectID), this.currentBlock[i].toY, percent);
                    this.animatedObjects.setNodePosition(objectID, newX, newY);
                }
            }
            if (this.currFrame >= this.animationBlockLength)
            {
                if (this.doingUndo)
                {
                    if (this.finishUndoBlock(this.undoStack.pop()))
                    {
                        this.awaitingStep = true;
                        this.fireEvent("AnimationWaiting","NoData");
                    }

                }
                else
                {
                    if (this.animationPaused && (this.currentAnimation < this.AnimationSteps.length))
                    {
                        this.awaitingStep = true;
                        this.fireEvent("AnimationWaiting","NoData");
                        this.currentBlock = [];
                    }
                    else
                    {
                        this.startNextBlock();
                    }
                }
            }
            this.animatedObjects.update();
        }
    }
}

AnimationManager.prototype = new EventListener();
AnimationManager.prototype.constructor = AnimationManager;

function SingleAnimation(id, fromX, fromY, toX, toY) {
    this.objectID = id;
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
}
