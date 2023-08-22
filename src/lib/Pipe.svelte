<script lang="ts">
	import type { PipePair } from '$lib/Game';
	import { writable } from 'svelte/store';
	import { shouldChangePipe } from './stores';
	export let pipe: PipePair;
	import { season } from './stores';


	$: if ($shouldChangePipe) {
   	 changePipe();
    	shouldChangePipe.set(false); // Reset the flag
  	}
	  const seasons = ['Winter','Summer','Spring','Autumn'];

	// Create a Svelte writable store to hold the current season

	function changePipe() {
		// Exclude the current season from the selection
		const availableSeasons = seasons.filter(seasonName => seasonName !== $season);

		// Select a random index from the available seasons array
		const randomIndex = Math.floor(Math.random() * availableSeasons.length);

		// Set the season store to the randomly selected season
		season.set(availableSeasons[randomIndex]);
	}
	$: seasonClass = $season ? $season.toLowerCase() : '';

</script>

{#if pipe.show}
	<section
		style="left: {pipe.left}px; top: {pipe.topPipe.top}px; width: {pipe.width}px; height: {pipe
			.topPipe.height}px;"
		class={`pipe-top pipe ${seasonClass}`}
		/>
	<section
		style="left: {pipe.left}px; top: {pipe.bottomPipe.top}px; width: {pipe.width}px; height: {pipe
			.bottomPipe.height}px;"
		class={`pipe-bottom pipe ${seasonClass}`}
		/>
{/if}

<style>
	.pipe {
		position: absolute;
		background: linear-gradient(180deg, #4caf50 30%, #8bc34a 70%); /* Green gradient */
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Soft shadow */
		border-radius: 10px; /* Rounded corners */
		overflow: hidden; /* To make the cap rounded as well */
	}

	.pipe.winter::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 20px;
		background: linear-gradient(90deg, #e0f7fa 30%, #b3e5fc 70%);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		}

		.pipe.spring::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 20px;
		background: linear-gradient(90deg, #a8e063 30%, #56ab2f 70%);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		}

		.pipe.summer::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 20px;
		background: linear-gradient(90deg, #f6d365 30%, #fda085 70%);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		}

		.pipe.autumn::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 20px;
		background: linear-gradient(90deg, #e65c00 30%, #f9d423 70%);
		border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

	.pipe-top::before {
		bottom: 0; /* Place the cap at the bottom of the top pipe */
	}

	.pipe-bottom::before {
		top: 0; /* Place the cap at the top of the bottom pipe */
	}

	.pipe.winter {
		background: linear-gradient(135deg, #e0f7fa 25%, #b3e5fc 25%, #b3e5fc 50%, #e0f7fa 50%, #e0f7fa 75%, #b3e5fc 75%);
		background-size: 100px 100px;
		box-shadow: 0px 0px 15px rgba(173, 216, 230, 0.5);
		border-radius: 10px;
		clip-path: polygon(98% 0, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0 98%, 0 2%, 2% 0);
	}

	.pipe.spring {
		background: linear-gradient(to bottom, #a8e063 0%, #56ab2f 100%);
		border-radius: 15px;
		box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.3);
	}

	.pipe.summer {
		background: linear-gradient(to right, #f6d365 0%, #fda085 100%);
		box-shadow: 0px 0px 30px rgba(255, 223, 139, 0.5);
		}

		.pipe.autumn {
			background: linear-gradient(to bottom, #e69500 0%, #f9d423 100%);
			box-shadow: 0px 4px 10px rgba(173, 140, 30, 0.5);
			border-radius: 10px;
		}



</style>
