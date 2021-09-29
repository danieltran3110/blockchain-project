// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {

    string[] public colors;

    mapping(string => bool) _colorExists;

    mapping(string => uint256) _tokenIdOfColor;

    constructor() ERC721("Color", "COLOR") public {
    }

    function mint(string memory _color) public {
        require(!_colorExists[_color], "duplicate color");
        colors.push(_color);
        uint _id = colors.length - 1;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
        _tokenIdOfColor[_color] = _id;
    }

    function totalColors() external view returns(string[] memory) {
        return colors;
    }
}