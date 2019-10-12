import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigationFocus } from 'react-navigation';


class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listNote: [],
            uid: ''
        };
    }
    UNSAFE_componentWillMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            fetch('https://nguyenhai.xyz/api/note.php?action=show',{
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
                this.setState({listNote: responseJson})
            })
        })
    }
    componentDidMount = async () => {
        try {
            this.setState({
                uid: await AsyncStorage.getItem('userID')
            })
            const response = await fetch('https://nguyenhai.xyz/api/note.php?action=show',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: this.state.uid
                }),
            })
            const note = await response.json()
            this.setState({listNote: note})
        } catch (err) {
            this.setState({listNote: ''})
            // alert(err)
        }
    }
    reloadDB() {
        fetch('https://nguyenhai.xyz/api/note.php?action=show',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: this.state.uid
            }),
        })
        .then(response => response.json())
        .then(responseJson => {
            this.setState({listNote: responseJson})
        })
        .catch((error) => (
            this.setState({listNote: ''})
        ))
    }
    openUpdate(noteData) {
        this.props.navigation.navigate('NoteDetails', {
            data: noteData,
            uid: this.state.uid,
            isEdit: 'true'
        })
    }
    openAdd(){
        if(this.state.uid !== '') {
            this.props.navigation.navigate('NoteDetails', {
                uid: this.state.uid,
                isEdit: 'false'
            })
        }
    }
    deleteNote(noteID) {
        fetch('https://nguyenhai.xyz/api/note.php?action=delete',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: noteID
            }),
        }).then(response => {
            this.reloadDB();
        })
    }
    openDialog(noteID) {
        Alert.alert(
            'Xác nhận',
            'Bạn có thực sự muốn xóa?',
            [
                {
                text: 'Thôi',
                style: 'cancel',
                },
                {text: 'Đồng ý', onPress: () => this.deleteNote(noteID)},
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
                        <Text style={{fontWeight: 'bold', marginLeft: 18, fontSize: 20, color: '#1A202C'}}>Ghi chú của bạn</Text>
                    </View>
                </TouchableWithoutFeedback>

                <FlatList
                    data={this.state.listNote}
                    numColumns={2}
                    refreshing={false}
                    onRefresh={() => this.reloadDB()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
                            onLongPress={() => this.openDialog(item.id)}
                            onPress={() => this.openUpdate(item)}>
                            <View style={styles.item}>
                                {
                                    item.title !== ''
                                    ? <Text style={styles.headline}>{item.title}</Text>
                                    : null
                                }
                                {
                                    item.content !== ''
                                    ? <Text style={styles.content}>{item.content}</Text>
                                    : null
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    )}/>

                <TouchableWithoutFeedback
                    onPress={()=>this.openAdd()}>
                    <View style={styles.fab}>
                        <Icon name="plus" size={17} color="#fff" />
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
        margin: 5,
        borderWidth: 1.5,
        borderColor: "#dee0e3",
        borderRadius: 10
    },
    headline: {
        fontWeight: 'bold',
        color: '#202124'
    },
    content: {
        color: '#616164'
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

export default withNavigationFocus(Note)