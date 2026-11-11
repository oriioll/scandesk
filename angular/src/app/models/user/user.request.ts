/**
 * Interface that shows the format of the body an API request of a user
 * @property name - Name for the account
 * @property email - Email for the account
 * @property password - Plain-text account password
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface UserRequest {
  name: string;
  email: string;
  password: string;
}
