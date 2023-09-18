// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

contract HighScoreNFT is ERC721, ERC721URIStorage, VRFConsumerBaseV2 {
	using Counters for Counters.Counter;
	// Mapping to store the NFT's name, image URL, and score
	mapping(address => uint256) public addressToTokenId;
	mapping(uint256 => string) public name;
	mapping(uint256 => string) public imageURL;
	mapping(uint256 => uint256) public score;
    mapping(string => Player) public playerScores;

	// Define a struct for the Player
    struct Player {
        string name;
        uint256 pipeScore;
        uint256 chainlinkScore;
        uint256 totalScore;
        string nftImageURL;
    }

    function _generateScoreKey(string memory playerName, uint256 _score) private pure returns (string memory) {
        return string(abi.encodePacked(playerName, "_", Strings.toString(_score)));
    }

    function storeAndMint(string memory playerName, uint256 _pipeScore, uint256 _chainlinkScore) public {
        uint256 _totalScore = _pipeScore + _chainlinkScore * 2; // Assuming chainlinkScore is multiplied by the multiplier
        // Generate key for this player and score
        string memory scoreKey = _generateScoreKey(playerName, _totalScore);

        // Store the score for the player using the generated key
        playerScores[scoreKey] = Player({
            name: playerName,
            pipeScore: _pipeScore,
            chainlinkScore: _chainlinkScore,
            totalScore: _totalScore,
            nftImageURL: '' // Image URL will be set in mint
        });

        // Update topScorers list if the player qualifies
        for (uint i = 0; i < 5; i++) {
            if (_totalScore > topScorers[i].totalScore) {
                for (uint j = 4; j > i; j--) {
                    topScorers[j] = topScorers[j - 1];
                }
                topScorers[i] = playerScores[scoreKey];
                break;
            }
        }

        // Mint an NFT with the stored score
        mint(playerName, _totalScore);
    }



	// Array to store the top 5 players
    Player[5] public topScorers;


	VRFCoordinatorV2Interface COORDINATOR;

	// public multiplier
	uint256 public multiplier = 1;
	// Your subscription ID.
	uint64 s_subscriptionId;

	// Event to emit when the score is updated
	event ScoreChanged(uint256 id, uint256 newScore);

	// Mapping to store the NFT's owner
	mapping(uint256 => address) public tokenOwner;
	// The gas lane to use, which specifies the maximum gas price to bump to.
	// For a list of available gas lanes on each network,
	// see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
	bytes32 keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;

	// Depends on the number of requested values that you want sent to the
	// fulfillRandomWords() function. Storing each word costs about 20,000 gas,
	// so 100,000 is a safe default for this example contract. Test and adjust
	// this limit based on the network that you select, the size of the request,
	// and the processing of the callback request in the fulfillRandomWords()
	// function.
	uint32 callbackGasLimit = 100000;

	// The default is 3, but you can set this higher.
	uint16 requestConfirmations = 3;

	// For this example, retrieve 2 random values in one request.
	// Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
	uint32 numWords = 1;

	constructor(
		uint64 subscriptionId
	) ERC721('FlapOnChain', 'fc') VRFConsumerBaseV2(0x2eD832Ba664535e5886b75D64C46EB9a228C2610) {
		COORDINATOR = VRFCoordinatorV2Interface(0x2eD832Ba664535e5886b75D64C46EB9a228C2610);
		s_subscriptionId = subscriptionId;
		_tokenIdCounter.increment();
	}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return ERC721.supportsInterface(interfaceId);
    }


	Counters.Counter private _tokenIdCounter;


	// Function to mint a new NFT
	function mint(string memory playerName, uint256 playerScore) public returns (uint256){
		// Get the current token ID
		uint256 id = _tokenIdCounter.current();
		// Increment the token ID counter
		_tokenIdCounter.increment();
		_safeMint(msg.sender, id);
		// Mint the NFT to the sender
		tokenOwner[id] = msg.sender;
		// Set the NFT's name, image URL, and score
		name[id] = playerName;
		updateScore(id, playerScore);
		addressToTokenId[msg.sender] = id;
		string memory _tokenURI = tokenURI(id);
		_setTokenURI(id, _tokenURI);  // This sets the token URI for the minted token

		return id;
	}

	// Function to update the score
	function updateScore(uint256 id, uint256 _score) public {
		// Update the score and emit the event
		score[id] = _score;
		emit ScoreChanged(id, _score);

		// Update the name and image URL based on the new score
		if (score[id] > 15) {
			imageURL[
				id
			] = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/eagle_nobg.png";
		} else if (score[id] > 0) {
			imageURL[
				id
			] = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/chick_nobg.png";
		} else {
			imageURL[
				id
			] = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/egg_nobg.png";
		}
	}

	function tokenURI(
		 uint256 id
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		string memory _imageURL;
		if (score[id] > 15) {
			_imageURL = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/eagle_nobg.png";
		} else if (score[id] > 0) {
			_imageURL = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/chick_nobg.png";
		} else {
			_imageURL = "https://bafybeicdmsjlykhff3r65onlzz6t5eb7z7mfw2zq42m3d4qdfm5wg5xjle.ipfs.dweb.link/egg_nobg.png";
		}
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "',
						name[id],
						'", ',
						'"description": "Flapping to a new high score", "image": "',
						_imageURL,
						'", ',
						'"attributes": [',
						'{"trait_type": "Score", "value": ',
						Strings.toString(score[id]),
						'}] ',
						'}'
					)
				)
			)
		);
		string memory finalTokenURI = string(
			abi.encodePacked('data:application/json;base64,', json)
		);
		return finalTokenURI;
	}

	function requestNewMultiplier() external returns (uint256 requestId) {
		requestId = COORDINATOR.requestRandomWords(
			keyHash,
			s_subscriptionId,
			requestConfirmations,
			callbackGasLimit,
			numWords
		);
		return requestId;
	}

	// Function to update the multiplier
	function fulfillRandomWords(uint256, uint256[] memory _rawWords) internal override {
		// generate a new multiplier under between 1 and 10
		uint256 _multiplier = (_rawWords[0] % 10) + 1;
		// set multiplier
		multiplier = _multiplier;
	}

	// The following functions is an override required by Solidity.
	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function storeScoresAndImageURL(string memory playerName, uint256 _pipeScore, uint256 _chainlinkScore, uint256 _totalScore, uint256 tokenId) public {
        require(msg.sender == tokenOwner[tokenId], "Only the NFT owner can submit scores.");

        // Store the score for the player
        playerScores[playerName] = Player({
            name: playerName,
            pipeScore: _pipeScore,
            chainlinkScore: _chainlinkScore,
            totalScore: _totalScore,
            nftImageURL: ''
        });

		// mint(playerName);

        // Check if this player's score qualifies for the top 5
        for (uint i = 0; i < 5; i++) {
            if (_totalScore > topScorers[i].totalScore) {
                // Shift down the list to make room for the new entry
                for (uint j = 4; j > i; j--) {
                    topScorers[j] = topScorers[j - 1];
                }
                // Store the new top scorer in the array
                topScorers[i] = playerScores[playerName];
                break;
            }
        }
    }

	    // Function to get the top 5 players
    function getTopScorers() public view returns (Player[5] memory) {
        return topScorers;
    }

    function getPlayerScoreByKey(string memory scoreKey) public view returns (Player memory) {
        return playerScores[scoreKey];
    }


}
