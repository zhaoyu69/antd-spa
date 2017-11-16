import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts-liquidfill';

class LiquidFill extends Component{
    getOption = () => {
        const option = {
		    series: [{
		        type: 'liquidFill',
                data: [0.6, 0.5, 0.4, 0.3],
		    }]
		};
        return option;
    };
    render(){
        return (
            <ReactEcharts
                option={this.getOption()}
                style={{height: '700px', width: '100%'}}
            />
        );
    }
};

export default LiquidFill;
