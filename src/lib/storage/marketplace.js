
import { createWritableStore } from "$lib/helpers/storage"

const OfferObj = {
    owner: '',
    tokenId: null,
    tokenType: null,
    sellPrice: null,
    rent: {
        price:null,
        deposit: null,
        minDuration: 0,
    }
}

export const userOffers = createWritableStore('userOffers', {eggs:[],dragons:[]})


