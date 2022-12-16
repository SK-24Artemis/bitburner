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
import { hgw } from "/lib/constant/misc.js";
import { home } from "/lib/constant/server.js";
import { log } from "/lib/io.js";
import { network } from "/lib/network.js";
import {
    assert,
    can_run_script,
    gain_root_access,
    num_threads,
} from "/lib/util.js";

/**
 * Wait this extra amount of time in milliseconds.
 */
function buffer_time() {
    return 100;
}

/**
 * Attempt to gain root access to a given server.  After gaining root access, we
 * copy our HGW scripts over to the server.
 *
 * @param ns The Netscript API.
 * @param host Hostname of a world server.
 * @return True if we have root access to the given server; false otherwise.
 */
function gain_admin_access(ns, host) {
    if (gain_root_access(ns, host)) {
        const file = [hgw.script.GROW, hgw.script.HACK, hgw.script.WEAKEN];
        assert(ns.scp(file, host, home));
        return bool.HAS;
    }
    return bool.NOT;
}

/**
 * Whether a server's money is at its maximum.
 *
 * @param ns The Netscript API.
 * @param host The hostname of a server.
 * @return True if the amount of money on the given server is at its maximum;
 *     false otherwise.
 */
function has_max_money(ns, host) {
    return ns.getServerMoneyAvailable(host) >= ns.getServerMaxMoney(host);
}

/**
 * Whether a server's security level is at its minimum.
 *
 * @param ns The Netscript API.
 * @param host The hostname of a server.
 * @return True if the security level of the given server is at its minimum;
 *     false otherwise.
 */
function has_min_security(ns, host) {
    return (
        ns.getServerSecurityLevel(host) <= ns.getServerMinSecurityLevel(host)
    );
}

/**
 * Perform an HGW action against a target server.
 *
 * @param ns The Netscript API.
 * @param host Perform an HGW action against this server.
 * @param botnet An array of world servers to which we have root access.  Use
 *     these servers to weaken the given target.
 * @param action The action we want to perform against the given target server.
 *     Possibilities are:
 *     (1) "grow" := Grow money on the target server.
 *     (2) "weaken" := Weaken the security level of the target server.
 */
async function hgw_action(ns, host, botnet, action) {
    assert(host !== "");
    assert(host !== home);
    assert(botnet.length > 0);
    assert(action === hgw.action.GROW || action === hgw.action.WEAKEN);
    const time = waiting_time(ns, host, action);
    const script = hgw_script(action);
    botnet
        .filter((s) => can_run_script(ns, script, s))
        .forEach((s) => {
            const nthread = num_threads(ns, script, s);
            ns.exec(script, s, nthread, host);
        });
    await ns.sleep(time);
}

/**
 * The HGW script to use for a given HGW action.
 *
 * @param action The action we want to perform against the given target server.
 *     Possibilities are:
 *     (1) "grow" := Grow money on the target server.
 *     (2) "weaken" := Weaken the security level of the target server.
 * @return The HGW script corresponding to the given action.
 */
function hgw_script(action) {
    switch (action) {
        case hgw.action.GROW:
            return hgw.script.GROW;
        case hgw.action.WEAKEN:
            return hgw.script.WEAKEN;
        default:
            // Should never reach here.
            assert(false);
    }
}

/**
 * Gain root access to as many world servers as we can.
 *
 * @param ns The Netscript API.
 * @return An array of hostnames of servers.  We have root access to each
 *     server.
 */
function nuke_servers(ns) {
    return network(ns).filter((host) => gain_admin_access(ns, host));
}

/**
 * Prepare a server for hacking.  Our objective is to get a server to maximum
 * money and minimum security.  The target server should not be bankrupt, i.e.
 * must be able to hold some positive amount of money.
 *
 * @param ns The Netscript API.
 * @param host Prepare this server for hacking.
 */
async function prep(ns, host) {
    for (;;) {
        const botnet = nuke_servers(ns);
        if (!has_min_security(ns, host)) {
            await hgw_action(ns, host, botnet, hgw.action.WEAKEN);
        }
        if (!has_max_money(ns, host)) {
            await hgw_action(ns, host, botnet, hgw.action.GROW);
        }
        if (has_min_security(ns, host) && has_max_money(ns, host)) {
            break;
        }
        await ns.sleep(1);
    }
    log(ns, `${host} is at minimum security and maximum money`);
}

/**
 * The amount of time in milliseconds we must wait for an HGW action to
 * complete.
 *
 * @param ns The Netscript API.
 * @param host Perform an HGW action against this server.
 * @param action The action we want to perform against the given target server.
 *     Possibilities are:
 *     (1) "grow" := Grow money on the target server.
 *     (2) "weaken" := Weaken the security level of the target server.
 * @return The amount of time required for the given action to complete on the
 *     target server.
 */
function waiting_time(ns, host, action) {
    switch (action) {
        case hgw.action.GROW:
            return ns.getGrowTime(host) + buffer_time();
        case hgw.action.WEAKEN:
            return ns.getWeakenTime(host) + buffer_time();
        default:
            // Should never reach here.
            assert(false);
    }
}

/**
 * A proto-batcher.  Each of the hack, grow, and weaken functions is separated
 * into its own script.  When we need a particular HGW action, we launch the
 * appropriate script against a target server.  We pool the resources of all
 * world servers, excluding our home server and purchased servers.
 *
 * Usage: run hgw/go.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    const target = "joesguns";
    assert(ns.getServerMaxMoney(target) > 0);
    await prep(ns, target);
}
