/**
 * Copyright (C) 2022 Duck McSouls
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { assert } from "./libbnr.js";

/**
 * All possible paths from the top of the triangle to the bottom.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @return All possible paths for descending the given triangle.
 */
function all_paths(triangle) {
    let path = new Array();
    // Every path starts the top of the triangle.
    path.push([[0, 0]]);
    for (let i = 1; i < triangle.length; i++) {
        const new_path = new Array();
        for (let j = 0; j < path.length; j++) {
            const p = Array.from(path[j]);
            const q = Array.from(p);
            // The triangle level, increasing as we descend from top to bottom.
            // The top level is always zero.  The index of an array element at
            // a given level.
            const [level, element] = p[p.length - 1];
            p.push([level + 1, element]);
            q.push([level + 1, element + 1]);
            new_path.push(p);
            new_path.push(q);
        }
        path = new_path;
    }
    // The total number of possible paths from top to bottom.
    const npath = 2 ** (triangle.length - 1);
    assert(npath == path.length);
    return path;
}

/**
 * A deep copy of a triangle.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @return The same triangle, but as a deep copy.
 */
function clone(triangle) {
    const new_triangle = new Array();
    for (let i = 0; i < triangle.length; i++) {
        const level = [...triangle[i]];
        new_triangle.push(level);
    }
    return new_triangle;
}

/**
 * Descend from the top to the bottom of a triangle, finding a path
 * of minimum sum as we go.  We use a more efficient method than the
 * one implemented in descend_naive().
 *
 * @param triangle A triangle represented as an array of arrays.
 * @return An array with two elements:
 *     * A path of minimum sum from the top of the triangle to the bottom.
 *     * The minimum sum.
 */
function descend(triangle) {
    // Sanity checks.
    assert(is_triangle(triangle));
    if (1 == triangle.length) {
        return [triangle[0], triangle[0][0]];
    }
    // A triangle having at least 2 levels.  Consider the following triangle:
    //
    // (0)       2
    // (1)     3   4
    // (2)   6   5   7
    // (3) 4   1   8   3
    //
    // Think of the problem in a top-down manner.  To obtain a path of minimum
    // sum from level (0) to level (3), we must obtain a path of minimum sum
    // from level (0) to level (2), which in turn requires that we obtain a path
    // of minimum sum from level (0) to level (1).  Let min_sum be the minimum
    // sum of a path from level (0) to level (i) and suppose this path ends at
    // a[j], the j-th number at level (i).  Let b be an array of numbers at
    // level (i + 1).  The minimum sum of a path from level (0) to level
    // (i + 1) is given by
    //
    // min_sum + mininum(b[j], b[j + 1])
    //
    // Alternatively, consider the problem in a bottom-up manner.  Any minimum
    // path must end at the bottom level of the triangle.  Let i be any level
    // in the triangle, except for the last level.  Let mtriangle[i][j] be the
    // j-th number at level (i) and update this number to
    //
    // mtriangle[i][j] := mtriangle[i][j] + minimum(b[j], b[j + 1])
    //
    // where b is an array of numbers at level (i + 1).  Move up one level and
    // repeat the above calculation, propagating the minimum sum up the
    // triangle so that mtriangle[0][0] is the minimum sum of any path.

    // Get a deep copy of the triangle.  We don't want to modify the input
    // triangle.
    const mtriangle = clone(triangle);
    const path = new Array();
    // Start from the penultimate level and work upward to the top level.
    // Keep track of a minimum path as we move along.
    for (let i = (triangle.length - 2); i >= 0; i--) {
        // The minimum sum at level i.
        let minsum = Infinity;
        // A node at level i + 1.  This is a node of a path of minimum sum.
        let mink = Infinity;
        for (let j = 0; j < triangle[i].length; j++) {
            // Consider nodes at level i + 1.
            const a = mtriangle[i + 1][j];
            const b = mtriangle[i + 1][j + 1];
            mtriangle[i][j] += Math.min(a, b);
            // Update the path of minimum sum.  We keep track of the column
            // index at level i + 1.
            if (minsum > mtriangle[i][j]) {
                minsum = mtriangle[i][j];
                mink = (a < b) ? j : (j + 1);
            }
        }
        path.push(mink);
    }
    path.push(0);
    path.reverse();
    // Reconstruct a path of minimum sum.  This path contains the intermediate
    // nodes from the top of the triangle to the bottom level.
    for (let i = 0; i < triangle.length; i++) {
        path[i] = triangle[i][path[i]];
    }
    return [path, mtriangle[0][0]];
}

/**
 * Descend from the top to the bottom of a triangle.  We use a brute force
 * approach, where all paths are considered.  The method would not work
 * if given a large triangle.
 *
 * NOTE: Inefficient method because we are using lots of space and
 * computation time.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @return An array with two elements:
 *     * A path of minimum sum from the top of the triangle to the bottom.
 *     * The minimum sum.
 */
function descend_naive(triangle) {
    // Sanity checks.
    assert(is_triangle(triangle));
    if (1 == triangle.length) {
        return [triangle[0], triangle[0][0]];
    }
    // A triangle having at least 2 levels.
    const path = all_paths(triangle);
    return minimum_path(triangle, path);
}

/**
 * Whether the given array represents a valid triangle.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @return true if the array represents a triangle;
 *     false otherwise.
 */
