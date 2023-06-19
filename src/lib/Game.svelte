<script lang="ts">
	import { GameController } from './Game';
	import Pipe from '$lib/Pipe.svelte';
	import Bird from '$lib/Bird.svelte';
	const game = new GameController();
	let frame = game.newGame();
	setInterval(() => {
		frame = game.nextFrame();
	}, 1000 / 60);

	function jump() {
		game.jump();
	}

	function startGame() {
		frame = game.start();
	}
</script>

<main style="width: {frame.width}px; height: {frame.height}px;" class="game">
	<Pipe pipe={frame.firstPipe} />
	<Pipe pipe={frame.secondPipe} />
	{#if frame.gameOver || !frame.gameStarted}
		<h1 on:click={startGame}>Start Game</h1>
		{#if frame.gameOver}
			<h2>Game Over</h2>
			<h3>Score: {frame.score}</h3>
		{/if}
	{/if}
	<Bird bird={frame.bird} />
	<section style="height: {frame.ground.height}px;" id="ground" />
	<section id="score">{frame.score}</section>
</main>
<svelte:window on:keydown={jump} on:click={jump} />

<style>
	h1 {
		position: absolute;
		text-align: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
	}
	/* center h2 horizontally */
	h2 {
		position: absolute;
		text-align: center;
		top: 30%;
		left: 50%;
		background: red;
		transform: translate(-50%, -50%);
	}
	h3 {
		position: absolute;
		text-align: center;
		top: 40%;
		left: 50%;
		background: white;
		transform: translate(-50%, -50%);
	}
	main {
		position: relative;
		border: 1px solid black;
		overflow: hidden;
		background-color: lightblue;
	}
	#ground {
		background-color: brown;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	#score {
		position: absolute;
		right: 10px;
		top: 10px;
		font-size: 20px;
		z-index: 10;
		padding: 5px;
		font-family: cursive;
		background-color: white;
		user-select: none;
	}
</style>
