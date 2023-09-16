<script lang="ts">
	import type { Bird } from '$lib/Game';
	export let bird: Bird;

	  // Check if the thoughtText is an image URL
	function isImageUrl(text: string): boolean {
    return /\.(jpeg|jpg|gif|png)$/.test(text.toLowerCase());
  	}
</script>

<section
	style="left: {bird.left}px; top: {bird.top}px; width: {bird.size*1.2}px; height: {bird.size*1.2}px; background-image: url({bird.img})"
	class="bird"
>
{#if bird.thoughtText !== ''}
<div class="thought-bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}">
	{#if isImageUrl(bird.thoughtText)}
			<img src={bird.thoughtText} alt="Thought Image" class="thought-image"/>
	  	{:else}
			<p>{bird.thoughtText}</p>
	  	{/if}
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="top-left"></div>
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="top-right"></div>
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="bottom-left"></div>
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="bottom-right"></div>
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="left"></div>
		  <div class="bubble {isImageUrl(bird.thoughtText) ? 'image-bubble' : ''}" id="right"></div>
	  </div>
	<div class="small-bubble"></div>

{/if}
</section>

<style>
	.bird {
		position: absolute;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.thought-bubble {
		position: absolute;
		width: 220px;
		height: 120px;
		background-color: white;
		padding: 15px;
		top: -170px;
		right: -180px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 100px;
		animation: float 1s infinite;
	}

	.bubble {
		position: absolute;
		background-color: white;
		border-radius: 50%;
	}

	#top-left {
		width: 60px;
		height: 30px;
		top: -15px;
		left: 30px;
	}

	#top-right {
		width: 80px;
		height: 40px;
		top: -20px;
		right: 20px;
	}

	#bottom-left {
		width: 70px;
		height: 35px;
		bottom: -17px;
		left: 25px;
	}

	#bottom-right {
		width: 50px;
		height: 25px;
		bottom: -12px;
		right: 25px;
	}

	#left {
		width: 10px;
		height: 20px;
		left: -5px;
		top: 50%;
		transform: translateY(-50%);
	}

	#right {
		width: 25px;
		height: 40px;
		right: -12px;
		top: 50%;
		transform: translateY(-50%);
	}

	.thought-bubble p {
		margin: 0;
		font-size: 11px;
		font-family: 'Montserrat'; /* Playful font */
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		overflow: hidden; /* Removed to allow wrapping */
		white-space: normal; /* Changed to "normal" to allow wrapping */
		word-wrap: break-word; /* Added to allow breaking of words to next line */
		animation: typing 2s steps(30, end), /* Adjusted typing animation */
					blinking-cursor 0.5s step-end infinite alternate; /* Adjusted blinking cursor animation */
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
		}
	}

	.small-bubble {
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: white;
		top: -30px;
		right: 10px;
		border-radius: 50%;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.thought-bubble.image-bubble {
    width: 320px;
    height: 220px;
	top: -200px;
	right: -280px;
  }
  
  .thought-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100px;
  }

  .bubble.image-bubble#top-left {
    width: 120px;
    height: 30px;
	left: 60px;
  }
  .bubble.image-bubble#top-right {
    width: 50px;
    height: 20px;
	top: 0px;
	right: 30px;
  }
  .bubble.image-bubble#bottom-left {
    width: 30px;
    height: 20px;
	top: 160px;
	left: 30px;
  }
  .bubble.image-bubble#bottom-right {
	width: 100px;
    height: 25px;
	right: 60px;
  }

  .bubble.image-bubble#left {
    width: 20px;
    height: 50px;
	left: -10px;
	top: 75px;
  }
  .bubble.image-bubble#right {
    width: 25px;
    height: 50px;
	right: -10px;
  }

  @keyframes typing {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

  @keyframes blinking-cursor {
  0%, 100% {
    border-right-color: transparent;
  }
  50% {
    border-right-color: black;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.thought-image {
  animation: fadeIn 1s; /* Adjust the duration as needed */
}

</style>
