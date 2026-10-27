import { formatINR } from '../../../lib/catalog';
export default function Price({price,mrp,className=''}:{price:number;mrp?:number|null;className?:string}){
 return <span className={'price '+className}><span className="tabular">{formatINR(price)}</span>{mrp&&mrp>price&&<><s className="tabular" aria-label={`MRP ${formatINR(mrp)}`}>{formatINR(mrp)}</s><span className="save">Save {Math.round((1-price/mrp)*100)}%</span></>}</span>;
}
