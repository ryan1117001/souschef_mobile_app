import React, { Component } from 'react';
import {
   Text,
   View,
   StyleSheet,
   ScrollView,
   TextInput,
   TouchableOpacity,
   Switch,
   KeyboardAvoidingView
} from 'react-native';

class IngredientView extends Component {
   constructor(props) {
      super(props);

      this.socket = new WebSocket('ws://10.1.250.128:8000');

      this.state = {
         ingredients: [
            { 'id': 0, 'name': 'All-Purpose Flour', 'enable': true, 'grams': 0 },
            { 'id': 1, 'name': 'Baking Soda', 'enable': true, 'grams': 0 },
            { 'id': 2, 'name': 'Salt', 'enable': true, 'grams': 0 },
            { 'id': 3, 'name': 'Baking Powder', 'enable': true, 'grams': 0 },
            { 'id': 4, 'name': 'Brown Sugar', 'enable': true, 'grams': 0 },
            { 'id': 5, 'name': 'Chocolate Chips', 'enable': true, 'grams': 0 },
         ],
         dispense:
            { 'disabled': false, 'text': 'Tap to Dispense' }
      }
   }
   componentDidMount() {
      this.socket.onopen = () => {
         console.log("connection opened")
      }
      this.socket.onerror = (e) => {
         console.log("error: ", e.message)
      }
      this.socket.onclose = (e) => {
         console.log("closing", e.code, e.reason)
      }
      this.socket.onmessage = (e) => {
         console.log(e.data)
         this.setState({
            dispense:
               { 'disabled': false, 'text': 'Tap to Dispense' }
         })
      }
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
      this.setState({
         dispense:
            { 'disabled': true, 'text': 'Dispensing!!!' }
      })
      this.socket.send(JSON.stringify(this.state.ingredients))
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
                           <Switch
                              value={item.enable}
                              onValueChange={this.handleToggle(item.id)}
                           />
                           <Text>
                              {item.name}
                           </Text>
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
                  style={styles.dispenseButtonLayout}
                  onPress={this.handlePress}
                  disabled={this.state.dispense.disabled}
               >
                  <Text style={styles.dispenseTextLayout} > {this.state.dispense.text} </Text>
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
   input: {
      margin: 15,
      height: 20,
   },
   dispenseButtonLayout: {
      backgroundColor: '#d2f7f1',
      padding: 10,
      margin: 15,
      height: 40,
      textAlign: 'center',
      borderColor: '#2a4944',
      borderWidth: 1,
   },
   dispenseTextLayout: {
      color: 'black',
      textAlign: 'center'
   }
})