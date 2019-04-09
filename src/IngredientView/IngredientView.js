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
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props)

        // PC
        // this.socket = new WebSocket('ws://10.1.69.149:8000')

        // RPI
        this.socket = new WebSocket('ws://10.24.0.96:8000')

        this.state = {
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
                    name: 'raisins2',
                    ingredient: { id: 5, grams: 0 },
                    photo: require('../../assets/photos/raisins2.jpg'),
                    disabled: false
                },
            ],
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
            <KeyboardAvoidingView style={GlobalStyles.droidSafeArea} behavior='padding'>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.extractItemKey}
                    style={styles.root}
                />
                <View>
                    <Snackbar
                        visible={this.state.snackbar.isVisible}
                        message={this.state.snackbar.message}
                        timeout={2500}
                        onRequestClose={() => this.setState(
                            { snackbar: { isVisible: false, message: "" } }
                        )} />
                </View>
                <ActionButton
                    actions={[
                        { icon: 'help', label: 'Help' },
                        // { icon: 'settings', label: "Calibration" },
                    ]}
                    transition="speedDial"
                    onPress={(param) => this.handleScreenChange(param)}
                />
            </KeyboardAvoidingView>
        )
    }

    handleRounding(value, precision) {
        return parseFloat(Math.round(value * 100) / 100).toFixed(precision)
    }
    handleScreenChange = (param) => {
        if (param == "help") {
            this.props.navigation.navigate('Help')
        }
    }
    handleSocketSetup = () => {
        this.socket.onopen = () => {
            console.log("connection opened")
        }
        this.socket.onerror = (e) => {
            // console.log("error: ", e.message)
            Alert.alert('Failed to Connect', 'Please restart the Sous Chef App')
        }
        this.socket.onclose = (e) => {
            console.log("closing", e.code, e.reason)
        }
        this.socket.onmessage = (e) => {
            msg = JSON.parse(e.data)
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

    handleText = (id) => (param) => {
        dataCopy = this.state.data.slice()
        dataCopy[id].ingredient.grams = Number(param)
        this.setState({
            data: dataCopy
        })
    }

    handleSend = (id) => (param) => {
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
        else if (!Number(this.state.data[id].ingredient.grams)) {
            Alert.alert('Did Not Send', 'Value inputted is not a valid number')
        }
        else if (1400 < Number(this.state.data[id].ingredient.grams)) {
            Alert.alert('Did Not Send', 'The Sous Chef can dispense a max of 1400 grams.')
        }
    };

    extractItemKey = (item) => `${item.ingredient.id}`;

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