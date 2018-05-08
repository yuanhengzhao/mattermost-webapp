// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import * as GlobalActions from 'actions/global_actions.jsx';
import InternalLink from 'components/internal_link';
import LocalDateTime from 'components/local_date_time';
import TeamStore from 'stores/team_store.jsx';
import {isMobile} from 'utils/user_agent.jsx';
import {isMobile as isMobileView} from 'utils/utils.jsx';

export default class PostTime extends React.PureComponent {
    static propTypes = {

        /*
         * If true, time will be rendered as a permalink to the post
         */
        isPermalink: PropTypes.bool.isRequired,

        /*
         * The time to display
         */
        eventTime: PropTypes.number.isRequired,

        /*
         * The post id of posting being rendered
         */
        postId: PropTypes.string,

        /**
         * Called on the desktop app when the context menu closes
         */
        onContextMenuHide: PropTypes.func,

        /**
         * Called on the desktop app when the context menu opens
         */
        onContextMenuShow: PropTypes.func,
    };

    static defaultProps = {
        eventTime: 0,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentTeamDisplayName: TeamStore.getCurrent().name,
        };
    }

    handleClick = () => {
        if (isMobileView()) {
            GlobalActions.emitCloseRightHandSide();
        }
    };

    render() {
        const localDateTime = (
            <LocalDateTime
                eventTime={this.props.eventTime}
            />
        );
        if (isMobile() || !this.props.isPermalink) {
            return localDateTime;
        }

        return (
            <InternalLink
                ref='link'
                link={`/${this.state.currentTeamDisplayName}/pl/${this.props.postId}`}
                buttonClassName='post__permalink--button'
                className='post__permalink'
                onClick={this.handleClick}
                onContextMenuShow={this.props.onContextMenuShow}
                onContextMenuHide={this.props.onContextMenuHide}
            >
                {localDateTime}
            </InternalLink>
        );
    }
}
