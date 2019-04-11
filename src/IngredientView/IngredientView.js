import React, {
    Component
} from 'react';
import {
    FlatList,
    Image,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import {
    RkTextInput,
    RkCard,
    RkStyleSheet,
    RkTheme,
} from 'react-native-ui-kitten';
import {
    Snackbar,
    ActionButton
} from 'react-native-material-ui';
import GlobalStyles from '../GlobalStyles'


class IngredientView extends Component {
    // hides the header
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props)

        // IP address of the RPI
        this.socket = new WebSocket('ws://10.24.0.96:8000')

        this.state = {
            // data regarding the ingredients
            data: [
                {
                    name: 'Sour Patch Kids',
                    ingredient: { id: 0, grams: 0 },
                    photo: require('../../assets/photos/sourpatchkids.jpg'),
                    disabled: false
                },
                {
                    name: 'Nuts',
                    ingredient: { id: 1, grams: 0 },
                    photo: require('../../assets/photos/nuts.jpg'),
                    disabled: false
                },
                {
                    name: 'Gummy Bears',
                    ingredient: { id: 2, grams: 0 },
                    photo: require('../../assets/photos/gummybears.jpg'),
                    disabled: false
                },
                {
                    name: 'Teddy Grahams',
                    ingredient: { id: 3, grams: 0 },
                    photo: require('../../assets/photos/teddygrahams.jpg'),
                    disabled: false
                },
                {
                    name: 'Dried Dates',
                    ingredient: { id: 4, grams: 0 },
                    photo: require('../../assets/photos/drydates1.jpg'),
                    disabled: false
                },
                {
                    name: 'Raisins',
                    ingredient: { id: 5, grams: 0 },
                    photo: require('../../assets/photos/raisins2.jpg'),
                    disabled: false
                },
            ],
            // The popup at the bottome
            // default message is "sous chef"
            snackbar: {
                isVisible: false,
                message: "sous chef"
            }
        }
    }

    componentDidMount() {
        this.handleSocketSetup()
    }

    render() {
        // const {navigate} = this.props.navigation;
        return (
            // Takes account of the keyboard when it is needed
            <KeyboardAvoidingView style={GlobalStyles.droidSafeArea} behavior='padding'>
                {/* Each invdividual button is loaded here */}
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.extractItemKey}
                    style={styles.root}
                />
                <View>
                    { /* Snackbar message shows for 2.5 seconds on the screen */}
                    <Snackbar
                        visible={this.state.snackbar.isVisible}
                        message={this.state.snackbar.message}
                        timeout={2500}
                        onRequestClose={() => this.setState(
                            { snackbar: { isVisible: false, message: "" } }
                        )} />
                </View>
                {/* Action Button used as navigation */}
                <ActionButton
                    actions={[
                        { icon: 'help', label: 'Help' },
                    ]}
                    transition="speedDial"
                    onPress={(param) => this.handleScreenChange(param)}
                />
            </KeyboardAvoidingView>
        )
    }

    // Round the grams to one decimal
    handleRounding(value, precision) {
        return parseFloat(Math.round(value * 100) / 100).toFixed(precision)
    }

    // Change the screen as needed
    handleScreenChange = (param) => {
        if (param == "help") {
            this.props.navigation.navigate('Help')
        }
    }

    // intializes the socket, handles errors, and handles messages
    handleSocketSetup = () => {
        this.socket.onopen = () => {
            console.log("connection opened")
        }
        this.socket.onerror = (e) => {
            Alert.alert('Failed to Connect', 'Please restart the Sous Chef App')
        }
        this.socket.onclose = (e) => {
            console.log("closing", e.code, e.reason)
        }
        this.socket.onmessage = (e) => {
            msg = JSON.parse(e.data)
            // sent if the container is stalled or empty
            if (msg['type'] == "alert") {
                id = msg['data']['id']
                grams = msg['data']['grams']
                alert_string = 'You seem to be out of ' + this.state.data[id].name + ". So far only " + this.handleRounding(grams, 1) + " grams."
                Alert.alert('Empty Container', alert_string)
                dataCopy = this.state.data.slice()
                dataCopy[id].disabled = false
                this.setState({
                    data: dataCopy
                })
            }
            // if the sous chef finished dispenseing, snackbar will appear
            else if (msg['type'] == "completed") {
                id = msg['data']['id']
                grams = msg['data']['grams']
                dataCopy = this.state.data.slice()
                dataCopy[id].disabled = false
                this.setState({
                    data: dataCopy
                })
                snackbar_string = "Dispensed " + this.handleRounding(grams, 1) + " grams of " + this.state.data[id].name + "."
                this.setState({
                    snackbar: {
                        isVisible: true,
                        message: snackbar_string
                    }
                })
            }
            else {
                console.log("else statement")
            }
        }
    }

    // when the textfield ever changes, we call this to set the state
    handleText = (id) => (param) => {
        dataCopy = this.state.data.slice()
        dataCopy[id].ingredient.grams = Number(param)
        this.setState({
            data: dataCopy
        })
    }

    // the data will be sent through the socket
    handleSend = (id) => (param) => {
        // if the number is less than 1400 and is a valid number
        if (
            Number(this.state.data[id].ingredient.grams &&
                1400 >= Number(this.state.data[id].ingredient.grams))
        ) {
            dataCopy = this.state.data.slice()
            dataCopy[id].disabled = true
            this.setState({
                data: dataCopy
            })
            msg = JSON.stringify({ "type": "dispense", "data": this.state.data[id].ingredient })
            this.socket.send(msg)
        }
        // if not a valid number
        else if (!Number(this.state.data[id].ingredient.grams)) {
            Alert.alert('Did Not Send', 'Value inputted is not a valid number')
        }
        // if the value is greater than 1400
        else if (1400 < Number(this.state.data[id].ingredient.grams)) {
            Alert.alert('Did Not Send', 'The Sous Chef can dispense a max of 1400 grams.')
        }
    };

    extractItemKey = (item) => `${item.ingredient.id}`;

    // renders the button that is pressed
    renderItem = ({ item }) => (
        <TouchableOpacity
            style={item.disabled ? styles.disabled : styles.enabled}
            delayPressIn={70}
            activeOpacity={0.4}
            opacity
            onPress={this.handleSend(item.ingredient.id)}
            disabled={item.disabled}
        >
            <RkCard rkType='backImg'>
                <Image rkCardImg source={item.photo} />
                <View rkCardImgOverlay rkCardContent style={styles.overlay}>
                    <RkTextInput
                        rkType='rounded right'
                        placeholder='grams'
                        keyboardType='number-pad'
                        maxLength={9}
                        onChangeText={this.handleText(item.ingredient.id)}
                        disabled={item.disabled}
                    />
                </View>
            </RkCard>
        </TouchableOpacity>
    );
}

export default IngredientView

//Styles used on the app
const styles = RkStyleSheet.create(theme => ({
    disabled: {
        opacity: .4
    },
    enabled: {
        opacity: 1
    },
    root: {
        backgroundColor: theme.colors.screen.base,
    },
    overlay: {
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
}));

RkTheme.setType('RkText', 'header1', {
    text: {
        fontSize: 25,
        fontWeight: 'bold'
    }
});

RkTheme.setType('RkTextInput', 'right', {
    input: {
        textAlign: 'left',
    },
    container: {
        width: 110,
        height: 40,
    },
    backgroundColor: 'white',
});

RkTheme.setType('RkCard', 'backImg', {
    container: {
        borderWidth: 0,
        borderRadius: 0,
    },
    img: {
        height: 225,
    },
    imgOverlay: {
        height: 225,
        backgroundColor: 'transparent',
    },
    content: {
        paddingHorizontal: 14,
    },
    footer: {
        paddingTop: 15,
        paddingBottom: 0,
        paddingVertical: 7.5,
        paddingHorizontal: 0,
    },
});