// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract THNXToken is ERC20, Ownable {
    mapping(address => uint256) public lastPraiseTimestamp;
    mapping(address => uint256) public weeklyPraiseCount;
    mapping(address => uint256) public lastResetWeek;

    uint256 public constant MAX_TOKENS_PER_WEEK = 5 * 10**18;
    uint256 public constant MAX_TOKENS_PER_SEND = 3 * 10**18;
    uint256 public constant MAX_NOTE_LENGTH = 100;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    event PraiseSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string note,
        uint256 timestamp
    );

    event TokenBurned(
        address indexed burner,
        uint256 amount,
        uint256 timestamp
    );

    event DebugLog(string message, string reason);

    constructor() ERC20("THNX", "THNX") Ownable(0x2Da58f7bce847755f9d6686350B95B0dac99F446) {
        // Constructor implementation if needed
    }

    function _getCurrentWeek() internal view returns (uint256) {
        return block.timestamp / 1 weeks;
    }

    function _getWeekStartTimestamp() internal view returns (uint256) {
        // Calculate the timestamp for 00:00 UTC Sunday
        uint256 weekStart = block.timestamp - ((block.timestamp + 4 days) % 1 weeks);
        return weekStart;
    }

    function sendPraise(address recipient, uint256 amount, string memory note) external {
        require(amount > 0 && amount <= MAX_TOKENS_PER_SEND, "Amount must be between 0 and 3 tokens.");
        require(bytes(note).length > 0 && bytes(note).length <= MAX_NOTE_LENGTH, "Note length must be between 1 and 100 characters.");
        require(recipient != msg.sender, "Cannot send praise to yourself.");

        uint256 currentWeekStart = _getWeekStartTimestamp();
        if (lastResetWeek[msg.sender] < currentWeekStart) {
            weeklyPraiseCount[msg.sender] = 0;
            lastResetWeek[msg.sender] = currentWeekStart;
        }

        require(
            weeklyPraiseCount[msg.sender] + amount <= MAX_TOKENS_PER_WEEK,
            "Exceeded weekly praise limit of 5 $THNX every week starting 00:00 UTC on Sunday."
        );

        weeklyPraiseCount[msg.sender] += amount;

        _mint(recipient, amount);
        emit PraiseSent(msg.sender, recipient, amount, note, block.timestamp);
    }

    function transfer(address, uint256) pure public override returns (bool) {
        revert("$THNX is non-transferrable.");
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}