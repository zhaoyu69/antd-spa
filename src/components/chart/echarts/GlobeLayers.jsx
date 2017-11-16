import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import GlobalBaseTexture from '../../../style/img/global.jpg';

class GlobeLayers extends Component{
    getOption = () => {
        const option = {
            backgroundColor: '#f7f7f7',
            globe: {
                baseTexture: GlobalBaseTexture,
                heightTexture:'',

                displacementScale: 0.1,

                shading: 'lambert',

                environment: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: '#00aaff' // 天空颜色
                }, {
                    offset: 0.7, color: '#998866' // 地面颜色
                }, {
                    offset: 1, color: '#998866' // 地面颜色
                }], false),

                light: {
                    ambient: {
                        intensity: 0.1
                    },
                    main: {
                        intensity: 1.5
                    }
                },

                layers: [{
                    type: 'blend',
                    blendTo: 'emission',
                    texture: ''
                }, {
                    type: 'overlay',
                    texture: '',
                    shading: 'lambert',
                    distance: 5
                }]
            },
            series: []
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

export default GlobeLayers;
