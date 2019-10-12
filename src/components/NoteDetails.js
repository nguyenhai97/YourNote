import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import { withNavigationFocus } from 'react-navigation';

class NoteDetails extends Component {
    static navigationOptions = {
        drawerLockMode: 'locked-closed',
    }
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            uid: props.navigation.getParam('uid', 'null')
        }
    }
    componentDidMount() {
        // If not using didFocus event listener, this function would not load each time we open it
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            //Cleanup
            this.setState({
                title: '',
                content: '',
                uid: ''
            })
            const isEdit = this.props.navigation.getParam('isEdit', 'false');
            const data   = this.props.navigation.getParam('data', 'null');
            const uid    = this.props.navigation.getParam('uid', 'null')
            if(isEdit === 'true') {
                this.setState({
                    title: data.title,
                    content: data.content
                })
            }
            this.setState({
                uid: uid
            })
        });
    }
    trick() {
        this.refs.content.blur()
        this.refs.content.focus()
    }
    save() {
        const isEdit = this.props.navigation.getParam('isEdit', 'false');
        const data = this.props.navigation.getParam('data', 'null');
        if(isEdit === 'true') {
            try {
                fetch('https://nguyenhai.xyz/api/note.php?action=update', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: this.state.title,
                        content: this.state.content,
                        uid: this.state.uid,
                        id: data.id
                    }),
                })
                .then((response) => {
                    this.setState({
                        title: '',
                        content: ''
                    });
                    this.props.navigation.navigate('Ghi chú')
                })
            } catch(e) {
                alert(e)
            }
        } else {
            if(this.state.title === '' && this.state.content === '') {
                this.props.navigation.navigate('Ghi chú')
            } else {
                try {
                    fetch('https://nguyenhai.xyz/api/note.php?action=add', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: this.state.title,
                            content: this.state.content,
                            uid: this.state.uid,
                        }),
                    })
                    .then((response) => {
                        this.props.navigation.navigate('Ghi chú')
                    })
                } catch(e) {
                    alert(e)
                }
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput placeholder="Tiêu đề" style={{fontSize:24}}
                    onChangeText={value => this.setState({title: value})}
                    value={this.state.title}/>
                <TextInput
                    ref="content"
                    multiline={true}
                    style={{fontSize:16}}
                    placeholder="Nội dung"
                    onChangeText={value => this.setState({content: value})}
                    value={this.state.content} />
                <TouchableWithoutFeedback
                    onPress={()=>this.trick()}>
                    <View style={{flex:1}}></View>
                </TouchableWithoutFeedback>
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
});

export default withNavigationFocus(NoteDetails);