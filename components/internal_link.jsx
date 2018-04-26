// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import CopyUrlContextMenu from 'components/copy_url_context_menu';

import {browserHistory} from 'utils/browser_history';
import {isDesktopApp} from 'utils/user_agent';
import * as Utils from 'utils/utils';

/**
 * A link component that will not show the target URL when hovered in the desktop app, but
 * will still offer a Copy Link option when right clicked.
 */
export default class InternalLink extends React.PureComponent {
    static propTypes = {

        /**
         * A CSS class to apply to the link if it's a button (ie. in the desktop app)
         */
        buttonClassName: PropTypes.string,

        /**
         * A CSS class to apply to the link regardless of whether or not it is a button
         */
        className: PropTypes.string,

        children: PropTypes.node.isRequired,
        onClick: PropTypes.func,
        link: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.menuId = Utils.generateId();
    }

    handleClick = (e) => {
        browserHistory.push(this.props.link);

        if (this.props.onClick) {
            this.props.onClick(e);
        }
    };

    render() {
        let element;
        if (isDesktopApp()) {
            element = (
                <CopyUrlContextMenu
                    link={this.props.link}
                    menuId={this.menuId}
                >
                    <button
                        className={this.props.className + ' ' + this.props.buttonClassName}
                        onClick={this.handleClick}
                    >
                        {this.props.children}
                    </button>
                </CopyUrlContextMenu>
            );
        } else {
            element = (
                <Link
                    to={this.props.link}
                    className={this.props.className}
                    onClick={this.props.onClick}
                >
                    {this.props.children}
                </Link>
            );
        }

        return element;
    }
}
