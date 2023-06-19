<script lang="ts">
	import type { Bird } from '$lib/Game';
	export let bird: Bird;
</script>

<section
	style="left: {bird.left}px; top: {bird.top}px; width: {bird.size}px; height: {bird.size}px;"
	class="bird"
/>

<style>
	.bird {
		position: absolute;
		background-image: url('Wizard.png');
		background-size: cover;
	}
</style>
