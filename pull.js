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

// NOTE: This script is auto-generated by pull.sh.
// Do not import anything into this script.  The script should be self-contained
// and independent.

/**
 * A function for assertion.
 *
 * @param {boolean} cond Assert that this condition is true.
 * @returns {exception} Throw an error if the given condition is false.
 */
function assert(cond) {
    if (!cond) {
        throw new Error("Assertion failed.");
    }
}

/**
 * The directory structure under "src/" on github.com.
 *
 * @returns {array<string>} All files under "src/" on github.com.
 */
function dir_structure() {
    const filesystem = [
        // Insert directory tree here.  Should contain all scripts for playing
        // Bitburner.
        "bladeburner/bb.js",
        "bladeburner/go.js",
        "cct/bipartite.js",
        "cct/caesar.js",
        "cct/grid.js",
        "cct/grid2.js",
        "cct/grid3.js",
        "cct/hamming.js",
        "cct/hamming2.js",
        "cct/interval.js",
        "cct/ip.js",
        "cct/jump.js",
        "cct/jump2.js",
        "cct/lzc.js",
        "cct/lzd.js",
        "cct/maths.js",
        "cct/parenthesis.js",
        "cct/prime.js",
        "cct/rle.js",
        "cct/solver.js",
        "cct/spiral.js",
        "cct/subarray.js",
        "cct/sum.js",
        "cct/sum2.js",
        "cct/trader.js",
        "cct/trader2.js",
        "cct/trader3.js",
        "cct/trader4.js",
        "cct/triangle.js",
        "cct/vigenere.js",
        "chain/faction.js",
        "chain/ghost.js",
        "chain/home.js",
        "chain/install.js",
        "chain/misc.js",
        "chain/money.js",
        "chain/study.js",
        "connect.js",
        "corporation/agriculture.js",
        "corporation/go.js",
        "corporation/janitor.js",
        "corporation/prep.js",
        "corporation/tobacco.js",
        "faction/city.js",
        "faction/crime.js",
        "faction/early.js",
        "faction/end.js",
        "faction/go.js",
        "faction/hack.js",
        "faction/megacorp.js",
        "faction/share.js",
        "find-cct.js",
        "gang/augment.js",
        "gang/crime.js",
        "gang/go.js",
        "gang/program.js",
        "gang/snek.js",
        "go-high.js",
        "go-low.js",
        "go-mid.js",
        "go.js",
        "hack.js",
        "hash.js",
        "hgw/batcher/cloud.js",
        "hgw/batcher/joe.js",
        "hgw/batcher/pp.js",
        "hgw/batcher/pserv.js",
        "hgw/grow.js",
        "hgw/hack.js",
        "hgw/pbatch.js",
        "hgw/pserv.js",
        "hgw/weaken.js",
        "hgw/world.js",
        "hgw/xp.js",
        "hnet.js",
        "intelligence/bb.js",
        "intelligence/exe.js",
        "intelligence/go.js",
        "intelligence/larceny.js",
        "karma.js",
        "kill-script.js",
        "kill-server.js",
        "lib/array.js",
        "lib/batch.js",
        "lib/bb.js",
        "lib/cct.js",
        "lib/constant/bb.js",
        "lib/constant/bn.js",
        "lib/constant/bool.js",
        "lib/constant/cct.js",
        "lib/constant/corp.js",
        "lib/constant/crime.js",
        "lib/constant/faction.js",
        "lib/constant/gang.js",
        "lib/constant/hacknet.js",
        "lib/constant/hgw.js",
        "lib/constant/io.js",
        "lib/constant/location.js",
        "lib/constant/misc.js",
        "lib/constant/number.js",
        "lib/constant/pserv.js",
        "lib/constant/script.js",
        "lib/constant/server.js",
        "lib/constant/sleeve.js",
        "lib/constant/study.js",
        "lib/constant/time.js",
        "lib/constant/tor.js",
        "lib/constant/work.js",
        "lib/constant/wse.js",
        "lib/corporation/corp.js",
        "lib/corporation/util.js",
        "lib/gang/gangster.js",
        "lib/gang/util.js",
        "lib/hgw.js",
        "lib/hnet.js",
        "lib/io.js",
        "lib/money.js",
        "lib/network.js",
        "lib/number.js",
        "lib/pbatch.js",
        "lib/player.js",
        "lib/pserv.js",
        "lib/random.js",
        "lib/server.js",
        "lib/singularity/augment.js",
        "lib/singularity/crime.js",
        "lib/singularity/faction.js",
        "lib/singularity/network.js",
        "lib/singularity/program.js",
        "lib/singularity/study.js",
        "lib/singularity/util.js",
        "lib/singularity/work.js",
        "lib/sleeve/cc.js",
        "lib/sleeve/util.js",
        "lib/source.js",
        "lib/util.js",
        "lib/wse.js",
        "nmap.js",
        "share.js",
        "singularity/crime.js",
        "singularity/daemon.js",
        "singularity/home.js",
        "singularity/install.js",
        "singularity/money.js",
        "singularity/popen.js",
        "singularity/program.js",
        "singularity/study.js",
        "sleeve/cc.js",
        "sleeve/homicide.js",
        "sleeve/larceny.js",
        "sleeve/money.js",
        "sleeve/study.js",
        "stock/go.js",
        "stock/pre4s.js",
        "stock/trade.js",
        "test/crime/crime-int.js",
        "test/crime/crime.js",
        "test/hgw/100million.js",
        "test/hgw/batcher/pp.js",
        "test/hgw/batcher/proto.js",
        "test/hgw/billion.js",
        "test/hgw/brutessh.js",
        "test/hgw/ftpcrack.js",
        "test/hgw/joesguns.js",
        "test/hgw/naive.js",
        "test/hgw/nuke.js",
        "test/hgw/pbatch.js",
        "test/hgw/prep.js",
        "test/hgw/proto.js",
        "test/hgw/pserv.js",
        "test/hgw/smart.js",
        "test/hgw/smtp.js",
        "test/hgw/sshftp.js",
        "test/hgw/world.js",
        "test/intelligence/augment-buy.js",
        "test/intelligence/augment-install.js",
        "test/intelligence/augment-post-install.js",
        "test/intelligence/crime.js",
        "test/intelligence/daemon.js",
        "test/intelligence/faction-join-all.js",
        "test/intelligence/faction-join.js",
        "test/intelligence/home.js",
        "test/intelligence/int.js",
        "test/intelligence/program.js",
        "test/intelligence/relocate.js",
        "test/intelligence/study.js",
        "test/intelligence/tor-program.js",
        "test/intelligence/tor.js",
        "test/intelligence/travel.js",
        "test/intelligence/util.js",
        "test/karma/go.js",
        "test/stock/go.js",
        "test/stock/go4s.js",
        "test/stock/pre4s.js",
        "test/stock/trade4s.js",
        "world.js",
    ];
    assert(filesystem.length > 0);
    return filesystem;
}

