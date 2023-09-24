<script lang="ts">
    import { writable } from 'svelte/store';
	export let score: number;
    export let functionScore: number;
    export let startFunc;
    import { pushScore } from './Game.ts'; // Adjust the path if needed
    import { saveScoreButton } from './stores';

    let finalScore = 0;
    // Input binding for the username
    let username = '';

    async function pushToBlockchain() {
    if (!username || username.trim() === '') {
        console.error('Username is required.');
        return;
    }

    try {
        await pushScore(username, score, functionScore);
        console.log('Score successfully pushed to blockchain.');
    } catch (error) {
        console.error('Error pushing score to blockchain:', error);
    }
    }

    finalScore = score + 2*functionScore;
</script>

<main class="game-over">
    <h1>Game Over</h1>
    <div class="score-box">
        Your Score:
        <div class="actual-score">
            {finalScore}
        </div>
    </div>

    <h1>Publish your score onchain and mint an NFT!</h1>
    <div class="content">
        <input id="username" bind:value={username} placeholder="Enter Your Name" />
        {#if $saveScoreButton}
        <button class="save-button" on:click={pushToBlockchain}>Publish Score</button>
        {/if}
        {#if !$saveScoreButton}
        <div class="qr-container">
            <img src="/qr.png" alt="QR Code" class="qr-code"/>
            <button disabled={true} on:click={pushToBlockchain}>Score Saved! Scan to find your NFT</button>
        </div>
        {/if}
    </div>
    <hr> <!-- This is the horizontal line -->
    <h1>Start new game</h1>
    <div class="content">
    <button class="new-button" on:click={startFunc}>Start new game</button>
    </div>
</main>

<style>
    .qr-container {
    text-align: center;  /* To center the button and image horizontally */
    margin-top: 20px;    /* Optional spacing on top */
    }

    .qr-code {
    width: 100px;      /* Setting the width */
    height: auto;      /* To maintain aspect ratio */
    padding: 1px;      /* Adding padding */
    display: block;    /* Making it block level for centering */
    margin: 10px auto; /* Centering it horizontally and adding spacing */
}

    .game-over {
        font-family: 'Circular';
        background: rgba(255, 255, 255);
        padding:60px;
        text-align: center;
        width: 30%; /* Making the dialog a bit smaller */
        margin: auto; /* For center alignment */
        position: relative;
        top: 10%;
    }
    hr {
        width: 100%; /* or any other preferred width */
        margin-top: 20px; /* space above the line */
        margin-bottom: 20px; /* space below the line */
        border: none; /* remove default border */
        border-top: 0.5px solid gray; /* create a new top border with desired color and thickness */
        margin-left: auto;
        margin-right: auto;

    }

    .game-over h1{
        font-size: 1.5em;
        text-align: center;

    }

    .score-box {
        border: 2px dotted #375bd2;  /* Dotted border with the color of the button */
        padding: 15px;
        font-size: 0.8em;
        text-align: center;
        margin-bottom: 20px;  /* Add some space between the score box and the title */
        border-radius: 10px;  /* Optional: to make the corners rounded */
        width: 80%;           /* You can adjust this for preferred width */
        margin-left: auto;
        margin-right: auto;
        font-family: 'Circular-Light';
    }

    .actual-score {
        font-size: 6em;     /* Makes the score larger */
        color: #375bd2;  /* Dotted border with the color of the button */
        font-family: 'Circular';
    }

    .save-button {
        background-color: #375bd2;
        color: white;
        cursor: pointer;
        transition: transform 0.3s;
        padding: 10px 20px;  /* Uniform padding for top/bottom and left/right */
        z-index: 0;
        width: 283px;
        font-size: 1em;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        text-align: center;  /* Ensures text is centered horizontally */
        display: block;      /* Convert the button to a block element */
        line-height: normal; /* Resets line-height */
        transition: transform 0.2s, background-color 0.2s;
        position: relative;  /* Added for clarity */
        font-family: 'Circular';
    }


    .content {
        padding: 15px;
        margin-top: 15px;
        font-size: 14px;
        text-align:center;
    }

    button {
        text-align: center;
    }
    .new-button {
        background-color: #375bd2;
        color: white;
        cursor: pointer;
        transition: transform 0.3s;
        padding: 10px 20px;  /* Uniform padding for top/bottom and left/right */
        z-index: 0;
        width: 283px;
        font-size: 1em;
        margin-left: auto;
        margin-right: auto;
        margin-top: -15px;
        text-align: center;  /* Ensures text is centered horizontally */
        display: block;      /* Convert the button to a block element */
        line-height: normal; /* Resets line-height */
        transition: transform 0.2s, background-color 0.2s;
        position: relative;  /* Added for clarity */
        font-family: 'Circular';
    }

</style>