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

// Miscellaneous helper functions related to Augmentations.

import { all_factions, home, work_hack_lvl } from "/lib/constant.js";
import { commit_crime } from "/lib/singularity.crime.js";
import { work } from "/lib/singularity.work.js";
import { Time } from "/lib/time.js";
import { assert } from "/lib/util.js";

/**
 * Which Augmentations we still need to purchase from a faction.
 *
 * @param ns The Netscript API.
 * @param fac We want to purchase all Augmentations from this faction.
 * @return A map {aug: cost} as follows:
 *
 *     (1) aug := The key is the name of an Augmentation.  We do not yet have
 *         this Augmentation.
 *     (2) cost := The value is the cost of the corresponding Augmentation.
 *
 *     This is never an empty map because we can always level up the NeuroFlux
 *     Governor Augmentation.
 */
function augmentations_to_buy(ns, fac) {
    assert(is_valid_faction(fac));
    // All Augmentations we have not yet purchased from the given faction.  The
    // NeuroFlux Governor Augmentation can be levelled up infinitely many
    // times.  Add it to the list of faction Augmentations.
    const purchased = true;
    const owned_aug = new Set(ns.singularity.getOwnedAugmentations(purchased));
    let fac_aug = ns.singularity.getAugmentationsFromFaction(fac);
    fac_aug = fac_aug.filter(a => !owned_aug.has(a));
    if (!fac_aug.includes(nfg())) {
        fac_aug.push(nfg());
    }
    assert(fac_aug.length > 0);
    // A map {aug: cost} of Augmentations and their respective costs.  Use the
    // ceiling function to avoid comparison of floating point numbers.
    const augment = new Map();
    for (const aug of fac_aug) {
        const cost = Math.ceil(ns.singularity.getAugmentationPrice(aug));
        augment.set(aug, cost);
    }
    return augment;
}

/**
 * The maximum number of Augmentations to purchase from a faction.  This number
 * does not include the NeuroFlux Governor.  We limit the number of
 * Augmentations to purchase to help speed up the process of buying all
 * Augmentations from a faction.  We purchase this number of Augmentations from
 * a faction and install them.  If the faction has any more Augmentations
 * (besides the NeuroFlux Governor), we purchase those after the installation.
 * Some Augmentations require a huge amount of faction reputation.  It can take
 * a very long time to accumulate enough reputation points, especially if an
 * Augmentation requires at least one million reputation points.  By purchasing
 * a given number of Augmentations and installing them, we gain some favour
 * with the faction.  In case our favour points are high enough, we would be
 * able to donate to the faction in exchange for reputation points.  This
 * should help to shorten the amount of time required to reach a certain amount
 * of reputation points.
 */
function aug_purchase_limit() {
    return 5;
}

/**
 * Choose the most expensive Augmentation to buy.  Why should we buy the most
 * expensive Augmentation first?  The answer is simple.  After we have
 * purchased an Augmentation from a faction, the cost of each remaining
 * Augmentation is raised by a multiplier.  Had we not purchased the most
 * expensive Augmentation, its cost would now be much higher than previously.
 *
 * @param augment A map {aug: cost} where the key is the name of an
 *     Augmentation and the value is the cost of the Augmentation.  Cannot be
 *     an empty map.
 * @return An array [aug, cost] where aug is the most expensive Augmentation
 *     from the given map.
 */
function choose_augmentation(augment) {
    assert(augment.size > 0);
    let max = -Infinity;
    let aug = "";
    for (const [a, cost] of augment) {
        if (max < cost) {
            max = cost;
            aug = a;
        }
    }
    return [aug, max];
}

/**
 * Whether we have a given Augmentation.
 *
 * @param ns The Netscript API.
 * @param aug Check this Augmentation.
 * @return true if we have already purchased the given Augmentation;
 *     false otherwise.
 */
function has_augmentation(ns, aug) {
    const purchased = true;
    const augment = new Set(ns.singularity.getOwnedAugmentations(purchased));
    return augment.has(aug);
}

/**
 * Whether a string represents a valid faction name.
 *
 * @param fac A string representing a faction name.  Cannot be an empty string.
 * @return true if the given string represents a valid faction name;
 *     false otherwise.
 */
function is_valid_faction(fac) {
    assert(fac.length > 0);
    const faction = new Set(all_factions());
    return faction.has(fac);
}

/**
 * A string representing the name of the NeuroFlux Governor Augmentation.
 */
function nfg() {
    return "NeuroFlux Governor";
}

/**
 * The number of Augmentations we have purchased.  This number only includes
 * those that have been bought and not yet installed.
 *
 * @param ns The Netscript API.
 * @return How many Augmentations we have bought and yet to install.
 */
function num_augmentations(ns) {
    const purchased = true;
    const no_purchased = !purchased;
    const owned_aug = ns.singularity.getOwnedAugmentations(no_purchased);
    const owned_bought_aug = ns.singularity.getOwnedAugmentations(purchased);
    assert(owned_bought_aug.length >= owned_aug.length);
    const npurchase = owned_bought_aug.length - owned_aug.length;
    return npurchase;
}

