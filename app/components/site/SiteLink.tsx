import Link from 'next/link';
import type { ComponentProps } from 'react';
import { isDocumentLink } from '../../../lib/site';
// Client-side navigation inside the site; full page loads for the Saving Power story and external pages.
export default function SiteLink({href,...props}:Omit<ComponentProps<'a'>,'href'>&{href:string}){
 if(isDocumentLink(href))return <a href={href} {...(href.startsWith('http')?{target:'_blank',rel:'noreferrer'}:{})} {...props}/>;
 return <Link href={href} {...props}/>;
}
