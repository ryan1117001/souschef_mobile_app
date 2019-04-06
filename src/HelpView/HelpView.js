import React, { Component } from 'react';
import { View, Text } from 'react-native';

class HelpView extends Component {
    render() {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Help View</Text>
          </View>
        );
      }
}

export default HelpView