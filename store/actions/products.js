import Product from '../../models/product'

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const fetchProducts = () => {
	return async dispatch => {
		try {
			const response = await fetch(
				'https://shop-app-a09a8-default-rtdb.firebaseio.com/products.json'
			)

			if (!response.ok) {
				throw new Error('something went wrong')
			}

			const respData = await response.json()
			const loadedProducts = []

			for (const key in respData) {
				loadedProducts.push(
					new Product(
						key,
						'u1',
						respData[key].title,
						respData[key].imageUrl,
						respData[key].description,
						respData[key].price
					)
				)
			}

			dispatch({ type: SET_PRODUCTS, products: loadedProducts })
		} catch (err) {
			throw err
		}
	}
}

export const deleteProduct = productId => {
	return {
		type: DELETE_PRODUCT,
		productId,
	}
}

export const createProduct = (title, description, imageUrl, price) => {
	return async dispatch => {
		const response = await fetch(
			'https://shop-app-a09a8-default-rtdb.firebaseio.com/products.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description,
					imageUrl,
					price,
				}),
			}
		)

		const respData = await response.json()

		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				id: respData.name,
				title,
				description,
				imageUrl,
				price,
			},
		})
	}
}

export const updateProduct = (id, title, description, imageUrl) => {
	return {
		type: UPDATE_PRODUCT,
		prodId: id,
		productData: {
			title,
			description,
			imageUrl,
		},
	}
}
