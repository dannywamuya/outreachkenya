const personalEmailProviders = [
	'gmail.com',
	'yahoo.com',
	'hotmail.com',
	'outlook.com',
	'live.com',
	'aol.com',
	'icloud.com',
	'mail.com',
	'me.com',
	'msn.com',
	'comcast.net',
	'verizon.net',
	'att.net',
	'bellsouth.net',
	'cox.net',
	'earthlink.net',
	'sbcglobal.net',
	'ymail.com',
	'zoho.com',
	'protonmail.com',
	'tutanota.com',
	'gmx.com',
];

export function isNotPersonal(email: string): boolean {
	const domain = email.split('@')[1];
	return !personalEmailProviders.includes(domain);
}
