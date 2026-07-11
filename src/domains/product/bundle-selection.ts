/**
 * Pure helpers for bundle component selection.
 *
 * A bundle is composed of `items`. Each item is either:
 *  - mandatory (`isOptional === false`, or no `optionGroup`), OR
 *  - part of a "choose exactly one" option group (`isOptional && optionGroup`).
 *
 * The backend (`cart.service.ts`) validates that every mandatory item has its
 * required quantity of variants selected, and that exactly one product is
 * chosen per option group. These helpers build/validate that selection so the
 * FE can mirror the rules before calling `POST /cart`.
 */
import type { BundleDetail } from '@/api/types.gen';

export type BundleItem = BundleDetail['items'][number];
export type SelectedVariant = { productId: string; variantId: string; quantity: number };

/** Items that are always included (not part of a choose-one group). */
export function getMandatoryItems(items: BundleItem[]): BundleItem[] {
  return items.filter((i) => !(i.isOptional && i.optionGroup));
}

/** Group the choose-one (optional + optionGroup) items by their group name. */
export function buildGroups(items: BundleItem[]): Map<string, BundleItem[]> {
  const groups = new Map<string, BundleItem[]>();
  for (const it of items) {
    if (it.isOptional && it.optionGroup) {
      const arr = groups.get(it.optionGroup) ?? [];
      arr.push(it);
      groups.set(it.optionGroup, arr);
    }
  }
  return groups;
}

/**
 * Build the `selectedVariants` payload for `POST /cart` from the user's choices.
 * @param variantByProduct chosen variantId per productId
 * @param groupChoice chosen productId per option group
 */
export function buildSelectedVariants(
  items: BundleItem[],
  variantByProduct: Record<string, string>,
  groupChoice: Record<string, string>,
): SelectedVariant[] {
  const selected: SelectedVariant[] = [];

  for (const it of getMandatoryItems(items)) {
    const variantId = variantByProduct[it.productId];
    if (variantId) selected.push({ productId: it.productId, variantId, quantity: it.quantity });
  }

  for (const [group, arr] of buildGroups(items)) {
    const chosenPid = groupChoice[group];
    const it = arr.find((a) => a.productId === chosenPid);
    const variantId = it ? variantByProduct[chosenPid] : undefined;
    if (it && variantId) selected.push({ productId: chosenPid, variantId, quantity: it.quantity });
  }

  return selected;
}

/** True when every mandatory item and every option group has a resolved variant. */
export function isBundleSelectionValid(
  items: BundleItem[],
  variantByProduct: Record<string, string>,
  groupChoice: Record<string, string>,
): boolean {
  const mandatoryOk = getMandatoryItems(items).every((it) => !!variantByProduct[it.productId]);
  const groupsOk = [...buildGroups(items).keys()].every(
    (g) => !!groupChoice[g] && !!variantByProduct[groupChoice[g]],
  );
  return mandatoryOk && groupsOk;
}
