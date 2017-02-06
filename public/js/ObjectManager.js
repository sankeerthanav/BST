function UndoBlock() {
}

function UndoMove(id, fmX, fmy, tx, ty) {
    this.objectID = id;
    this.fromX = fmX;
    this.fromY = fmy;
    this.toX = tx;
    this.toY = ty;
}

UndoMove.prototype = new UndoBlock();
UndoMove.prototype.constructor = UndoMove;

function UndoCreate(id) {
    this.objectID = id;
}

UndoCreate.prototype = new UndoBlock();
UndoCreate.prototype.constructor = UndoCreate;

UndoCreate.prototype.undoInitialStep = function (world) {
    world.removeObject(this.objectID);
};

function UndoHighlight(id, val) {
    this.objectID = id;
    this.highlightValue = val;
}

UndoHighlight.prototype = new UndoBlock();
UndoHighlight.prototype.constructor = UndoHighlight;

UndoHighlight.prototype.undoInitialStep = function (world) {
    world.setHighlight(this.objectID, this.highlightValue);
};

function UndoSetHeight(id, val) {
    this.objectID = id;
    this.height = val;
}

UndoSetHeight.prototype = new UndoBlock();
UndoSetHeight.prototype.constructor = UndoSetHeight;

UndoSetHeight.prototype.undoInitialStep = function (world) {
    world.setHeight(this.objectID, this.height);
};

function UndoSetWidth(id, val) {
    this.objectID = id;
    this.width = val;
}

UndoSetWidth.prototype = new UndoBlock();
UndoSetWidth.prototype.constructor = UndoSetWidth;

UndoSetWidth.prototype.undoInitialStep = function (world) {
    world.setWidth(this.objectID, this.width);
};

function UndoSetNumElements(obj, newNumElems) {
    this.objectID = obj.objectID;
    this.sizeBeforeChange = obj.getNumElements();
    this.sizeAfterChange = newNumElems;
    if (this.sizeBeforeChange > this.sizeAfterChange) {
        this.labels = new Array(this.sizeBeforeChange - this.sizeAfterChange);
        this.colors = new Array(this.sizeBeforeChange - this.sizeAfterChange);
        for (var i = 0; i < this.sizeBeforeChange - this.sizeAfterChange; i++) {
            this.labels[i] = obj.getText(i + this.sizeAfterChange);
            this.colors[i] = obj.getTextColor(i + this.sizeAfterChange);
        }
    }
}

UndoSetNumElements.prototype = new UndoBlock();
UndoSetNumElements.prototype.constructor = UndoSetNumElements;

UndoSetNumElements.prototype.undoInitialStep = function (world) {
    world.setNumElements(this.objectID, this.sizeBeforeChange);
    if (this.sizeBeforeChange > this.sizeAfterChange) {
        for (var i = 0; i < this.sizeBeforeChange - this.sizeAfterChange; i++) {
            world.setText(this.objectID, this.labels[i], i + this.sizeAfterChange);
            world.setTextColor(this.objectID, this.colors[i], i + this.sizeAfterChange);
        }
    }
};

function UndoSetAlpha(id, alph) {
    this.objectID = id;
    this.alphaVal = alph;
}

UndoSetAlpha.prototype = new UndoBlock();
UndoSetAlpha.prototype.constructor = UndoSetAlpha;

UndoSetAlpha.prototype.undoInitialStep = function (world) {
    world.setAlpha(this.objectID, this.alphaVal);
};

function UndoSetNull(id, nv) {
    this.objectID = id;
    this.nullVal = nv;
}

UndoSetNull.prototype = new UndoBlock();
UndoSetNull.prototype.constructor = UndoSetNull;

UndoSetNull.prototype.undoInitialStep = function (world) {
    world.setNull(this.objectID, this.nullVal);
};

function UndoSetForegroundColor(id, color) {
    this.objectID = id;
    this.color = color;
}

UndoSetForegroundColor.prototype = new UndoBlock();
UndoSetForegroundColor.prototype.constructor = UndoSetForegroundColor;

