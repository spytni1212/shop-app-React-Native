import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import Colors from '../constants/Colors'
import { authenticate, setDidTryAutoLogin } from '../store/actions/auth'

const StartupScreen = props => {
	const dispatch = useDispatch()

	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem('userData')
			if (!userData) {
				dispatch(setDidTryAutoLogin())
				return
			}
			const transformedData = JSON.parse(userData)
			const { token, userId, expiryDate } = transformedData
			const expirationDate = new Date(expiryDate)

			if (expirationDate <= new Date() || !token || !userId) {
				dispatch(setDidTryAutoLogin())
				return
			}

			const expirationTime =
				expirationDate.getTime() - new Date().getTime()

			dispatch(authenticate(userId, token, expirationTime))
		}
		tryLogin()
	}, [dispatch])

	return (
		<View style={styles.screen}>
			<ActivityIndicator size='large' color={Colors.primary} />
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default StartupScreen
