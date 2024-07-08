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

const SafeHTMLComponent = ({ html }: { html: string }) => {
	return <div dangerouslySetInnerHTML={{ __html: html }} style={text} />;
};

interface OTPProps {
	html: string;
	deleteEmail: string;
	found: boolean;
	subject: string;
}

export const Email = ({ html, found, deleteEmail, subject }: OTPProps) => (
	<Html>
		<Head />
		<Preview>{subject}</Preview>
		<Body style={main}>
			<Container style={container}>
				<SafeHTMLComponent html={html} />
				{found ? (
					<Text
						style={{
							...text,
							color: '#ababab',
							marginTop: '14px',
							marginBottom: '16px',
						}}>
						Your email was found in your database. Please click here if you
						would like to{' '}
						<a href={deleteEmail} target='_blank'>
							Delete
						</a>{' '}
						it.
					</Text>
				) : null}
			</Container>
		</Body>
	</Html>
);
Email.PreviewProps = {
	html: '<p>Dear [Recipient\'s Name/Organization],</p><p><br>I hope this message finds you well. My name is [Your Name], and I am writing to bring to your immediate attention a severe case of human rights violation that has recently occurred in [Location/City, Country].</p><p><br><strong>Incident Details:</strong></p><ul class="list-disc pl-4"><li><p><strong>Date and Time of Incident:</strong> [DD/MM/YYYY, HH</p><p>AM/PM]</p></li><li><p><strong>Location of Incident:</strong> [Specific Location/Address]</p></li><li><p><strong>Type of Violation:</strong> [e.g., Police Brutality, Extrajudicial Killing, etc.]</p></li><li><p><strong>Victims Involved:</strong> [Name(s) of Victim(s), if known]</p></li><li><p><strong>Perpetrators Involved:</strong> [Details of the perpetrators, if known]</p></li><li><p><strong>Description of Incident:</strong> [Provide a detailed account of what happened, including any relevant context or background information.]</p></li></ul><p></p><p><strong>Attachments:</strong> I have attached [number] file(s) to this email, including:</p><ul class="list-disc pl-4"><li><p>[e.g., Photos, Videos, Documents, etc.]</p></li></ul><p></p><p><strong>Witnesses:</strong> If there were any witnesses to the incident, please provide their details here:</p><ul class="list-disc pl-4"><li><p>[Name(s) of Witness(es), Contact Information, if available]</p></li></ul><p><br><strong>Urgent Actions Requested:</strong></p><ol class="list-decimal pl-4"><li><p>Immediate investigation into the reported incident.</p></li><li><p>Protection and support for the victim(s) and their families.</p></li><li><p>Legal action against the perpetrators.</p></li><li><p>Public awareness and condemnation of the incident.</p><p></p></li></ol><p>I urge your organization to take swift and decisive action to address this grave violation of human rights. The affected individuals and the broader community are looking to your esteemed organization for justice and support.</p><p>Thank you for your attention to this urgent matter. Please do not hesitate to contact me if you require any further information or assistance.</p><p></p><p><strong>Contact Information:</strong></p><ul class="list-disc pl-4"><li><p><strong>Name:</strong> [Your Full Name]</p></li><li><p><strong>Email:</strong> [Your Email Address]</p></li><li><p><strong>Phone:</strong> [Your Phone Number]</p><p></p></li></ul><p>Sincerely,</p><p>[Your Name]</p>',
	found: true,
	deleteEmail: '',
	subject: 'Email Subject',
} as OTPProps;

export default Email;

const main = {
	backgroundColor: '#ffffff',
};

const container = {
	margin: '0 auto',
};

const link = {
	color: '#2754C5',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	textDecoration: 'underline',
};

const text = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	margin: '24px 0',
};
