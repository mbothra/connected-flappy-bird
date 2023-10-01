<script lang="ts">
	import { GameController } from './Game';
	import Pipe from '$lib/Pipe.svelte';
	import Bird from '$lib/Bird.svelte';
	import WalletConnect from '$lib/WalletConnect.svelte';
	import ApiCallZone from '$lib/ApiCallZone.svelte';
	import { gamePaused } from './stores';
  import DialogBox from './DialogBox.svelte';
  import { onMount } from 'svelte';
  import GameOver from './GameOver.svelte';
  import ContractDialogBox from './ContractDialogBox.svelte';
  import './fonts.css';

	const game = new GameController();
	let frame = game.newGame();
	onMount(() => {
		updateDimensions();

		// Update dimensions whenever the window is resized
		window.addEventListener('resize', updateDimensions);

		return () => {
			// Clean up event listener on component destroy
			window.removeEventListener('resize', updateDimensions);
    };
	});

	function updateDimensions() {
		frame.width = window.innerWidth;
		frame.height = window.innerHeight;
	}

	let web3Props: Web3Props; // Make sure to import the Web3Props type if needed
	function jump() {
		game.jump();
	}

	function startGame() {
		let height = window.innerHeight
		let width = window.innerWidth
		frame = game.start(height, width);
	}

	let intervalId: any = null; // Change the type to any
	function startGameLoop() {
		if (intervalId !== null) {
			clearInterval(intervalId);
		}
		intervalId = setInterval(() => {
		frame = game.nextFrame();
		}, 1000/30);
  	}

  function stopGameLoop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  $: {
    if ($gamePaused) {
      stopGameLoop();
    } else {
      startGameLoop();
    }
  }

  function goFullScreen() {
	if (!document.fullscreenElement) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if ((document.documentElement as any).webkitRequestFullScreen) { // Casting to any for older Webkit browsers
			(document.documentElement as any).webkitRequestFullScreen();
		}
	}
}



</script>


