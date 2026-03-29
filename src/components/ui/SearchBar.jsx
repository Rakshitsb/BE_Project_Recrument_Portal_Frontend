import { Typography, Input, Select, Button, Space } from 'antd'
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function SearchBar({
  searchTerm,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
  loading,
  locations = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
      <Title level={3} className="mb-1">
        Find your dream companies
      </Title>
      <Text type="secondary">
        Discover curated roles from fast-growing teams worldwide.
      </Text>

      <div className="mt-4 flex flex-col lg:flex-row gap-3">
        <Input
          size="large"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onPressEnter={onSubmit}
          prefix={<SearchOutlined />}
          placeholder="Search by role, company, or keyword"
          className="flex-1"
          allowClear
        />
        <Select
          size="large"
          value={location}
          onChange={onLocationChange}
          className="lg:w-60 w-full"
          suffixIcon={<EnvironmentOutlined />}
          options={[
            { value: 'Anywhere', label: 'Anywhere' },
            ...locations.map((loc) => ({ value: loc, label: loc })),
          ]}
        />
        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          onClick={onSubmit}
          loading={loading}
          className="w-full lg:w-auto"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
