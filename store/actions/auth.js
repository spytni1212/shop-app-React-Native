import AsyncStorage from '@react-native-async-storage/async-storage'

// export const SIGNUP = 'SIGNUP'
// export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId, token) => {
	return { type: AUTHENTICATE, userId, token }
}

export const signup = (email, password) => {
	return async dispatch => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJiH6eXmSZf1Ly6P5t_qGZ8Y60fZckwtM',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		)

		if (!response.ok) {
			const errorRespData = await response.json()
			const errorId = errorRespData.error.message
			let message = 'Something went wrong'
			if (errorId === 'EMAIL_EXISTS') {
				message = 'This email exists already!'
			}
			throw new Error(message)
		}

		const respData = await response.json()
		console.log(respData)
		dispatch(authenticate(respData.localId, respData.idToken))
		const expirationDate = new Date(
			new Date().getTime() + parseInt(respData.expiresIn) * 1000
		)
		saveDataToStorage(respData.idToken, respData.localId, expirationDate)
	}
}

export const login = (email, password) => {
	return async dispatch => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJiH6eXmSZf1Ly6P5t_qGZ8Y60fZckwtM',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		)

		if (!response.ok) {
			const errorRespData = await response.json()
			const errorId = errorRespData.error.message
			let message = 'Something went wrong'
			if (errorId === 'EMAIL_NOT_FOUND') {
				message = 'This email could not be found!'
			} else if (errorId === 'INVALID_PASSWORD') {
				message = 'This password is not valid!'
			}
			throw new Error(message)
		}

		const respData = await response.json()
		console.log(respData)
		dispatch(authenticate(respData.localId, respData.idToken))
		const expirationDate = new Date(
			new Date().getTime() + parseInt(respData.expiresIn) * 1000
		)
		saveDataToStorage(respData.idToken, respData.localId, expirationDate)
	}
}

export const logout = () => {
	return { type: LOGOUT }
}

const saveDataToStorage = (token, userId, expirationDate) => {
	AsyncStorage.setItem(
		'userData',
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate.toISOString(),
		})
	)
}
