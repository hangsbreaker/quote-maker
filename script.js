
var box = document.getElementById("box");
var boxWrapper = document.getElementById("box-wrapper");
const minWidth = 0;
const minHeight = 0;

var initX, initY, mousePressX, mousePressY, initW, initH, initRotate;

// handle resize
var rightMid = document.getElementById("right-mid");
var leftMid = document.getElementById("left-mid");
var topMid = document.getElementById("top-mid");
var bottomMid = document.getElementById("bottom-mid");

var leftTop = document.getElementById("left-top");
var rightTop = document.getElementById("right-top");
var rightBottom = document.getElementById("right-bottom");
var leftBottom = document.getElementById("left-bottom");

var rotate = document.getElementById("rotate");

function showboxder() {
    document.getElementById('box').style.border = "1px dashed #000";
    document.getElementsByClassName('rotate-link')[0].style.display = 'block';

    let dots = document.getElementsByClassName('dot');
    for (i = 0; i < dots.length; i++) {
        dots[i].style.display = 'block';
    }
}

function hideboxder() {
    document.getElementById('box').style.border = "none";
    document.getElementsByClassName('rotate-link')[0].style.display = 'none';

    let dots = document.getElementsByClassName('dot');
    for (i = 0; i < dots.length; i++) {
        dots[i].style.display = 'none';
    }
}

function repositionElement(x, y, f = 'px') {
    boxWrapper.style.left = x + f;
    boxWrapper.style.top = y + f;
}

function resize(w, h) {
    box.style.width = w + 'px';
    box.style.height = h + 'px';
}


function getCurrentRotation(el) {
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform")
    "none";
    if (tm != "none") {
        var values = tm.split('(')[1].split(')')[0].split(',');
        var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return (angle < 0 ? angle + 360 : angle);
    }
    return 0;
}

function rotateBox(deg) {
    boxWrapper.style.transform = `rotate(${deg}deg)`;
}

// ======================================================================================
// drag support
boxWrapper.addEventListener('touchstart', function (event) {
    var touch = event.touches[0];
    if (event.target.className.indexOf("dot") > -1) {
        return;
    }

    initX = this.offsetLeft;
    initY = this.offsetTop;
    mousePressX = touch.pageX;
    mousePressY = touch.pageY;


    function eventMoveHandlerTouch(event) {
        var touch = event.touches[0];
        repositionElement(initX + (touch.pageX - mousePressX),
            initY + (touch.pageY - mousePressY));
    }

    boxWrapper.addEventListener('touchmove', eventMoveHandlerTouch, false);
    window.addEventListener('touchend', function eventEndHandlerTouch() {
        boxWrapper.removeEventListener('touchmove', eventMoveHandlerTouch, false);
        window.removeEventListener('touchend', eventEndHandlerTouch);
    }, false);

}, false);
// done drag support

function resizeHandlerTouch(event, left = false, top = false, xResize = false, yResize = false) {
    var touch = event.touches[0];
    initX = boxWrapper.offsetLeft;
    initY = boxWrapper.offsetTop;
    mousePressX = touch.pageX;
    mousePressY = touch.pageY;

    initW = box.offsetWidth;
    initH = box.offsetHeight;

    initRotate = getCurrentRotation(boxWrapper);
    var initRadians = initRotate * Math.PI / 180;
    var cosFraction = Math.cos(initRadians);
    var sinFraction = Math.sin(initRadians);
    function eventMoveHandlerTouch(event) {
        var touch = event.touches[0];
        var wDiff = (touch.pageX - mousePressX);
        var hDiff = (touch.pageY - mousePressY);
        var rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
        var rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

        var newW = initW, newH = initH, newX = initX, newY = initY;

        if (xResize) {
            if (left) {
                newW = initW - rotatedWDiff;
                if (newW < minWidth) {
                    newW = minWidth;
                    rotatedWDiff = initW - minWidth;
                }
            } else {
                newW = initW + rotatedWDiff;
                if (newW < minWidth) {
                    newW = minWidth;
                    rotatedWDiff = minWidth - initW;
                }
            }
            newX += 0.5 * rotatedWDiff * cosFraction;
            newY += 0.5 * rotatedWDiff * sinFraction;
        }

        if (yResize) {
            if (top) {
                newH = initH - rotatedHDiff;
                if (newH < minHeight) {
                    newH = minHeight;
                    rotatedHDiff = initH - minHeight;
                }
            } else {
                newH = initH + rotatedHDiff;
                if (newH < minHeight) {
                    newH = minHeight;
                    rotatedHDiff = minHeight - initH;
                }
            }
            newX -= 0.5 * rotatedHDiff * sinFraction;
            newY += 0.5 * rotatedHDiff * cosFraction;
        }

        resize(newW, newH);
        repositionElement(newX, newY);
    }


    window.addEventListener('touchmove', eventMoveHandlerTouch, false);
    window.addEventListener('touchend', function eventEndHandlerTouch() {
        window.removeEventListener('touchmove', eventMoveHandlerTouch, false);
        window.removeEventListener('touchend', eventEndHandlerTouch);
    }, false);
}


