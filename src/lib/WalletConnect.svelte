<script lang="ts">
	import { ethers } from 'ethers';
	export let style = '';
	export let web3Props: Web3Props;

	async function connectWallet() {
		let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		await provider.send('eth_requestAccounts', []);
		const signer = provider.getSigner();
		const account = await signer.getAddress();
		const chainId = await signer.getChainId();
		web3Props = { signer, provider, chainId, account };
		getBalance();
	}
	async function getBalance() {
		let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		await provider.send('eth_requestAccounts', []);
		const signer = provider.getSigner();
		const account = await signer.getAddress();
		const bal = await provider.getBalance(account);
		const balInEth = ethers.utils.formatEther(bal);
		console.log(`balance of ${account}` + ` is ${balInEth} ETH`);
	}
</script>

<div class="btn-container">
	{#if !web3Props?.account}
		<button class="btn pixar-btn" on:click={connectWallet}>Attach Wallet</button>
	{/if}
</div>

<style>
	.btn-container {
		position: absolute;
		top: 10px;
		right: 150px;
		z-index: 10;
	}

	.btn {
		padding: 12px 20px;
		border: none;
		cursor: pointer;
		font-size: 16px;
	}

	.pixar-btn {
		background: linear-gradient(45deg, #375bd2, #375bd2);
		color: #FFF;
		font-family: 'Circular'; /* Playful font */
	}

	.pixar-btn:hover {
		background: linear-gradient(45deg, #375bd2, #375bd2);
	}
</style>