<main style="width: {frame.width}px; height: {frame.height}px;" class="game">
	<img src="/chainlink-logo.png" alt="Chainlink Logo" class="chainlink-logo" on:click={goFullScreen}/>
	<WalletConnect {web3Props}/> 
	<section class="background" style="background-image: url({frame.background});"></section>
	{#each [frame.firstPipe, frame.secondPipe] as pipe}
		<Pipe {pipe} />
		{#if pipe.apiCallZone}
			<ApiCallZone zone={pipe.apiCallZone} />
		{/if}
	{/each}
	{#if !frame.gameStarted}
	<div class="game-title">
		<h1 class="title-text">Chainlinked Flappy Bird </h1>
		<h1 class="subtitle-text">Powered by Chainlink Functions & Automation</h1>
		<h1 on:click={startGame} class="start-game-btn">Start Game</h1>
	</div>
{/if}
{#if frame.gameOver}
<GameOver score={frame.score} startFunc={startGame} functionScore={frame.functionScore}/>
{/if}

	<Bird bird={frame.bird} />
	<!-- <Web3Props/> -->
	<section style="height: {frame.ground.height}px;" id="ground">
		<section id="grass-container">
			{#each Array(50) as _, i} <!-- 50 grass strands; adjust as needed -->
				<div class="grass-strand" style="left: {i * 2}%;"></div> <!-- Positioning each strand -->
			{/each}
		</section>
	</section>
	<section id="score">Score: {frame.score + 2*frame.functionScore}</section>
		{#if frame.infoMessage !== ''}
		<section id="info-bar">
			{frame.infoMessage}
		</section>
		{/if}
</main>


<svelte:window on:keydown={jump} on:click={jump} />

<DialogBox />
<ContractDialogBox />
<style>

* {
    box-sizing: border-box;
  }
  
.background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 98%;
	z-index: -1;
	background-size: contain; /* Adjust based on your image's aspect ratio */
	animation: animateBackground 30s linear infinite;
}

.game-title {
  position: absolute;
  text-align: center;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Montserrat';
  top: 40%;
  display: flex;        /* Add flexbox */
  flex-direction: column; /* Stack items vertically */
  align-items: center;   /* Center them horizontally */
  background: rgba(255, 255, 255);
  height: 300px; /* Provides consistent spacing between the elements */
	width: 500px;
}


.title-text {
    position: absolute;
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Circular';
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0);
    top: 30%;
    background: None;
    font-size: 2.3em;
    white-space: nowrap; /* prevent wrapping */
}

.subtitle-text {
	position: absolute;
	text-align: center;
	left: 50%;
	transform: translate(-50%, -50%);
	font-family: 'Circular-Light'; /* Playful font */
	padding: 10px;
	border-radius: 10px; /* Rounded corners */
	box-shadow: 2px 4px 6px rgba(0, 0, 0, 0); /* Soft shadow */
	top: 52%;
	background: None;
	font-size: 1.3em;
	white-space: nowrap; /* prevent wrapping */
	color:gray;
}


.chainlink {
  font-size: 2rem; /* Increased font-size */
  font-weight: bold;
  color: #375bd2; /* Change to your preferred color */
}

@keyframes animateBackground {
	0% {
		background-position: 0% 0%;
	}
	100% {
		background-position: 300% 0%;
	}
}

@keyframes animateBackground {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 300% 0%;
  }
}


h1, h2, h3 {
	position: absolute;
	text-align: center;
	left: 50%;
	transform: translate(-50%, -50%);
	font-family: 'Montserrat'; /* Playful font */
	padding: 10px;
	border-radius: 10px; /* Rounded corners */
	box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2); /* Soft shadow */
}

h4 {
	position: absolute;
	text-align: center;
	left: 50%;
	transform: translate(-50%, -50%);
	font-family: 'Chalkduster', cursive; /* Playful font */
	padding: 10px;
	border-radius: 10px; /* Rounded corners */
}

h1 {
	top: 50%;
	background: rgba(255, 255, 255, 0.8);
	font-size: 1.5em;
	font-family: 'Montserrat', bold; /* Playful font */
}

h2 {
	top: 30%;
	background: rgba(255, 100, 100, 0.8);
}

h3 {
	top: 40%;
	background: rgba(255, 255, 255, 0.8);
}

main {
	position: relative;
	border-radius: 20px; /* Rounded corners */
	overflow: hidden;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

#ground {
  background: linear-gradient(180deg, #8bc34a 50%, #689f38 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden; /* Hide the grass that extends beyond the ground */
  z-index: -1; /* Set a higher z-index than the background */
}

#grass-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px; /* Height of the grass area; adjust as needed */
}

.grass-strand {
  position: absolute;
  bottom: 0;
  width: 2px; /* Thickness of individual grass strand; adjust as needed */
  height: 10px; /* Height of individual grass strand; adjust as needed */
  background-color: #8bc34a; /* Color of the grass */
  transform-origin: bottom;
  animation: sway 1s infinite ease-in-out;
}

@keyframes sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg); /* Degree of sway; adjust as needed */
  }
}

#score {
	position: absolute;
	right: 10px;
	top: 10px;
	font-size: 16px;
	z-index: 10;
	padding: 5px;
	font-family: 'Circular'; /* Playful font */
	background: rgba(255, 255, 255);
	user-select: none;
	padding:10px;
	width: 130px;
	text-align: center;
}

#info-bar {
	position: absolute;
	bottom: 10px;
	right: 10px;
	font-size: 14px;
	z-index: 100;
	padding: 8px;
	font-family: 'Montserrat';
	background: rgba(255, 255, 255, 0.8);
	user-select: none;
	border-radius: 10px;
}

.start-game-btn {
    background-color: #375bd2;
    color: white;
    cursor: pointer;
    transition: transform 0.3s;
    padding: 10px 20px;
    z-index: 0;
    width: 15%;
	font-size: 1em;
	border-radius: 0px;
	width:250px;
	top: 75%;
}


    .start-game-btn:hover {
		transform: translate(-50%, -50%) scale(1.2);
    }

	.chainlink-logo {
		position: absolute;
		top: 25px;  /* Adjust as needed */
		left: 25px; /* Adjust as needed */
		width: 150px; /* Adjust based on the desired size */
		height: auto; /* Maintains the image's aspect ratio */
		z-index: 101; /* Ensures it's above other elements; adjust if necessary */
	}

    .game-over {
        position: absolute; /* Absolutely position the GameOver dialog */
        top: 110%; /* Position it just below the start-game-btn */
        left: 50%; /* Center it horizontally */
        transform: translateX(-50%); /* Shift half of its width to the left for true centering */
    }
</style>
