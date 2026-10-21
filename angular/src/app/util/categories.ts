/**
 * ARRAY TO LINK CATEGORIES TO THEIR SVG ICONS
 * The name of the category must match with its name in the db
 */
export const CATEGORY_ICONS: { name: string; icon: string }[] = [
  { name: 'Food', icon: '/icons/food.svg' },
  { name: 'Drinks', icon: '/icons/drinks.svg' },
  { name: 'Clothing', icon: '/icons/clothing.svg' },
  { name: 'Home', icon: '/icons/home.svg' },
  { name: 'Electronics', icon: '/icons/electronics.svg' },
  { name: 'Other', icon: '/icons/other.svg' },
];

/**
 * Finds the icon svg of a category
 * @param name The name of the category to search
 * @returns string - The svg path of that category or the other svg icon path
 */
export const categoryIcon = (name: string): string => {
  return CATEGORY_ICONS.find((c) => c.name === name)?.icon ?? '/icons/other.svg';
};
