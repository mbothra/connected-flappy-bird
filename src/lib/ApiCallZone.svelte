<script lang="ts">
	import type { ApiCallZone } from '$lib/Game';
	export let zone: ApiCallZone;
</script>

{#if zone.show}
	<section style="left: {zone.left}px; top: {zone.top}px; width: {zone.width}px; height: 350px;" class="api-call-zone">
		<div class="effect-tag">{zone.effect}</div>
		<div class="effect-description">Functions Activation Zone</div>
		<!-- You can add themed graphics and animations based on zone.effect here -->
	</section>
{/if}

<style>
	.api-call-zone {
		position: absolute;
		background: linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 100%);
		border: 3px dashed #000; /* Dashed outline */
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
		border-radius: 10px; /* Rounded corners */
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 10px 5px 10px; /* Padding to position items within the container */
	}

	.effect-tag {
		font-family: 'Chalkduster', cursive; /* Playful font */
		font-size: 16px;
		color: #5c6273; /* Text color */
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Soft text shadow */
	}

	.effect-description {
		font-family: 'Chalkduster', cursive; /* Playful font */
		font-size: 16px;
		color: #5c6273; /* Text color */
		text-align: right;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Soft text shadow */
        animation: bounce 1s infinite;
		transition: all 0.5s ease;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}
</style>
