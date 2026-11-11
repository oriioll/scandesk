/**
 * Interface to describe the components of a feature card in the dashboard
 * only ux-ui and frontend, not used for any api request
 * @property iconPath - Feature icon asset path
 * @property title - Feature card heading
 * @property text - Feature card description
 * @property buttons - Actions shown on the card
 * @property routeTo - Destination route for the card
 * @author Oriol Plazas
 * @since 1.0.0
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
 *
 * @property text - Button label
 * @property isPrincipal - Whether this is the primary action
 * @property routeTo - Destination route for the action
 * @property queryParams - Route query values, omitted when unused
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface FeatureButton {
  text: string;
  isPrincipal: boolean;
  routeTo: string;
  queryParams?: Record<string, string>;
}
