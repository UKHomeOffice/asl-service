import React from 'react';
import ReactMarkdown from 'react-markdown';

const content = `# Privacy notice

ASPeL is provided by Home Office Digital, Data and Technology on behalf of the ASRU (Animals in Science Regulation Unit).

The data controller for ASPeL is ASRU. A data controller determines how and why personal data is processed.

## What data we need

The personal data we collect from you includes:

* name, title, date of birth and email address
* place, or places, of work and your role within those establishments
* training, qualifications and experience relevant to the regulated use of animals in science
* your Internet Protocol (IP) address, and details of which version of web browser you used and operating system
* information on how you use the site, using cookies and page tagging techniques
* actions you make within the system recorded in an audit trail

## We also collect:

* information about licensed establishments (and establishments applying for a licence), such as details of where scientific procedures can be carried out and names of people with specific responsibilities
* information relevant to licensed projects (and project applications), such as potential harms and benefits of the work, procedures, scientific background

## What we do with your data and who sees it

The data provided by you and your establishment(s) is used by ASRU, the Animals in Science Committee and trusted, security vetted, government suppliers to assess the suitability of licence applications. It is also used to process metrics that are used to help improve the service that ASRU provides.

Information provided in the non-technical summaries of project licences, and in the annual statistics, will be de-identified before being published on GOV.UK.

De-identified data may also be used to answer Parliamentary Questions and Freedom of Information requests.

We will only ever share any identifiable data if we are required to do so by law – for example, by court order, or to prevent fraud or other crime.

## How long we keep your data

We will only retain your personal data for as long as:

* it is needed for the purposes set out in this document
* the law requires us to

We will hold all licence data and any personal data associated with a licence for 10 years after a licence was last active.

## Children’s privacy protection

Licence holders must be over the age of 18.

Our services are not designed for, or intentionally targeted at, children 13 years of age or younger. We do not collect or maintain data about anyone under the age of 13.

## Where your data is processed and stored

We design, build and run our systems to make sure that your data is as safe as possible at any stage, both while it’s processed and when it’s stored.

The databases that host the licence records and applications are located in Great Britain. They are subject to security oversight and review in compliance with agreed Government standards.

## How we protect your data and keep it secure

We are committed to doing all that we can to keep your data secure. We have set up systems and processes to prevent unauthorised access or disclosure of your data – for example, we protect your data using varying levels of encryption.

We also make sure that any third parties that we deal with keep all personal data they process on our behalf secure.

## Your rights

You have the right to request:

* information about how your personal data is processed
* a copy of that personal data
* that anything inaccurate in your personal data is corrected immediately

You can also:

* raise an objection about how your personal data is processed
* request that your personal data is erased if there is no longer a justification for it

If you have any of these requests, get in contact with our Data Protection Officer.

## Links to other websites

ASPeL may contain links to other websites.

This privacy policy only applies to ASPeL, and doesn’t cover any other sites or online services that we link to.

## Following a link to another website

If you go to another website from this one, read the privacy policy on that website to find out what it does with your information.

## Changes to this policy

We may change this privacy notice. In that case, the ‘last updated’ date at the bottom of this page will also change. Any changes to this privacy policy will apply to you and your data immediately.

If these changes affect how your personal data is processed, the Home Office will take reasonable steps to let you know.

## Contact us or make a complaint

Contact the Data Protection Officer (DPO) if you:

* have any questions about anything in this document
* think that your personal data has been misused or mishandled

Data Protection Officer
[DPO@homeoffice.gov.uk](mailto:DPO@homeoffice.gov.uk)
Home Office
2 Marsham Street
London,
SW1P 4DF

You can also make a complaint to the Information Commissioner, who is an independent regulator.

[casework@ico.org.uk](mailto:casework@ico.org.uk)

Telephone: 0303 123 1113
Textphone: 01625 545860
Monday to Friday, 9am to 4:30pm

[Find out about call charges](https://www.gov.uk/call-charges)

Information Commissioner's Office
Wycliffe House
Water Lane
Wilmslow
Cheshire
SK9 5AF

Last updated 17 May 2018`;

export default () => {
  return <ReactMarkdown>{ content }</ReactMarkdown>;
};