UndoSetForegroundColor.prototype.undoInitialStep = function (world) {
    world.setForegroundColor(this.objectID, this.color);
};

function UndoSetBackgroundColor(id, color) {
    this.objectID = id;
    this.color = color;
}

UndoSetBackgroundColor.prototype = new UndoBlock();
UndoSetBackgroundColor.prototype.constructor = UndoSetBackgroundColor;

UndoSetBackgroundColor.prototype.undoInitialStep = function (world) {
    world.setBackgroundColor(this.objectID, this.color);
};

function UndoSetHighlightIndex(id, index) {
    this.objectID = id;
    this.index = index;
}

UndoSetHighlightIndex.prototype = new UndoBlock();
UndoSetHighlightIndex.prototype.constructor = UndoSetHighlightIndex;

UndoSetHighlightIndex.prototype.undoInitialStep = function (world) {
    world.setHighlightIndex(this.objectID, this.index);
};

function UndoSetText(id, str, index) {
    this.objectID = id;
    this.newText = str;
    this.labelIndex = index;
}

UndoSetText.prototype = new UndoBlock();
UndoSetText.prototype.constructor = UndoSetText;

UndoSetText.prototype.undoInitialStep = function (world) {
    world.setText(this.objectID, this.newText, this.labelIndex);
};

function UndoSetTextColor(id, color, index) {
    this.objectID = id;
    this.color = color;
    this.index = index;
}

UndoSetTextColor.prototype = new UndoBlock();
UndoSetTextColor.prototype.constructor = UndoSetTextColor;

UndoSetTextColor.prototype.undoInitialStep = function (world) {
    world.setTextColor(this.objectID, this.color, this.index);
};

function UndoHighlightEdge(from, to, val) {
    this.fromID = from;
    this.toID = to;
    this.highlightValue = val;
}

UndoHighlightEdge.prototype = new UndoBlock();
UndoHighlightEdge.prototype.constructor = UndoHighlightEdge;

UndoHighlightEdge.prototype.undoInitialStep = function (world) {
    world.setEdgeHighlight(this.fromID, this.toID, this.highlightValue);
};

function UndoSetEdgeColor(from, to, oldColor) {
    this.fromID = from;
    this.toID = to;
    this.color = oldColor;
}

UndoSetEdgeColor.prototype = new UndoBlock();
UndoSetEdgeColor.prototype.constructor = UndoSetEdgeColor;

UndoSetEdgeColor.prototype.undoInitialStep = function (world) {
    world.setEdgeColor(this.fromID, this.toID, this.color);
};

function UndoSetEdgeAlpha(from, to, oldAplha) {
    this.fromID = from;
    this.toID = to;
    this.alpha = oldAplha;
}

UndoSetEdgeAlpha.prototype = new UndoBlock();
UndoSetEdgeAlpha.prototype.constructor = UndoSetEdgeAlpha;

UndoSetEdgeAlpha.prototype.undoInitialStep = function (world) {
    world.setEdgeAlpha(this.fromID, this.toID, this.alpha);
};

function UndoSetPosition(id, x, y) {
    this.objectID = id;
    this.x = x;
    this.y = y;
}

UndoSetPosition.prototype = new UndoBlock();
UndoSetPosition.prototype.constructor = UndoSetPosition;

UndoSetPosition.prototype.undoInitialStep = function (world) {
    world.setNodePosition(this.objectID, this.x, this.y);
};

