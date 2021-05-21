import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	ScrollView,
	Text,
	TextInput,
	StyleSheet,
	Platform,
	ActivityIndicator,
	Alert,
} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'

import HeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'
import { createProduct, updateProduct } from '../../store/actions/products'

const EditProductScreen = props => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	const prodId = props.route.params ? props.route.params.productId : null
	const editedProduct = useSelector(state =>
		state.products.userProducts.find(prod => prod.id === prodId)
	)
	const dispatch = useDispatch()

	const [title, setTitle] = useState(editedProduct ? editedProduct.title : '')
	const [imageUrl, setImageUrl] = useState(
		editedProduct ? editedProduct.imageUrl : ''
	)
	const [price, setPrice] = useState('')
	const [description, setDescription] = useState(
		editedProduct ? editedProduct.description : ''
	)

	useEffect(() => {
		if (error) {
			Alert.alert('An error occurred!', error, [{ text: 'Okay' }])
		}
	}, [error])

	const submitHandler = useCallback(async () => {
		setError(null)
		setIsLoading(true)
		try {
			if (editedProduct) {
				await dispatch(
					updateProduct(prodId, title, description, imageUrl)
				)
			} else {
				await dispatch(
					createProduct(title, description, imageUrl, +price)
				)
			}
			props.navigation.goBack()
		} catch (err) {
			setError(err.message)
		}
		setIsLoading(false)
	}, [dispatch, prodId, title, description, imageUrl, price])

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title='Save'
						iconName={
							Platform.OS === 'android'
								? 'md-checkmark'
								: 'ios-checkmark'
						}
						onPress={submitHandler}
					/>
				</HeaderButtons>
			),
		})
	}, [submitHandler])

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		)
	}

	return (
		<ScrollView>
			<View style={styles.form}>
				<View style={styles.formControl}>
					<Text style={styles.label}>Title</Text>
					<TextInput
						style={styles.input}
						value={title}
						onChangeText={text => setTitle(text)}
					/>
				</View>
				<View style={styles.formControl}>
					<Text style={styles.label}>Image URL</Text>
					<TextInput
						style={styles.input}
						value={imageUrl}
						onChangeText={text => setImageUrl(text)}
					/>
				</View>
				{editedProduct ? null : (
					<View style={styles.formControl}>
						<Text style={styles.label}>Price</Text>
						<TextInput
							style={styles.input}
							value={price}
							onChangeText={text => setPrice(text)}
						/>
					</View>
				)}
				<View style={styles.formControl}>
					<Text style={styles.label}>Description</Text>
					<TextInput
						style={styles.input}
						value={description}
						onChangeText={text => setDescription(text)}
					/>
				</View>
			</View>
		</ScrollView>
	)
}

export const screenOptions = navData => {
	const routeParams = navData.route.params ? navData.route.params : {}
	return {
		headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product',
	}
}

const styles = StyleSheet.create({
	form: {
		margin: 20,
	},
	formControl: {
		width: '100%',
	},
	label: {
		fontFamily: 'open-sans-bold',
		marginVertical: 8,
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default EditProductScreen
