/**
 * 坐标
 *
 * @author alfadb
 * @created 2017-02-16
 */
export class Point {
    /** X坐标 */
    public x: number;
    /** Y坐标 */
    public y: number;

    /**
     * @constructor
     * @param x {number} X坐标
     * @param y {number} Y坐标
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
