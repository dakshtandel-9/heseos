import { PACKAGE_TYPES, getPackage, type Bhk, type Package, type Tier } from './catalog';

/** Starting prices span upgrade types; the cheapest type can change by size AND tier. */
export function getStartingPackage(bhk: Bhk, tier: Tier): Package {
 return PACKAGE_TYPES.map(type => getPackage(type.id, bhk, tier))
  .reduce((lowest, candidate) => candidate.price < lowest.price ? candidate : lowest);
}

