<script>
	import { OfferType, saleTerms, rentTerms } from '$lib/contracts/Marketplace';
	import { getWei, timeDropdrown } from '$lib/helpers/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let contract;
	export let tokenId;
	export let _offerType;
	export let _tokenType;

	let price;
	let deposit;
	let duration = 0;
	
	async function createOffer() {
		let Terms;
		let rent = null;
		let priceInWei = await getWei(price);
		let depositInWei;

		if (_offerType == OfferType.ForSale) {
			Terms = saleTerms;
			Terms.price = priceInWei;
		} else {
			depositInWei = await getWei(deposit);
			Terms = rentTerms;
			Terms.price = priceInWei;
			Terms.rental.deposit = depositInWei;
			Terms.rental.minDuration = duration * timeDropdrown.oneDay;
			rent = true;
		}

		let offering = await contract.setOffer(tokenId, _offerType, _tokenType, Terms);
		let _rentTerms =
			rent == true
				? {
						price: price,
						deposit: deposit,
						duration: duration + ' days'
				  }
				: null;

		let rentalTerms =
			rent == true
				? {
						price: priceInWei,
						deposit: depositInWei,
						minDuration: Terms.rental.minDuration
				  }
				: null;

		if (offering.blockHash) {
			let offer = {
				offerType: _offerType,
				owner: contract.contract.account,
				rent: rentalTerms,
				rentTerms: _rentTerms,
				sellPrice: priceInWei,
				price: price,
				tokenId: tokenId,
				tokenType: _tokenType
			};

			console.log('offer created:', offer);
			dispatch('offerCreated', {
				offer: offer,
				name: 'offerCreated'
			});
		}
	}
</script>

<h3>Create a {_offerType == OfferType.ForSale ? 'Sale' : 'Rent'} Offer</h3>

<div class="form-floating mb-3">
	<input
		type="number"
		class="form-control"
		id="price"
		placeholder="Price in Eth"
		bind:value={price}
	/>
	<label for="price">Price in Eth</label>
</div>
{#if _offerType == OfferType.ForRent}
	<div class="form-floating mb-3">
		<input
			type="number"
			class="form-control"
			id="deposit"
			placeholder="Amount in Eth"
			bind:value={deposit}
		/>
		<label for="deposit">Deposit in Eth</label>
	</div>
	<div class="form-floating mb-3">
		<input
			type="number"
			class="form-control"
			id="duration"
			placeholder="Time to rent"
			bind:value={duration}
		/>
		<label for="floatingPassword">Number of days</label>
	</div>
{/if}

<button class="btn btn-success mt-2" on:click={() => createOffer()}>Create Offer</button>
