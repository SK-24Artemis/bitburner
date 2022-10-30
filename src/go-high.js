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

import { home, home_t } from "/lib/constant/server.js";
import { has_singularity_api } from "/lib/source.js";

/**
 * This function should be run immediately after the soft reset of installing a
 * bunch of Augmentations.  Our purpose is to gain some money and Hack XP
 * early on when our stats are low.
 *
 * @param ns The Netscript API.
 */
function reboot(ns) {
    const nthread = 1;
    let extra = "low-end.js";
    if (ns.getServerMaxRam(home) > home_t.RAM_HIGH) {
        extra = "world-server.js";
    }
    const script = [
        extra,
        "hnet-farm.js",
        "buy-server.js",
        "trade-bot.js",
        "/cct/solver.js",
        "hram.js",
    ];
    script.forEach((s) => ns.exec(s, home, nthread));
}

/**
 * Start a load chain.  A script in the chain would likely use functions from
 * the Singularity API.  Each function from this API tends to use a huge amount
 * of RAM.
 *
 * @param ns The Netscript API.
 */
function load_chain(ns) {
    const script = "/singularity/study.js";
    const nthread = 1;
    ns.exec(script, home, nthread);
}

/**
 * NOTE: Assume our home server to have at least 512GB RAM.
 *
 * Restart our source of income and Hack XP.  This script is useful whenever we
 * have installed a bunch of Augmentations and we want to automatically restart
 * scripts to:
 *
 * (1) Purchase Hacknet nodes and manage our farm of nodes.
 * (2) Buy servers and use each purchased server to hack a target server in the
 *     game world.
 * (3) Gain root access to servers in the game world (excluding purchased
 *     servers) and use each server to hack itself or a low-end server.
 *
 * Usage: run go-high.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    reboot(ns);
    if (has_singularity_api(ns)) {
        load_chain(ns);
    }
}
