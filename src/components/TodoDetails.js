import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, CheckBox, FlatList, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

class TodoDetails extends Component {
    static navigationOptions = {
        drawerLockMode: 'locked-closed',
    }
    constructor(props) {
        super(props);
        this.state = {
            uid: props.navigation.getParam('uid', 'false'),
            title: '',
            items: [
                {name: '', isChecked: false}
            ]
        }
    }
    UNSAFE_componentWillMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const isEdit = this.props.navigation.getParam('isEdit', 'false');
            const title = this.props.navigation.getParam('title', 'false');
            const TodoData = this.props.navigation.getParam('data', 'false');
            const holderID = this.props.navigation.getParam('id', 'false');
            if(isEdit !== 'false') {
                this.setState({
                    id: holderID,
                    title: title,
                    isEdit: true,
                    items: TodoData
                })
            }
        })
    }
    addItem() {
        const items = [
            ...this.state.items, 
            {name:'', isChecked: false}
        ];
        this.setState({
            items,
        });
    }
    save() {
        if(this.state.title !== '') {
            if(this.state.isEdit) {
                try {
                    fetch('https://nguyenhai.xyz/api/task.php?action=update', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: this.state.id,
                            title: this.state.title,
                            datas: this.state.items
                        }),
                    })
                    .then((response) => {
                        this.props.navigation.navigate('Việc cần làm')
                    })
                } catch(e) {
                    alert(e)
                }
            } else {
                try {
                    fetch('https://nguyenhai.xyz/api/task.php?action=add', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            uid: this.state.uid,
                            title: this.state.title,
                            datas: this.state.items
                        }),
                    })
                    .then((response) => {
                        this.props.navigation.navigate('Việc cần làm')
                    })
                } catch(e) {
                    alert(e)
                }
            }
        } else {
            this.setState({
                noTitleDetected: true
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}>
                    <TextInput placeholder="Tiêu đề" style={[{fontSize:24}, this.state.noTitleDetected ? styles.nope : null]}
                        onChangeText={value => this.setState({title: value, noTitleDetected: false})}
                        value={this.state.title}/>
                    {
                        this.state.noTitleDetected
                        ? <Text style={styles.textNope}>không được bỏ trống tiêu đề</Text>
                        : null
                    }
                    <FlatList
                        extraData={this.state}
                        data={this.state.items}
                        renderItem={({item, index}) => (
                            <View style={{flexDirection: 'row', alignItems: "center"}}>
                                <View style={{flexDirection: 'row', alignItems: "center"}}>
                                    <CheckBox style={{color: '#b2b2b2'}} value={
                                        Boolean(Number(this.state.items[index].isChecked))
                                    } onValueChange={()=>{
                                        var tmp = Boolean(Number(this.state.items[index].isChecked));
                                        tmp = !tmp;
                                        this.state.items[index].isChecked = tmp
                                        this.forceUpdate();
                                    }}/>
                                    <TextInput
                                        style={[styles.input, (Boolean(Number(this.state.items[index].isChecked)))? styles.checked : null]}
                                        onChangeText={
                                            value => {
                                                this.state.items[index].name = value;
                                                this.forceUpdate();
                                            }
                                        }
                                        value={item.name} />
                                    <Icon
                                        style={{padding: 14}}
                                        onPress={()=> {
                                            this.state.items.splice(index, 1)
                                            this.forceUpdate();
                                        }}
                                        name="times" size={16} color="#606163" />
                                </View>
                            </View>
                        )} />
                    <TouchableWithoutFeedback
                        onPress={() => this.addItem()}>
                        <View style={{flexDirection:'row', alignItems: 'center',padding: 1}}>
                            <Icon2 name="add" size={28} color="#878789" fontWeight="bold" />
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 16, color: '#b2b2b2'}}>Thêm Item</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
                <TouchableNativeFeedback onPress={() => this.save()}>
                    <View style={styles.btn}>
                        <Text style={{color:'#fff', textAlign:'center', fontWeight: 'bold'}}>Lưu</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8
    },
    btn: {
        marginTop: 8,
        backgroundColor: "#c93838",
        borderRadius: 16,
        padding: 8,
    },
    checked: {
        textDecorationLine: 'line-through',
        color: '#b2b2b2'
    },
    input: {
        flex: 1,
        fontSize: 18
    },
    nope: {
        borderBottomWidth: 2,
        borderBottomColor: '#FC8181'
    },
    textNope: {
        fontSize: 13,
        color: '#9B2C2C'
    }
});

export default withNavigationFocus(TodoDetails);