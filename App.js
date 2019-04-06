
import IngredientView from './src/IngredientView/IngredientView'
import CalibrationView from './src/CalibrationView/CalibrationView';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HelpView from './src/HelpView/HelpView';

const MainNavigator = createStackNavigator({
   Home: { screen: IngredientView },
   Calibration: { screen: CalibrationView },
   Help: {screen: HelpView}
});
const App = createAppContainer(MainNavigator);

export default App;