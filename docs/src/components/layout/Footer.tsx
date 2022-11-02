import React from 'react';
import footerNav from '../../../footer.json';
import LinkedInLogo from '../../../public/linkedin.svg';
import MagicBellLogo from '../../../public/magicbell.svg';
import TwitterLogo from '../../../public/twitter.svg';
import YouTubeLogo from '../../../public/youtube.svg';
import FooterLink from './FooterLink';

export default function Footer() {
  return (
    <footer className="flex justify-between max-w-screen-xl mx-auto md:px-8 px-4 md:py-24 py-12 w-full md:flex-row flex-col-reverse text-darkPurple">
      <div className="flex flex-1 flex-col gap-4">
        <a href="https://www.magicbell.com/" aria-label="Go to homepage">
          <MagicBellLogo
            className="md:h-7 h-6 fill-current text-darkPurple"
            role="img"
            aria-label="MagicBell logo"
            focusable="false"
          />
        </a>

        <p>The Notification Inbox for web & mobile apps.</p>
        <ul
          className="flex gap-4 mt-3 md:mt-4 items-center"
          aria-label="Social media links"
        >
          <li>
            <a
              href="https://twitter.com/magicbell_io"
              className="text-darkGrey hover:text-darkPurple"
              aria-label="Go to our Twitter page"
              rel="noreferrer"
            >
              <TwitterLogo
                className="h-4 fill-current"
                role="img"
                aria-label="Twitter logo"
                focusable="false"
              />
            </a>
          </li>

          <li>
            <a
              href="https://es.linkedin.com/company/magicbell"
              className="text-darkGrey hover:text-darkPurple"
              aria-label="Go to our LinkedIn page"
              rel="noreferrer"
            >
              <LinkedInLogo
                className="h-4 fill-current"
                role="img"
                aria-label="LinkedIn logo"
                focusable="false"
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UCqz_KjolBVyaxHnxEeO1RCQ"
              className="text-darkGrey hover:text-darkPurple"
              aria-label="Go to our YouTube page"
              rel="noreferrer"
            >
              <YouTubeLogo
                className="h-6 fill-current"
                role="img"
                aria-label="YouTube logo"
                focusable="false"
              />
            </a>
          </li>
        </ul>
        <ul className="flex gap-6 md:gap-4" aria-label="Legal pages">
          {footerNav.legalPagesLinks.map((link, index) => (
            <FooterLink key={`legal-page-${index}`} link={link} />
          ))}
        </ul>
        <small>
          &copy; {new Date().getFullYear()} MagicBell, Inc. All rights reserved.
        </small>
      </div>
      <div className="grid gap-y-8 gap-x-10 grid-cols-none sm:grid-cols-2 md:mb-0 mb-14">
        <div>
          <h4 className="font-bold text-2xl">Company</h4>
          <ul className="flex flex-col gap-4 mt-4" aria-label="Company pages">
            {footerNav.companyLinks.map((link, index) => (
              <FooterLink key={`company-page-${index}`} link={link} />
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-2xl">Product</h4>
          <ul className="flex flex-col gap-4 mt-4" aria-label="Product pages">
            {footerNav.productLinks.map((link, index) => (
              <FooterLink key={`product-page-${index}`} link={link} />
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-2xl">Resources</h4>
          <ul className="flex flex-col gap-4 mt-4" aria-label="Project pages">
            {footerNav.resourcesLinks.map((link, index) => (
              <FooterLink key={`resources-page-${index}`} link={link} />
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-2xl">Build</h4>
          <ul className="flex flex-col gap-4 mt-4" aria-label="Learn pages">
            {footerNav.learnLinks.map((link, index) => (
              <FooterLink key={`build-page-${index}`} link={link} />
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
