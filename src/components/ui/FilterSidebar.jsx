import { Card, Checkbox, Divider, Typography, Button } from 'antd'

const { Title } = Typography

function FilterSidebar({
  filters,
  onFiltersChange,
  options,
}) {
  const handleGroupChange = (key) => (values) => {
    onFiltersChange({ [key]: values })
  }

  const reset = () =>
    onFiltersChange({
      industries: [],
      sizes: [],
      categories: [],
      tags: [],
    })

  return (
    <Card
      title={<Title level={5} className="mb-0">Filters</Title>}
      className="sticky top-20 shadow-sm"
      bodyStyle={{ padding: 16 }}
    >
      <div className="space-y-4">
        <section>
          <p className="text-xs text-gray-500 mb-2">Industry</p>
          <Checkbox.Group
            options={options.industries}
            value={filters.industries}
            onChange={handleGroupChange('industries')}
            className="flex flex-col gap-2"
          />
        </section>

        <Divider className="my-2" />

        <section>
          <p className="text-xs text-gray-500 mb-2">Company size</p>
          <Checkbox.Group
            options={options.sizes}
            value={filters.sizes}
            onChange={handleGroupChange('sizes')}
            className="flex flex-col gap-2"
          />
        </section>

        <Divider className="my-2" />

        <section>
          <p className="text-xs text-gray-500 mb-2">Category</p>
          <Checkbox.Group
            options={options.categories}
            value={filters.categories}
            onChange={handleGroupChange('categories')}
            className="flex flex-col gap-2"
          />
        </section>

        <Divider className="my-2" />

        <section>
          <p className="text-xs text-gray-500 mb-2">Tags</p>
          <Checkbox.Group
            options={options.tags}
            value={filters.tags}
            onChange={handleGroupChange('tags')}
            className="grid grid-cols-2 gap-2"
          />
        </section>

        <Button block type="text" onClick={reset}>
          Reset filters
        </Button>
      </div>
    </Card>
  )
}

export default FilterSidebar
