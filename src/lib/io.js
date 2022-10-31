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

import { colour } from "/lib/constant/misc.js";

// Miscellaneous functions for input/output.

/**
 * Print a log to the Terminal.
 *
 * @param ns The Netscript API.
 * @param msg Print this message to the Terminal.
 * @param clr Use this colour to print the given message.  Must be a string
 *     representation of a Unicode escape sequence.  Default is empty string,
 *     which means we use the default colour theme of the Terminal.
 */
export function log(ns, msg, clr = "") {
    const date = new Date(Date.now()).toISOString();
    const suffix = clr !== "" ? colour.RESET : "";
    ns.tprintf(`[${date}]${clr}${ns.getScriptName()}: ${msg}${suffix}`);
}
