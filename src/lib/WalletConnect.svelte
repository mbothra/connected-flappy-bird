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

{#if !web3Props?.account}
	<button {style} class="btn" on:click={connectWallet}>Attach Wallet</button>
{/if}
