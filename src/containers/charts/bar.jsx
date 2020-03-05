import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts';

class Bar extends React.Component {
    render() {
        const data = [
            { item: '北京', count: 40, percent: 0.4 },
            { item: '上海', count: 21, percent: 0.21 },
            { item: '深圳', count: 17, percent: 0.17 },
            { item: '杭州', count: 13, percent: 0.13 },
            { item: '其他', count: 9, percent: 0.09 },
        ];

        const cols = {
            percent: {
                formatter: val => (val = `${val * 100}%`),
            },
        };

        return (
            <div>
                <Chart
                    width={600}
                    height={600}
                    data={data}
                    scale={cols}
                    padding="auto"
                    forceFit
                    
                >
                    <Coord type="theta" radius={0.65} />
                    <Axis name="percent" />
                    <Legend position="right" offsetY={-window.innerHeight / 2 + 120} offsetX={-100} />
                    <Tooltip
                        showTitle={false}
                        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color="item"
                        tooltip={[
                            'item*percent',
                            (item, percent) => {
                                percent = `${percent * 100}%`;
                                return {
                                    name: item,
                                    value: percent,
                                };
                            },
                        ]}
                        style={{
                            lineWidth: 1,
                            stroke: '#fff',
                        }}
                    />
                </Chart>
            </div>
        );
    }
}

export default Bar