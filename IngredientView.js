import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView } from 'react-native';
import * as buttonpress from './ButtonPress';

class IngredientView extends Component {
   constructor(props) {
      super(props);
      buttonpress.socketSetup()
      this.state = {
         ingredients: [
            { 'id': 0, 'name': 'All-Purpose Flour', 'enable': true, 'grams': 0 },
            { 'id': 1, 'name': 'Baking Soda', 'enable': true, 'grams': 0 },
            { 'id': 2, 'name': 'Salt', 'enable': true, 'grams': 0 },
            { 'id': 3, 'name': 'Baking Powder', 'enable': true, 'grams': 0 },
            { 'id': 4, 'name': 'Brown Sugar', 'enable': true, 'grams': 0 },
            { 'id': 5, 'name': 'Chocolate Chips', 'enable': true, 'grams': 0 },
         ],
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
      console.log(this.state.ingredients)
      buttonpress.send(this.state.ingredients);
   }
   handleToggle = (id) => (param) => {
      console.log(id, param)
      let ingredientsCopy = JSON.parse(JSON.stringify(this.state.ingredients))
      ingredientsCopy[id].enable = param
      this.setState({
         ingredients: ingredientsCopy
      })
   }
   render() {
      return (
         <KeyboardAvoidingView>
            <View>
               <ScrollView>
                  {
                     this.state.ingredients.map((item, index) => (
                        <View key={item.id} style={styles.item}>
                           <Text
                              style={styles.nameLayout}
                           >
                              {item.name}
                           </Text>
                           <Switch
                              style={styles.switchLayout}
                              value={item.enable}
                              onValueChange={this.handleToggle(item.id)}
                           />
                           <TextInput
                              style={styles.input}
                              keyboardType='numeric'
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
         </KeyboardAvoidingView>
      )
   }
}
export default IngredientView

const styles = StyleSheet.create({
   item: {
      flexDirection: 'row',
      padding: 5,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: '#d2f7f1',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   nameLayout: {
      // paddingRight: 20,      
   },
   input: {
      margin: 15,
      height: 20,

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
      textAlign: 'center'
   },
   switchLayout: {
      // paddingRight: 20
   }
})