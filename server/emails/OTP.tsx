import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface OTPProps {
	otp: string;
}

// TODO: Update Base URL
const baseUrl = '';

export const OTP = ({ otp }: OTPProps) => (
	<Html>
		<Head />
		<Preview>
			Outreach OTP ({otp}). Copy and paste this temporary one time password
		</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={h1}>Outreach OTP [{otp}]</Heading>
				<Text style={{ ...text, marginBottom: '14px' }}>
					Copy and paste this temporary one time password:
				</Text>
				<code style={code}>{otp}</code>
				<Text
					style={{
						...text,
						color: '#ababab',
						marginTop: '14px',
						marginBottom: '16px',
					}}>
					If you didn&apos;t try to send an email with{' '}
					<a href='http://outreachkenya.com' target='_blank'>
						OutReachKenya
					</a>
					, you can safely ignore this email.
				</Text>
			</Container>
		</Body>
	</Html>
);

OTP.PreviewProps = {
	otp: '123456',
} as OTPProps;

export default OTP;

const main = {
	backgroundColor: '#ffffff',
};

const container = {
	paddingLeft: '12px',
	paddingRight: '12px',
	margin: '0 auto',
};

const h1 = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '24px',
	fontWeight: 'bold',
	margin: '40px 0',
	padding: '0',
};

const text = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	margin: '24px 0',
};

const code = {
	display: 'inline-block',
	padding: '16px 4.5%',
	width: '90.5%',
	backgroundColor: '#f4f4f4',
	borderRadius: '5px',
	border: '1px solid #eee',
	color: '#333',
};
