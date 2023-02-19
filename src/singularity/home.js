/**
 * Copyright (C) 2022--2023 Duck McSouls
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

import { home, home_t } from "/quack/lib/constant/server.js";
import { wait_t } from "/quack/lib/constant/time.js";
import { log } from "/quack/lib/io.js";
import { Server } from "/quack/lib/server.js";
import { choose_hardware_company } from "/quack/lib/singularity/util.js";
import {
    assert,
    exec,
    trade_bot_resume,
    trade_bot_stop_buy,
} from "/quack/lib/util.js";

/**
 * Determine which to upgrade on the home server: Cores or RAM.  If the script
 * "share.js" is running, this means that we are sharing our home server with a
 * faction.  In this case, we only need to upgrade our RAM in order to run
 * "share.js" using more threads.
 *
 * @param ns The Netscript API.
 * @return A string having exactly one of the following values.
 *     (1) "Cores" := Upgrade the Cores on the home server.
 *     (2) "RAM" := Upgrade the RAM on the home server.
 *     (3) "" := The empty string, meaning do not upgrade anything on the home
 *         server.
 */
function choose_upgrade(ns) {
    // Do not upgrade anything.
    if (is_at_limits(ns)) {
        return "";
    }
    // Is the script "share.js" running on our home server?
    const server = new Server(ns, home);
    const script = "/quack/share.js";
    assert(ns.fileExists(script, home));
    if (server.is_running_script(script)) {
        return "RAM";
    }
    // Upgrade the Cores.
    const core_cost = Math.ceil(ns.singularity.getUpgradeHomeCoresCost());
    const ram_cost = Math.ceil(ns.singularity.getUpgradeHomeRamCost());
    if (core_cost < ram_cost) {
        if (server.cores() < home_t.CORE) {
            return "Cores";
        }
    }
    // Upgrade the RAM.
    assert(ram_cost <= core_cost || server.cores() === home_t.CORE);
    assert(server.ram_max() < home_t.RAM);
    return "RAM";
}

/**
 * Whether the Cores and RAM on the home server are at the artificial limits.
 * Even though the Cores or RAM, or both, are at maximum, this does not
 * necessarily mean we cannot purchase more Cores or RAM for the home server.
 *
 * @param ns The Netscript API.
 * @return true if both Cores and RAM are at maximum; false otherwise.
 */
function is_at_limits(ns) {
    const server = new Server(ns, home);
    if (server.cores() >= home_t.CORE && server.ram_max() >= home_t.RAM) {
        return true;
    }
    return false;
}

/**
 * Upgrade the Cores or RAM on the home server.
 *
 * @param ns The Netscript API.
 */
async function upgrade(ns) {
    // Relocate to increase Intelligence XP.
    const shop = await choose_hardware_company(ns);
    ns.singularity.goToLocation(shop);
    // Suppose our home server already has the greatest number of Cores and
    // RAM.  This does not necessarily mean we cannot purchase any more Cores
    // or RAM for the server.  We place artificial limits on the Cores and RAM
    // to avoid having to wait too long to accumulate sufficient funds.
    // Initially, we are willing to wait to upgrade the Cores or RAM up to and
    // including the given limits.  After the limits on Cores and RAM are
    // reached, we do not want to wait to accumulate money for upgrading Cores
    // or RAM.  We simply upgrade if our current funds allow.
    if (is_at_limits(ns)) {
        if (ns.singularity.upgradeHomeCores()) {
            log(ns, "Upgrade home Cores");
        }
        if (ns.singularity.upgradeHomeRam()) {
            log(ns, "Upgrade home RAM");
        }
        return;
    }
    // Wait to accumulate funds to purchase upgrades.
    const attribute = choose_upgrade(ns);
    assert(attribute !== "");
    if (attribute === "Cores") {
        await upgrade_cores(ns);
        return;
    }
    assert(attribute === "RAM");
    await upgrade_ram(ns);
}

/**
 * Upgrade the Cores on the home server.
 *
 * @param ns The Netscript API.
 */
async function upgrade_cores(ns) {
    log(ns, "Upgrade home Cores");
    const success = ns.singularity.upgradeHomeCores();
    // We are willing to wait some time for our funds to increase.  After the
    // waiting period is over, try to upgrade the Cores again.  If we are still
    // unsuccessful at the second attempt, then move on.
    if (!success) {
        await ns.sleep(wait_t.MINUTE);
        ns.singularity.upgradeHomeCores();
    }
}

/**
 * Upgrade the RAM on the home server.
 *
 * @param ns The Netscript API.
 */
async function upgrade_ram(ns) {
    log(ns, "Upgrade home RAM");
    const success = ns.singularity.upgradeHomeRam();
    // We are willing to wait some time for our funds to increase.  After the
    // waiting period is over, try to upgrade the RAM again.  If we are still
    // unsuccessful at the second attempt, then move on.
    if (!success) {
        await ns.sleep(wait_t.MINUTE);
        ns.singularity.upgradeHomeRam();
    }
}

/**
 * Upgrade the Cores and RAM on our home server.
 *
 * Usage: run singularity/home.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    // Less verbose log.
    ns.disableLog("getHackingLevel");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");
    ns.disableLog("singularity.applyToCompany");
    ns.disableLog("singularity.workForCompany");

    await trade_bot_stop_buy(ns);
    await upgrade(ns);
    trade_bot_resume(ns);
    // The next script in the load chain.
    exec(ns, "/quack/chain/install.js");
}
