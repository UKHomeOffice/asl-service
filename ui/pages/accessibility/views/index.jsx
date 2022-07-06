import React from 'react';
import ReactMarkdown from 'react-markdown';

const content = `# Accessibility statement for ASPeL

This website is run by the Home Office. We want as many people as possible to be able to use this website. For example,
that means you should be able to:

 * change colours, contrast levels and fonts
 * zoom in up to 300% without the text spilling off the screen
 * navigate most of the website using just a keyboard
 * navigate most of the website using speech recognition software
 * listen to most of the website using a screen reader

We’ve also made the website text as simple as possible to understand.

[AbilityNet](https://mcmw.abilitynet.org.uk) has advice on making your device easier to use if you have a disability.

## How accessible this website is

We know some parts of this website are not fully accessible. You can see a full list of any issues we currently know
about in the Non-accessible content section of this statement.

## Feedback and contact information

If you need information from this website in a different format, or if you need to apply for or amend a licence but are
unable to use this site, then contact us and we will make alternative arrangements.

 * [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk)
 * call 0207 035 4469

Please note, our working hours are Monday to Friday 09:00-17:00 excluding bank holidays. We’ll consider your request and
get back to you in 3 working days.

## Reporting accessibility problems with this website

We’re always looking to improve the accessibility of this website. If you find any problems not listed on this page or
think we’re not meeting accessibility requirements, contact:

 * [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk)
 * call 0207 035 4469

Please note, our working hours are Monday to Friday 09:00-17:00 excluding bank holidays. We’ll consider your request and
get back to you in 3 working days.

## Enforcement procedure

The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and
Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with
how we respond to your complaint,
[contact the Equality Advisory and Support Service (EASS)](https://www.equalityadvisoryservice.com).

If you are in Northern Ireland and are not happy with how we respond to your complaint you can contact the
[Equalities Commission for Northern Ireland](https://www.equalityni.org/Home) who are responsible for enforcing the
Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility
regulations’) in Northern Ireland.

## Technical information about this website’s accessibility

The Home Office is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and
Mobile Applications) (No. 2) Accessibility Regulations 2018.

### Compliance status

This website is partially compliant with the [Web Content Accessibility Guidelines version 2.1](https://www.w3.org/TR/WCAG21)
AA standard, due to the non-compliances listed below.

### Non-accessible content

The content listed below is non-accessible for the following reasons.

*Non-compliance with the accessibility regulations*

 * The data presented in tables, such as the licence holder directories, aren’t optimised for screen reader use,
   particularly as acronyms are often used that lack contextual definitions (WCAG 3.1.4) This is an AAA standard we
   would like to meet.
 * Not all navigational links and buttons are adequately descriptive (WCAG 2.4.9) This also is an AAA standard we intend
   to meet.
 * When magnifying the content, you will need to scroll sideways, as well as up and down, as the content doesn’t reflow.
   This fails WCAG 1.4.10 Reflow (AA).
 * Pages don’t have unique titles. This fails WCAG 2.4.2 Page Titled (A).
 * In places, the page heading structure needs to be improved (WCAG 1.3.1).

We are continually improving this website with new features, bug fixes and changes that improve the general usability.
We regularly review the site from an accessibility point of view, and intend to fix the issues to make the site WCAG 2.1
AA compliant.

*Disproportionate burden*

We have not made any disproportionate burden claims.

*Content that’s not within the scope of the accessibility regulations*

We consider all content on ASPeL to be within the scope of the accessibility regulations.

## Preparation of this accessibility statement

This statement was prepared on 14th September 2020. It was last reviewed on 14th September 2020.

This website was last tested on 11th September 2020. Testing was carried out internally by the Home Office.

We tested the service based on a user's ability to apply for and manage their licences. We also tested the application
assessment and granting processes.
`;

export default () => {
  return <ReactMarkdown escapeHtml={false}>{ content }</ReactMarkdown>;
};
