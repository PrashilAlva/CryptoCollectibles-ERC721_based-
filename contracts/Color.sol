pragma solidity >=0.4.21 <0.7.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {
  string[] public colors;
  mapping(string => bool) _colorExists;
  mapping(string => uint) dataa;
  constructor() ERC721Full("Color", "COLOR") public {
  }

  modifier isColor(string memory _col){
      require(!_colorExists[_col]);
      _;
  }

  function mint(string memory _color) public isColor(_color){
    colors.push(_color);
    uint _id = colors.length;
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
    dataa[_color] = _id;
  }

  modifier colorExists(string memory code){
    require(_colorExists[code]);
    _;
  }

  function getID(string memory hexCode) public colorExists(hexCode) returns(uint){
    return dataa[hexCode];
  }

}