function ObjectManager() {
    this.Nodes = [];
    this.Edges = [];
    this.BackEdges = [];
    this.activeLayers = [];
    this.activeLayers[0] = true;
    this.ctx = document.getElementById('canvas').getContext('2d');
    this.framenum = 0;
    this.width = 0;
    this.height = 0;
    this.statusReport = new AnimatedLabel(-1, "", false, 30);
    this.statusReport.x = 30;

    this.draw = function () {
        var i;
        var j;
        this.framenum++;
        if (this.framenum > 1000)
            this.framenum = 0;

        this.ctx.clearRect(0, 0, this.width, this.height); // clear canvas
        this.statusReport.y = this.height - 15;

        for (i = 0; i < this.Nodes.length; i++) {
            if (this.Nodes[i] != null && !this.Nodes[i].highlighted && this.Nodes[i].addedToScene && !this.Nodes[i].alwaysOnTop) {
                this.Nodes[i].draw(this.ctx);
            }
        }

        for (i = 0; i < this.Nodes.length; i++) {
            if (this.Nodes[i] != null && (this.Nodes[i].highlighted && !this.Nodes[i].alwaysOnTop) && this.Nodes[i].addedToScene) {
                this.Nodes[i].pulseHighlight(this.framenum);
                this.Nodes[i].draw(this.ctx);
            }
        }

        for (i = 0; i < this.Nodes.length; i++) {
            if (this.Nodes[i] != null && this.Nodes[i].alwaysOnTop && this.Nodes[i].addedToScene) {
                this.Nodes[i].pulseHighlight(this.framenum);
                this.Nodes[i].draw(this.ctx);
            }
        }

        for (i = 0; i < this.Edges.length; i++) {
            if (this.Edges[i] != null) {
                for (j = 0; j < this.Edges[i].length; j++) {
                    if (this.Edges[i][j].addedToScene) {
                        this.Edges[i][j].pulseHighlight(this.framenum);
                        this.Edges[i][j].draw(this.ctx);
                    }
                }
            }
        }
        this.statusReport.draw(this.ctx);
    };

    this.update = function () {
    };

    this.addHighlightCircleObject = function (objectID, objectColor, radius) {
        var newNode = new HighlightCircle(objectID, objectColor, radius);

        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            throw "addHighlightCircleObject:Object with same ID (" + String(objectID) + ") already Exists!"
        }
        this.Nodes[objectID] = newNode;
    };

    this.setEdgeAlpha = function (fromID, toID, alphaVal) {
        var oldAlpha = 1.0;
        if (this.Edges[fromID] != null &&
            this.Edges[fromID] != undefined) {
            var len = this.Edges[fromID].length;
            for (var i = len - 1; i >= 0; i--) {
                if (this.Edges[fromID][i] != null &&
                    this.Edges[fromID][i] != undefined &&
                    this.Edges[fromID][i].Node2 == this.Nodes[toID]) {
                    oldAlpha = this.Edges[fromID][i].alpha;
                    this.Edges[fromID][i].alpha = alphaVal;
                }
            }
        }
        return oldAlpha;
    };

    this.setAlpha = function (nodeID, alphaVal) {
        if (this.Nodes[nodeID] != null && this.Nodes[nodeID] != undefined) {
            this.Nodes[nodeID].setAlpha(alphaVal);
        }
    };

    this.getAlpha = function (nodeID) {
        if (this.Nodes[nodeID] != null && this.Nodes[nodeID] != undefined) {
            return this.Nodes[nodeID].getAlpha();
        } else {
            return -1;
        }
    };

    this.getTextColor = function (nodeID, index) {
        if (this.Nodes[nodeID] != null && this.Nodes[nodeID] != undefined) {
            return this.Nodes[nodeID].getTextColor(index);
        } else {
            return "#000000";
        }
    };

    this.setTextColor = function (nodeID, color, index) {
        if (this.Nodes[nodeID] != null && this.Nodes[nodeID] != undefined) {
            this.Nodes[nodeID].setTextColor(color, index);
        }
    };


    this.setHighlightIndex = function (nodeID, index) {
        if (this.Nodes[nodeID] != null && this.Nodes[nodeID] != undefined) {
            this.Nodes[nodeID].setHighlightIndex(index);
        }
    };

    this.setAllLayers = function (layers) {
        this.activeLayers = [];
        for (var i = 0; i < layers.length; i++) {
            this.activeLayers[layers[i]] = true;
        }
        this.resetLayers();
    };

    this.resetLayers = function () {
        var i;
        for (i = 0; i < this.Nodes.length; i++) {
            if (this.Nodes[i] != null && this.Nodes[i] != undefined) {
                this.Nodes[i].addedToScene = this.activeLayers[this.Nodes[i].layer] == true;
            }
        }

        for (i = this.Edges.length - 1; i >= 0; i--) {
            if (this.Edges[i] != null && this.Edges[i] != undefined) {
                for (var j = 0; j < this.Edges[i].length; j++) {
                    if (this.Edges[i][j] != null && this.Edges[i][j] != undefined) {
                        this.Edges[i][j].addedToScene =
                            this.activeLayers[this.Edges[i][j].Node1.layer] == true &&
                            this.activeLayers[this.Edges[i][j].Node2.layer] == true;
                    }
                }
            }
        }
    };


    this.setLayer = function (objectID, layer) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            this.Nodes[objectID].layer = layer;
            if (this.activeLayers[layer]) {
                this.Nodes[objectID].addedToScene = true;
            } else {
                this.Nodes[objectID].addedToScene = false;
            }
            if (this.Edges[objectID] != null && this.Edges[objectID] != undefined) {
                for (var i = 0; i < this.Edges[objectID].length; i++) {
                    var nextEdge = this.Edges[objectID][i];
                    if (nextEdge != null && nextEdge != undefined) {
                        nextEdge.addedToScene = ((nextEdge.Node1.addedToScene) &&
                        (nextEdge.Node2.addedToScene));
                    }
                }
            }
            if (this.BackEdges[objectID] != null && this.BackEdges[objectID] != undefined) {
                for (var i = 0; i < this.BackEdges[objectID].length; i++) {
                    var nextEdge = this.BackEdges[objectID][i];
                    if (nextEdge != null && nextEdge != undefined) {
                        nextEdge.addedToScene = ((nextEdge.Node1.addedToScene) &&
                        (nextEdge.Node2.addedToScene));
                    }
                }
            }
        }
    };

    this.clearAllObjects = function () {
        this.Nodes = [];
        this.Edges = [];
        this.BackEdges = [];
    };


    this.setForegroundColor = function (objectID, color) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            this.Nodes[objectID].setForegroundColor(color);
        }
    };

    this.setBackgroundColor = function (objectID, color) {
        if (this.Nodes[objectID] != null) {
            this.Nodes[objectID].setBackgroundColor(color);
        }
    };

    this.setHighlight = function (nodeID, val) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return;
        }
        this.Nodes[nodeID].setHighlight(val);
    };


    this.getHighlight = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return false;
        }
        return this.Nodes[nodeID].getHighlight();
    };


    this.getHighlightIndex = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return false;
        }
        return this.Nodes[nodeID].getHighlightIndex();
    };

    this.setWidth = function (nodeID, val) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return;
        }
        this.Nodes[nodeID].setWidth(val);
    };

    this.setHeight = function (nodeID, val) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return;
        }
        this.Nodes[nodeID].setHeight(val);
    };


    this.getHeight = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return -1;
        }
        return this.Nodes[nodeID].getHeight();
    };

    this.getWidth = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return -1;
        }
        return this.Nodes[nodeID].getWidth();
    };

    this.backgroundColor = function (objectID) {
        if (this.Nodes[objectID] != null) {
            return this.Nodes[objectID].backgroundColor;
        } else {
            return '#000000';
        }
    };

    this.foregroundColor = function (objectID) {
        if (this.Nodes[objectID] != null) {
            return this.Nodes[objectID].foregroundColor;
        } else {
            return '#000000';
        }
    };


    this.disconnect = function (objectIDfrom, objectIDto) {
        var undo = null;
        var i;
        if (this.Edges[objectIDfrom] != null) {
            var len = this.Edges[objectIDfrom].length;
            for (i = len - 1; i >= 0; i--) {
                if (this.Edges[objectIDfrom][i] != null && this.Edges[objectIDfrom][i].Node2 == this.Nodes[objectIDto]) {
                    var deleted = this.Edges[objectIDfrom][i];
                    undo = deleted.createUndoDisconnect();
                    this.Edges[objectIDfrom][i] = this.Edges[objectIDfrom][len - 1];
                    len -= 1;
                    this.Edges[objectIDfrom].pop();
                }
            }
        }
        if (this.BackEdges[objectIDto] != null) {
            len = this.BackEdges[objectIDto].length;
            for (i = len - 1; i >= 0; i--) {
                if (this.BackEdges[objectIDto][i] != null && this.BackEdges[objectIDto][i].Node1 == this.Nodes[objectIDfrom]) {
                    deleted = this.BackEdges[objectIDto][i];
                    // Note:  Don't need to remove this child, did it above on the regular edge
                    this.BackEdges[objectIDto][i] = this.BackEdges[objectIDto][len - 1];
                    len -= 1;
                    this.BackEdges[objectIDto].pop();
                }
            }
        }
        return undo;
    };

    this.deleteIncident = function (objectID) {
        var undoStack = [];

        if (this.Edges[objectID] != null) {
            var len = this.Edges[objectID].length;
            for (var i = len - 1; i >= 0; i--) {
                var deleted = this.Edges[objectID][i];
                var node2ID = deleted.Node2.identifier();
                undoStack.push(deleted.createUndoDisconnect());

                var len2 = this.BackEdges[node2ID].length;
                for (var j = len2 - 1; j >= 0; j--) {
                    if (this.BackEdges[node2ID][j] == deleted) {
                        this.BackEdges[node2ID][j] = this.BackEdges[node2ID][len2 - 1];
                        len2 -= 1;
                        this.BackEdges[node2ID].pop();
                    }
                }
            }
            this.Edges[objectID] = null;
        }
        if (this.BackEdges[objectID] != null) {
            len = this.BackEdges[objectID].length;
            for (i = len - 1; i >= 0; i--) {
                deleted = this.BackEdges[objectID][i];
                var node1ID = deleted.Node1.identifier();
                undoStack.push(deleted.createUndoDisconnect());

                len2 = this.Edges[node1ID].length;
                for (j = len2 - 1; j >= 0; j--) {
                    if (this.Edges[node1ID][j] == deleted) {
                        this.Edges[node1ID][j] = this.Edges[node1ID][len2 - 1];
                        len2 -= 1;
                        this.Edges[node1ID].pop();
                    }
                }
            }
            this.BackEdges[objectID] = null;
        }
        return undoStack;
    };


    this.removeObject = function (ObjectID) {
        var OldObject = this.Nodes[ObjectID];
        if (ObjectID == this.Nodes.length - 1) {
            this.Nodes.pop();
        } else {
            this.Nodes[ObjectID] = null;
        }
    };

    this.getObject = function (objectID) {
        if (this.Nodes[objectID] == null || this.Nodes[objectID] == undefined) {
            throw "getObject:Object with ID (" + String(objectID) + ") does not exist"
        }
        return this.Nodes[objectID];
    };


    this.addCircleObject = function (objectID, objectLabel) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            throw "addCircleObject:Object with same ID (" + String(objectID) + ") already Exists!"
        }
        var newNode = new AnimatedCircle(objectID, objectLabel);
        this.Nodes[objectID] = newNode;
    };

    this.getNodeX = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            throw "getting x position of an object that does not exit";
        }
        return this.Nodes[nodeID].x;
    };

    this.getTextWidth = function (text) {
        this.ctx.font = '10px sans-serif';
        if (text == undefined) {
            w = 3;
        }
        var strList = text.split("\n");
        var width = 0;
        if (strList.length == 1) {
            width = this.ctx.measureText(text).width;
        } else {
            for (var i = 0; i < strList.length; i++) {
                width = Math.max(width, this.ctx.measureText(strList[i]).width);
            }
        }

        return width;
    };

    this.setText = function (nodeID, text, index) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return;
            throw "setting text of an object that does not exit";
        }
        this.Nodes[nodeID].setText(text, index, this.getTextWidth(text));
    };

    this.getText = function (nodeID, index) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            throw "getting text of an object that does not exit";
        }
        return this.Nodes[nodeID].getText(index);
    };

    this.getNodeY = function (nodeID) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            throw "getting y position of an object that does not exit";
        }
        return this.Nodes[nodeID].y;
    };


    this.connectEdge = function (objectIDfrom, objectIDto, color, curve, directed, lab, connectionPoint) {
        var fromObj = this.Nodes[objectIDfrom];
        var toObj = this.Nodes[objectIDto];
        if (fromObj == null || toObj == null) {
            throw "Tried to connect two nodes, one didn't exist!";
        }
        var l = new Line(fromObj, toObj, color, curve, directed, lab, connectionPoint);
        if (this.Edges[objectIDfrom] == null || this.Edges[objectIDfrom] == undefined) {
            this.Edges[objectIDfrom] = [];
        }
        if (this.BackEdges[objectIDto] == null || this.BackEdges[objectIDto] == undefined) {
            this.BackEdges[objectIDto] = [];
        }
        l.addedToScene = fromObj.addedToScene && toObj.addedToScene;
        this.Edges[objectIDfrom].push(l);
        this.BackEdges[objectIDto].push(l);
    };


    this.setNull = function (objectID, nullVal) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            this.Nodes[objectID].setNull(nullVal);
        }
    };

    this.getNull = function (objectID) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            return this.Nodes[objectID].getNull();
        }
        return false;
    };

    this.setEdgeColor = function (fromID, toID, color) {
        var oldColor = "#000000";
        if (this.Edges[fromID] != null &&
            this.Edges[fromID] != undefined) {
            var len = this.Edges[fromID].length;
            for (var i = len - 1; i >= 0; i--) {
                if (this.Edges[fromID][i] != null &&
                    this.Edges[fromID][i] != undefined &&
                    this.Edges[fromID][i].Node2 == this.Nodes[toID]) {
                    oldColor = this.Edges[fromID][i].color();
                    this.Edges[fromID][i].setColor(color);
                }
            }
        }
        return oldColor;
    };

    this.alignTop = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        this.Nodes[id1].alignTop(this.Nodes[id2]);
    };

    this.alignLeft = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        this.Nodes[id1].alignLeft(this.Nodes[id2]);
    };

    this.alignRight = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        this.Nodes[id1].alignRight(this.Nodes[id2]);
    };


    this.getAlignRightPos = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        return this.Nodes[id1].getAlignRightPos(this.Nodes[id2]);
    };

    this.getAlignLeftPos = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        return this.Nodes[id1].getAlignLeftPos(this.Nodes[id2]);
    };


    this.alignBottom = function (id1, id2) {
        if (this.Nodes[id1] == null || this.Nodes[id1] == undefined ||
            this.Nodes[id2] == null || this.Nodes[id2] == undefined) {
            throw "Tring to align two nodes, one doesn't exist: " + String(id1) + "," + String(id2);
        }
        this.Nodes[id1].alignBottom(this.Nodes[id2]);
    };


    this.setEdgeHighlight = function (fromID, toID, val) {
        var oldHighlight = false;
        if (this.Edges[fromID] != null &&
            this.Edges[fromID] != undefined) {
            var len = this.Edges[fromID].length;
            for (var i = len - 1; i >= 0; i--) {
                if (this.Edges[fromID][i] != null &&
                    this.Edges[fromID][i] != undefined &&
                    this.Edges[fromID][i].Node2 == this.Nodes[toID]) {
                    oldHighlight = this.Edges[fromID][i].highlighted;
                    this.Edges[fromID][i].setHighlight(val);
                }
            }
        }
        return oldHighlight;
    };

    this.addLabelObject = function (objectID, objectLabel, centering) {
        if (this.Nodes[objectID] != null && this.Nodes[objectID] != undefined) {
            throw new Error("addLabelObject: Object Already Exists!");
        }

        var newLabel = new AnimatedLabel(objectID, objectLabel, centering, this.getTextWidth(objectLabel));
        this.Nodes[objectID] = newLabel;
    };

    this.addLinkedListObject = function (objectID, nodeLabel, width, height, linkPer, verticalOrientation, linkPosEnd, numLabels, backgroundColor, foregroundColor) {
        if (this.Nodes[objectID] != null) {
            throw new Error("addLinkedListObject:Object with same ID already Exists!");
            return;
        }
        var newNode = new AnimatedLinkedList(objectID, nodeLabel, width, height, linkPer, verticalOrientation, linkPosEnd, numLabels, backgroundColor, foregroundColor);
        this.Nodes[objectID] = newNode;
    };

    this.getNumElements = function (objectID) {
        return this.Nodes[objectID].getNumElements();
    };

    this.setNumElements = function (objectID, numElems) {
        this.Nodes[objectID].setNumElements(numElems);
    };

    this.addBTreeNode = function (objectID, widthPerElem, height, numElems, backgroundColor, foregroundColor) {
        backgroundColor = (backgroundColor == undefined) ? "#FFFFFF" : backgroundColor;
        foregroundColor = (foregroundColor == undefined) ? "#FFFFFF" : foregroundColor;

        if (this.Nodes[objectID] != null && Nodes[objectID] != undefined) {
            throw "addBTreeNode:Object with same ID already Exists!";
        }

        var newNode = new AnimatedBTreeNode(objectID, widthPerElem, height, numElems, backgroundColor, foregroundColor);
        this.Nodes[objectID] = newNode;
    };

    this.addRectangleObject = function (objectID, nodeLabel, width, height, xJustify, yJustify, backgroundColor, foregroundColor) {
        if (this.Nodes[objectID] != null || this.Nodes[objectID] != undefined) {
            throw new Error("addRectangleObject:Object with same ID already Exists!");
        }
        var newNode = new AnimatedRectangle(objectID, nodeLabel, width, height, xJustify, yJustify, backgroundColor, foregroundColor);
        this.Nodes[objectID] = newNode;

    };

    this.setNodePosition = function (nodeID, newX, newY) {
        if (this.Nodes[nodeID] == null || this.Nodes[nodeID] == undefined) {
            return;
        }
        if (newX == undefined || newY == undefined) {

            return;
        }
        this.Nodes[nodeID].x = newX;
        this.Nodes[nodeID].y = newY;
    }
}

