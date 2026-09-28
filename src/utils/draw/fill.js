export const scanlinePoly = (ctx, lines, coloredLines, col) => {
    const b = lines.getBounds()
    lines.forEach((line) => console.log(line))

    var x, y, xx
    // ctx.fillStyle = col
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
                        const closestLine = coloredLines.reduce(
                            (accumulator, currentLine) => {
                                const currentDistance = pDistance(
                                    xx,
                                    y,
                                    currentLine.p1.x,
                                    currentLine.p1.y,
                                    currentLine.p2.x,
                                    currentLine.p2.y
                                )
                                return currentDistance < accumulator.distance
                                    ? {
                                          distance: currentDistance,
                                          color: currentLine.color,
                                      }
                                    : accumulator
                            },
                            { distance: Infinity, color: 'black' }
                        )
                        // console.log(closestLine.color)
                        ctx.fillStyle = closestLine.color
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
}

const atLineLevelY = (y, l) =>
    (l.p1.y < l.p2.y && y >= l.p1.y && y <= l.p2.y) ||
    (y >= l.p2.y && y <= l.p1.y)

function pDistance(x, y, x1, y1, x2, y2) {
    var A = x - x1
    var B = y - y1
    var C = x2 - x1
    var D = y2 - y1

    var dot = A * C + B * D
    var len_sq = C * C + D * D
    var param = -1
    if (len_sq != 0)
        //in case of 0 length line
        param = dot / len_sq

    var xx, yy

    if (param < 0) {
        xx = x1
        yy = y1
    } else if (param > 1) {
        xx = x2
        yy = y2
    } else {
        xx = x1 + param * C
        yy = y1 + param * D
    }

    var dx = x - xx
    var dy = y - yy
    return Math.sqrt(dx * dx + dy * dy)
}

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
