import { memo } from 'react'
import { Form, Input, Button, Row, Col, Card, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input

/**
 * DynamicListField
 * Reusable Form.List component for structured, repeatable entries.
 * Renders as stacked cards — each card is one "item" with multiple inputs.
 *
 * Props:
 *   name        {string}   — Form.List name (e.g. "education")
 *   label       {string}   — Section label shown above the list
 *   addLabel    {string}   — Text on the "+" button (e.g. "Add Education")
 *   fields      {Array}    — Field config per entry:
 *     [{ name, label, placeholder, span?, textarea?, rows?, required? }]
 *   emptyText   {string}   — Text shown when list is empty
 *   maxItems    {number}   — Max number of items allowed (default: 10)
 */
const DynamicListField = memo(function DynamicListField({
  name,
  label,
  addLabel     = 'Add Entry',
  fields       = [],
  emptyText    = 'No entries yet',
  maxItems     = 10,
}) {
  return (
    <Form.List name={name}>
      {(listFields, { add, remove }) => (
        <div style={{ marginBottom: 24 }}>
          {/* ── Section header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text
              strong
              style={{
                fontSize: 13,
                color: '#595959',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </Text>
            {listFields.length < maxItems && (
              <Button
                type="dashed"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => add()}
                style={{ borderRadius: 6 }}
              >
                {addLabel}
              </Button>
            )}
          </div>

          {/* ── Empty state ── */}
          {listFields.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '16px',
                border: '1px dashed #d9d9d9',
                borderRadius: 8,
                marginBottom: 8,
                cursor: 'pointer',
              }}
              onClick={() => add()}
            >
              <PlusOutlined style={{ color: '#bfbfbf', marginRight: 6 }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {emptyText} — click to add
              </Text>
            </div>
          )}

          {/* ── Entry cards ── */}
          {listFields.map((listField) => (
            <Card
              key={listField.key}
              size="small"
              style={{ marginBottom: 10, borderRadius: 8, border: '1px solid #e8e8e8' }}
              extra={
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(listField.name)}
                  style={{ padding: '0 4px' }}
                />
              }
            >
              <Row gutter={[12, 0]}>
                {fields.map((fieldCfg) => (
                  <Col
                    key={fieldCfg.name}
                    xs={24}
                    md={fieldCfg.span ?? 24}
                  >
                    <Form.Item
                      name={[listField.name, fieldCfg.name]}
                      label={fieldCfg.label}
                      rules={
                        fieldCfg.required
                          ? [{ required: true, message: `${fieldCfg.label} is required` }]
                          : []
                      }
                      style={{ marginBottom: 8 }}
                    >
                      {fieldCfg.textarea ? (
                        <TextArea
                          placeholder={fieldCfg.placeholder ?? ''}
                          rows={fieldCfg.rows ?? 3}
                          showCount={!!fieldCfg.maxLength}
                          maxLength={fieldCfg.maxLength}
                        />
                      ) : (
                        <Input placeholder={fieldCfg.placeholder ?? ''} />
                      )}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </div>
      )}
    </Form.List>
  )
})

export default DynamicListField
