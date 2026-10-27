import '@fontsource-variable/inter';
import './site.css';
import { BagProvider } from '../components/commerce/BagProvider';
import GlobalNav from '../components/site/GlobalNav';
import Footer from '../components/site/Footer';
export default function SiteLayout({children}:Readonly<{children:React.ReactNode}>){
 return <BagProvider><a className="skip-link" href="#main">Skip to content</a><GlobalNav/><main id="main">{children}</main><Footer/></BagProvider>;
}
