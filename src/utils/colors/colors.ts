// export const colors = [
//     'tomato',
//     'orange',
//     'indigo',
//     'violet',
//     'maroon',
//     'red',
//     'purple',
//     'fuchsia',
//     'green',
//     'lime',
//     'olive',
//     'yellow',
//     'navy',
//     'blue',
//     'teal',
//     'aqua',
// ]

export const COLORS = [
    'steelblue',
    'mediumseagreen',
    'cornsilk',
    'darkslateblue',
    'thistle',
    'yellow',
    'darkorchid',
    'lightcyan',
    'olive',
    'papayawhip',
    'fuchsia',
    'skyblue',
    'indianred',
    'mintcream',
    'chocolate',
    'royalblue',
    'honeydew',
    'dimgray',
    'salmon',
    'seashell',
    'orangered',
    'mistyrose',
    'limegreen',
    'purple',
    'blanchedalmond',
    'darkgoldenrod',
    'springgreen',
    'plum',
    'teal',
    'goldenrod',
    'navy',
    'peachpuff',
    'darkgray',
    'lavenderblush',
    'forestgreen',
    'lightcoral',
    'deepskyblue',
    'linen',
    'lime',
    'orchid',
    'beige',
    'slategray',
    'crimson',
    'hotpink',
    'whitesmoke',
    'khaki',
    'tomato',
    'aqua',
    'rosybrown',
    'darkslategrey',
    'powderblue',
    'aliceblue',
    'darkorange',
    'coral',
    'silver',
    'darkred',
    'mediumaquamarine',
    'burlywood',
    'lightpink',
    'olivedrab',
    'sandybrown',
    'rebeccapurple',
    'palegreen',
    'slateblue',
    'saddlebrown',
    'violet',
    'lightyellow',
    'turquoise',
    'mediumvioletred',
    'dodgerblue',
    'seagreen',
    'antiquewhite',
    'firebrick',
    'gainsboro',
    'midnightblue',
    'bisque',
    'deeppink',
    'darkslategray',
    'mediumorchid',
    'lightsteelblue',
    'darkseagreen',
    'gold',
    'lightgray',
    'cadetblue',
    'aquamarine',
    'blueviolet',
    'lightgoldenrodyellow',
    'palevioletred',
    'moccasin',
    'green',
    'lavender',
    'navajowhite',
    'mediumturquoise',
    'indigo',
    'lightsalmon',
    'orange',
    'ghostwhite',
    'sienna',
    'mediumblue',
    'greenyellow',
    'pink',
    'darkcyan',
    'lightgreen',
    'tan',
    'gray',
    'yellowgreen',
    'chartreuse',
    'darkviolet',
    'snow',
    'peru',
    'blue',
    'wheat',
    'darksalmon',
    'red',
    'darkolivegreen',
    'lightblue',
    'mediumspringgreen',
    'darkturquoise',
    'cornflowerblue',
    'maroon',
    'dimgrey',
    'magenta',
    'black',
    'lightslategray',
    'lightseagreen',
    'lightskyblue',
    'mediumpurple',
    'darkmagenta',
    'oldlace',
    'lemonchiffon',
    'lightgrey',
    'darkgreen',
    'brown',
    'darkkhaki',
    'floralwhite',
    'ivory',
    'white',
    'crimson',
    'mediumslateblue',
    'darkgrey',
    'lightslategrey',
    'darkblue',
    'palegoldenrod',
    'peachpuff',
    'slategrey',
    'lightgoldenrodyellow',
    'paleturquoise',
    'aqua',
    'cyan',
    'darkslateblue',
    'rosybrown',
    'mediumaquamarine',
    'lightsteelblue',
    'blueviolet',
    'darkseagreen',
    'mediumvioletred',
]

// ---------------------------------------------------------------------------
// seeded-light-color.ts
//
// Deterministic light/pastel CSS color generator.
// Same seed → same color, always. Output is guaranteed to be light
// (HSL lightness 78–90%) so it works well as a background, tag, or fill
// with dark text on top.
// ---------------------------------------------------------------------------

type ColorFormat = 'hex' | 'rgb' | 'hsl'

/**
 * Fast deterministic PRNG (Mulberry32).
 * Returns a function yielding floats in [0, 1).
 */
function mulberry32(seed: number): () => number {
    let a = seed >>> 0
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/**
 * Stable 32-bit hash for any string or number seed (FNV-1a).
 */
function hashSeed(seed: string | number): number {
    let h = 2166136261
    const str = String(seed)
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

/**
 * HSL → RGB conversion. h: 0–360, s/l: 0–100. Returns [r, g, b] in 0–255.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
        const color =
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
        return Math.round(255 * color)
    }
    return [f(0), f(8), f(4)]
}

const toHex = (v: number): string => v.toString(16).padStart(2, '0')

/**
 * Deterministic light CSS color from a seed.
 *
 * Hue spreads across the full 360° for variety, while saturation and
 * lightness are constrained so the result is always visibly light:
 *   S = 55–85%   (colorful, not neon)
 *   L = 78–90%   (always light)
 *
 * @param seed   Any string or number — same seed always yields same color.
 * @param format Output format: "hex" | "rgb" | "hsl". Defaults to "hex".
 */
export function seededLightColor(
    seed: string | number,
    format: ColorFormat = 'hex'
): string {
    const rand = mulberry32(hashSeed(seed))

    const h = Math.floor(rand() * 360) // 0–359
    //const s = 55 + Math.floor(rand() * 31) // 55–85
    // const l = 78 + Math.floor(rand() * 13) // 78–90
    const s = 60 + rand() * 20
    const l = 75 + Math.floor(rand() * 13)

    const [r, g, b] = hslToRgb(h, s, l)

    switch (format) {
        case 'hsl':
            return `hsl(${h}, ${s}%, ${l}%)`
        case 'rgb':
            return `rgb(${r}, ${g}, ${b})`
        case 'hex':
        default:
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }
}

/**
 * Generates N distinct light colors deterministically from one seed.
 * Handy for building a stable palette per user/entity.
 */
export function seededLightPalette(
    seed: string | number,
    count = 5,
    format: ColorFormat = 'hex'
): string[] {
    return Array.from({ length: count }, (_, i) =>
        seededLightColor(`${seed}-${i}`, format)
    )
}
