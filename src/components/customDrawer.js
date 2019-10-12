import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

export default class customDrawer extends Component {
    constructor(){
        super();
    }
    _clearAll = async () => {
        try {
            await AsyncStorage.clear()
            this.props.navigation.navigate('Auth');
        } catch(e) {
            // clear error
        }
        
        console.log('Done.')
    }      
    render() {
        const { navigate } = this.props.navigation;
        return (
        <View>
            <View>
                <Text style={{padding: 8, color: '#5f6368', fontWeight: '700'}}>Chọn chức năng</Text>
                <TouchableWithoutFeedback 
                    onPress={() => navigate('Ghi chú')}>
                    <View style={[styles.menuItem, (this.props.activeItemKey=='Ghi chú') ? styles.active : null]}>
                        <Icon2 name="lightbulb-outline" size={25} color="#1A202C" style={[styles.icon, (this.props.activeItemKey=='Ghi chú') ? styles.active : null]} />
                        <Text style={{marginLeft: 18, fontWeight: '700'}}>Ghi chú</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => navigate('Việc cần làm')} >
                    <View style={[styles.menuItem, (this.props.activeItemKey=='Việc cần làm') ? styles.active : null]}>
                        <Icon2 name="check" size={25} color="#1A202C" style={[styles.icon, (this.props.activeItemKey=='Việc cần làm') ? styles.active : null]} />
                        <Text style={{marginLeft: 18, fontWeight: '700'}}>Việc cần làm</Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={{paddingLeft: 8, color: '#5f6368', fontWeight: '700'}}>Khác</Text>
                <TouchableWithoutFeedback
                    onPress={() => this._clearAll()} >
                    <View style={styles.menuItem}>
                        <Icon2 name="power-settings-new" size={25} color="#F56565" style={styles.icon} />
                        <Text style={{marginLeft: 18, fontWeight: '700', color: '#F56565'}}>Đăng xuất</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    menuItem: {
        padding: 16,
        color: '#202124',
        marginRight: 10,
        flexDirection: 'row',
        alignItems: "center",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    active: {
        backgroundColor: '#feefc3',
        color: '#202124'
    },
    icon: {
        fontWeight: 'bold',
        color: '#5f6368'
    }
})