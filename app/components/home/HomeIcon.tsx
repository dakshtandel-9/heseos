import { AirVent, Award, BellRing, Blinds, Briefcase, Building2, ChartColumn, Cpu, Flag, Gem, Globe, Hand, Headset, Hotel, House, LayoutGrid, Lightbulb, Mic, Network, ShieldCheck, SlidersHorizontal, Smartphone, Sparkles, Sun, Users, type LucideIcon } from 'lucide-react';
// Homepage content (lib/home.ts) names its icons; this maps the names to the icon set.
const ICONS:Record<string,LucideIcon>={
 lights:Lightbulb,curtains:Blinds,climate:AirVent,security:ShieldCheck,scenes:Sparkles,
 support:Headset,hardware:Gem,india:Flag,ecosystem:Network,
 home:House,hotel:Hotel,building:Building2,enterprise:Briefcase,
 design:Gem,touch:Hand,variants:LayoutGrid,
 control:SlidersHorizontal,comfort:Sun,
 anywhere:Smartphone,power:ChartColumn,alerts:BellRing,devices:LayoutGrid,voice:Mic,
 customers:Users,installed:Cpu,years:Award,global:Globe,
};
export default function HomeIcon({name,size=22}:{name:string;size?:number}){
 const Icon=ICONS[name]??Sparkles;
 return <Icon size={size} strokeWidth={1.6} aria-hidden="true"/>;
}
