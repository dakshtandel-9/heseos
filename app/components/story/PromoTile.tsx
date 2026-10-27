import type { ReactNode } from 'react';
import SiteLink from '../site/SiteLink';
// A tile with a headline and up to two actions, laid over its media or (stacked) above it.
export default function PromoTile({title,body,image,media,href,cta,secondary,tone='dark',size='half',stacked=false}:{title:string;body?:string;image?:string;media?:ReactNode;href:string;cta:string;secondary?:{href:string;label:string};tone?:'dark'|'light';size?:'half'|'full';stacked?:boolean}){
 return <article className={`promo ${size} ${tone==='light'?'light':''} ${stacked?'stacked':''}`}>
  <div className="promo-copy"><h3 className={size==='full'?'headline':'title'}>{title}</h3>{body&&<p className="lead">{body}</p>}
   <div className="actions"><SiteLink className="btn small" href={href}>{cta}</SiteLink>{secondary&&<SiteLink className="link" href={secondary.href}>{secondary.label} ›</SiteLink>}</div></div>
  <div className="promo-media">{media??(image&&<img src={image} alt="" loading="lazy"/>)}</div>
 </article>;
}
