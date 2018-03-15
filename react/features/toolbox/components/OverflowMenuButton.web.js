// @flow

import InlineDialog from '@atlaskit/inline-dialog';
import React, { Component } from 'react';

import { translate } from '../../base/i18n';

import ToolbarButtonV2 from './ToolbarButtonV2';

type Props = {

    /**
     * A child React Element to display within {@code InlineDialog}.
     */
    children: React$Node,

    /**
     * Whether or not the OverflowMenu popover should display.
     */
    isOpen: boolean,

    /**
     * Calback to change the visiblility of the overflow menu.
     */
    onVisibilityChange: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * A React {@code Component} for opening or closing the {@code OverflowMenu}.
 *
 * @extends Component
 */
class OverflowMenuButton extends Component<Props> {
    /**
     * Initializes a new {@code OverflowMenuButton} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onCloseDialog = this._onCloseDialog.bind(this);
        this._onToggleDialogVisibility
            = this._onToggleDialogVisibility.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { children, isOpen, t } = this.props;
        const iconClasses = `icon-thumb-menu ${isOpen ? 'toggled' : ''}`;

        return (
            <div className = 'toolbox-button-wth-dialog'>
                <InlineDialog
                    content = { children }
                    isOpen = { isOpen }
                    onClose = { this._onCloseDialog }
                    position = { 'top right' }>
                    <ToolbarButtonV2
                        iconName = { iconClasses }
                        onClick = { this._onToggleDialogVisibility }
                        tooltip = { t('toolbar.moreActions') } />
                </InlineDialog>
            </div>
        );
    }

    _onCloseDialog: () => void;

    /**
     * Callback invoked when {@code InlineDialog} signals that it should be
     * close.
     *
     * @private
     * @returns {void}
     */
    _onCloseDialog() {
        const { onVisibilityChange } = this.props;

        if (onVisibilityChange) {
            onVisibilityChange(false);
        }
    }

    _onToggleDialogVisibility: () => void;

    /**
     * Callback invoked to signal that an event has occurred that should change
     * the visibility of the {@code InlineDialog} component.
     *
     * @private
     * @returns {void}
     */
    _onToggleDialogVisibility() {
        const { isOpen, onVisibilityChange } = this.props;

        if (onVisibilityChange) {
            onVisibilityChange(!isOpen);
        }
    }
}

export default translate(OverflowMenuButton);
