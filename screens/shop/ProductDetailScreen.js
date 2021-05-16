import React from 'react'
import { ScrollView, View, Text, Image, StyleSheet, Button } from 'react-native'
import { useSelector } from 'react-redux'

const ProductDetailScreen = props => {
	const productId = props.navigation.getParam('productId')
	const selectedProduct = useSelector(state =>
		state.products.availableProducts.find(prod => prod.id === productId)
	)

	return (
		<View>
			<Text>{selectedProduct.title}</Text>
		</View>
	)
}

ProductDetailScreen.navigationOptions = navigationData => {
	const title = navigationData.navigation.getParam('productTitle')

	return {
		headerTitle: title,
	}
}

const styles = StyleSheet.create({})

export default ProductDetailScreen