function is_triangle(triangle) {
    assert(triangle.length > 0);
    const VALID = true;
    const NOT_VALID = !VALID;
    for (let i = 0; i < triangle.length - 1; i++) {
        const top = triangle[i];
        const bottom = triangle[i + 1];
        if (top.length < 1) {
            return NOT_VALID;
        }
        if (bottom.length < 1) {
            return NOT_VALID;
        }
        if (top.length != (bottom.length - 1)) {
            return NOT_VALID;
        }
    }
    return VALID;
}

/**
 * The path with minimum sum.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @param path An array of arrays, representing all possible paths.
 *     Each subarray represents a path from the top of the triangle
 *     to the bottom.
 * @return An array with two elements:
 *     * An array representing a path of minimum sum.
 *     * The sum of the given path.
 */
function minimum_path(triangle, path) {
    let min_sum = Infinity;
    let min_path = new Array();
    // Determine a path of minimum sum.
    for (let i = 0; i < path.length; i++) {
        const sum = path_sum(triangle, path[i]);
        if (min_sum > sum) {
            min_sum = sum;
            min_path = path[i];
        }
    }
    // Reconstruct the path.
    const p = new Array();
    for (let i = 0; i < min_path.length; i++) {
        const [level, index] = min_path[i];
        const node = triangle[level][index];
        p.push(node);
    }
    return [p, min_sum];
}

/**
 * The sum of the given path.
 *
 * @param triangle A triangle represented as an array of arrays.
 * @param path A path from the top of the triangle to the bottom.
 * @return The sum of the given path.
 */
function path_sum(triangle, path) {
    let sum = 0;
    for (let i = 0; i < path.length; i++) {
        // The i-th node in a path.
        // Level is the level in the triangle at which a node is
        // located.  This also represents a subarray in @array whose
        // index is "level".  The variable "index" represents the value
        // of an element from the subarray indexed by "level".
        const [level, index] = path[i];
        sum += triangle[level][index];
    }
    return sum;
}

/**
 * Minimum Path Sum in a Triangle: You are given a 2D array of numbers
 * (array of array of numbers) that represents a triangle (the first array
 * has one element, and each array has one more element than the one before
 * it, forming a triangle). Find the minimum path sum from the top to the
 * bottom of the triangle. In each step of the path, you may only move to
 * adjacent numbers in the row below.
 *
 * For example, given this array
 *
 * [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]
 *
 * we can represent it as this triangle
 *
 *       2
 *     3   4
 *   6   5   7
 * 4   1   8   3
 *
 * From one level of the triangle, we move to a level below but only to a
 * number directly below a given number.  At level 0, we have [2].  At level
 * 1, we have [3, 4].  From 3, we can move down to either 6 or 5, but we
 * cannot move from 3 to 7 because 7 is not directly below 3.
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    // Test data.
    const triangle = [
        // Minimum sum: 11
        // Path: [2,3,5,1]
        [
            [2],
            [3, 4],
            [6, 5, 7],
            [4, 1, 8, 3]
        ],
        // Minimum sum: -10
        // Path: [-10]
        [
            [-10]
        ],
        // Minimum sum: 31
        // Path: [9,3,2,1,4,4,2,6]
        [
            [9],
            [4, 3],
            [8, 4, 2],
            [7, 8, 7, 1],
            [4, 6, 7, 9, 4],
            [4, 7, 6, 3, 5, 4],
            [8, 6, 5, 7, 5, 2, 6],
            [6, 3, 9, 9, 9, 7, 6, 3]
        ],
        // Minimum sum: 10
        // Path: [3,4,2,1]
        [
            [3],
            [6, 4],
            [5, 2, 7],
            [9, 1, 8, 6]
        ],
        // Minimum sum: -1
        // Path: [-1,3,-3]
        [
            [-1],
            [2, 3],
            [1, -1, -3]
        ],
        // From https://rosettacode.org/wiki/Maximum_triangle_path_sum
        // Minimum sum: 475
        // Path 1: [55,48,30,26,38,16,18,59,7,11,11,41,42,2,11,35,10,15]
        // Path 2: [55,48,30,26,38,36,18,59,7,11,11,41,42,2,40,1,18,2]
        [
            [55],
            [94, 48],
            [95, 30, 96],
            [77, 71, 26, 67],
            [97, 13, 76, 38, 45],
            [7, 36, 79, 16, 37, 68],
            [48, 7, 9, 18, 70, 26, 6],
            [18, 72, 79, 46, 59, 79, 29, 90],
            [20, 76, 87, 11, 32, 7, 7, 49, 18],
            [27, 83, 58, 35, 71, 11, 25, 57, 29, 85],
            [14, 64, 36, 96, 27, 11, 58, 56, 92, 18, 55],
            [2, 90, 3, 60, 48, 49, 41, 46, 33, 36, 47, 23],
            [92, 50, 48, 2, 36, 59, 42, 79, 72, 20, 82, 77, 42],
            [56, 78, 38, 80, 39, 75, 2, 71, 66, 66, 1, 3, 55, 72],
            [44, 25, 67, 84, 71, 67, 11, 61, 40, 57, 58, 89, 40, 56, 36],
            [85, 32, 25, 85, 57, 48, 84, 35, 47, 62, 17, 1, 1, 99, 89, 52],
            [6, 71, 28, 75, 94, 48, 37, 10, 23, 51, 6, 48, 53, 18, 74, 98, 15],
            [27, 2, 92, 23, 8, 71, 76, 84, 15, 52, 92, 63, 81, 10, 44, 10, 69, 93]
        ]
    ];
    for (let i = 0; i < triangle.length; i++) {
        const [path, sum] = descend(triangle[i]);
        ns.tprint("Triangle: " + i);
        ns.tprint(sum);
        ns.tprint(path);
    }
}
