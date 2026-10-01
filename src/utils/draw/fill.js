export const scanlinePoly = (
    ctx,
    lines,
    coloredLines,
    alpha,
    calculatePixelColor
) => {
    const b = lines.getBounds()
    lines.forEach((line) => console.log(line))

    let pixelData = []

    var x, y, xx
    // ctx.fillStyle = col
    ctx.save()
    ctx.globalAlpha = alpha
    b.left = Math.floor(b.left)
    b.top = Math.floor(b.top)
    for (y = b.top; y <= b.bottom; y++) {
        // update
        // old line was const ly = lines.getLinesAtY(y).sortLeftToRightAtY(y);
        // changed to
        const ly = lines.getLinesAtY(y + 0.5).sortLeftToRightAtY(y + 0.5)
        x = b.left - 1
        while (x <= b.right) {
            const nx1 = ly.nextLineFromX(x)
            if (nx1 !== undefined) {
                const nx2 = ly.nextLineFromX(nx1)
                if (nx2 !== undefined) {
                    const xS = Math.floor(nx1)
                    const xE = Math.floor(nx2)
                    for (xx = xS; xx < xE; xx++) {
                        const calculatedPixel = calculatePixelColor(xx, y)
                        pixelData.push(calculatedPixel)
                        ctx.fillStyle = calculatedPixel.color

                        ctx.fillRect(xx, y, 1, 1)
                    }
                    x = nx2
                } else {
                    break
                }
            } else {
                break
            }
        }
    }
    ctx.restore()
    return pixelData
}

const atLineLevelY = (y, l) =>
    (l.p1.y < l.p2.y && y >= l.p1.y && y <= l.p2.y) ||
    (y >= l.p2.y && y <= l.p1.y)

export function createLines(linesArray = []) {
    return Object.assign(linesArray, {
        addLine(l) {
            this.push(l)
        },
        getLinesAtY(y) {
            return createLines(this.filter((l) => atLineLevelY(y, l)))
        },
        sortLeftToRightAtY(y) {
            for (const l of this) {
                l.dist = l.p1.x + l.slope * (y - l.p1.y)
            }
            this.sort((a, b) => a.dist - b.dist)
            return this
        },
        nextLineFromX(x) {
            // only when sorted
            const line = this.find((l) => l.dist > x)
            return line ? line.dist : undefined
        },
        getBounds() {
            var top = Infinity,
                left = Infinity
            var right = -Infinity,
                bottom = -Infinity
            for (const l of this) {
                top = Math.min(top, l.p1.y, l.p2.y)
                left = Math.min(left, l.p1.x, l.p2.x)
                right = Math.max(right, l.p1.x, l.p2.x)
                bottom = Math.max(bottom, l.p1.y, l.p2.y)
            }
            return { top, left, right, bottom }
        },
    })
}
