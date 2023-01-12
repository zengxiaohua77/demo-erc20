// SPDX-License-Identifier: MIT

/* global ethers */

function keccak256(input) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
}

module.exports = {
  keccak256,
};
