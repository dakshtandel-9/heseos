export type AdminProduct={id:string;name:string;sku:string;category:string;description:string;image:string;price:number|null;mrp:number|null;stock:number|null;status:'active'|'draft'|'archived';created_at:string;updated_at:string};
export type OrderItem={id:string;order_id:string;product_id:string;name:string;price:number;qty:number};
export type Order={id:string;name:string;email:string;phone:string;address:string;total:number;status:string;payment:string;notes:string;created_at:string;updated_at:string;items:OrderItem[]};
export type Submission={id:string;type:string;name:string;email:string;phone:string;details:string;status:string;notes:string;created_at:string};
export type Activity={id:string;message:string;created_at:string};
export type AdminData={products:AdminProduct[];orders:Order[];submissions:Submission[];activity:Activity[]};
