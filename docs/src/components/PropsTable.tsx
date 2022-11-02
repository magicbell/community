import Table from './Table';

function toDotNotation(
  input: Record<string, unknown>,
  current = '',
  result: Record<string, unknown> = {},
) {
  for (const key in input) {
    const value = input[key];
    const newKey = current ? `${current}.${key}` : key;
    if (value && typeof value === 'object') {
      result[key] = 'object';
      toDotNotation(value as Record<string, unknown>, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

export default function PropsTable({
  properties,
}: {
  properties: Record<string, unknown>;
}) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Property name</th>
          <th>Default value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(toDotNotation(properties || {}))
          .sort((a, b) => (a[0] > b[0] ? 1 : -1))
          .map(([key, value]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <code>{String(value)}</code>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