rightMid.addEventListener('touchstart', e => resizeHandlerTouch(e, false, false, true, false));
leftMid.addEventListener('touchstart', e => resizeHandlerTouch(e, true, false, true, false));
topMid.addEventListener('touchstart', e => resizeHandlerTouch(e, false, true, false, true));
bottomMid.addEventListener('touchstart', e => resizeHandlerTouch(e, false, false, false, true));
leftTop.addEventListener('touchstart', e => resizeHandlerTouch(e, true, true, true, true));
rightTop.addEventListener('touchstart', e => resizeHandlerTouch(e, false, true, true, true));
rightBottom.addEventListener('touchstart', e => resizeHandlerTouch(e, false, false, true, true));
leftBottom.addEventListener('touchstart', e => resizeHandlerTouch(e, true, false, true, true));

// handle rotation
rotate.addEventListener('touchstart', function (event) {
    // if (event.target.className.indexOf("dot") > -1) {
    //     return;
    // }

    var touch = event.touches[0];
    initX = this.offsetLeft;
    initY = this.offsetTop;
    mousePressX = touch.pageX;
    mousePressY = touch.pageY;


    var arrow = document.querySelector("#box");
    var arrowRects = arrow.getBoundingClientRect();
    var arrowX = arrowRects.left + arrowRects.width / 2;
    var arrowY = arrowRects.top + arrowRects.height / 2;

    function eventMoveHandlerTouch(event) {
        var touch = event.touches[0];
        var angle = Math.atan2(touch.pageY - arrowY, touch.pageX - arrowX) + Math.PI / 2;
        rotateBox(angle * 180 / Math.PI);
    }

    window.addEventListener('touchmove', eventMoveHandlerTouch, false);

    window.addEventListener('touchend', function eventEndHandlerTouch() {
        window.removeEventListener('touchmove', eventMoveHandlerTouch, false);
        window.removeEventListener('touchend', eventEndHandlerTouch);
    }, false);
}, false);

// Mouse Click ===============================================================================
// ===========================================================================================

// drag support
boxWrapper.addEventListener('mousedown', function (event) {
    if (event.target.className.indexOf("dot") > -1) {
        return;
    }

    initX = this.offsetLeft;
    initY = this.offsetTop;
    mousePressX = event.clientX;
    mousePressY = event.clientY;


    function eventMoveHandler(event) {
        repositionElement(initX + (event.clientX - mousePressX),
            initY + (event.clientY - mousePressY));
    }

    boxWrapper.addEventListener('mousemove', eventMoveHandler, false);
    window.addEventListener('mouseup', function eventEndHandler() {
        boxWrapper.removeEventListener('mousemove', eventMoveHandler, false);
        window.removeEventListener('mouseup', eventEndHandler);
    }, false);

}, false);
// done drag support

function resizeHandler(event, left = false, top = false, xResize = false, yResize = false) {
    initX = boxWrapper.offsetLeft;
    initY = boxWrapper.offsetTop;
    mousePressX = event.clientX;
    mousePressY = event.clientY;

    initW = box.offsetWidth;
    initH = box.offsetHeight;

    initRotate = getCurrentRotation(boxWrapper);
    var initRadians = initRotate * Math.PI / 180;
    var cosFraction = Math.cos(initRadians);
    var sinFraction = Math.sin(initRadians);
    function eventMoveHandler(event) {
        var wDiff = (event.clientX - mousePressX);
        var hDiff = (event.clientY - mousePressY);
        var rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
        var rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

        var newW = initW, newH = initH, newX = initX, newY = initY;

        if (xResize) {
            if (left) {
                newW = initW - rotatedWDiff;
                if (newW < minWidth) {
                    newW = minWidth;
                    rotatedWDiff = initW - minWidth;
                }
            } else {
                newW = initW + rotatedWDiff;
                if (newW < minWidth) {
                    newW = minWidth;
                    rotatedWDiff = minWidth - initW;
                }
            }
            newX += 0.5 * rotatedWDiff * cosFraction;
            newY += 0.5 * rotatedWDiff * sinFraction;
        }

        if (yResize) {
            if (top) {
                newH = initH - rotatedHDiff;
                if (newH < minHeight) {
                    newH = minHeight;
                    rotatedHDiff = initH - minHeight;
                }
            } else {
                newH = initH + rotatedHDiff;
                if (newH < minHeight) {
                    newH = minHeight;
                    rotatedHDiff = minHeight - initH;
                }
            }
            newX -= 0.5 * rotatedHDiff * sinFraction;
            newY += 0.5 * rotatedHDiff * cosFraction;
        }

        resize(newW, newH);
        repositionElement(newX, newY);
    }


    window.addEventListener('mousemove', eventMoveHandler, false);
    window.addEventListener('mouseup', function eventEndHandler() {
        window.removeEventListener('mousemove', eventMoveHandler, false);
        window.removeEventListener('mouseup', eventEndHandler);
    }, false);
}


