import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import {
	CREATE_PRODUCT,
	DELETE_PRODUCT,
	UPDATE_PRODUCT,
} from '../actions/products'

const initialState = {
	availableProducts: PRODUCTS,
	userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1'),
}

const productsReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_PRODUCT:
			const newProduct = new Product(
				new Date().toString(),
				'u1',
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price
			)
			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct),
			}

		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex(
				prod => prod.id === action.prodId
			)
			const updatedProduct = new Product(
				action.prodId,
				state.userProducts[productIndex.ownerId],
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				state.userProducts[productIndex].price
			)
			const updatedUserProducts = [...state.userProducts]
			updatedUserProducts[productIndex] = updatedProduct

			const availableProductIndex = state.availableProducts.findIndex(
				prod => prod.id === action.prodId
			)
			const updatedAvailableProducts = [...state.availableProducts]
			updatedAvailableProducts[availableProductIndex] = updatedProduct

			return {
				...state,
				availableProducts: updatedAvailableProducts,
				userProducts: updatedUserProducts,
			}
		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter(
					product => product.id !== action.productId
				),
				availableProducts: state.availableProducts.filter(
					product => product.id !== action.productId
				),
			}
	}
	return state
}

export default productsReducer
