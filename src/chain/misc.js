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

import { home } from "/lib/constant/server.js";
import { wait_t } from "/lib/constant/time.js";
import { exec } from "/lib/util.js";

/**
 * Start a load chain to run various scripts.
 *
 * Usage: run chain/misc.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    // Suppress some log messages.
    ns.disableLog("sleep");
    // Assume our home server is high-end and has enough RAM to run multiple
    // scripts at the same time.  Here is a brief description of the purpose of
    // each script.
    //
    // (1) /corporation/corp.js := This script creates and manage our
    //     corporation.  Along with our gang, a corporation can be a source of
    //     significant income.
    // (2) /gang/go.js := This utility script helps us to decide which faction
    //     to join so we can create a gang within that faction.
    // (3) /singularity/daemon.js := This script determines whether we should be
    //     hacking the w0r1d_d43m0n server.  It terminates if the conditions are
    //     not met for the server to appear in the game world.
    // (4) /singularity/int-farm.js := This script passively farms Intelligence
    //     XP.
    // (5) /singularity/program.js := This script attempts to purchase port
    //     opener programs.  We need all five port opener programs so we can
    //     open all ports of each server.
    // (6) /sleeve/cc.js := Our sleeve manager.
    const gang_script = [
        "/gang/go.js",
        "/gang/slum-snakes.js",
        "/gang/dead-speakers.js",
    ];
    const script = [
        "/corporation/corp.js",
        "/singularity/daemon.js",
        "/singularity/int-farm.js",
        "/sleeve/cc.js",
        gang_script[0],
    ];
    script.forEach((s) => exec(ns, s));
    // Wait until we have joined a criminal faction.  Then launch another
    // script.  We must wait because the script launched by "/gang/go.sh" needs
    // to perform tasks that require focus.  The script
    // "/singularity/program.js" also requires focus.  We can only focus on one
    // task at a time.
    let is_running = true;
    while (is_running) {
        is_running = false;
        for (const s of gang_script) {
            if (ns.scriptRunning(s, home)) {
                is_running = true;
                break;
            }
        }
        await ns.sleep(wait_t.SECOND);
    }
    exec(ns, "/singularity/program.js");
}
