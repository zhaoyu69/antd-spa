import React, { Component } from 'react';
import { Card, Calendar, notification } from 'antd';

export default class Calendars extends Component{
    onSelect = (value) => {
        notification.open({
            message: 'You selected date',
            description: value.format('YYYY-MM-DD'),
            duration: 3,
            placement: 'bottomRight',
        });
    };
    render(){
        return(
            <Card style={{background:'#fff',marginTop:'20px'}}>
                <Calendar
                    onSelect={this.onSelect}
                />
            </Card>
        )
    }
}