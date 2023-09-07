<script lang="ts">
    import { writable } from 'svelte/store';
	export let score: number;
    import { pushScore } from './Game.ts'; // Adjust the path if needed
    import { saveScoreButton } from './stores';

    // Input binding for the username
    let username = '';

    async function pushToBlockchain() {
    if (!username || username.trim() === '') {
        console.error('Username is required.');
        return;
    }

    try {
        await pushScore(username, score);
        console.log('Score successfully pushed to blockchain.');
    } catch (error) {
        console.error('Error pushing score to blockchain:', error);
    }
    }

</script>

<main class="game-over">
    <h1>Publish your score onchain and mint an NFT!</h1>
    <div class="content">
        <label for="username">Enter your username:</label>
        <input id="username" bind:value={username} placeholder="Your Name" />
        {#if $saveScoreButton}
        <button on:click={pushToBlockchain}>Save Score</button>
        {/if}
        {#if !$saveScoreButton}
        <button disabled={true} on:click={pushToBlockchain}>Score Saved!</button>
        {/if}
    </div>
</main>

<style>
    .game-over {
        font-family: 'Montserrat';
        background: rgba(255, 255, 255, 0.9);
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        padding: 15px;
        text-align: center;
        width: 30%; /* Making the dialog a bit smaller */
        margin: auto; /* For center alignment */
        position: relative;
        top: 50%;
        font-size: 8px;
    }

    .content {
        background: rgba(246, 237, 215, 0.7);
        border-radius: 12px;
        padding: 15px;
        margin-top: 15px;
        font-size: 14px;
    }

    button {
        background-color: #375bd2;
        border: none;
        color: white;
        padding: 8px 15px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
    }

    button:hover {
        background-color: #4a6ed9;
        transform: scale(1.05);
    }
</style>