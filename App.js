import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import IngredientView from './IngredientView.js';

export default class SouschefMain extends Component {
   render() {
      return (
         <View style={viewStyle.mainViewContainer}>
            <Text style={viewStyle.title} >
               Sous-Chef
        </Text>
            <IngredientView />
         </View>
      );
   }
}

const viewStyle = StyleSheet.create({
   mainViewContainer: {
      marginTop: 50
   },
   title: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
   },
})