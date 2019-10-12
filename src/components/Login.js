import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableNativeFeedback } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
    static navigationOptions = {
        header: null
    };
    constructor() {
        super();
        this.state = {
            username: '',
            passwd: '',
            hasErr: false,
            err: ''
        };
    }
    _SignInAsync = async (responseJson) => {
        try {
            await AsyncStorage.setItem('userID', responseJson.id);
        } catch (e) {
        // saving error
        }
        this.props.navigation.navigate('App');
    }
    login() {
        //reset
        this.props.navigation.setParams({regSuccess: false})
        this.setState({
            hasErr: false,
            err: ''
        })

        if(this.state.username === '' || this.state.passwd === '') {
            this.setState({
                hasErr: true,
                err: 'Vui lòng nhập đầy đủ thông tin'
            })
        } else {
            fetch('https://nguyenhai.xyz/api/user.php?action=login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.passwd,
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status !== 'fail') {
                    this._SignInAsync(responseJson);
                    this.props.navigation.navigate('App');
                } else {
                    this.setState({
                        hasErr: true,
                        err: 'Vui lòng kiểm tra lại thông tin đăng nhập'
                    })
                }
            });
        }
    }
    open_reg() {
        this.props.navigation.navigate('Reg');
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headline}>Chào mừng</Text>
                <Text style={styles.subline}>Đăng nhập để tiếp tục</Text>
                <TextInput
                    onChangeText={value => this.setState({username: value})}
                    value={this.state.email}
                    autoCapitalize="none"
                    placeholder="Tên đăng nhập"
                    style={styles.input}/>
                <TextInput
                    onChangeText={value => this.setState({passwd: value})}
                    value={this.state.passwd}
                    placeholder="Mật khẩu"
                    secureTextEntry={true}
                    style={styles.input}/>
                {/* Show info here */}
                {this.state.hasErr ?
                    <Text style={styles.err}>{ this.state.err }</Text>
                    :
                    null
                }
                {this.props.navigation.getParam('regSuccess', false) ?
                    <Text style={styles.success}>Đăng ký thành công</Text>
                    :
                    null
                }
                {/* Btn Login */}
                <TouchableNativeFeedback onPress={() => this.login()}>
                    <View style={styles.btn}>
                        <Text style={{color:'#fff', textAlign:'center', fontWeight: 'bold'}}>Đăng nhập</Text>
                    </View>
                </TouchableNativeFeedback>
                {/* Register */}
                <View style={{flexDirection:"row", marginTop: 15, justifyContent: 'center'}}>
                    <Text>Chưa có tài khoản?</Text>
                    <Text
                        onPress={() => this.open_reg()}
                        style={{color:"#c93838", fontWeight: 'bold', marginLeft:5}}>Đăng ký</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    input: {
        backgroundColor: '#E2E8F0',
        color: '#718096',
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10
    },
    btn: {
        marginTop: 8,
        backgroundColor: "#c93838",
        borderRadius: 26,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16,
        paddingLeft: 16,
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 30
    },
    subline: {
        fontSize: 22,
        color: '#718096',
        marginBottom: 18
    },
    err: {
        backgroundColor: '#FC8181',
        padding: 10,
        borderRadius: 5,
        color: '#742A2A',
        fontWeight: 'bold'
    },
    success: {
        backgroundColor: '#68D391',
        padding: 10,
        borderRadius: 5,
        color: '#22543D',
        fontWeight: 'bold'
    }
});