rightMid.addEventListener('mousedown', e => resizeHandler(e, false, false, true, false));
leftMid.addEventListener('mousedown', e => resizeHandler(e, true, false, true, false));
topMid.addEventListener('mousedown', e => resizeHandler(e, false, true, false, true));
bottomMid.addEventListener('mousedown', e => resizeHandler(e, false, false, false, true));
leftTop.addEventListener('mousedown', e => resizeHandler(e, true, true, true, true));
rightTop.addEventListener('mousedown', e => resizeHandler(e, false, true, true, true));
rightBottom.addEventListener('mousedown', e => resizeHandler(e, false, false, true, true));
leftBottom.addEventListener('mousedown', e => resizeHandler(e, true, false, true, true));

// handle rotation
rotate.addEventListener('mousedown', function (event) {
    // if (event.target.className.indexOf("dot") > -1) {
    //     return;
    // }

    initX = this.offsetLeft;
    initY = this.offsetTop;
    mousePressX = event.clientX;
    mousePressY = event.clientY;


    var arrow = document.querySelector("#box");
    var arrowRects = arrow.getBoundingClientRect();
    var arrowX = arrowRects.left + arrowRects.width / 2;
    var arrowY = arrowRects.top + arrowRects.height / 2;

    function eventMoveHandler(event) {
        var angle = Math.atan2(event.clientY - arrowY, event.clientX - arrowX) + Math.PI / 2;
        rotateBox(angle * 180 / Math.PI);
    }

    window.addEventListener('mousemove', eventMoveHandler, false);

    window.addEventListener('mouseup', function eventEndHandler() {
        window.removeEventListener('mousemove', eventMoveHandler, false);
        window.removeEventListener('mouseup', eventEndHandler);
    }, false);
}, false);

// ======================================================================================================
resize(250, 110);
repositionElement(50, 50, "%");

// =======================================================================================================
let cap = document.getElementById("caption");
function setSize() {
    let size = document.getElementById("tsize").value;
    cap.style.fontSize = size + "px";
}

function setColor() {
    let color = document.getElementById("tcolor").value;
    cap.style.color = color;
}

function setHColor() {
    let color = document.getElementById("hcolor").value;
    cap.style.background = color;
}

function removeHL() {
    cap.style.background = "none";
}

function setBgColor() {
    let wrap = document.getElementById("wrap");
    let color = document.getElementById("bcolor").value;
    wrap.style.background = color;
}

function setStyle(par = 'n') {
    if (par == 'b') {
        cap.style.fontWeight = "bold";
    } else if (par == 'i') {
        cap.style.fontStyle = "italic";
    } else {
        cap.style.fontWeight = "normal";
        cap.style.fontStyle = "normal";
    }
}

function setAlign(par = 'L') {
    if (par == 'L') {
        cap.style.textAlign = "left";
    } else if (par == 'C') {
        cap.style.textAlign = "center";
    } else if (par == 'R') {
        cap.style.textAlign = "right";
    }
}

function generate() {
    hideboxder();

    var boxt = boxWrapper.offsetTop;
    var boxl = boxWrapper.offsetLeft;

    var boxh = box.style.height;
    var boxw = box.style.width;


    boxh = parseInt(boxh.replace("px", ""));
    boxw = parseInt(boxw.replace("px", ""));

    cap.style.width = boxw + "px";

    box.style.height = "0px";
    boxWrapper.style.top = (boxt - (boxh / 2)) + "px";

    box.style.width = "0px";
    boxWrapper.style.left = (boxl - (boxw / 2)) + "px";

    document.getElementById("previewImage").innerHTML = "";
    var element = document.getElementById("wrap");

    html2canvas(element, {
        dpi: 144,
        allowTaint: true,
        useCORS: true,
        onrendered: function (canvas) {

            boxWrapper.style.top = boxt + "px";
            box.style.height = boxh + "px";
            boxWrapper.style.left = boxl + "px";
            box.style.width = boxw + "px";

            cap.style.width = "100%";


            document.getElementById("previewImage").append(canvas);

            var imgageData = canvas.toDataURL("image/png", 1);

            // Now browser starts downloading  
            // it instead of just showing it 
            var newData = imgageData.replace(
                /^data:image\/png/, "data:application/octet-stream");

            let dwn = document.getElementById("generatedownload");
            dwn.setAttribute("download", "background.png")
            dwn.setAttribute("href", newData);
            dwn.click();
        }
    });
}

const checkfile = function (id = "") {
    let me = document.getElementById(id);
    if (me.files[0] != undefined) {
        var fileName = me.files[0].name;
        var fileSize = me.files[0].size;
        var ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
        var allowext = ['jpeg', 'jpg', 'png'];

        if (allowext.indexOf(ext) > -1) {
            //if(fileSize < 20000000){}
            var gambar = document.getElementById('wrap');
            gambar.style.background = "url(" + URL.createObjectURL(me.files[0]) + ")  no-repeat center center";
            gambar.style.backgroundSize = "cover";
        } else {
            return false;
        }
    }

}