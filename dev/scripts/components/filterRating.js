import React from 'react';

export default class FilterRating extends React.Component {
    constructor() {
		super();
		this.state = {
			value: 'filter rating'
		};
	}

    handleFilter(e) {
        this.props.getFilterRating(e.target.value);
        this.setState ({
            value: e.target.value
        })
    }

    render() {
        return (
            <div className="filterRating">
                <label className="filterLabel" htmlFor="filterRating">
                    <select value={this.state.value} className ="filterDropdown" id="filterRating" onChange={this.handleFilter.bind(this)}>
                        <option value="filter rating" disabled>Filter by Rating ▾</option>
                        <option value="all">All</option>
                        <option value="1">♥︎</option>
                        <option value="2">♥︎ ♥︎</option>
                        <option value="3">♥︎ ♥︎ ♥︎</option>
                        <option value="4">♥︎ ♥︎ ♥︎ ♥︎</option>
                        <option value="5">♥︎ ♥︎ ♥︎ ♥︎ ♥︎</option>
                    </select>
                </label>
			</div>
        )
    }
  }