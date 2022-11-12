

import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'v2-components';
import styles from './JobTracking.module.scss';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export function JobTrackingChart({ data }) {

    const { days, trackings, viewType, today } = data;
    //   const HEADERS = ['Hour-1', ...days];
    
    const chartOptions = {
        credits: {
            enabled: false,
        },
        colors: [
            '#91e8e1',
            '#2b908f',
            '#8085e9',
            '#90ed7d',
            '#f7a35c',
            '#f15c80',
            '#000000',
        ],
        title: {
            text: '',
        },
        xAxis: {
            title: { text: 'HOUR' },
            crosshair: {
                label: {
                    enabled: true,
                    padding: 8,
                },
            },
        },
        yAxis: {
            title: { text: `TRACKING (${viewType.toUpperCase()})` },
            crosshair: {
                label: {
                    enabled: true,
                    padding: 8,
                },
            },
        },
        tooltip: {
            formatter() {
                return `<br />Hour: ${this.x} - ${this.x + 1}<br />Value: ${this.y
                    }<br />Date: ${this.series.name}`;
            },
        },
        series: days.map((day) => ({
            name: day,
            data: trackings[day],
            dashStyle: day === today ? 'solid' : 'ShortDash',
            marker: {
                enabled: false,
                symbol: 'circle',
            },
        })),
    };


    return (
        <Row
            className={styles.chartContainer}
            flexDirection={Row.FLEX_DIRECTION.COLUMN}
        >
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={chartOptions}
            />
        </Row>
    );
}

JobTrackingChart.propTypes = {
    data: PropTypes.object,
};
export default JobTrackingChart;