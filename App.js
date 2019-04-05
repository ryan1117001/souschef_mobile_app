import React, { Component } from 'react';
import { View, Text } from 'react-native';
import GlobalStyles from './src/GlobalStyles';
import IngredientView from './src/IngredientView/IngredientView'

export default class SouschefMain extends Component {

   render() {
      return (
         <View style={GlobalStyles.droidSafeArea}>
            <IngredientView/>
         </View>
      );
   }
}