// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// ==================== External Imports ====================

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title BlacklistToken
/// @author Daniel Liu
/// @dev An ERC20 contract which support blacklist function
/// @custom:security-contact 139250065@qq.com
contract BlacklistToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    // ==================== Constants ====================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // ==================== Variables ====================

    // account => isInBlacklist
    mapping(address => bool) public isBlackUser;

    // blacklist users
    address[] public blackUsers;

    // ==================== Events ====================

    event AddUser(address indexed admin, address indexed user);
    event RemoveUser(address indexed admin, address indexed user);

    // ==================== Constructor function ====================

    constructor(string memory name, string memory symbol, uint256 quantity) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _mint(msg.sender, quantity * 10 ** decimals());
    }

    // ==================== External functions ====================

    function addBlackUser(address user) external onlyRole(ADMIN_ROLE) {
        require(!isBlackUser[user], "user in blacklist");

        isBlackUser[user] = true;
        blackUsers.push(user);

        emit AddUser(msg.sender, user);
    }

    function removeBlackUser(address user) external onlyRole(ADMIN_ROLE) {
        require(isBlackUser[user], "user not in blacklist");

        address[] memory users = blackUsers;
        uint256 lastIndex = users.length - 1;
        for (uint256 i = 0; i < lastIndex; ++i) {
            if (users[i] == user) {
                blackUsers[i] = users[lastIndex];
                break;
            }
        }

        isBlackUser[user] = false;
        blackUsers.pop();

        emit RemoveUser(msg.sender, user);
    }

    // ==================== Public functions ====================

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // ==================== Internal functions ====================

    /// @dev Check account `from` and `to` is not in blacklist before transfer token
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        require(!isBlackUser[from], "Account from is in blacklist");
        require(!isBlackUser[to], "Account to is in blacklist");

        super._beforeTokenTransfer(from, to, amount);
    }
}
