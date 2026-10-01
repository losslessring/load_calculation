import type { VertexCoordinates } from '../../interfaces/VertexCoordinates'

export function splitLine({
    start,
    end,
    segments,
    segmentLength,
}: {
    start: VertexCoordinates
    end: VertexCoordinates
    segments?: number
    segmentLength?: number
}): VertexCoordinates[] | undefined {
    if (segments) {
        return Array.from({ length: segments + 1 }, (_, i) => {
            const t = i / segments
            return {
                x: start.x + t * (end.x - start.x),
                y: start.y + t * (end.y - start.y),
            }
        })
    }

    const dx = end.x - start.x
    const dy = end.y - start.y
    const total = Math.hypot(dx, dy)
    if (total === 0) return [start]

    if (segmentLength) {
        const n = Math.ceil(total / segmentLength)
        return Array.from({ length: n + 1 }, (_, i) => {
            const t = Math.min((i * segmentLength) / total, 1)
            return { x: start.x + t * dx, y: start.y + t * dy }
        })
    }
}

export function pDistance(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
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

export function distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.hypot(x2 - x1, y2 - y1)
}
