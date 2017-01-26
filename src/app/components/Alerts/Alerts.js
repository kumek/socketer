import React from 'react'

const Alerts = ({
	alerts,
	dismissAlert
}) => {
	return (
		<div className="alerts">
			{alerts.map(({content, id}) => {
				return (
						<div className="alert" key={id}>
							<div className="alert__content" onClick={dismissAlert.bind(null, id)}>
								{content}
							</div>
						</div>
					)
			})}
		</div>
	)
}
export default Alerts