/**
 * A formatted name of the file where we want to save the downloaded file.  The
 * terminal command "wget" behaves differently from the API function
 * "ns.wget()".  The command "wget" is happy to create the required directory
 * if we do any of the following:
 *
 * wget /URL/to/src/file.js src/file.js
 * wget /URL/to/src/file.js /src/file.js
 *
 * The API function "ns.wget()" is happy with this
 *
 * await ns.wget("/URL/to/src/file.js", "/src/file.js", "home");
 *
 * but cannot handle this
 *
 * await ns.wget("/URL/to/src/file.js", "src/file.js", "home");
 *
 * That is, we must have the leading forward slash "/" character for the
 * function to work properly.  Here are the relevant issues on github.com:
 *
 * https://github.com/danielyxie/bitburner/issues/1935
 * https://github.com/danielyxie/bitburner/issues/2115
 *
 * @param {string} f A file name.  Cannot be empty string.
 * @returns {string} A possibly new file name with the leading forward slash "/"
 *     character added.
 */
function target_name(f) {
    assert(f !== "");
    const fname = f.toString();
    const prefix = "/quack";
    const slash = "/";
    return [prefix, slash, fname].join("");
}

/**
 * Print the usage information.
 *
 * @param {NS} ns The Netscript API.
 */
function usage(ns) {
    const msg = "Usage: run pull.js";
    ns.tprintf(msg);
}

/**
 * Pull all files (on github.com) under the directory quacksouls/bitburner/src
 * into the game.
 *
 * Usage: run pull.js
 *
 * @param {NS} ns The Netscript API.
 */
export async function main(ns) {
    // Sanity check.
    // The script does not accept any command line arguments.
    if (ns.args.length > 0) {
        usage(ns);
        return;
    }
    // Pull files into our home server.
    const home = "home";
    // The base URL where files are found.
    const github = "https://raw.githubusercontent.com/";
    const quack = "quacksouls/bitburner/main/src/";
    const prefix = github + quack;
    // Pull files into home server.
    for (const f of dir_structure()) {
        const file = prefix + f;
        const target = target_name(f);
        const success = await ns.wget(file, target, home);
        if (success) {
            ns.tprintf(file);
        }
    }

    const msg = "Download complete";
    ns.tprintf(msg);
    ns.toast(msg);
}
