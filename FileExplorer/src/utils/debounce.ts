/* eslint-disable */
export function debounce(a: any, b: any, c?: any) {
    let d: any, e: any
    return function () {
        function h() {
            (d = null), c || (e = a.apply(f, g))
        }
        var f = this,
            g = arguments
        return clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
    };
}
