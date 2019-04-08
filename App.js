
import IngredientView from './src/IngredientView/IngredientView'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HelpView from './src/HelpView/HelpView';

const MainNavigator = createStackNavigator({
   Home: { screen: IngredientView },
   Help: {screen: HelpView}
});
const App = createAppContainer(MainNavigator);

export default App;