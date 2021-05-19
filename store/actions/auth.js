export const SIGNUP = 'SIGNUP'

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
			throw new Error('Something went wrong')
		}

		const respData = await response.json()
		console.log(respData)
		dispatch({ type: SIGNUP })
	}
}
