import { Modal, Button, Space, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * ConfirmModal
 * A reusable confirmation dialog supporting dangerous actions and loading states.
 *
 * @param {object}   props
 * @param {boolean}  props.open          - Controls modal visibility
 * @param {Function} props.onConfirm     - Callback when confirm button is clicked
 * @param {Function} props.onCancel      - Callback when cancel button is clicked
 * @param {string}   props.title         - Modal heading text
 * @param {string}   props.description   - Body text explaining the action
 * @param {boolean}  [props.danger]      - Show danger styling on confirm button (default: false)
 * @param {boolean}  [props.loading]     - Disables confirm + shows spinner while in progress
 */
export function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  danger = false,
  loading = false,
}) {
  const titleNode = (
    <Space align="center" size={8}>
      {danger && (
        <ExclamationCircleOutlined style={{ color: 'var(--ant-color-error, #ff4d4f)' }} />
      )}
      <span>{title}</span>
    </Space>
  )

  const footer = (
    <Space>
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>

      <Button
        type="primary"
        danger={danger}
        loading={loading}
        disabled={loading}
        onClick={onConfirm}
      >
        Confirm
      </Button>
    </Space>
  )

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={titleNode}
      footer={footer}
      closable={!loading}
      maskClosable={!loading}
      centered
    >
      <Text>{description}</Text>
    </Modal>
  )
}

export default ConfirmModal
