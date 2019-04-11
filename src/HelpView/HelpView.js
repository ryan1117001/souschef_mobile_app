import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

class HelpView extends Component {

	// Help Page title
	static navigationOptions = {
		title: "Help Page"
	};

	// Renders instruction for the sous chef
	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.header}>
						Welcome to the Sous Chef Help Page!
					</Text>
					<Text style={styles.bullet}>
						{'\u2022' + " "}
						<Text>
							Make sure the Sous Chef is powered on!
						</Text>
					</Text>
					<Text style={styles.bullet}>
						{'\u2022' + " "}
						<Text>
							Put in the amount of grams that you want.
						</Text>
					</Text>
					<Text style={styles.bullet}>
						{'\u2022' + " "}
						<Text>
							Press the image to dispense and you're done!
						</Text>
					</Text>
				</View>
			</ScrollView>
		);
	}
}

export default HelpView

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 10
	},
	bullet: {
		fontSize: 18,
		padding: 10
	},
	header: {
		fontWeight: 'bold',
		fontSize: 20,
		padding: 10
	}
})