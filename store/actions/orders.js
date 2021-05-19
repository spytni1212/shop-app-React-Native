import Order from '../../models/order'

export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS'

export const fetchOrders = () => {
	return async dispatch => {
		try {
			const response = await fetch(
				'https://shop-app-a09a8-default-rtdb.firebaseio.com/orders/u1.json'
			)

			if (!response.ok) {
				throw new Error('something went wrong')
			}

			const respData = await response.json()
			const loadedOrders = []

			for (const key in respData) {
				loadedOrders.push(
					new Order(
						key,
						respData[key].cartItems,
						respData[key].totalAmount,
						new Date(respData[key].date)
					)
				)
			}

			dispatch({ type: SET_ORDERS, orders: loadedOrders })
		} catch (err) {
			throw err
		}
	}
}

export const addOrder = (cartItems, totalAmount) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const date = new Date()

		const response = await fetch(
			`https://shop-app-a09a8-default-rtdb.firebaseio.com/orders/u1.json?auth=${token}`,
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
