/* zw需要的函数start */
const DRAW_IMAGE_EXTEND_EX = 3;
var multiply = function ( ae, be ) {
    var te = [];

    var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return te;

}

class Point2D {
    constructor(x, y, z, u, v) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.u = u;
        this.v = v;
    }
    changeByMatrix4(te) {
        var vx = this.x, vy = this.y, vz = this.z;
        var d = 1 / (te[3] * vx + te[7] * vy + te[11] * vz + te[15]);

        this.x = (te[0] * vx + te[4] * vy + te[8] * vz + te[12]) * d;
        this.y = (te[1] * vx + te[5] * vy + te[9] * vz + te[13]) * d;
        this.z = (te[2] * vx + te[6] * vy + te[10] * vz + te[14]) * d;
    }
    clone() {
        return new Point2D(this.x, this.y, this.z, this.u, this.v);
    }
}

class Vert2D {
    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }
    clone() {
        return new Vert2D(this.p0, this.p1, this.p2);
    }
    drawMeshLineToContext(plist, ctx) {
        var p0 = plist[this.p0], p1 = plist[this.p1], p2 = plist[this.p2];
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p0.x, p0.y);
    }
    drawImageToContext(plist, img, ctx) {
        var p0 = plist[this.p0], p1 = plist[this.p1], p2 = plist[this.p2];
        Vert2D.drawImageToContextWithPoints(img, ctx, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
    }

    static extendVert(x0, y0, x1, y1, x2, y2) {
        var x = 2 * x0 - x1 - x2, y = 2 * y0 - y1 - y2;
        var d = Math.sqrt(DRAW_IMAGE_EXTEND_EX / (x * x + y * y));
        return [x0 + x * d, y0 + y * d];
    }

    static drawImageToContextWithPoints(img, ctx, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
        u0 *= img.width;
        u1 *= img.width;
        u2 *= img.width;
        v0 *= img.height;
        v1 *= img.height;
        v2 *= img.height;

        //use width DRAW_IMAGE_EXTEND to fix gap in images
        var s0 = Vert2D.extendVert(x0, y0, x1, y1, x2, y2);
        var s1 = Vert2D.extendVert(x1, y1, x0, y0, x2, y2);
        var s2 = Vert2D.extendVert(x2, y2, x1, y1, x0, y0);
        //fix end

        ctx.beginPath();
        ctx.moveTo(s0[0], s0[1]);
        ctx.lineTo(s1[0], s1[1]);
        ctx.lineTo(s2[0], s2[1]);
        ctx.closePath();

        x1 -= x0;
        y1 -= y0;
        x2 -= x0;
        y2 -= y0;

        u1 -= u0;
        v1 -= v0;
        u2 -= u0;
        v2 -= v0;

        var det = 1 / (u1 * v2 - u2 * v1),
            a = (v2 * x1 - v1 * x2) * det,
            b = (v2 * y1 - v1 * y2) * det,
            c = (u1 * x2 - u2 * x1) * det,
            d = (u1 * y2 - u2 * y1) * det,
            e = x0 - a * u0 - c * v0,
            f = y0 - b * u0 - d * v0;

        ctx.save();
        ctx.transform(a, b, c, d, e, f);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }
}

class Mesh2D {
    constructor() {
        this.points = [];
        this.verts = [];
    }

    clone() {
        var n = new Mesh2D();
        for (var i = 0; i < this.points.length; i++) {
            n.points[i] = this.points[i].clone();
        }
        for (var i = 0; i < this.verts.length; i++) {
            n.verts[i] = this.verts[i];//not clone
        }
        return n;
    }

    changeByMatrix4(te) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].changeByMatrix4(te);
        }
    }

    move(x, y) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x += x;
            this.points[i].y += y;
        }
    }

    drawImageToContext(img, ctx) {
        for (var i = 0; i < this.verts.length; i++) {
            this.verts[i].drawImageToContext(this.points, img, ctx);
        }
    }
    drawMeshLine(ctx) {
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#0000ff";
        for (var i = 0; i < this.verts.length; i++) {
            this.verts[i].drawMeshLineToContext(this.points, ctx);
        }
        ctx.stroke();
        ctx.restore();
    }
    static createMapMesh(width, height, divW, divH) {
        var m = new Mesh2D();
        var widthSingle = width / divW, heightSingle = height / divH;
        var uSingle = 1 / divW, vSingel = 1 / divH;
        for (var i = 0; i <= divH; i++) {
            for (var j = 0; j <= divW; j++) {
                m.points.push(new Point2D(j * widthSingle, i * heightSingle, 0, j * uSingle, i * vSingel));
            }
        }
        for (var i = 0; i < divH; i++) {
            for (var j = 0; j < divW; j++) {
                var startPoint = (divW + 1) * i + j;
                m.verts.push(new Vert2D(startPoint + 1, startPoint, startPoint + divW + 1));
                m.verts.push(new Vert2D(startPoint + divW + 1, startPoint + divW + 2, startPoint + 1));
            }
        }
        return m;
    }
}
export { DRAW_IMAGE_EXTEND_EX, multiply, Point2D, Vert2D, Mesh2D } 
/* zw需要的函数end */