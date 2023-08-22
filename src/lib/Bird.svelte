<script lang="ts">
	import type { Bird } from '$lib/Game';
	export let bird: Bird;
</script>

<section
	style="left: {bird.left}px; top: {bird.top}px; width: {bird.size*1.2}px; height: {bird.size*1.2}px; background-image: url({bird.img})"
	class="bird"
>
{#if bird.thoughtText !== ''}
	<div class="thought-bubble">
		<p>{bird.thoughtText}</p>
	</div>
	<div class="small-bubble"></div>
{/if}
</section>

<style>
	.bird {
		position: absolute;
		background-size: contain; /* Changed from "cover" to "contain" */
		background-repeat: no-repeat; /* Added to prevent repeating of the background image */
	}

	.thought-bubble {
		position: absolute;
		width: 120px;
		height: 60px;
		background-color: white;
		padding: 15px;
		top: -120px;
		right: -140px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 100px;
		animation: float 1s infinite;
	}

	.thought-bubble::before,
	.thought-bubble::after {
		content: "";
		position: absolute;
		background-color: white;
		border-radius: 60%;
	}

	.thought-bubble::before {
		width: 50px;
		height: 50px;
		top: -20px;
		left: 15px;
	}

	.thought-bubble::after {
		width: 70px;
		height: 70px;
		top: -35px;
		right: 15px;
	}

	.small-bubble {
		position: absolute;
		width: 30px;
		height: 30px;
		background-color: white;
		top: -40px;
		right: 10px;
		border-radius: 50%;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.thought-bubble p {
		margin: 0;
		font-size: 12px;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
</style>
