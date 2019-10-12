import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

export default class Todo extends Component {
    constructor() {
        super();
        this.state = {
            listTodo: []
        };
    }
    UNSAFE_componentWillMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.reloadDB();
        })
    }
    componentDidMount = async () => {
        try {
            this.setState({
                uid: await AsyncStorage.getItem('userID')
            })
            const response = await fetch('https://nguyenhai.xyz/api/task.php?action=show',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: this.state.uid
                }),
            })
            const data = await response.json()
            this.setState({listTodo: data})
        } catch (err) {
            this.setState({listTodo: ''})
            // alert(err)
        }
    }
    reloadDB() {
        fetch('https://nguyenhai.xyz/api/task.php?action=show',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: this.state.uid
            }),
        }).then(response => response.json())
        .then(responseJson => {
            this.setState({listTodo: responseJson})
        })
        .catch((err) => {
            this.setState({
                listTodo: []
            })
        })
    }
    deleteTodo(todoID) {
        fetch('https://nguyenhai.xyz/api/task.php?action=delete',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: todoID
            }),
        }).then(response => {
            this.reloadDB();
        })
    }
    openDialog(id) {
        Alert.alert(
            'Xác nhận',
            'Bạn có thực sự muốn xóa?',
            [
                {
                text: 'Thôi',
                style: 'cancel',
                },
                {text: 'Đồng ý', onPress: () => this.deleteTodo(id)},
            ],
            {cancelable: false},
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>{this.props.navigation.toggleDrawer();}}>
                    <View style={styles.header}>
                        <View style={{paddingTop: 18,paddingBottom: 18}}>
                            <Icon name="bars" size={20} color="#1A202C" />
                        </View>
                        <Text style={{marginLeft: 18, fontSize: 20, color: '#1A202C', fontWeight: 'bold'}}>Việc cần làm</Text>
                    </View>
                </TouchableWithoutFeedback>

                <FlatList
                    style={{paddingLeft: 4, paddingRight: 4}}
                    data={this.state.listTodo}
                    refreshing={false}
                    onRefresh={() => this.reloadDB()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
                            onLongPress={() => this.openDialog(item.id)}
                            onPress={() => this.props.navigation.navigate('TodoDetails', {
                                id: item.id,
                                title: item.title,
                                uid: this.state.uid,
                                data: item.datas,
                                isEdit: 'true'
                            })}>
                            <View style={styles.item}>
                                <Text style={styles.headline}>{item.title}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}/>
                
                <TouchableWithoutFeedback
                    onPress={()=>this.props.navigation.navigate('TodoDetails', {
                        uid: this.state.uid,
                        isEdit: 'false'
                    })}>
                    <View style={styles.fab}>
                        <Icon name="plus" size={16} color="#fff" />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: 60,
        height: 60,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#c93838',
        borderRadius: 30,
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    item: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#dadce0"
    },
    headline: {
        fontSize: 16,
        color: '#202124'
    },
    header: {
        paddingLeft: 15,
        position:'relative',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
});