/**
 * All Augmentations we own and have already installed.
 *
 * @param ns The Netscript API.
 * @return A set of all Augmentations we own.  These Augmentations are already
 *     installed.
 */
export function owned_augmentations(ns) {
    const purchased = false;
    return new Set(ns.singularity.getOwnedAugmentations(purchased));
}

/**
 * All pre-requisites of an Augmentation.  Include only pre-requisites we have
 * not yet purchased.
 *
 * @param ns The Netscript API.
 * @param aug A string representing the name of an Augmentation.
 * @return A map {a: cost} as follows:
 *
 *     (1) a := An Augmentation that is a pre-requisite of the given
 *         Augmentation.
 *     (2) cost := The cost of the given pre-requisite.
 *
 *     Return an empty map if the given Augmentation has no pre-requisites or
 *     we have already purchased all of its pre-requisites.
 */
function prerequisites(ns, aug) {
    assert("" != aug);
    const augment = new Map();
    const prereq = ns.singularity.getAugmentationPrereq(aug);
    if (0 == prereq.length) {
        return augment;
    }
    // A map {a: cost} of Augmentations and their respective costs.
    for (const a of prereq) {
        if (has_augmentation(ns, a)) {
            continue;
        }
        const cost = ns.singularity.getAugmentationPrice(a);
        augment.set(a, cost);
    }
    return augment;
}

/**
 * Purchase all Augmentations from a faction.
 *
 * @param ns The Netscript API.
 * @param fac We want to buy all Augmentations from this faction.
 */
export async function purchase_augmentations(ns, fac) {
    assert(is_valid_faction(fac));
    const augment = augmentations_to_buy(ns, fac);
    assert(augment.size > 0);
    // Below is our purchasing strategy.
    //
    // (1) Purchase the most expensive Augmentation first.
    // (2) If an Augmentation has a pre-requisite that we have not yet bought,
    //     purchase the pre-requisite first.
    // (3) Leave the NeuroFlux Governor Augmentation to last.
    assert(augment.has(nfg()));
    assert(augment.delete(nfg()));
    while (augment.size > 0) {
        if (num_augmentations(ns) >= aug_purchase_limit()) {
            break;
        }
        // Choose the most expensive Augmentation.
        const [aug, cost] = choose_augmentation(augment);
        if (has_augmentation(ns, aug)) {
            assert(augment.delete(aug));
            continue;
        }
        // If the most expensive Augmentation has no pre-requisites or we have
        // already purchased all of its pre-requisites, then purchase the
        // Augmentation.
        const prereq = prerequisites(ns, aug);
        if (0 == prereq.size) {
            await purchase_aug(ns, aug, cost, fac);
            assert(augment.delete(aug));
            continue;
        }
        // If the Augmentation has one or more pre-requisites we have not yet
        // purchased, then first purchase the pre-requisites.
        while (prereq.size > 0) {
            const [pre, price] = choose_augmentation(prereq);
            await purchase_aug(ns, pre, price, fac);
            assert(prereq.delete(pre));
        }
        await purchase_aug(ns, aug, cost, fac);
        assert(augment.delete(aug));
    }
    // Level up the NeuroFlux Governor Augmentation as high as our funds allows.
    let cost = Math.ceil(ns.singularity.getAugmentationPrice(nfg()));
    let nfg_rep = Math.ceil(ns.singularity.getAugmentationRepReq(nfg()));
    let fac_rep = Math.floor(ns.singularity.getFactionRep(fac));
    let money = ns.getServerMoneyAvailable(home);
    while ((cost <= money) && (nfg_rep <= fac_rep)) {
        assert(ns.singularity.purchaseAugmentation(fac, nfg()));
        cost = Math.ceil(ns.singularity.getAugmentationPrice(nfg()));
        nfg_rep = Math.ceil(ns.singularity.getAugmentationRepReq(nfg()));
        fac_rep = Math.floor(ns.singularity.getFactionRep(fac));
        money = ns.getServerMoneyAvailable(home);
    }
}

/**
 * Purchase an Augmentation.
 *
 * @param ns The Netscript API.
 * @param aug We want to purchase this Augmentation.
 * @param cost The cost of the given Augmentation.
 * @param fac We want to purchase the given Augmentation from this faction.
 */
async function purchase_aug(ns, aug, cost, fac) {
    // Purchase any pre-requisites first.
    const prereq = prerequisites(ns, aug);
    while (prereq.size > 0) {
        const [pre, price] = choose_augmentation(prereq);
        await purchase_aug(ns, pre, price, fac);
        assert(prereq.delete(pre));
    }
    // Having purchased all pre-requisites of an Augmentation, now purchase
    // the Augmentation.
    let success = false;
    const t = new Time();
    const time = t.second();
    while (!success) {
        assert(!has_augmentation(ns, aug));
        if (ns.getServerMoneyAvailable(home) < cost) {
            if (ns.getHackingLevel() < work_hack_lvl) {
                await commit_crime(ns, cost);
            } else {
                await work(ns, cost);
            }
        }
        await ns.sleep(time);
        success = ns.singularity.purchaseAugmentation(fac, aug);
    }
    assert(has_augmentation(ns, aug));
}
