import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

class IngredientView extends Component {
   constructor(props) {
      super(props);
      this.state = {
         ingredients: [
            { 'name': 'All-Purpose Flour', 'id': 0, 'grams': 0 },
            { 'name': 'Baking Soda', 'id': 1, 'grams': 0 },
            { 'name': 'Salt', 'id': 2, 'grams': 0 },
            { 'name': 'Baking Powder', 'id': 3, 'grams': 0 },
            { 'name': 'Brown Sugar', 'id': 4, 'grams': 0 },
            { 'name': 'Chocolate Chips', 'id': 5, 'grams': 0 },
         ]
      }
   }
   componentDidMount() {
      console.log("didMount")
      
   }
   handleText = (id) => (param) => {
      let ingredientsCopy = JSON.parse(JSON.stringify(this.state.ingredients))
      ingredientsCopy[id].grams = param
      this.setState({
         ingredients: ingredientsCopy
      })
   }
   handlePress = () => {
      console.log("handle press")
   }
   render() {
      return (
         <View>
            <ScrollView>
               {
                  this.state.ingredients.map((item, index) => (
                     <View key={item.id} style={styles.item}>
                        <Text>{item.name}</Text>
                        <TextInput
                           placeholder="grams"
                           onChangeText={this.handleText(item.id)}
                        />
                     </View>
                  ))
               }
            </ScrollView>
            <TouchableOpacity
               style={styles.dispenseButton}
               onPress={this.handlePress}
            >
               <Text style={styles.dispenseText} > Dispense </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default IngredientView

const styles = StyleSheet.create({
   item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 30,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: '#d2f7f1'
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   dispenseButton: {
      backgroundColor: '#d2f7f1',
      padding: 10,
      margin: 15,
      height: 40,
      textAlign: 'center',
      borderColor: '#2a4944',
      borderWidth: 1,
   },
   dispenseText: {
      color: 'black',
      textAlign: 'center',
   },
})