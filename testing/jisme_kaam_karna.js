import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Text, Icon } from 'v2-components';
import { LoadingWrapper, LoadComponent } from 'HOCS';
import PropTypes from 'prop-types';
import styles from './JobDetails.module.scss';
import { actions } from '../modules';
import { isJobLoadingSelector, jobDetailsSelector } from '../selectors';
import { useToggle } from 'utils/utils';
import { AggsTable } from './AggsTable';

function JobDetailsComponent(props) {
    const { dataset } = props;
    const [expanded, toggle] = useToggle();
    const { headings, aggNames } = dataset;
    return (
        <React.Fragment>
            <Row
                flexDirection={Row.FLEX_DIRECTION.COLUMN}
                className={styles.tableWrapper}
            >
                <div className={styles.HeaderRow}>
                    {headings.map(({ label, value }) =>
                        label === 'divider' ? (
                            <Row key={label} className={styles.divider} />
                        ) : (
                            <Row
                                key={label}
                                className={styles.HeaderItem}
                                flexDirection={Row.FLEX_DIRECTION.COLUMN}
                            >
                                <Text bold className={styles.HeaderHeading}>
                                    {label}
                                </Text>
                                <Text>{value}</Text>
                            </Row>
                        )
                    )}
                </div>

                <Row
                    flexDirection={Row.FLEX_DIRECTION.COLUMN}
                    className={styles.AggsRow}
                >
                    <Text pointer onClick={toggle} className={styles.blueText}>
                        <Text
                            bold
                            pointer
                            color={Text.COLOR.BLUE}
                            className={styles.center}
                        >
                            Aggregation(s) List
                        </Text>
                        <Icon
                            color={Icon.COLORS.BLUE}
                            className={styles[expanded ? 'asc' : 'desc']}
                            type="keyboard_arrow_right"
                        />
                    </Text>





                    {expanded && (
                        <div className={styles.AggNameRow}>
                            {aggNames.map((aggName) => (
                                <Text key={aggName} className={styles.aggName}>
                                    {aggName}
                                </Text>
                            ))}
                        </div>
                    )}







                </Row>
            </Row>
            <AggsTable />
        </React.Fragment>
    );
}

JobDetailsComponent.propTypes = {
    dataset: PropTypes.object,
};

const mapStateToProps = (state) => ({
    dataset: jobDetailsSelector(state),
    loading: isJobLoadingSelector(state),
});

const { loadJobDetails } = actions;

export const JobDetails = compose(
    connect(mapStateToProps, {
        load: loadJobDetails,
    }),
    LoadComponent,
    LoadingWrapper({ size: 'large' })
)(JobDetailsComponent);




const getSelectedFilterTypeSelector = createSelector(
    CatchupJobsSelector,
    (substate) => (key) => substate[key]
);