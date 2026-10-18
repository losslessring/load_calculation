import test, { expect } from '@playwright/test'

import { angleBetween } from '../../src/utils/geometry/geometry'
test.describe('angle between two points', () => {
    test('should return 0', async () => {
        const Point1 = { x: 0, y: 0 }
        const Point2 = { x: 100, y: 0 }

        const result = angleBetween(Point1, Point2)
        const expected = 0

        await expect(result).toStrictEqual(expected)
    })

    test('should return PI', async () => {
        const Point1 = { x: 0, y: 0 }
        const Point2 = { x: -100, y: 0 }

        const result = angleBetween(Point1, Point2)
        const expected = 3.141592653589793

        await expect(result).toStrictEqual(expected)
    })
})
