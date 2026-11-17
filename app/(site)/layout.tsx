import '@fontsource-variable/inter';
import './site.css';
import GlobalNav from '../components/site/GlobalNav';
import Footer from '../components/site/Footer';
import { NAV } from '../../lib/site';
import { PRODUCT_DIRECTORY, directoryCategoryHref, directorySubcategoryHref } from '../../lib/product-directory';
import './catalog.css';
import './chrome.css';
import './home.css';
import './directory.css';
import './collection.css';
import './forms.css';
import './page-polish.css';
import './app-page.css';
export default function SiteLayout({children}:Readonly<{children:React.ReactNode}>){
 const nav=NAV.map(item=>item.label==='Products'?{...item,groups:PRODUCT_DIRECTORY.map(c=>({title:c.name,href:directoryCategoryHref(c),links:c.subcategories.map(s=>({label:s.name,href:directorySubcategoryHref(c,s)}))}))}:item);
 return <><a className="skip-link" href="#main">Skip to content</a><GlobalNav nav={nav}/><main id="main">{children}</main><Footer/></>;
}
