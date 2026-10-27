/**
 * Interface to describe the components of a feature card in the dashboard
 * only ux-ui and frontend, not used for any api request
 */
export interface FeatureCard {
  iconPath: string;
  title: string;
  text: string;
  buttons: FeatureButton[];
  routeTo: string;
}
/**
 * Configure what the buttons on the feature do
 */
export interface FeatureButton {
  text: string;
  isPrincipal: boolean;
  routeTo: string;
  queryParams?: Record<string, string>;
}
