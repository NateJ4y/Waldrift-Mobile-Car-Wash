import { ServicePackage, AddonService, MembershipPlan } from '../types';

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-full-wash',
    name: 'FULL WASH',
    tagline: 'A proper clean, inside and out',
    description: 'A complete exterior wash and interior clean for everyday vehicles.',
    price_sedan: 80,
    price_suv: 100,
    price_bakkie: 100,
    price_van: 120,
    duration_minutes: 45,
    is_popular: true,
    counts_for_loyalty: true,
    features: [
      'Exterior hand wash',
      'Interior vacuum',
      'Dashboard and interior wipe-down',
      'Windows cleaned inside and out',
      'Tyre shine',
    ],
  },
];

export const INITIAL_ADDONS: AddonService[] = [];

export const INITIAL_MEMBERSHIPS: MembershipPlan[] = [];
