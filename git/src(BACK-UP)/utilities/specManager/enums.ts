export const getSpecPhaseStatus = (value: any) => {
	const types: any = {
		'Operation & Monitoring': '#e1a4e1',
		'Post Construction': '#ff7300',
		'In Construction': '#e5b32c',
		'Pre Construction': '#48adce',
	};
	return types[value];
};