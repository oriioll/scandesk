/**
 * Backend operation values used for product stock history records.
 * @property Create - History entry for product creation
 * @property Delete - History entry for product removal
 * @property Edit - History entry for product changes
 * @author Oriol Plazas
 * @since 1.0.0
 */
export enum HistoryAction {
  Create = 'create',
  Delete = 'delete',
  Edit = 'edit',
}
