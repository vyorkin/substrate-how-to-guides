// Add utterances comments at the bottom of custom `DocItem` theme.

import React from 'react';
import RatingSmileys from '../../components/RatingSmileys';
import ThemeSelector from "../ThemeSelector";

export default function CustomDocItem(props) {
	return (
		<>
			<ThemeSelector {...props} />
			<RatingSmileys/>
			
		</>
	);
}
