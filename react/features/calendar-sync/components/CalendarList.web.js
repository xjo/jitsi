// @flow

import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../base/i18n';
import { openSettingsDialog, SETTINGS_TABS } from '../../settings';

import { isCalendarEnabled } from '../functions';

import AbstractCalendarList from './AbstractCalendarList';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link CalendarList}.
 */
type Props = {

    /**
     * Whether or not a calendar may be connected for fetching calendar events.
     */
    _hasIntegrationSelected: boolean,

    /**
     * Whether or not events have been fetched from a calendar.
     */
    _hasLoadedEvents: boolean,

    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Function,

    /**
     * The translate function.
     */
    t: Function
};

/**
 * Component to display a list of events from the user's calendar.
 */
class CalendarList extends Component<Props> {
    /**
     * Initializes a new {@code CalendarList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._getRenderListEmptyComponent
            = this._getRenderListEmptyComponent.bind(this);
        this._onOpenSettings = this._onOpenSettings.bind(this);
    }

    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { disabled } = this.props;

        return (
            AbstractCalendarList
                ? <AbstractCalendarList
                    disabled = { disabled }
                    renderListEmptyComponent
                        = { this._getRenderListEmptyComponent() } />
                : null
        );
    }

    _getRenderListEmptyComponent: () => Object;

    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {?React$Component}
     */
    _getRenderListEmptyComponent() {
        const { _hasIntegrationSelected, _hasLoadedEvents, t } = this.props;

        if (!_hasIntegrationSelected) {
            return (
                <div>
                    <p className = 'header-text-description'>
                        { t('welcomepage.connectCalendarText', {
                            app: interfaceConfig.APP_NAME
                        }) }
                    </p>
                    <Button
                        appearance = 'primary'
                        className = 'calendar-button'
                        id = 'connect_calendar_button'
                        onClick = { this._onOpenSettings }
                        type = 'button'>
                        { t('welcomepage.connectCalendarButton') }
                    </Button>
                </div>
            );
        } else if (_hasIntegrationSelected && !_hasLoadedEvents) {
            return (
                <Spinner
                    invertColor = { true }
                    isCompleting = { false }
                    size = 'medium' />
            );
        }

        return undefined;
    }

    _onOpenSettings: () => void;

    /**
     * Opens {@code SettingsDialog}.
     *
     * @private
     * @returns {void}
     */
    _onOpenSettings() {
        this.props.dispatch(openSettingsDialog(SETTINGS_TABS.CALENDAR));
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code CalendarList} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _hasIntegrationSelected: boolean,
 *     _hasLoadedEvents: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        _hasIntegrationSelected:
            Boolean(state['features/calendar-sync'].integrationType),
        _hasLoadedEvents: Boolean(state['features/calendar-sync'].events)
    };
}

export default isCalendarEnabled()
    ? translate(connect(_mapStateToProps)(CalendarList))
    : undefined;
