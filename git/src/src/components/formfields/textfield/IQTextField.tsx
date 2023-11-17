import styled from '@emotion/styled';

type IQTextFieldProps = {};

const FieldContainer = styled.span`
	border-bottom: 1px solid #cccccc;

	&:before {
		color: #ec711c;
	}

	&:focus-within {
		border-color: royalblue;
	}
`;

const Input = styled.input`
	border: unset;

	&:focus-visible {
		outline: unset;
	}
`;

export default (props: IQTextFieldProps) => {
	return <FieldContainer className='common-icon-eraser'>
		<Input type='text' placeholder='Name' />
	</FieldContainer>;
};