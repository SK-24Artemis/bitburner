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

/**
 * Various boolean values.
 */
export const bool = {
    // Whether or not a graph is bipartite.
    "BIPARTITE": true,
    "NOT_BIPARTITE": false,
    // Whether or not we can run something.
    "CAN_RUN": true,
    "NOT_RUN": false,
    // Enable or disable a feature.
    "ENABLE": true,
    "DISABLE": false,
    // Whether or not we have access to something.
    "HAS": true,
    "NOT": false,
    // Whether or not it is time for something to occur.
    "IS_TIME": true,
    "NOT_TIME": false,
    // Whether or not we can jump.
    "JUMP": true,
    "NO_JUMP": false,
    // Whether or not a server is low-end.
    "LOWEND": true,
    "NOT_LOWEND": false,
    // Whether or not we can merge two things together.
    "MERGE": true,
    "NO_MERGE": false,
    // Whether or not we can move from one state to another.
    "MOVE": true,
    "NOT_MOVE": false,
    // Whether or not a new state has occurred.
    "NEW": true,
    "NOT_NEW": false,
    // Whether or not a state is reachable.  These values are specific to
    // Array Jumping Game.
    "REACHABLE": 1,
    "NOT_REACHABLE": 0,
    // Whether or not to skip an action.
    "SKIP": true,
    "NO_SKIP": false,
    // Whether or not we are successful at something.
    "SUCCESS": true,
    "FAILURE": false,
    // Whether or not something is valid or correct.
    "VALID": true,
    "INVALID": false,
    // Whether we are (or should be) engaged in territory warfare.
    "WAR": true,
    "NO_WAR": false
};
