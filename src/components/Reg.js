import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Reg extends Component {
    static navigationOptions = {
        header: null
    };
    constructor() {
        super();
        this.state = {
            username: '',
            fullname: '',
            password: '',
            rePassword: '',
            hasErr: false,
            err: '',
        };
    }
    doReg() {
        fetch('https://nguyenhai.xyz/api/user.php?action=reg', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                fullname: this.state.fullname,
                password: this.state.password,
            }),
        }).then(response => {
            if (response.status === 200) {
                this.props.navigation.navigate('Login', {
                    regSuccess: true
                });
            } else if(response.status === 401) {
                this.setState({
                    hasErr: true,
                    err: 'Tên đăng nhập đã tồn tại'
                })
            }
        });
    }
    reg() {
        if(this.state.username === '' || this.state.fullname === '' ||
            this.state.password === '' || this.state.rePassword ==='') {
            this.setState({
                hasErr: true,
                err: 'Vui lòng nhập đầy đủ thông tin'
            })
        } else if(this.state.password !== this.state.rePassword) {
            this.setState({
                hasErr: true,
                err: 'Mật khẩu không khớp, vui lòng nhập lại'
            })
        } else {
            this.doReg();
        }
    }
    open_login() {
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headline}>Chưa có tài khoản?</Text>
                <Text style={styles.subline}>Đăng ký ngay</Text>
                <ScrollView>
                    <Text style={{fontWeight:'bold', marginBottom: 5}}>Thông tin cá nhân</Text>
                    <TextInput
                        onChangeText={value => this.setState({username: value})}
                        value={this.state.username}
                        autoCapitalize="none"
                        placeholder="Tên đăng nhập"
                        style={styles.input}/>
                    <TextInput
                        onChangeText={value => this.setState({fullname: value})}
                        value={this.state.fullname}
                        autoCapitalize="words"
                        placeholder="Họ và tên đầy đủ"
                        style={styles.input}/>
                    <Text style={{fontWeight:'bold', marginBottom: 5}}>Mật khẩu</Text>
                    <TextInput
                        onChangeText={value => this.setState({password: value})}
                        value={this.state.password}
                        placeholder="Mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}/>
                    <TextInput
                        onChangeText={value => this.setState({rePassword: value})}
                        value={this.state.rePassword}
                        placeholder="Nhập lại mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}/>
                    {/* Show err here */}
                    {this.state.hasErr ?
                        <Text style={styles.err}>{ this.state.err }</Text>
                        :
                        null
                    }
                    {/* Btn Login */}
                    <TouchableNativeFeedback onPress={() => this.reg()}>
                        <View style={styles.btn}>
                            <Text style={{color:'#fff', textAlign:'center', fontWeight: 'bold'}}>Tạo tài khoản</Text>
                        </View>
                    </TouchableNativeFeedback>
                    {/* Register */}
                    <View style={{flexDirection:"row", marginTop: 15, justifyContent: 'center'}}>
                        <Text>Đã có tài khoản?</Text>
                        <Text
                            onPress={() => this.open_login()}
                            style={{color:"#c93838", marginLeft:5, fontWeight: 'bold'}}>Đăng nhập</Text>
                    </View>
                </ScrollView>
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
    }
});