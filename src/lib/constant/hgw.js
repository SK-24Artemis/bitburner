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

/// ///////////////////////////////////////////////////////////////////////
// A bunch of constant values related to the HGW model.
/// ///////////////////////////////////////////////////////////////////////

/**
 * Various constants in the model of hack/grow/weaken (HGW).
 */
export const hgw = {
    /**
     * Various actions in the HGW model.
     */
    action: {
        GROW: "grow",
        HACK: "hack",
        WEAKEN: "weaken",
    },
    /**
     * Wait this extra amount of time in milliseconds when we perform an HGW
     * action.
     */
    BUFFER_TIME: 100,
    /**
     * The fraction of money to steal from a server.
     */
    hack: {
        joesguns: {
            FRACTION: 0.7,
        },
        n00dles: {
            FRACTION: 0.5,
        },
        phantasy: {
            FRACTION: 0.5,
        },
    },
    /**
     * The maximum amount of RAM for a purchased server that runs a batcher.
     */
    PSERV_MAX_RAM: 32768, // 2^15
    /**
     * The minimum Hack stat to reach when farming for Hack XP.
     */
    MIN_HACK: 150,
    /**
     * The fraction of money to steal from a server.
     */
    money: {
        /**
         * Steal at most 95% of money from a server.
         */
        MAX_FRACTION: 0.95,
    },
    /**
     * Various constants related to one batch in the model of proto batcher.
     */
    pbatch: {
        /**
         * The delay time between the firing of each HGW action.  Time is in
         * milliseconds.
         */
        DELAY: 250,
        /**
         * An invalid number of threads.
         */
        INVALID_NUM_THREAD: -1,
        /**
         * Sleep for this amount of time while waiting for a batch to complete.
         * Time is in milliseconds.
         */
        SLEEP: 100,
    },
    /**
     * Various scripts in the HGW model.
     */
    script: {
        /**
         * The grow script.  Use this script to grow money on a server.
         */
        GROW: "/quack/hgw/grow.js",
        /**
         * The hack script.  Use this script to hack a server.
         */
        HACK: "/quack/hgw/hack.js",
        /**
         * The weaken script.  Use this script to lower the security of a
         * server.
         */
        WEAKEN: "/quack/hgw/weaken.js",
    },
    /**
     * The change in security for each of the H/G/W actions.  Data taken from
     * this file:
     *
     * https://github.com/bitburner-official/bitburner-src/blob/dev/src/Constants.ts
     */
    security: {
        /**
         * One thread of ns.hack() increases a server's security by this amount.
         */
        HACK: 0.002,
        /**
         * One thread of ns.grow() increases a server's security by this amount.
         */
        GROW: 0.004,
        /**
         * One thread of ns.weaken() decreases a server's security by this
         * amount.
         */
        WEAKEN: 0.05,
    },
    /**
     * Various strategies for preparing a server.
     */
    strategy: {
        /**
         * Grow first, followed by weaken.  Repeat in a loop.
         */
        GW: "gw",
        /**
         * Get a server to maximum money first.  Then repeatedly weaken the
         * server.
         */
        MGW: "mgw",
        /**
         * Get a server to minimum security first.  Then apply the strategy GW.
         */
        MWG: "mwg",
        /**
         * Weaken first, followed by grow.  Repeat in a loop.
         */
        WG: "wg",
    },
};
