import { Divider, Typography } from 'antd'

const { Title, Text } = Typography

/**
 * PageHeader
 * A consistent page-level header with optional subtitle and action slot.
 * Renders as a flex row with the title/subtitle on the left and actions on the right.
 *
 * @param {object}    props
 * @param {string}    props.title       - Primary heading text
 * @param {string}    [props.subtitle]  - Optional secondary description text
 * @param {ReactNode} [props.actions]   - Optional right-side action elements (e.g. buttons)
 */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        className="flex items-center justify-between"
        style={{ minHeight: 40 }}
      >
        <div className="flex flex-col gap-0.5">
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>

          {subtitle && (
            <Text type="secondary" className="text-sm">
              {subtitle}
            </Text>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      <Divider style={{ marginTop: 12, marginBottom: 0 }} />
    </div>
  )
}

export default PageHeader
