import { BadgeCheck, Lightbulb, LockKeyhole, Plug, Smartphone, ToggleRight, Wrench, type LucideIcon } from 'lucide-react';
import type { SupportIcon } from '../../../lib/support';
// Support content (lib/support.ts) names its icons; both the server topic cards and the client answer browser draw them from here.
export const SUPPORT_ICONS:Record<SupportIcon,LucideIcon>={start:Wrench,app:Smartphone,switches:ToggleRight,security:LockKeyhole,lighting:Lightbulb,automation:Plug,warranty:BadgeCheck};