Function.prototype.bind = function () {
    var _function = this;

    var args = Array.prototype.slice.call(arguments);
    var scope = args.shift();
    return function () {
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        return _function.apply(scope, args);
    }
};

function EventListener() {
    this.events = [];
}


EventListener.prototype.removeListener = function (kind, scope, func) {
    if (this.events[kind] == undefined) {
        return;
    }
    var scopeFunctions = null;
    var i;
    for (i = 0; i < this.events[kind].length; i++) {
        if (this.events[kind][i].scope == scope) {
            scopeFunctions = this.events[kind][i];
            break;
        }
    }
    if (scopeFunctions == null) {
        return;
    }
    for (i = 0; i < scopeFunctions.functions.length; i++) {
        if (scopeFunctions.functions[i] == func) {
            scopeFunctions.functions.splice(i, 1);
            return;
        }
    }
};


EventListener.prototype.addListener = function (kind, scope, func) {
    if (this.events[kind] === undefined) {
        this.events[kind] = [];
    }
    var i;
    var scopeFunctions = null;
    for (i = 0; i < this.events[kind].length; i++) {
        if (this.events[kind][i].scope == scope) {
            scopeFunctions = this.events[kind][i];
            break;
        }
    }
    if (scopeFunctions === null) {
        this.events[kind].push({scope: scope, functions: []});
        scopeFunctions = this.events[kind][this.events[kind].length - 1];
    }
    for (i = 0; i < scopeFunctions.functions.length; i++) {
        if (scopeFunctions.functions[i] == func) {
            return;
        }
    }
    scopeFunctions.functions.push(func);
};

EventListener.prototype.fireEvent = function (kind, event) {
    if (this.events[kind] !== undefined) {
        for (var i = 0; i < this.events[kind].length; i++) {
            var objects = this.events[kind][i];
            var functs = objects.functions;
            var scope = objects.scope;
            for (var j = 0; j < functs.length; j++) {
                var func = functs[j];
                func.call(scope, event);
            }
        }
    }

};
