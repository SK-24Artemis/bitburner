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

import { bool } from "/lib/constant/bool.js";
import { wait_t } from "/lib/constant/time.js";
import { network } from "/lib/network.js";
import { Player } from "/lib/player.js";
import { Server } from "/lib/server.js";
import { assert, filter_bankrupt_servers, filter_pserv } from "/lib/util.js";

/**
 * All low-end servers against which our hacking script is targeting.
 *
 * @param ns The Netscript API.
 * @return An array of hostnames, each of which is a low-end server that our
 *     hacking script is targeting.  An empty array if:
 *
 *     (1) We have not yet compromised any low-end servers.
 *     (2) Our hack script is not running against any compromised low-end
 *         servers.  We have root access on at least one low-end server, but
 *         our hack script is currently not targeting any of those compromised
 *         servers.
 */
function current_compromised(ns) {
    const p = new Player(ns);
    // eslint-disable-next-line max-len
    return low_end_servers(ns).filter((s) => ns.isRunning(p.script(), p.home(), s));
}

/**
 * Hack any low-end servers we can compromise.
 *
 * @param ns The Netscript API.
 * @param target An array of hostnames of low-end servers.  Assume we can gain
 *     root access on these servers.
 */
async function hack_low_end(ns, target) {
    assert(target.length > 0);
    // First, kill all instances of our hack script (running on home) that are
    // directed against low-end servers.
    const player = new Player(ns);
    low_end_servers(ns).forEach((host) => {
        ns.kill(player.script(), player.home(), host);
    });
    // Next, hack all low-end servers we can now visit, including those newly
    // found.
    const home = new Server(ns, player.home());
    let nthread = home.threads_per_instance(player.script(), target.length);
    if (nthread < 1) {
        nthread = 1;
    }
    for (const host of target) {
        const server = new Server(ns, host);
        assert(await server.gain_root_access());
        ns.exec(player.script(), player.home(), nthread, host);
    }
}

/**
 * Whether we can compromise any new low-end servers.  Suppose there are
 * low-end servers that our hacking script is not targeting.  We want to know
 * if we can compromise any of those remaining low-end servers.
 *
 * @param ns The Netscript API.
 * @return true if there is at least one new low-end server we can compromise;
 *     false otherwise.
 */
function has_target(ns) {
    const lowend = new_low_end(ns);
    assert(lowend.length > 0);
    const target = lowend.filter((host) => !skip_low_end(ns, host));
    return target.length > 0;
}

/**
 * Whether we have compromised all low-end servers and our hack script is
 * running against them.
 *
 * @param ns The Netscript API.
 * @return true if our hack script is running against all low-end servers;
 *     false otherwise.
 */
function is_complete(ns) {
    const lowend = new_low_end(ns);
    return lowend.length === 0;
}

/**
 * Whether a server is a low-end server.  A server is low-end if it does not
 * have enough RAM to run our hack script even using one thread.  We exclude
 * these:
 *
 * (1) Purchased servers.
 * (2) A world server that is currently running our hacking script.
 *
 * @param ns The Netscript API.
 * @param hostname The hostname of a world server.  Cannot be a purchased
 *     server.
 * @return true if the given hostname represents a low-end server;
 *     false otherwise.
 */
function is_low_end(ns, hostname) {
    assert(hostname.length > 0);
    const player = new Player(ns);
    const server = new Server(ns, hostname);
    if (server.is_running_script(player.script())) {
        return bool.NOT_LOWEND;
    }
    const nthread = server.num_threads(player.script());
    return nthread === 0;
}

/**
 * Choose servers in the game world that are low-end.  A server is low-end if
 * it does not have enough RAM to run our hack script even using one thread.
 *
 * A bankrupt server can be low-end if it lacks the required amount of RAM to
 * run our hack script using one thread.  Although we would not obtain any money
 * from hacking a low-end bankrupt server, we would still obtain some Hack XP.
 * We exclude all low-end bankrupt servers.
 *
 * @param ns The Netscript API.
 * @return An array of low-end servers, not including low-end bankrupt servers.
 */
function low_end_servers(ns) {
    const lowend = filter_bankrupt_servers(
        ns,
        filter_pserv(ns, network(ns))
    ).filter((s) => is_low_end(ns, s));
    assert(lowend.length > 0);
    return lowend;
}

/**
 * Search for new low-end servers to hack.  Suppose we have already compromised
 * a number of low-end servers and are currently running our hack script
 * against those servers.  This function searches for low-end servers that are
 * not yet compromised.
 *
 * @param ns The Netscript API.
 * @return An array of low-end servers that are yet to be hacked.
 */
function new_low_end(ns) {
    const target = [];
    const player = new Player(ns);
    for (const host of low_end_servers(ns)) {
        if (ns.isRunning(player.script(), player.home(), host)) {
            continue;
        }
        target.push(host);
    }
    return target;
}

/**
 * Whether to skip a low-end server.  A low-end server is skipped due to
 * various reasons:
 *
 * (1) The server has a hacking skill requirement that is higher than our Hack
 *     stat.
 * (2) We cannot open all ports on the given low-end server.
 *
 * @param ns The Netscript API.
 * @param host Do we skip this server?
 * @return true if the given server should be skipped; false otherwise.
 */
function skip_low_end(ns, host) {
    assert(is_low_end(ns, host));
    const player = new Player(ns);
    const server = new Server(ns, host);
    if (player.hacking_skill() < server.hacking_skill()) {
        return bool.SKIP;
    }
    if (player.num_ports() < server.num_ports_required()) {
        return bool.SKIP;
    }
    return bool.NO_SKIP;
}

/**
 * Use our home server to hack any new low-end servers that we can now
 * compromise.
 *
 * @param ns The Netscript API.
 */
async function update(ns) {
    // No more low-end servers to compromise.
    if (is_complete(ns)) {
        return;
    }
    // Cannot hack any of the remaining low-end servers.
    if (!has_target(ns)) {
        return;
    }
    // Hack all low-end servers we can compromise.
    const target = [];
    for (const host of low_end_servers(ns)) {
        if (skip_low_end(ns, host)) {
            continue;
        }
        target.push(host);
    }
    const current = current_compromised(ns);
    assert(target.length > 0);
    assert(target.length > current.length);
    await hack_low_end(ns, target);
}

/**
 * Hack various low-end servers found in the game world, excluding purchased
 * servers.  A world server is said to be low-end if it does not have enough
 * RAM to run our hack script on the server.  We use our home server to hack
 * low-end servers.  The script figures out how many threads to use to hack a
 * low-end server.
 *
 * Usage: run low-end.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    // We want a less verbose log.
    ns.disableLog("getHackingLevel");
    ns.disableLog("getServerUsedRam");
    ns.disableLog("kill");
    ns.disableLog("scan");
    ns.disableLog("sleep");
    // Continuously search for low-end servers to hack.
    for (;;) {
        await update(ns);
        await ns.sleep(wait_t.MINUTE);
    }
}
