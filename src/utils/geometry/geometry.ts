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
