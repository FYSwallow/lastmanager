import React from 'react'
import './link-button.less'
class LinkButton extends React.Component {
    render() {
        return (
            <button {...this.props} className="link-button"></button>
        )
    }
}

export default LinkButton