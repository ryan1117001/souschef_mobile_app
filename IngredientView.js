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

      // this.socket = new WebSocket('ws://10.1.250.128:8000');
      this.socket = new WebSocket('ws://172.16.16.3:8000');

      this.state = {
         ingredients: [
            { 'id': 0, 'name': 'All-Purpose Flour', 'enable': true, 'grams': 0 },
            { 'id': 1, 'name': 'Baking Soda', 'enable': true, 'grams': 0 },
            { 'id': 2, 'name': 'Salt', 'enable': true, 'grams': 0 },
            { 'id': 3, 'name': 'Baking Powder', 'enable': true, 'grams': 0 },
            { 'id': 4, 'name': 'Brown Sugar', 'enable': true, 'grams': 0 },
            { 'id': 5, 'name': 'Chocolate Chips', 'enable': true, 'grams': 0 },
         ],
         status:
            { 'disabled': false, 'text': 'Ready to Dispense' },
      }
   }
   componentDidMount() {
      this.handleSocketSetup()
   }

   handleSocketSetup = () => {
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
            status:
               { 'disabled': false, 'validNum': true, 'text': 'Tap to Dispense' }
         })
      }
   }

   handleText = (id) => (param) => {
      let ingredientsCopy = JSON.parse(JSON.stringify(this.state.ingredients))
      ingredientsCopy[id].grams = Number(param)
      this.setState({
         ingredients: ingredientsCopy
      })
   }

   handlePress = () => {
      console.log("handle press")
      if (this.checkNumber()) {
         this.setState({
            status:
               { 'disabled': true, 'text': 'Dispensing!!!' }
         })
         this.socket.send(JSON.stringify(this.state.ingredients))
      }
      else {
         this.setState({
            status:
               { 'disabled': false, 'text': 'Invalid Number, Did Not Send' }
         })
      }
   }
   handleToggle = (id) => (param) => {
      console.log(id, param)
      let ingredientsCopy = JSON.parse(JSON.stringify(this.state.ingredients))
      ingredientsCopy[id].enable = param
      this.setState({
         ingredients: ingredientsCopy
      })
   }
   checkNumber = () => {
      let ingredientsCopy = JSON.parse(JSON.stringify(this.state.ingredients))

      for (i = 0; i < ingredientsCopy.length; i++) {
         if (ingredientsCopy[i].grams == null) {
            return false
         }
      }

      return true
   }
   render() {
      return (
         <KeyboardAvoidingView>
            <ScrollView>
               {
                  this.state.ingredients.map((item, index) => (
                     <View key={item.id} style={styles.item}>
                        <Switch
                           value={item.enable}
                           onValueChange={this.handleToggle(item.id)}
                        // disabled={true} this lines breaks the expo app
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
            <Text
               style={styles.statusTextLayout}
            >
               {this.state.status.text}
            </Text>
            <TouchableOpacity
               style={!this.state.status.disabled ? styles.dispenseButtonLayout : styles.disabledButtonLayout}
               onPress={this.handlePress}
               disabled={this.state.status.disabled}
            >
               <Text style={styles.dispenseTextLayout} > Dispense </Text>
            </TouchableOpacity>
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
      margin: 10,
      height: 40,
      textAlign: 'center',
      borderColor: '#2a4944',
      borderWidth: 1,
   },
   disabledButtonLayout: {
      backgroundColor: '#ff9486',
      padding: 10,
      margin: 10,
      height: 40,
      textAlign: 'center',
      borderColor: '#2a4944',
      borderWidth: 1,
   },
   dispenseTextLayout: {
      color: 'black',
      textAlign: 'center'
   },
   statusTextLayout: {
      color: 'black',
      textAlign: 'center',
      borderColor: 'black',
      borderWidth: 1,
      padding: 10,
      margin: 10,
      height: 40,
   }
})