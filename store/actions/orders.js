export const ADD_ORDER = 'ADD_ORDER'

export const addOrder = (cartItems, totalAmount) => {
	return async dispatch => {
		const date = new Date()

		const response = await fetch(
			'https://shop-app-a09a8-default-rtdb.firebaseio.com/orders/u1.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					cartItems,
					totalAmount,
					date: date,
				}),
			}
		)

		if (!response.ok) {
			throw new Error('Something went wrong')
		}

		const respData = await response.json()

		dispatch({
			type: ADD_ORDER,
			orderData: {
				id: respData.name,
				items: cartItems,
				amount: totalAmount,
				date: date,
			},
		})
	}
}
